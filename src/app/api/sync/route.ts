import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { fetchPoliciesFromApi, mapApiToPolicy } from "@/lib/sync";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.YOUTH_POLICY_OPENAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "YOUTH_POLICY_OPENAPI_KEY not configured" }, { status: 500 });
  }

  const supabase = createServerClient();
  let totalSynced = 0;
  let pageNum = 1;

  try {
    while (true) {
      const { policies, hasMore } = await fetchPoliciesFromApi(apiKey, pageNum, 100);
      if (policies.length === 0) break;

      const records = policies.map(mapApiToPolicy);
      const { error } = await supabase.from("policies").upsert(records, { onConflict: "plcy_no" });

      if (error) {
        throw new Error(`Supabase upsert 실패 (page ${pageNum}): ${error.message}`);
      }

      totalSynced += records.length;
      if (!hasMore) break;
      pageNum++;
    }

    return NextResponse.json({ success: true, totalSynced, syncedAt: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("동기화 실패:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
