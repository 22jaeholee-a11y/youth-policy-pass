import { mapLhToHousingNotice } from "@/lib/sync-housing";
import { LhNoticeItem } from "@/types/housing";

const mockLhItem: LhNoticeItem = {
  RNUM: "1",
  UPP_AIS_TP_NM: "임대",
  AIS_TP_CD_NM: "행복주택",
  PAN_NM: "2026년 대전 행복주택 입주자 모집공고",
  CNP_CD_NM: "대전",
  PAN_SS: "공고중",
  ALL_CNT: "15",
  DTL_URL: "https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtanc.do?pn=1234",
};

describe("mapLhToHousingNotice", () => {
  test("LH API 응답을 DB 레코드로 변환", () => {
    const result = mapLhToHousingNotice(mockLhItem);
    expect(result.provider).toBe("lh");
    expect(result.notice_id).toBe("1");
    expect(result.title).toBe("2026년 대전 행복주택 입주자 모집공고");
    expect(result.notice_type).toBe("임대");
    expect(result.notice_sub_type).toBe("행복주택");
    expect(result.region_name).toBe("대전");
    expect(result.region_code).toBe("30000");
    expect(result.status).toBe("공고중");
    expect(result.detail_url).toBe(
      "https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtanc.do?pn=1234"
    );
    expect(result.raw_data).toEqual(mockLhItem);
  });

  test("지역명으로 region_code 매핑 실패 시 빈 문자열", () => {
    const unknown = { ...mockLhItem, CNP_CD_NM: "알수없음" };
    const result = mapLhToHousingNotice(unknown);
    expect(result.region_code).toBe("");
  });

  test("빈 필드는 빈 문자열로 처리", () => {
    const empty: LhNoticeItem = {
      RNUM: "2",
      UPP_AIS_TP_NM: "",
      AIS_TP_CD_NM: "",
      PAN_NM: "테스트 공고",
      CNP_CD_NM: "",
      PAN_SS: "",
      ALL_CNT: "0",
      DTL_URL: "",
    };
    const result = mapLhToHousingNotice(empty);
    expect(result.notice_type).toBe("");
    expect(result.region_name).toBe("");
    expect(result.region_code).toBe("");
  });
});
