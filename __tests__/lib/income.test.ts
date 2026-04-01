import { calculateIncomePercent, getMedianAnnualSalary } from "@/lib/income";

describe("calculateIncomePercent", () => {
  test("1인 가구, 연봉 2870만원 → 약 100%", () => {
    const result = calculateIncomePercent(2870, 1);
    expect(result).toBeGreaterThanOrEqual(99);
    expect(result).toBeLessThanOrEqual(101);
  });

  test("1인 가구, 연봉 0 → 0%", () => {
    expect(calculateIncomePercent(0, 1)).toBe(0);
  });

  test("4인 가구, 연봉 7300만원 → 약 100%", () => {
    const result = calculateIncomePercent(7300, 4);
    expect(result).toBeGreaterThanOrEqual(99);
    expect(result).toBeLessThanOrEqual(101);
  });

  test("존재하지 않는 가구원 수 → 0", () => {
    expect(calculateIncomePercent(3000, 10)).toBe(0);
  });
});

describe("getMedianAnnualSalary", () => {
  test("1인 가구 중위소득 연봉 반환", () => {
    const result = getMedianAnnualSalary(1);
    expect(result).toBeGreaterThan(2800);
    expect(result).toBeLessThan(2900);
  });
});
