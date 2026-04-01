"use client";

import { Policy, CATEGORY_COLORS } from "@/types/policy";
import { getRegionName } from "@/lib/regions";

interface PolicyModalProps {
  policy: Policy;
  onClose: () => void;
}

function formatApplyPeriod(raw: string): string {
  if (!raw) return "상시";
  // "20260325 ~ 20260408\N20260209 ~ 20260225" 같은 형식 처리
  return raw
    .split("\\N")
    .map((period) => {
      return period.replace(/(\d{4})(\d{2})(\d{2})/g, "$1.$2.$3").trim();
    })
    .join("\n");
}

export default function PolicyModal({ policy, onClose }: PolicyModalProps) {
  const raw = policy.raw_data as Record<string, string>;
  const colors = CATEGORY_COLORS[policy.category] ?? {
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  const firstRegionCode = policy.region_code?.split(",")[0] ?? "";
  const regionName =
    getRegionName(firstRegionCode) ??
    (policy.region_code ? "지역한정" : "전국");

  const sections = [
    { label: "신청기간", value: formatApplyPeriod(policy.apply_period) },
    { label: "자격조건", value: raw.addAplyQlfcCndCn },
    { label: "참여 제한대상", value: raw.ptcpPrpTrgtCn },
    { label: "제출서류", value: raw.sbmsnDcmntCn },
  ].filter((s) => s.value && s.value.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/40" />

      {/* 모달 본체 */}
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
          >
            {policy.category}
          </span>
          <span className="text-xs text-gray-400">{regionName}</span>
        </div>

        <h2 className="mt-3 text-lg font-bold text-gray-900">{policy.title}</h2>

        <p className="mt-2 text-sm">
          <span className="font-bold text-[#2E7D32]">{policy.description}</span>
        </p>

        {/* 요약 정보 */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">연령</p>
            <p className="text-sm font-medium">
              {policy.age_unlimited
                ? "제한없음"
                : policy.min_age && policy.max_age
                  ? `${policy.min_age}~${policy.max_age}세`
                  : "-"}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">소득</p>
            <p className="text-sm font-medium">
              {policy.earn_max && policy.earn_max !== "0"
                ? `${parseInt(policy.earn_max).toLocaleString()}만원↓`
                : "제한없음"}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">주관기관</p>
            <p className="text-sm font-medium">{policy.org_name || "-"}</p>
          </div>
        </div>

        {/* 상세 섹션 */}
        <div className="mt-5 space-y-4">
          {sections.map((section) => (
            <div key={section.label}>
              <h3 className="mb-1 text-sm font-semibold text-gray-700">
                {section.label}
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {section.value}
              </p>
            </div>
          ))}
        </div>

        {/* 신청 버튼 */}
        {policy.apply_url && (
          <a
            href={policy.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full rounded-xl bg-green-500 py-3 text-center text-sm font-semibold text-white hover:bg-green-600"
          >
            신청 페이지로 이동 →
          </a>
        )}
      </div>
    </div>
  );
}
