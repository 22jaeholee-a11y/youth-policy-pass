/** 온통청년 API 원본 응답의 개별 정책 항목 */
export interface YouthApiPolicy {
  plcyNo: string;
  plcyNm: string;
  plcyKywdNm: string;
  plcyExplnCn: string;
  lclsfNm: string;
  mclsfNm: string;
  plcySprtCn: string;
  sprvsnInstCdNm: string;
  sprtTrgtMinAge: string;
  sprtTrgtMaxAge: string;
  sprtTrgtAgeLmtYn: string;
  earnCndSeCd: string;
  earnMinAmt: string;
  earnMaxAmt: string;
  jobCd: string;
  zipCd: string;
  aplyUrlAddr: string;
  refUrlAddr1: string;
  refUrlAddr2: string;
  aplyPrdSeCd: string;
  aplyYmd: string;
  bizPrdBgngYmd: string;
  bizPrdEndYmd: string;
  plcyAplyMthdCn: string;
  inqCnt: string;
  lastMdfcnDt: string;
  [key: string]: string;
}

export interface YouthApiResponse {
  youthPolicyList: YouthApiPolicy[];
}

export interface Policy {
  id: string;
  plcy_no: string;
  title: string;
  category: string;
  sub_category: string;
  min_age: number | null;
  max_age: number | null;
  age_unlimited: boolean;
  region_code: string;
  earn_type: string;
  earn_max: string;
  job_code: string;
  description: string;
  benefit_detail: string;
  apply_url: string;
  apply_method: string;
  apply_period: string;
  apply_period_type: string;
  biz_start_date: string;
  biz_end_date: string;
  org_name: string;
  view_count: number;
  raw_data: Record<string, unknown>;
  synced_at: string;
  created_at: string;
}

export interface FilterParams {
  age: number;
  region: string;
  income: number;
  employment: string;
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  일자리: { bg: "bg-purple-100", text: "text-purple-700" },
  복지문화: { bg: "bg-orange-100", text: "text-orange-700" },
  교육: { bg: "bg-blue-100", text: "text-blue-700" },
  "금융･복지･문화": { bg: "bg-green-100", text: "text-green-700" },
  "교육･직업훈련": { bg: "bg-cyan-100", text: "text-cyan-700" },
};
