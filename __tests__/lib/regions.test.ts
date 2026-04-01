import { getRegionName, getRegionCode, REGIONS } from "@/lib/regions";
import { regionCodeTo5Digit, regionCodeTo2Digit } from "@/lib/regions";

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

describe("regionCodeTo5Digit", () => {
  test("2자리 코드를 5자리로 변환", () => {
    expect(regionCodeTo5Digit("11")).toBe("11000");
    expect(regionCodeTo5Digit("26")).toBe("26000");
    expect(regionCodeTo5Digit("36")).toBe("36110");
  });

  test("매핑되지 않는 코드는 null 반환", () => {
    expect(regionCodeTo5Digit("99")).toBeNull();
  });

  test("빈 문자열은 null 반환", () => {
    expect(regionCodeTo5Digit("")).toBeNull();
  });
});

describe("regionCodeTo2Digit", () => {
  test("5자리 코드를 2자리로 변환", () => {
    expect(regionCodeTo2Digit("11000")).toBe("11");
    expect(regionCodeTo2Digit("36110")).toBe("36");
  });

  test("빈 문자열은 빈 문자열 반환", () => {
    expect(regionCodeTo2Digit("")).toBe("");
  });
});
