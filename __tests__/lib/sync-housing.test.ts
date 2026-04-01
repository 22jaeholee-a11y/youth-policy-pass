import { mapLhToHousingNotice } from "@/lib/sync-housing";
import { LhNoticeItem } from "@/types/housing";

const mockLhItem: LhNoticeItem = {
  RNUM: "1",
  PAN_ID: "BN-0007448",
  PAN_NM: "2026년 대전 행복주택 입주자 모집공고",
  UPP_AIS_TP_NM: "임대",
  UPP_AIS_TP_CD: "06",
  AIS_TP_CD_NM: "행복주택",
  AIS_TP_CD: "01",
  CNP_CD_NM: "대전",
  PAN_SS: "공고중",
  ALL_CNT: "15",
  DTL_URL: "https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtanc.do?pn=1234",
  DTL_URL_MOB: "",
  PAN_NT_ST_DT: "2026.04.01",
  CLSG_DT: "2026.04.30",
  PAN_DT: "20260401",
  CCR_CNNT_SYS_DS_CD: "01",
  SPL_INF_TP_CD: "010",
};

describe("mapLhToHousingNotice", () => {
  test("LH API 응답을 DB 레코드로 변환", () => {
    const result = mapLhToHousingNotice(mockLhItem);
    expect(result.provider).toBe("lh");
    expect(result.notice_id).toBe("BN-0007448");
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

  test("경기도 같은 긴 지역명도 매핑됨", () => {
    const gyeonggi = { ...mockLhItem, CNP_CD_NM: "경기도" };
    const result = mapLhToHousingNotice(gyeonggi);
    expect(result.region_code).toBe("41000");
  });

  test("경상북도, 충청남도 등 도 단위 매핑", () => {
    expect(mapLhToHousingNotice({ ...mockLhItem, CNP_CD_NM: "경상북도" }).region_code).toBe("47000");
    expect(mapLhToHousingNotice({ ...mockLhItem, CNP_CD_NM: "충청남도" }).region_code).toBe("44000");
    expect(mapLhToHousingNotice({ ...mockLhItem, CNP_CD_NM: "전라남도" }).region_code).toBe("46000");
  });

  test("서울특별시 외 같은 패턴도 매핑됨", () => {
    expect(mapLhToHousingNotice({ ...mockLhItem, CNP_CD_NM: "서울특별시 외" }).region_code).toBe("11000");
    expect(mapLhToHousingNotice({ ...mockLhItem, CNP_CD_NM: "부산광역시 외" }).region_code).toBe("26000");
  });

  test("전국은 빈 region_code", () => {
    const nationwide = { ...mockLhItem, CNP_CD_NM: "전국" };
    const result = mapLhToHousingNotice(nationwide);
    expect(result.region_code).toBe("");
  });

  test("지역명으로 region_code 매핑 실패 시 빈 문자열", () => {
    const unknown = { ...mockLhItem, CNP_CD_NM: "알수없음" };
    const result = mapLhToHousingNotice(unknown);
    expect(result.region_code).toBe("");
  });

  test("빈 필드는 빈 문자열로 처리", () => {
    const empty: LhNoticeItem = {
      RNUM: "2",
      PAN_ID: "",
      PAN_NM: "테스트 공고",
      UPP_AIS_TP_NM: "",
      UPP_AIS_TP_CD: "",
      AIS_TP_CD_NM: "",
      AIS_TP_CD: "",
      CNP_CD_NM: "",
      PAN_SS: "",
      ALL_CNT: "0",
      DTL_URL: "",
      DTL_URL_MOB: "",
      PAN_NT_ST_DT: "",
      CLSG_DT: "",
      PAN_DT: "",
      CCR_CNNT_SYS_DS_CD: "",
      SPL_INF_TP_CD: "",
    };
    const result = mapLhToHousingNotice(empty);
    expect(result.notice_type).toBe("");
    expect(result.region_name).toBe("");
    expect(result.region_code).toBe("");
  });
});
