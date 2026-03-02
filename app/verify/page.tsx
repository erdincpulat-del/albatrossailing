export const dynamic = "force-dynamic";

type VerifyResponse =
  | { ok: false; error: string; details?: string }
  | {
      ok: true;
      status: "not_found";
    }
  | {
      ok: true;
      status: "verified";
      status_label?: string;
      issued_by?: string;
      verified_at?: string;
      record: any;
    };

function badgeStyle(label: string) {
  const up = (label || "").toUpperCase();
  if (up.includes("ACTIVE") || up.includes("VERIFIED")) return styles.badgeOk;
  if (up.includes("EXPIRED")) return styles.badgeWarn;
  if (up.includes("REVOKED") || up.includes("INVALID")) return styles.badgeFail;
  return styles.badgeNeutral;
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const code = (searchParams.code || "").trim();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""; // opsiyonel (prod'da domain yazarsın)
  const verifyUrl = `${baseUrl}/verify?code=${encodeURIComponent(code)}`;

  let resData: VerifyResponse | null = null;

  if (code) {
    const r = await fetch(`${baseUrl}/api/verify?code=${encodeURIComponent(code)}`, {
      cache: "no-store",
    });
    resData = (await r.json()) as VerifyResponse;
  }

  const isVerified =
    resData && "ok" in resData && resData.ok === true && (resData as any).status === "verified";
  const statusLabel = isVerified ? ((resData as any).status_label || "VERIFIED") : "NOT FOUND";

  const record = isVerified ? (resData as any).record : null;

  return (
    <div style={styles.bg}>
      <div style={styles.shell}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logoBox}>A</div>
            <div>
              <div style={styles.brandName}>ALBATROS SAILING</div>
              <div style={styles.brandSub}>Training Verification</div>
            </div>
          </div>

          <div style={{ ...styles.badge, ...badgeStyle(statusLabel) }}>
            {statusLabel}
          </div>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <div style={styles.titleRow}>
            <div>
              <div style={styles.h1}>Lisans Doğrulama</div>
              <div style={styles.pMuted}>
                Bu sayfa Albatros Sailing eğitim tamamlama kayıtlarını doğrulamak için kullanılır.
              </div>
            </div>

            <div style={styles.queryBox}>
              <div style={styles.queryLabel}>Sorgu Kodu</div>
              <div style={styles.queryCode}>{code || "—"}</div>
            </div>
          </div>

          <div style={styles.hr} />

          {!code ? (
            <div style={styles.empty}>
              <div style={styles.emptyTitle}>Kod gerekli</div>
              <div style={styles.pMuted}>
                Örnek: <span style={styles.code}>/verify?code=ALB001</span>
              </div>
            </div>
          ) : !resData ? (
            <div style={styles.empty}>
              <div style={styles.emptyTitle}>Yükleniyor…</div>
            </div>
          ) : "ok" in resData && resData.ok === true && (resData as any).status === "not_found" ? (
            <div style={styles.empty}>
              <div style={styles.emptyTitle}>Kayıt bulunamadı</div>
              <div style={styles.pMuted}>
                Bu kodla eşleşen eğitim kaydı sistemde bulunamadı.
              </div>
            </div>
          ) : "ok" in resData && resData.ok === false ? (
            <div style={styles.empty}>
              <div style={styles.emptyTitle}>Sistem hatası</div>
              <div style={styles.pMuted}>
                {resData.error} {resData.details ? `• ${resData.details}` : ""}
              </div>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div style={styles.grid}>
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>İsim</div>
                  <div style={styles.fieldValue}>{record?.full_name || record?.name || "—"}</div>
                </div>

                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Kurs</div>
                  <div style={styles.fieldValue}>{record?.course || record?.course_name || "—"}</div>
                </div>

                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Lisans Kodu</div>
                  <div style={styles.fieldValue}>{record?.license_code || "—"}</div>
                </div>

                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Lokasyon</div>
                  <div style={styles.fieldValue}>{record?.location || "—"}</div>
                </div>

                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Tarih</div>
                  <div style={styles.fieldValue}>{record?.issue_date || record?.date || "—"}</div>
                </div>

                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Durum</div>
                  <div style={styles.fieldValue}>{record?.status || "—"}</div>
                </div>

                {/* Authority fields */}
                <div style={styles.fieldWide}>
                  <div style={styles.fieldLabel}>Issued By</div>
                  <div style={styles.fieldValue}>
                    {(resData as any).issued_by || "Albatros Sailing Yacht Training Authority"}
                  </div>
                </div>

                <div style={styles.fieldWide}>
                  <div style={styles.fieldLabel}>Verification ID</div>
                  <div style={styles.mono}>{record?.id || "—"}</div>
                </div>

                <div style={styles.fieldWide}>
                  <div style={styles.fieldLabel}>Verification Link</div>
                  <div style={styles.mono}>{verifyUrl}</div>
                </div>
              </div>

              <div style={styles.notice}>
                Not: Bu doğrulama ekranı resmi devlet lisansı değildir. Geçerlilik yalnızca Albatros Sailing eğitim
                tamamlama ve doğrulama kayıtları içindir.
              </div>
            </>
          )}

          <div style={styles.footer}>
            <div style={styles.footerLeft}>© {new Date().getFullYear()} Albatros Sailing</div>
            <div style={styles.footerRight}>/verify • v2</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bg: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.08), transparent 60%), linear-gradient(180deg, #0B0F14 0%, #070A0D 100%)",
    color: "rgba(255,255,255,0.92)",
    padding: "42px 18px",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  shell: { maxWidth: 980, margin: "0 auto" },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  brand: { display: "flex", gap: 12, alignItems: "center" },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
    border: "1px solid rgba(255,255,255,0.14)",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    letterSpacing: 1,
  },
  brandName: { fontWeight: 800, letterSpacing: 2 },
  brandSub: { opacity: 0.65, fontSize: 12, marginTop: 2 },

  badge: {
    padding: "10px 14px",
    borderRadius: 999,
    fontWeight: 800,
    letterSpacing: 1,
    fontSize: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    backdropFilter: "blur(8px)",
  },
  badgeOk: { background: "rgba(34,197,94,0.14)", color: "rgba(187,255,214,0.95)" },
  badgeWarn: { background: "rgba(245,158,11,0.14)", color: "rgba(255,231,188,0.95)" },
  badgeFail: { background: "rgba(239,68,68,0.14)", color: "rgba(255,204,204,0.95)" },
  badgeNeutral: { background: "rgba(148,163,184,0.14)", color: "rgba(226,232,240,0.95)" },

  card: {
    borderRadius: 22,
    background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
    padding: 22,
  },
  titleRow: { display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  h1: { fontSize: 28, fontWeight: 900, letterSpacing: 0.5, marginBottom: 6 },
  pMuted: { opacity: 0.7, fontSize: 13, lineHeight: 1.45 },

  queryBox: {
    minWidth: 220,
    borderRadius: 16,
    padding: "12px 14px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.22)",
  },
  queryLabel: { opacity: 0.7, fontSize: 12, marginBottom: 6 },
  queryCode: { fontWeight: 900, fontSize: 20, letterSpacing: 1.2 },

  hr: { height: 1, background: "rgba(255,255,255,0.10)", margin: "18px 0" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },
  field: {
    borderRadius: 16,
    padding: "14px 14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.20)",
  },
  fieldWide: {
    gridColumn: "1 / -1",
    borderRadius: 16,
    padding: "14px 14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.20)",
  },
  fieldLabel: { opacity: 0.65, fontSize: 12, marginBottom: 8, letterSpacing: 0.6 },
  fieldValue: { fontWeight: 800, fontSize: 16 },

  mono: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 13,
    opacity: 0.95,
    wordBreak: "break-all",
  },
  code: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    padding: "2px 6px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
  },

  notice: {
    marginTop: 14,
    borderRadius: 16,
    padding: "12px 14px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)",
    opacity: 0.86,
    fontSize: 12,
    lineHeight: 1.45,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 18,
    opacity: 0.65,
    fontSize: 12,
  },
  footerLeft: {},
  footerRight: { fontFamily: 'ui-monospace, Menlo, Monaco, Consolas, "Courier New", monospace' },

  empty: {
    padding: "18px 4px",
  },
  emptyTitle: { fontWeight: 900, fontSize: 18, marginBottom: 8 },
};