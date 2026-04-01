import { Policy, CATEGORY_COLORS } from "@/types/policy";
import { getRegionName } from "@/lib/regions";

interface PolicyCardProps {
  policy: Policy;
  onClick?: () => void;
}

function getDday(endDate: string): string | null {
  if (!endDate) return null;
  const year = endDate.substring(0, 4);
  const month = endDate.substring(4, 6);
  const day = endDate.substring(6, 8);
  const end = new Date(`${year}-${month}-${day}`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

export default function PolicyCard({ policy, onClick }: PolicyCardProps) {
  const colors = CATEGORY_COLORS[policy.category] ?? { bg: "bg-gray-100", text: "text-gray-700" };
  // aplyPrdSeCd: "0057001" = 기간제, "0057002" = 상시 (추정, 코드 정의서 확인 필요)
  const isAlwaysOpen = !policy.biz_end_date;
  const dday = isAlwaysOpen ? null : getDday(policy.biz_end_date);
  // region_code can be comma-separated, take first code for display
  const firstRegionCode = policy.region_code?.split(",")[0] ?? "";
  const regionName = getRegionName(firstRegionCode) ?? (policy.region_code ? "지역한정" : "전국");
  const ageTag = policy.age_unlimited
    ? "연령무관"
    : policy.min_age && policy.max_age
      ? `${policy.min_age}~${policy.max_age}세`
      : null;

  return (
    <div onClick={onClick}
      className="block cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}>
          {policy.category}
        </span>
        {isAlwaysOpen ? (
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">상시</span>
        ) : dday ? (
          <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">{dday}</span>
        ) : null}
      </div>
      <h3 className="mt-2.5 text-base font-semibold text-gray-900">{policy.title}</h3>
      <p className="mt-1 text-sm">
        <span className="font-bold text-[#2E7D32]">{policy.description}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ageTag && <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{ageTag}</span>}
        {policy.earn_type === "0043001" ? (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">소득 제한없음</span>
        ) : policy.earn_max && policy.earn_max !== "0" ? (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            소득 {parseInt(policy.earn_max).toLocaleString()}만원 이하
          </span>
        ) : (
          <span className="rounded bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">소득 조건확인</span>
        )}
        {regionName && <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{regionName}</span>}
      </div>
    </div>
  );
}
