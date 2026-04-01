import { render, screen } from "@testing-library/react";
import PolicyCard from "@/components/PolicyCard";
import { Policy } from "@/types/policy";

const mockPolicy: Policy = {
  id: "1",
  plcy_no: "R2024030720423",
  title: "청년월세 특별지원",
  category: "주거",
  sub_category: "주거비지원",
  min_age: 19,
  max_age: 34,
  age_unlimited: false,
  region_code: "11000",
  earn_type: "중위소득",
  earn_max: "중위소득 60%",
  job_code: "무관",
  description: "청년 주거비 부담 경감",
  benefit_detail: "월 최대 20만원, 12개월간 지원",
  apply_url: "https://www.myhome.go.kr",
  apply_method: "온라인 신청",
  apply_period: "2024.03.01 ~ 2024.12.31",
  apply_period_type: "기간",
  biz_start_date: "20240301",
  biz_end_date: "20261231",
  org_name: "국토교통부",
  view_count: 15432,
  raw_data: {},
  synced_at: "2024-03-15T10:30:00Z",
  created_at: "2024-03-15T10:30:00Z",
};

describe("PolicyCard", () => {
  test("정책명이 렌더링된다", () => {
    render(<PolicyCard policy={mockPolicy} />);
    expect(screen.getByText("청년월세 특별지원")).toBeInTheDocument();
  });

  test("카테고리 뱃지가 표시된다", () => {
    render(<PolicyCard policy={mockPolicy} />);
    expect(screen.getByText("주거")).toBeInTheDocument();
  });

  test("혜택 내용이 표시된다", () => {
    render(<PolicyCard policy={mockPolicy} />);
    expect(screen.getByText("월 최대 20만원, 12개월간 지원")).toBeInTheDocument();
  });

  test("신청 링크가 새 탭으로 열린다", () => {
    render(<PolicyCard policy={mockPolicy} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://www.myhome.go.kr");
    expect(link).toHaveAttribute("target", "_blank");
  });

  test("상시모집 정책은 '상시' 뱃지를 표시한다", () => {
    const alwaysOpen = { ...mockPolicy, apply_period_type: "상시", biz_end_date: "" };
    render(<PolicyCard policy={alwaysOpen} />);
    expect(screen.getByText("상시")).toBeInTheDocument();
  });
});
