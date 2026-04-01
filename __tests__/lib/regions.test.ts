import { getRegionName, getRegionCode, REGIONS } from "@/lib/regions";

describe("regions", () => {
  test("코드로 지역명 조회", () => {
    expect(getRegionName("11000")).toBe("서울");
  });

  test("지역명으로 코드 조회", () => {
    expect(getRegionCode("서울")).toBe("11000");
  });

  test("존재하지 않는 코드는 null 반환", () => {
    expect(getRegionName("99999")).toBeNull();
  });

  test("전체 지역 목록 반환", () => {
    expect(REGIONS.length).toBeGreaterThan(0);
    expect(REGIONS[0]).toHaveProperty("code");
    expect(REGIONS[0]).toHaveProperty("name");
  });
});
