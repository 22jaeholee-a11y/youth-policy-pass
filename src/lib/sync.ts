import { YouthApiPolicy } from "@/types/policy";

const YOUTH_API_URL = "https://www.youthcenter.go.kr/go/ythip/getPlcy";

export async function fetchPoliciesFromApi(
  apiKey: string,
  pageNum: number = 1,
  pageSize: number = 100
): Promise<{ policies: YouthApiPolicy[]; hasMore: boolean }> {
  const params = new URLSearchParams({
    apiKeyNm: apiKey,
    pageNum: String(pageNum),
    pageSize: String(pageSize),
    rtnType: "json",
  });

  const response = await fetch(`${YOUTH_API_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`온통청년 API 호출 실패: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.resultCode !== 200) {
    throw new Error(`온통청년 API 오류: ${data.resultMessage}`);
  }

  const policies: YouthApiPolicy[] = data.result?.youthPolicyList ?? [];

  return { policies, hasMore: policies.length === pageSize };
}

export function mapApiToPolicy(api: YouthApiPolicy) {
  const parseAge = (val: string): number | null => {
    const num = parseInt(val, 10);
    return isNaN(num) ? null : num;
  };

  const parseCount = (val: string): number => {
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : num;
  };

  return {
    plcy_no: api.plcyNo,
    title: api.plcyNm ?? "",
    category: api.lclsfNm ?? "",
    sub_category: api.mclsfNm ?? "",
    min_age: parseAge(api.sprtTrgtMinAge),
    max_age: parseAge(api.sprtTrgtMaxAge),
    age_unlimited: api.sprtTrgtAgeLmtYn === "Y",
    region_code: api.zipCd ?? "",
    earn_type: api.earnCndSeCd ?? "",
    earn_max: api.earnMaxAmt ?? "",
    job_code: api.jobCd ?? "",
    description: api.plcyExplnCn ?? "",
    benefit_detail: api.plcySprtCn ?? "",
    apply_url: api.aplyUrlAddr || api.refUrlAddr1 || api.refUrlAddr2 || "",
    apply_method: api.plcyAplyMthdCn ?? "",
    apply_period: api.aplyYmd ?? "",
    apply_period_type: api.aplyPrdSeCd ?? "",
    biz_start_date: api.bizPrdBgngYmd ?? "",
    biz_end_date: api.bizPrdEndYmd ?? "",
    org_name: api.sprvsnInstCdNm ?? "",
    view_count: parseCount(api.inqCnt),
    raw_data: api as Record<string, unknown>,
    synced_at: new Date().toISOString(),
  };
}
