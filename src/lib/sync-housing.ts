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

/** LH API 응답 항목을 housing_notices 테이블 레코드로 변환 */
export function mapLhToHousingNotice(item: LhNoticeItem) {
  // 지역명에서 "도/시" 접미사 제거하여 매핑 (예: "경기도" → "경기")
  const regionName = item.CNP_CD_NM ?? "";
  const normalizedName = regionName
    .replace(/특별자치시$/, "")
    .replace(/특별자치도$/, "")
    .replace(/특별시$/, "")
    .replace(/광역시$/, "")
    .replace(/도$/, "");
  const regionCode = getRegionCode(normalizedName) ?? getRegionCode(regionName);

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
