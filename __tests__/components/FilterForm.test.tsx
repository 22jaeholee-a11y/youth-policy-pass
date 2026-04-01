import { render, screen, fireEvent } from "@testing-library/react";
import FilterForm from "@/components/FilterForm";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => {
  mockPush.mockClear();
});

describe("FilterForm", () => {
  test("Step 1: 나이 입력이 렌더링된다", () => {
    render(<FilterForm />);
    expect(screen.getByText(/나이/)).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  test("나이 입력 후 다음 버튼으로 Step 2 진행", () => {
    render(<FilterForm />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "27" } });
    const nextButton = screen.getByText("다음");
    fireEvent.click(nextButton);
    expect(screen.getByText(/지역/)).toBeInTheDocument();
  });

  test("모든 스텝 완료 후 결과 페이지로 이동", () => {
    render(<FilterForm />);

    // Step 1: 나이
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "27" } });
    fireEvent.click(screen.getByText("다음"));

    // Step 2: 지역
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "11000" } });
    fireEvent.click(screen.getByText("다음"));

    // Step 3: 소득 (가구원수 기본값 1인, 연봉 입력)
    const salaryInputs = screen.getAllByRole("spinbutton");
    const salaryInput = salaryInputs[0]; // the salary number input
    fireEvent.change(salaryInput, { target: { value: "3000" } });
    fireEvent.click(screen.getByText("다음"));

    // Step 4: 고용상태
    fireEvent.click(screen.getByText("미취업"));
    fireEvent.click(screen.getByText("결과 보기"));

    expect(mockPush).toHaveBeenCalledTimes(1);
    const calledUrl = mockPush.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/results?");
    expect(calledUrl).toContain("age=27");
    expect(calledUrl).toContain("region=");
    expect(calledUrl).toContain("income=");
    expect(calledUrl).toContain("employment=미취업");
  });
});
