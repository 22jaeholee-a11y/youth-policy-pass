"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REGIONS } from "@/lib/regions";
import { calculateIncomePercent, getMedianAnnualSalary } from "@/lib/income";

const EMPLOYMENT_OPTIONS = ["재직자", "자영업", "미취업", "무관"];

export default function FilterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [householdSize, setHouseholdSize] = useState(1);
  const [annualSalary, setAnnualSalary] = useState("");
  const [employment, setEmployment] = useState("");

  const canNext = () => {
    switch (step) {
      case 1: return age !== "" && parseInt(age) > 0;
      case 2: return region !== "";
      case 3: return annualSalary !== "" && parseInt(annualSalary) >= 0;
      case 4: return employment !== "";
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const incomePercent = calculateIncomePercent(parseInt(annualSalary), householdSize);
      router.push(
        `/results?age=${age}&region=${region}&income=${incomePercent}&employment=${employment}`
      );
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-green-500" : "bg-gray-200"}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">나이가 어떻게 되세요?</h2>
          <p className="mb-6 text-sm text-gray-500">만으로 입력해주세요</p>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
            placeholder="예: 27" min={1} max={100}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">지역이 어디세요?</h2>
          <p className="mb-6 text-sm text-gray-500">거주하는 시/도를 선택해주세요</p>
          <select value={region} onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
            <option value="">선택해주세요</option>
            {REGIONS.map((r) => (<option key={r.code} value={r.code}>{r.name}</option>))}
          </select>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            소득 정보를 알려주세요
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            가구원 수와 세전 연봉을 입력하면 자격을 자동으로 계산해드려요
          </p>

          {/* 가구원 수 */}
          <label className="mb-2 block text-sm font-medium text-gray-700">
            가구원 수
          </label>
          <select
            value={householdSize}
            onChange={(e) => setHouseholdSize(parseInt(e.target.value))}
            className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}인 가구
              </option>
            ))}
          </select>

          {/* 세전 연봉 */}
          <label className="mb-2 block text-sm font-medium text-gray-700">
            세전 연봉 (만원)
          </label>
          <input
            type="number"
            value={annualSalary}
            onChange={(e) => setAnnualSalary(e.target.value)}
            placeholder="예: 3000"
            min={0}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />

          {/* 중위소득 대비 % 실시간 표시 */}
          {annualSalary && parseInt(annualSalary) >= 0 && (
            <p className="mt-3 text-sm text-gray-500">
              → {householdSize}인 가구 기준 중위소득 대비{" "}
              <span className="font-semibold text-green-600">
                {calculateIncomePercent(parseInt(annualSalary), householdSize)}%
              </span>
              <span className="ml-1 text-xs text-gray-400">
                (중위소득 100% = 연봉 약 {getMedianAnnualSalary(householdSize).toLocaleString()}만원)
              </span>
            </p>
          )}
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">현재 고용 상태는요?</h2>
          <p className="mb-6 text-sm text-gray-500">해당하는 상태를 선택해주세요</p>
          <div className="grid grid-cols-2 gap-3">
            {EMPLOYMENT_OPTIONS.map((opt) => (
              <button key={opt} onClick={() => setEmployment(opt)}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  employment === opt ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}>{opt}</button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <button onClick={handleBack}
            className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">이전</button>
        )}
        <button onClick={handleNext} disabled={!canNext()}
          className="flex-1 rounded-xl bg-green-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500">
          {step === 4 ? "결과 보기" : "다음"}
        </button>
      </div>
    </div>
  );
}
