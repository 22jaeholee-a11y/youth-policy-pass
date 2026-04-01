"use client";

import { HousingNotice, PROVIDER_BADGE } from "@/types/housing";

interface HousingModalProps {
  notice: HousingNotice;
  onClose: () => void;
}

export default function HousingModal({ notice, onClose }: HousingModalProps) {
  const badge = PROVIDER_BADGE[notice.provider] ?? {
    label: notice.provider,
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  const statusColor =
    notice.status === "접수중"
      ? "text-green-600 bg-green-50"
      : notice.status === "공고중"
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 bg-gray-50";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/40" />

      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}>
            {notice.status}
          </span>
        </div>

        <h2 className="mt-3 text-lg font-bold text-gray-900">{notice.title}</h2>

        {/* 요약 정보 */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">공고유형</p>
            <p className="text-sm font-medium">{notice.notice_type || "-"}</p>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">세부유형</p>
            <p className="text-sm font-medium">{notice.notice_sub_type || "-"}</p>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">지역</p>
            <p className="text-sm font-medium">{notice.region_name || "-"}</p>
          </div>
        </div>

        {/* 상세보기 버튼 */}
        {notice.detail_url && (
          <a
            href={notice.detail_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full rounded-xl bg-indigo-500 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-600"
          >
            상세보기 (LH 홈페이지) →
          </a>
        )}
      </div>
    </div>
  );
}
