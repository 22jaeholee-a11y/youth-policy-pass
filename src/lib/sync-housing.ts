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

  const params = new URLSearchParams({
    ServiceKey: apiKey,
    PG_SZ: String(pageSize),
    PAGE: String(page),
    PAN_NT_ST_DT: formatDate(sixMonthsAgo),
    CLSG_DT: formatDate(today),
  });

  const response = await fetch(`${LH_API_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`LH API 호출 실패: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // LH API 응답 형식: 배열의 첫 번째는 메타데이터, 두 번째는 공고 목록
  if (!Array.isArray(data) || data.length < 2) {
    return { notices: [], totalCount: 0 };
  }

  const meta = data[0];
  if (meta.SS_CODE !== "S") {
    throw new Error(`LH API 오류: SS_CODE=${meta.SS_CODE}`);
  }

  const notices: LhNoticeItem[] = data[1] ?? [];
  const totalCount = notices.length > 0 ? parseInt(notices[0].ALL_CNT, 10) : 0;

  return { notices, totalCount };
}

/** LH API 응답 항목을 housing_notices 테이블 레코드로 변환 */
export function mapLhToHousingNotice(item: LhNoticeItem) {
  const regionCode = getRegionCode(item.CNP_CD_NM);

  return {
    provider: "lh" as const,
    notice_id: item.RNUM,
    title: item.PAN_NM ?? "",
    notice_type: item.UPP_AIS_TP_NM ?? "",
    notice_sub_type: item.AIS_TP_CD_NM ?? "",
    region_name: item.CNP_CD_NM ?? "",
    region_code: regionCode ?? "",
    status: item.PAN_SS ?? "",
    detail_url: item.DTL_URL ?? "",
    raw_data: item as Record<string, unknown>,
    synced_at: new Date().toISOString(),
  };
}
