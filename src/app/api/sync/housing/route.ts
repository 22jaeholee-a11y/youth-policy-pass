import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { fetchLhNotices, mapLhToHousingNotice } from "@/lib/sync-housing";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.LH_API_SERVICE_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "LH_API_SERVICE_KEY not configured" },
      { status: 500 }
    );
  }

  const supabase = createServerClient();
  let totalSynced = 0;
  let page = 1;

  try {
    while (true) {
      const { notices, totalCount } = await fetchLhNotices(apiKey, page, 100);
      if (notices.length === 0) break;

      const records = notices.map(mapLhToHousingNotice);
      const { error } = await supabase
        .from("housing_notices")
        .upsert(records, { onConflict: "provider,notice_id" });

      if (error) {
        throw new Error(`Supabase upsert 실패 (page ${page}): ${error.message}`);
      }

      totalSynced += records.length;
      if (totalSynced >= totalCount) break;
      page++;
    }

    return NextResponse.json({
      success: true,
      totalSynced,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("LH 공고 동기화 실패:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
