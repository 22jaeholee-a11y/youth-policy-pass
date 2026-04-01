import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { buildFilterQuery, parseFilterParams } from "@/lib/filter";
import { Policy } from "@/types/policy";
import ResultSummary from "@/components/ResultSummary";
import CategoryFilter from "@/components/CategoryFilter";
import PolicyList from "@/components/PolicyList";

interface ResultsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const resolvedParams = await searchParams;
  const params = parseFilterParams(resolvedParams);

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

  const category = resolvedParams.category ?? "";

  const supabase = createServerClient();
  const query = buildFilterQuery(supabase, params, category || undefined);
  const { data: policies, error } = await query;

  if (error) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">잠시 후 다시 시도해주세요</h1>
        <p className="mt-2 text-sm text-gray-500">데이터를 불러오는 중 오류가 발생했습니다</p>
      </div>
    );
  }

  const policyList = (policies as Policy[]) ?? [];

  return (
    <div>
      <ResultSummary count={policyList.length} params={params} />
      <CategoryFilter />
      <PolicyList policies={policyList} />
      <div className="mt-8 text-center">
        <Link href="/filter"
          className="inline-block rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
          조건 다시 입력하기
        </Link>
      </div>
    </div>
  );
}
