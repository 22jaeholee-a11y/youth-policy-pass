"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { label: "주거", value: "주거" },
  { label: "일자리", value: "일자리" },
  { label: "복지문화", value: "복지문화" },
  { label: "교육", value: "교육" },
  { label: "금융·복지·문화", value: "금융･복지･문화" },
  { label: "교육·직업훈련", value: "교육･직업훈련" },
  { label: "공공주택", value: "공공주택" },
];

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=3600`;
}

export default function CategoryFilter() {
  const router = useRouter();

  const currentRaw = getCookie("categoryFilter");
  const selected = currentRaw ? currentRaw.split(",") : [];

  const handleClick = (value: string) => {
    let next: string[];

    if (selected.includes(value)) {
      next = selected.filter((v) => v !== value);
    } else {
      next = [...selected, value];
    }

    setCookie("categoryFilter", next.join(","));
    router.push("/results");
  };

  const handleReset = () => {
    setCookie("categoryFilter", "");
    router.push("/results");
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
