import { FilterParams } from "@/types/policy";
import { getRegionName } from "@/lib/regions";

interface ResultSummaryProps {
  count: number;
  params: FilterParams;
}

export default function ResultSummary({ count, params }: ResultSummaryProps) {
  const regionName = getRegionName(params.region) ?? params.region;

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {count > 0 ? (
          <>
            <span className="text-green-600">{count}개</span>의 정책을 받을 수 있어요
          </>
        ) : (
          "조건에 맞는 정책이 없습니다"
        )}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {params.age}세 · {regionName} · 중위소득 {params.income}% 이하 · {params.employment}
      </p>
      {count === 0 && (
        <p className="mt-3 text-sm text-gray-400">
          조건을 완화하면 더 많은 정책을 확인할 수 있어요
        </p>
      )}
    </div>
  );
}
