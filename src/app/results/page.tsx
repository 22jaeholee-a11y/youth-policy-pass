import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase-server";
import { buildFilterQuery, buildHousingFilterQuery, parseFilterParams } from "@/lib/filter";
import { Policy } from "@/types/policy";
import { HousingNotice, ResultItem } from "@/types/housing";
import ResultSummary from "@/components/ResultSummary";
import CategoryFilter from "@/components/CategoryFilter";
import PolicyList from "@/components/PolicyList";

export default async function ResultsPage() {
  const cookieStore = await cookies();
  const filterCookie = cookieStore.get("filterParams")?.value;
  let filterSource: Record<string, string | undefined> = {};

  if (filterCookie) {
    try {
      filterSource = JSON.parse(decodeURIComponent(filterCookie));
    } catch {
      filterSource = {};
    }
  }

  const params = parseFilterParams(filterSource);

  if (!params) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">조건을 먼저 입력해주세요</h1>
        <Link href="/filter"
          className="mt-4 inline-block rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600">
          조건 입력하기
        </Link>
      </div>
    );
  }

  const category = cookieStore.get("categoryFilter")?.value
    ? decodeURIComponent(cookieStore.get("categoryFilter")!.value)
    : "";

  const supabase = createServerClient();
  const selectedCategories = category ? category.split(",") : [];
  const showHousing = selectedCategories.length === 0 || selectedCategories.includes("공공주택");
  const showPolicies = selectedCategories.length === 0 || selectedCategories.some((c) => c !== "공공주택");

  const policyCategories = selectedCategories.filter((c) => c !== "공공주택");

  const items: ResultItem[] = [];

  if (showPolicies) {
    const policyQuery = buildFilterQuery(
      supabase,
      params,
      policyCategories.length > 0 ? policyCategories.join(",") : undefined
    );
    const { data: policies } = await policyQuery;
    if (policies) {
      for (const p of policies as Policy[]) {
        items.push({ type: "policy", data: p });
      }
    }
  }

  if (showHousing) {
    const housingQuery = buildHousingFilterQuery(supabase, params);
    const { data: notices } = await housingQuery;
    if (notices) {
      for (const n of notices as HousingNotice[]) {
        items.push({ type: "housing", data: n });
      }
    }
  }

  const totalCount = items.length;

  return (
    <div>
      <ResultSummary count={totalCount} params={params} />
      <CategoryFilter />
      <PolicyList items={items} />
      <div className="mt-8 text-center">
        <Link href="/filter"
          className="inline-block rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
          조건 다시 입력하기
        </Link>
      </div>
    </div>
  );
}
