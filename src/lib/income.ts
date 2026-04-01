/** 2025년 기준 중위소득 (월, 원) */
const MEDIAN_INCOME_MONTHLY: Record<number, number> = {
  1: 2392013,
  2: 3932658,
  3: 5025353,
  4: 6097773,
  5: 7108192,
  6: 8064805,
};

/**
 * 세전 연봉(만원)과 가구원 수로 중위소득 대비 %를 계산
 * @param annualSalary 세전 연봉 (만원 단위, 예: 3000 = 3000만원)
 * @param householdSize 가구원 수 (1~6)
 * @returns 중위소득 대비 % (예: 125.3)
 */
export function calculateIncomePercent(
  annualSalary: number,
  householdSize: number
): number {
  const monthlyMedian = MEDIAN_INCOME_MONTHLY[householdSize];
  if (!monthlyMedian) return 0;

  const annualMedian = monthlyMedian * 12;
  const salaryInWon = annualSalary * 10000;

  return Math.round((salaryInWon / annualMedian) * 100);
}

/**
 * 가구원 수별 중위소득 100% 연봉(만원) 반환
 */
export function getMedianAnnualSalary(householdSize: number): number {
  const monthly = MEDIAN_INCOME_MONTHLY[householdSize];
  if (!monthly) return 0;
  return Math.round((monthly * 12) / 10000);
}

export { MEDIAN_INCOME_MONTHLY };
