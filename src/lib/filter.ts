import { SupabaseClient } from "@supabase/supabase-js";
import { FilterParams } from "@/types/policy";

export function buildFilterQuery(supabase: SupabaseClient, params: FilterParams, category?: string) {
  let query = supabase.from("policies").select("*");

  // 카테고리 필터 (다중 선택 지원: "주거,일자리" 형태)
  if (category) {
    const categories = category.split(",");
    if (categories.length === 1) {
      query = query.ilike("category", `%${categories[0]}%`);
    } else {
      query = query.or(
        categories.map((c) => `category.ilike.%${c}%`).join(",")
      );
    }
  }

  // 나이 필터: age_unlimited이거나, 범위에 포함되거나, 나이 정보가 없는 정책 포함
  query = query.or(
    `age_unlimited.eq.true,and(min_age.lte.${params.age},max_age.gte.${params.age}),min_age.is.null`
  );

  // 지역 필터: zipCd는 쉼표 구분 다중 지역코드 (예: "43111,43112")
  // 시/도 코드 앞 2자리로 매칭하되, 다른 코드 내부에 포함되지 않도록 정확히 매칭
  // 예: 서울(11)을 찾을 때 청주(43111)에 매칭되면 안 됨
  const regionPrefix = params.region.substring(0, 2);
  query = query.or(
    [
      `region_code.like.${regionPrefix}___`,   // 정확히 5자리 (단일 코드)
      `region_code.like.${regionPrefix}___%`,   // 해당 시도로 시작하는 코드 포함
      `region_code.eq.`,                        // 빈 값 (전국)
      `region_code.is.null`,                    // null (전국)
    ].join(",")
  );

  // 소득 필터: earnCndSeCd="0043001"이면 소득 제한 없음
  // earnMaxAmt는 만원 단위 연소득 상한 — 사용자 입력 income은 중위소득 %인데,
  // API의 소득 상한은 만원 단위 금액이므로 직접 비교가 어려움
  // → 소득 제한 없는 정책("0043001")은 무조건 포함, 그 외는 모두 포함 (정확한 비교는 추후 개선)
  // 소득 필터는 일단 모든 정책을 포함하되, earn_type 정보만 카드에 표시
  // (실제 소득 비교는 코드 정의서의 정확한 값 확인 후 구현)

  // 고용상태 필터: jobCd는 코드값 (예: "0013010")
  // 코드 매핑이 없으므로 일단 모든 정책 포함 (추후 코드 정의서 기반 매핑 추가)

  // 마감되지 않은 정책만
  const today = new Date().toISOString().replace(/-/g, "").substring(0, 8);
  query = query.or(`biz_end_date.gte.${today},biz_end_date.eq.,biz_end_date.is.null`);

  // 조회수 기준 정렬 (인기순)
  query = query.order("view_count", { ascending: false });

  return query;
}

export function parseFilterParams(
  searchParams: Record<string, string | undefined>
): FilterParams | null {
  const age = parseInt(searchParams.age ?? "", 10);
  const region = searchParams.region ?? "";
  const income = parseInt(searchParams.income ?? "", 10);
  const employment = searchParams.employment ?? "";

  if (isNaN(age) || age < 1 || age > 100) return null;
  if (!region) return null;
  if (isNaN(income) || income < 0) return null;
  if (!employment) return null;

  return { age, region, income, employment };
}
