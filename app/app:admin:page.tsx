"use client";

import { useEffect, useState } from "react";
import {
  setStatus,
  upsertLicense,
  deleteLicense,
  generateCodeAndShort
} from "@/app/admin/actions";
type Row = {
  id: string;
  code: string;
  short_code?: string | null;
  full_name: string;
  role?: string | null;
  program?: string | null;
  issue_date?: string | null;
  valid_until?: string | null;
  location?: string | null;
  status: "verified" | "revoked" | "pending";
  created_at: string;
};

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [logged, setLogged] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    short_code: "",
    full_name: "",
    role: "",
    program: "Offshore Captain Training",
    issue_date: "",
    valid_until: "",
    location: "Bodrum / İstanbul",
    status: "verified",
  });

  async function refresh() {
    setErr(null);
    try {
      const data = await listLicenses();
      setRows(data as Row[]);
      setLogged(true);
    } catch {
      setLogged(false);
      setRows([]);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login() {
    const r = await adminLogin(pw);
    if (!r.ok) {
      setErr("Wrong password");
      return;
    }
    setPw("");
    await refresh();
  }

  async function logout() {
    await adminLogout();
    setLogged(false);
    setRows([]);
  }

  async function save() {
    setErr(null);
    try {
      await upsertLicense(form);
      setForm((p) => ({ ...p, full_name: "", role: "" }));
      await refresh();
    } catch {
      setErr("Save failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1020] text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-white/55">ALBATROS ADMIN</div>
            <h1 className="mt-3 text-3xl font-semibold">License Manager</h1>
            <p className="mt-2 text-white/65 text-sm">
              SOLAS • COLREG • GMDSS set compatible — generate codes, manage status, verify links.
            </p>
          </div>
          {logged ? (
            <button
              onClick={logout}
              className="rounded-xl bg-white px-4 py-2 text-black font-semibold hover:opacity-90"
            >
              Logout
            </button>
          ) : null}
        </div>

        {!logged && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 max-w-xl">
            <div className="text-sm text-white/80">Admin Login</div>
            <div className="mt-3 flex gap-3">
              <input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="ADMIN_PASSWORD"
                type="password"
                className="flex-1 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none"
              />
              <button
                onClick={login}
                className="rounded-xl bg-white px-5 py-3 text-black font-semibold hover:opacity-90"
              >
                Login
              </button>
            </div>
            {err && <div className="mt-3 text-sm text-rose-300">{err}</div>}
          </div>
        )}

        {logged && (
          <>
            {/* Create / Update */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-xs tracking-[0.25em] uppercase text-white/55">
                  Create / Update (Upsert by code)
                </div>
                <button
                  onClick={async () => {
                    setErr(null);
                    try {
                      const g = await generateCodeAndShort();
                      setForm((p) => ({ ...p, code: g.code, short_code: g.short_code }));
                    } catch {
                      setErr("Generate failed");
                    }
                  }}
                  className="rounded-xl border border-white/15 bg-black/25 px-4 py-2 text-sm hover:border-white/30"
                >
                  Generate Code + Short
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Input label="CODE" value={form.code} onChange={(v) => setForm({ ...form, code: v })} placeholder="YC-0002475" />
                <Input label="SHORT CODE" value={form.short_code} onChange={(v) => setForm({ ...form, short_code: v })} placeholder="7H2K-9Q" />
                <Input label="FULL NAME" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} placeholder="OKTAY TOPUZ" />

                <Input label="ROLE" value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="Instructor / Participant" />
                <Input label="PROGRAM" value={form.program} onChange={(v) => setForm({ ...form, program: v })} placeholder="Offshore Captain Training" />
                <Select label="STATUS" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={["verified", "pending", "revoked"]} />

                <Input label="ISSUE DATE" value={form.issue_date} onChange={(v) => setForm({ ...form, issue_date: v })} placeholder="2026-04-20" />
                <Input label="VALID UNTIL" value={form.valid_until} onChange={(v) => setForm({ ...form, valid_until: v })} placeholder="2027-04-20" />
                <Input label="LOCATION" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Bodrum / İstanbul" />

                <div className="flex items-end">
                  <button
                    onClick={save}
                    className="w-full rounded-xl bg-white px-5 py-3 text-black font-semibold hover:opacity-90"
                  >
                    Save
                  </button>
                </div>
              </div>

              {err && <div className="mt-3 text-sm text-rose-300">{err}</div>}
            </div>

            {/* List */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div className="text-xs tracking-[0.25em] uppercase text-white/55">Licenses</div>
                <button
                  onClick={refresh}
                  className="rounded-xl border border-white/15 bg-black/25 px-4 py-2 text-sm hover:border-white/30"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-white/55">
                    <tr className="border-b border-white/10">
                      <th className="py-3 text-left">CODE</th>
                      <th className="py-3 text-left">SHORT</th>
                      <th className="py-3 text-left">NAME</th>
                      <th className="py-3 text-left">PROGRAM</th>
                      <th className="py-3 text-left">STATUS</th>
                      <th className="py-3 text-left">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b border-white/10">
                        <td className="py-3 font-mono">{r.code}</td>
                        <td className="py-3 font-mono">{r.short_code ?? "—"}</td>
                        <td className="py-3">{r.full_name}</td>
                        <td className="py-3">{r.program ?? "—"}</td>
                        <td className="py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs border ${
                              r.status === "verified"
                                ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200"
                                : r.status === "revoked"
                                ? "bg-rose-500/15 border-rose-400/30 text-rose-200"
                                : "bg-sky-500/15 border-sky-400/30 text-sky-200"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={async () => {
                                await setStatus(r.code, "verified");
                                await refresh();
                              }}
                              className="rounded-lg border border-white/15 bg-black/25 px-3 py-1.5 text-xs hover:border-white/30"
                            >
                              Verify
                            </button>
                            <button
                              onClick={async () => {
                                await setStatus(r.code, "revoked");
                                await refresh();
                              }}
                              className="rounded-lg border border-white/15 bg-black/25 px-3 py-1.5 text-xs hover:border-white/30"
                            >
                              Revoke
                            </button>
                            <button
                              onClick={async () => {
                                await setStatus(r.code, "pending");
                                await refresh();
                              }}
                              className="rounded-lg border border-white/15 bg-black/25 px-3 py-1.5 text-xs hover:border-white/30"
                            >
                              Pending
                            </button>
                            <button
                              onClick={async () => {
                                await deleteLicense(r.code);
                                await refresh();
                              }}
                              className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:border-rose-400/50"
                            >
                              Delete
                            </button>
                            <a
                              href={`/verify?code=${encodeURIComponent(r.code)}&sc=${encodeURIComponent(
                                r.short_code ?? ""
                              )}`}
                              target="_blank"
                              className="rounded-lg border border-white/15 bg-black/25 px-3 py-1.5 text-xs hover:border-white/30"
                            >
                              View
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {rows.length === 0 && (
                      <tr>
                        <td className="py-6 text-white/50" colSpan={6}>
                          No records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-[11px] tracking-[0.25em] uppercase text-white/55">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-white/25"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <div className="text-[11px] tracking-[0.25em] uppercase text-white/55">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-white/25"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}