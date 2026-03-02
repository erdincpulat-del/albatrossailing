import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { ok: false, error: "missing_code" },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { ok: false, error: "missing_env" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase
    .from("licenses")
    .select("*")
    .or(`license_code.eq.${code},short_code.eq.${code}`)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, error: "db_error", details: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({ ok: true, status: "not_found" });
  }

  return NextResponse.json({
    ok: true,
    status: "verified",
    record: data,
  });
}