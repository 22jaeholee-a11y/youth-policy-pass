import { mapApiToPolicy } from "@/lib/sync";
import { YouthApiPolicy } from "@/types/policy";

const mockApiPolicy: YouthApiPolicy = {
  plcyNo: "R2024030720423",
  plcyNm: "청년월세 특별지원",
  plcyKywdNm: "월세,주거,청년",
  plcyExplnCn: "독립 거주 청년의 주거비 부담 경감을 위해 월세를 지원합니다.",
  lclsfNm: "주거",
  mclsfNm: "주거비지원",
  plcySprtCn: "월 최대 20만원, 12개월간 지원",
  sprvsnInstCdNm: "국토교통부",
  sprtTrgtMinAge: "19",
  sprtTrgtMaxAge: "34",
  sprtTrgtAgeLmtYn: "N",
  earnCndSeCd: "중위소득",
  earnMinAmt: "",
  earnMaxAmt: "중위소득 60%",
  jobCd: "무관",
  zipCd: "11000",
  aplyUrlAddr: "https://www.myhome.go.kr",
  aplyPrdSeCd: "기간",
  aplyYmd: "2024.03.01 ~ 2024.12.31",
  bizPrdBgngYmd: "20240301",
  bizPrdEndYmd: "20241231",
  plcyAplyMthdCn: "온라인 신청",
  inqCnt: "15432",
  lastMdfcnDt: "2024-03-15 10:30:00",
};

describe("mapApiToPolicy", () => {
  test("API 응답을 DB 레코드로 변환", () => {
    const result = mapApiToPolicy(mockApiPolicy);
    expect(result.plcy_no).toBe("R2024030720423");
    expect(result.title).toBe("청년월세 특별지원");
    expect(result.category).toBe("주거");
    expect(result.min_age).toBe(19);
    expect(result.max_age).toBe(34);
    expect(result.age_unlimited).toBe(false);
    expect(result.region_code).toBe("11000");
    expect(result.earn_type).toBe("중위소득");
    expect(result.earn_max).toBe("중위소득 60%");
    expect(result.job_code).toBe("무관");
    expect(result.apply_url).toBe("https://www.myhome.go.kr");
    expect(result.view_count).toBe(15432);
    expect(result.raw_data).toEqual(mockApiPolicy);
  });

  test("나이 값이 빈 문자열이면 null로 변환", () => {
    const noAge = { ...mockApiPolicy, sprtTrgtMinAge: "", sprtTrgtMaxAge: "" };
    const result = mapApiToPolicy(noAge);
    expect(result.min_age).toBeNull();
    expect(result.max_age).toBeNull();
  });

  test("연령 제한 없음이면 age_unlimited = true", () => {
    const unlimited = { ...mockApiPolicy, sprtTrgtAgeLmtYn: "Y" };
    const result = mapApiToPolicy(unlimited);
    expect(result.age_unlimited).toBe(true);
  });

  test("조회수가 숫자가 아니면 0으로 처리", () => {
    const badCount = { ...mockApiPolicy, inqCnt: "" };
    const result = mapApiToPolicy(badCount);
    expect(result.view_count).toBe(0);
  });
});
