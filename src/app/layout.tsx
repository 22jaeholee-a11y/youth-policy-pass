import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "청년정책 패스 | 내가 받을 수 있는 정책 확인",
  description: "나이, 지역, 소득, 고용상태만 입력하면 받을 수 있는 청년정책을 한눈에 확인할 수 있습니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <a href="/" className="text-lg font-bold text-green-600">청년정책 패스</a>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
