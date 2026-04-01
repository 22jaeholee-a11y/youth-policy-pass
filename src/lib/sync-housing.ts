import { LhNoticeItem } from "@/types/housing";
import { getRegionCode } from "@/lib/regions";

const LH_API_URL =
  "http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1";

/** LH API에서 공고 목록을 가져온다 */
export async function fetchLhNotices(
  apiKey: string,
  page: number = 1,
  pageSize: number = 100
): Promise<{ notices: LhNoticeItem[]; totalCount: number }> {
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const formatDate = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

  const otherParams = new URLSearchParams({
    PG_SZ: String(pageSize),
    PAGE: String(page),
    PAN_NT_ST_DT: formatDate(sixMonthsAgo),
    CLSG_DT: formatDate(today),
  });

  // ServiceKey는 이미 URL 인코딩된 상태이므로 URLSearchParams에 넣으면 이중 인코딩됨
  const response = await fetch(`${LH_API_URL}?ServiceKey=${apiKey}&${otherParams}`);
  if (!response.ok) {
    throw new Error(`LH API 호출 실패: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // LH API 응답 형식:
  // data[0] = { dsSch: [...] }  — 검색조건 에코
  // data[1] = { dsList: [...], resHeader: [{ SS_CODE, RS_DTTM }] }  — 결과
  if (!Array.isArray(data) || data.length < 2) {
    return { notices: [], totalCount: 0 };
  }

  const result = data[1];
  const header = result.resHeader?.[0];

  if (!header || header.SS_CODE !== "Y") {
    throw new Error(`LH API 오류: SS_CODE=${header?.SS_CODE}`);
  }

  const notices: LhNoticeItem[] = result.dsList ?? [];
  const totalCount = notices.length > 0 ? parseInt(notices[0].ALL_CNT, 10) : 0;

  return { notices, totalCount };
}

/** LH 지역명 → 기존 REGIONS 이름 매핑 */
const LH_REGION_MAP: Record<string, string> = {
  "서울특별시": "서울",
  "부산광역시": "부산",
  "대구광역시": "대구",
  "인천광역시": "인천",
  "광주광역시": "광주",
  "대전광역시": "대전",
  "울산광역시": "울산",
  "세종특별자치시": "세종",
  "경기도": "경기",
  "강원특별자치도": "강원",
  "충청북도": "충북",
  "충청남도": "충남",
  "전북특별자치도": "전북",
  "전라남도": "전남",
  "경상북도": "경북",
  "경상남도": "경남",
  "제주특별자치도": "제주",
};

/** LH 지역명에서 region_code를 찾는다 ("서울특별시 외" → "서울" → "11000") */
function resolveRegionCode(lhRegionName: string): string | null {
  if (!lhRegionName || lhRegionName === "전국") return null;

  // "서울특별시 외" → "서울특별시"
  const baseName = lhRegionName.replace(/\s*외$/, "");

  // 직접 매핑 시도
  const mapped = LH_REGION_MAP[baseName];
  if (mapped) return getRegionCode(mapped);

  // 기존 getRegionCode로 시도
  return getRegionCode(baseName) ?? getRegionCode(lhRegionName);
}

/** LH API 응답 항목을 housing_notices 테이블 레코드로 변환 */
export function mapLhToHousingNotice(item: LhNoticeItem) {
  const regionName = item.CNP_CD_NM ?? "";
  const regionCode = resolveRegionCode(regionName);

  return {
    provider: "lh" as const,
    notice_id: item.PAN_ID ?? item.RNUM,
    title: item.PAN_NM ?? "",
    notice_type: item.UPP_AIS_TP_NM ?? "",
    notice_sub_type: item.AIS_TP_CD_NM ?? "",
    region_name: regionName,
    region_code: regionCode ?? "",
    status: item.PAN_SS ?? "",
    detail_url: item.DTL_URL ?? "",
    raw_data: item as unknown as Record<string, unknown>,
    synced_at: new Date().toISOString(),
  };
}
