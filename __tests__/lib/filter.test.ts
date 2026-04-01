import { buildFilterQuery } from "@/lib/filter";
import { FilterParams } from "@/types/policy";

const mockSelect = jest.fn().mockReturnThis();
const mockOr = jest.fn().mockReturnThis();
const mockLte = jest.fn().mockReturnThis();
const mockGte = jest.fn().mockReturnThis();
const mockOrder = jest.fn().mockReturnThis();
const mockIlike = jest.fn().mockReturnThis();

const mockFrom = jest.fn(() => ({
  select: mockSelect,
  or: mockOr,
  lte: mockLte,
  gte: mockGte,
  order: mockOrder,
  ilike: mockIlike,
}));

const mockSupabase = { from: mockFrom } as any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("buildFilterQuery", () => {
  test("기본 필터 - policies 테이블에서 select 호출", () => {
    const params: FilterParams = {
      age: 27,
      region: "11000",
      income: 120,
      employment: "미취업",
    };
    buildFilterQuery(mockSupabase, params);
    expect(mockFrom).toHaveBeenCalledWith("policies");
    expect(mockSelect).toHaveBeenCalledWith("*");
  });

  test("나이 필터 - or 조건 적용", () => {
    const params: FilterParams = {
      age: 27,
      region: "11000",
      income: 120,
      employment: "미취업",
    };
    buildFilterQuery(mockSupabase, params);
    expect(mockOr).toHaveBeenCalled();
  });
});
