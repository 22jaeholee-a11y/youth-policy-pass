export default function ResultsLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      {/* 스피너 */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
      <p className="mt-4 text-sm text-gray-500">맞춤 정책을 찾고 있어요...</p>
    </div>
  );
}
