import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const samplePolicies = [
  {
    plcy_no: "SEED001",
    title: "청년월세 특별지원",
    category: "주거",
    sub_category: "주거비지원",
    min_age: 19, max_age: 34, age_unlimited: false,
    region_code: "",
    earn_type: "중위소득", earn_max: "중위소득 60% 이하",
    job_code: "무관",
    description: "독립 거주 청년의 주거비 부담 경감을 위해 월세를 지원합니다.",
    benefit_detail: "월 최대 20만원, 12개월간 지원",
    apply_url: "https://www.myhome.go.kr",
    apply_method: "온라인 신청",
    apply_period: "2026.01.01 ~ 2026.12.31", apply_period_type: "기간",
    biz_start_date: "20260101", biz_end_date: "20261231",
    org_name: "국토교통부", view_count: 15432, raw_data: {},
  },
  {
    plcy_no: "SEED002",
    title: "청년도약계좌",
    category: "일자리",
    sub_category: "자산형성",
    min_age: 19, max_age: 34, age_unlimited: false,
    region_code: "",
    earn_type: "중위소득", earn_max: "중위소득 180% 이하",
    job_code: "재직자",
    description: "매월 70만원 한도 내에서 자유롭게 납입하면 정부가 기여금을 매칭 지원합니다.",
    benefit_detail: "만기 시 최대 5,000만원",
    apply_url: "https://www.kinfa.or.kr",
    apply_method: "은행 앱 신청",
    apply_period: "", apply_period_type: "상시",
    biz_start_date: "20260101", biz_end_date: "",
    org_name: "금융위원회", view_count: 28500, raw_data: {},
  },
  {
    plcy_no: "SEED003",
    title: "국민취업지원제도 (1유형)",
    category: "일자리",
    sub_category: "취업지원",
    min_age: 15, max_age: 34, age_unlimited: false,
    region_code: "",
    earn_type: "중위소득", earn_max: "중위소득 60% 이하",
    job_code: "미취업",
    description: "구직촉진수당과 취업지원서비스를 함께 제공합니다.",
    benefit_detail: "월 50만원, 6개월간 지원",
    apply_url: "https://www.work24.go.kr",
    apply_method: "고용24 온라인 신청",
    apply_period: "", apply_period_type: "상시",
    biz_start_date: "20260101", biz_end_date: "",
    org_name: "고용노동부", view_count: 32100, raw_data: {},
  },
  {
    plcy_no: "SEED004",
    title: "서울 청년 교통비 지원",
    category: "복지·문화",
    sub_category: "생활지원",
    min_age: 19, max_age: 34, age_unlimited: false,
    region_code: "11000",
    earn_type: "중위소득", earn_max: "중위소득 150% 이하",
    job_code: "무관",
    description: "서울 거주 청년의 대중교통비를 지원합니다.",
    benefit_detail: "연 최대 10만원",
    apply_url: "https://youth.seoul.go.kr",
    apply_method: "서울시 청년포털 신청",
    apply_period: "2026.03.01 ~ 2026.06.30", apply_period_type: "기간",
    biz_start_date: "20260301", biz_end_date: "20260630",
    org_name: "서울특별시", view_count: 8200, raw_data: {},
  },
  {
    plcy_no: "SEED005",
    title: "경기도 청년 기본소득",
    category: "복지·문화",
    sub_category: "생활지원",
    min_age: 24, max_age: 24, age_unlimited: false,
    region_code: "41000",
    earn_type: "", earn_max: "",
    job_code: "무관",
    description: "만 24세 경기도 거주 청년에게 지역화폐로 지급합니다.",
    benefit_detail: "분기별 25만원 (연 100만원)",
    apply_url: "https://www.gg.go.kr",
    apply_method: "경기도 포털 신청",
    apply_period: "", apply_period_type: "상시",
    biz_start_date: "20260101", biz_end_date: "",
    org_name: "경기도", view_count: 19800, raw_data: {},
  },
];

async function seed() {
  const { error } = await supabase
    .from("policies")
    .upsert(samplePolicies, { onConflict: "plcy_no" });

  if (error) {
    console.error("시드 실패:", error.message);
    process.exit(1);
  }

  console.log(`${samplePolicies.length}개 샘플 정책 삽입 완료`);
}

seed();
