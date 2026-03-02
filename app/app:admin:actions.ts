"use server";

import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

function requireAdmin() {
  const ok = cookies().get("admin_ok")?.value === "1";
  if (!ok) throw new Error("unauthorized");
}

export async function adminLogin(password: string) {
  if (password !== process.env.ADMIN_PASSWORD) return { ok: false as const };

  cookies().set("admin_ok", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { ok: true as const };
}

export async function adminLogout() {
  cookies().set("admin_ok", "0", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });
  return { ok: true as const };
}

export async function listLicenses() {
  requireAdmin();
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("licenses")
    .select("id, code, short_code, full_name, role, program, issue_date, valid_until, location, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error("list_failed");
  return data ?? [];
}

export async function upsertLicense(payload: {
  code: string;
  short_code?: string;
  full_name: string;
  role?: string;
  program?: string;
  issue_date?: string;
  valid_until?: string;
  location?: string;
  status?: string;
}) {
  requireAdmin();
  const supabase = supabaseServer();

  const code = payload.code.trim().toUpperCase();
  const short_code = payload.short_code?.trim().toUpperCase() || null;

  const qr_url =
    short_code
      ? `https://albatrossailing.com/verify?code=${encodeURIComponent(code)}&sc=${encodeURIComponent(short_code)}`
      : `https://albatrossailing.com/verify?code=${encodeURIComponent(code)}`;

  const clean = {
    code,
    short_code,
    full_name: payload.full_name.trim(),
    role: payload.role || null,
    program: payload.program || null,
    issue_date: payload.issue_date || null,
    valid_until: payload.valid_until || null,
    location: payload.location || null,
    status: payload.status || "verified",
    qr_url,
  };

  const { error } = await supabase.from("licenses").upsert(clean, { onConflict: "code" });
  if (error) throw new Error("upsert_failed");

  return { ok: true as const };
}

export async function setStatus(code: string, status: "verified" | "revoked" | "pending") {
  requireAdmin();
  const supabase = supabaseServer();

  const { error } = await supabase
    .from("licenses")
    .update({ status })
    .eq("code", code.trim().toUpperCase());

  if (error) throw new Error("status_failed");
  return { ok: true as const };
}

export async function deleteLicense(code: string) {
  requireAdmin();
  const supabase = supabaseServer();

  const { error } = await supabase
    .from("licenses")
    .delete()
    .eq("code", code.trim().toUpperCase());

  if (error) throw new Error("delete_failed");
  return { ok: true as const };
}

export async function generateCodeAndShort() {
  requireAdmin();
  const supabase = supabaseServer();

  const { data: codeData, error: codeErr } = await supabase.rpc("next_license_code");
  if (codeErr) throw new Error("code_gen_failed");

  let short = "";
  for (let i = 0; i < 10; i++) {
    const { data: scData, error: scErr } = await supabase.rpc("gen_short_code");
    if (scErr) throw new Error("short_gen_failed");

    short = String(scData).trim().toUpperCase();

    const { data: exists, error: exErr } = await supabase
      .from("licenses")
      .select("id")
      .eq("short_code", short)
      .limit(1);

    if (exErr) throw new Error("short_check_failed");
    if (!exists || exists.length === 0) break;
    short = "";
  }

  if (!short) throw new Error("short_collision");

  return { code: String(codeData), short_code: short };
}