export interface Region {
  code: string;
  name: string;
}

export const REGIONS: Region[] = [
  { code: "11000", name: "서울" },
  { code: "26000", name: "부산" },
  { code: "27000", name: "대구" },
  { code: "28000", name: "인천" },
  { code: "29000", name: "광주" },
  { code: "30000", name: "대전" },
  { code: "31000", name: "울산" },
  { code: "36110", name: "세종" },
  { code: "41000", name: "경기" },
  { code: "51000", name: "강원" },
  { code: "43000", name: "충북" },
  { code: "44000", name: "충남" },
  { code: "45000", name: "전북" },
  { code: "46000", name: "전남" },
  { code: "47000", name: "경북" },
  { code: "48000", name: "경남" },
  { code: "50000", name: "제주" },
];

export function getRegionName(code: string): string | null {
  const region = REGIONS.find(
    (r) => r.code === code || code.startsWith(r.code.substring(0, 2))
  );
  return region?.name ?? null;
}

export function getRegionCode(name: string): string | null {
  const region = REGIONS.find((r) => r.name === name);
  return region?.code ?? null;
}
