import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-gray-900">
        내가 받을 수 있는
        <br />
        <span className="text-green-600">청년정책</span>을 확인하세요
      </h1>
      <p className="mt-4 text-gray-500">4가지 조건만 입력하면 맞춤 정책을 알려드려요</p>
      <Link href="/filter"
        className="mt-8 rounded-xl bg-green-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-green-600">
        내 혜택 확인하기
      </Link>
    </div>
  );
}
