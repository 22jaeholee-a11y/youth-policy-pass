/** housing_notices 테이블 레코드 */
export interface HousingNotice {
  id: string;
  provider: string;
  notice_id: string;
  title: string;
  notice_type: string;
  notice_sub_type: string;
  region_name: string;
  region_code: string;
  status: string;
  detail_url: string;
  raw_data: Record<string, unknown>;
  synced_at: string;
  created_at: string;
}

/** LH API 개별 공고 항목 */
export interface LhNoticeItem {
  RNUM: string;
  UPP_AIS_TP_NM: string;
  AIS_TP_CD_NM: string;
  PAN_NM: string;
  CNP_CD_NM: string;
  PAN_SS: string;
  ALL_CNT: string;
  DTL_URL: string;
}

/** 결과 리스트에서 Policy와 HousingNotice를 구분하기 위한 통합 타입 */
export type ResultItem =
  | { type: "policy"; data: import("./policy").Policy }
  | { type: "housing"; data: HousingNotice };

/** 공급자별 뱃지 색상 */
export const PROVIDER_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  lh: { label: "LH 공공주택", bg: "bg-indigo-100", text: "text-indigo-700" },
  sh: { label: "SH 공공주택", bg: "bg-teal-100", text: "text-teal-700" },
  gh: { label: "GH 공공주택", bg: "bg-rose-100", text: "text-rose-700" },
};
