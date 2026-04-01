import { HousingNotice, PROVIDER_BADGE } from "@/types/housing";

interface HousingCardProps {
  notice: HousingNotice;
  onClick?: () => void;
}

export default function HousingCard({ notice, onClick }: HousingCardProps) {
  const badge = PROVIDER_BADGE[notice.provider] ?? {
    label: notice.provider,
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  const statusColor =
    notice.status === "접수중"
      ? "bg-green-50 text-green-600"
      : notice.status === "공고중"
        ? "bg-blue-50 text-blue-600"
        : "bg-gray-50 text-gray-600";

  return (
    <div
      onClick={onClick}
      className="block cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.bg} ${badge.text}`}>
          {badge.label}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}>
          {notice.status}
        </span>
      </div>
      <h3 className="mt-2.5 text-base font-semibold text-gray-900">{notice.title}</h3>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {notice.notice_type && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {notice.notice_type}
          </span>
        )}
        {notice.notice_sub_type && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {notice.notice_sub_type}
          </span>
        )}
        {notice.region_name && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {notice.region_name}
          </span>
        )}
      </div>
    </div>
  );
}
