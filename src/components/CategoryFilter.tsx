"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { label: "주거", value: "주거" },
  { label: "일자리", value: "일자리" },
  { label: "복지문화", value: "복지문화" },
  { label: "교육", value: "교육" },
  { label: "금융·복지·문화", value: "금융･복지･문화" },
  { label: "교육·직업훈련", value: "교육･직업훈련" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // category=주거,일자리 형태로 저장
  const currentRaw = searchParams.get("category") ?? "";
  const selected = currentRaw ? currentRaw.split(",") : [];

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let next: string[];

    if (selected.includes(value)) {
      // 이미 선택된 카테고리 → 해제
      next = selected.filter((v) => v !== value);
    } else {
      // 새로 선택
      next = [...selected, value];
    }

    if (next.length > 0) {
      params.set("category", next.join(","));
    } else {
      params.delete("category");
    }
    router.push(`/results?${params.toString()}`);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        onClick={handleReset}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          selected.length === 0
            ? "bg-green-500 text-white"
            : "bg-white border border-gray-300 text-gray-600 hover:border-green-400"
        }`}
      >
        전체
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleClick(cat.value)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            selected.includes(cat.value)
              ? "bg-green-500 text-white"
              : "bg-white border border-gray-300 text-gray-600 hover:border-green-400"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
