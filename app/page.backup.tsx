"use client";

import React, { useMemo, useState } from "react";

type Lang = "tr" | "en";
type VerifyStatus = "verified" | "not_found" | "invalid_format";

export default function Page() {
  const [lang, setLang] = useState<Lang>("tr");

  // Verification UI state
  const [idValue, setIdValue] = useState("");
  const [result, setResult] = useState<null | {
    status: VerifyStatus;
    id: string;
    name?: string;
    program?: string;
    issueDate?: string;
    validUntil?: string;
  }>(null);

  const t = useMemo(() => {
    const dict = {
      tr: {
        // Top / hero
        topPill: "INTERNATIONAL • OFFSHORE TRAINING • CHARTER • SEAMANSHIP",
        brand: "ALBATROS SAILING",
        institute: "Uluslararası Maritime Institute",
        locations: "Bodrum • İstanbul • Mediterranean",
        heroNote:
          "Albatros Sailing bir yelken okulu değildir. Gerçek deniz koşullarında kaptan yetiştiren bir denizcilik enstitüsüdür.",
        ctaPrimary: "Apply for Captain Training",
        ctaSecondary: "Explore Charter Program →",
        // Sections
        verifyTitle: "Lisans / ID Card Doğrulama",
        verifySubtitle:
          "Kart üzerindeki kısa kodu veya ID numarasını girerek doğrulama yapın.",
        inputLabel: "ID / Kısa Kod",
        inputPlaceholder: "Örn: 5324873813 veya AS-TR-000123",
        verifyBtn: "Sorgula",
        verified: "Onaylandı",
        notFound: "Kayıt bulunamadı",
        invalid: "Geçersiz format",
        detailsTitle: "Kart Bilgileri",
        fieldId: "ID",
        fieldName: "Ad Soyad",
        fieldProgram: "Program",
        fieldIssue: "Düzenlenme",
        fieldValid: "Geçerlilik",
        // Footer
        footerLine: "ACADEMY • OFFSHORE CAPTAIN TRAINING • CURATED ROUTES",
        // Language
        langTR: "TR",
        langEN: "EN",
      },
      en: {
        topPill: "INTERNATIONAL • OFFSHORE TRAINING • CHARTER • SEAMANSHIP",
        brand: "ALBATROS SAILING",
        institute: "International Maritime Institute",
        locations: "Bodrum • Istanbul • Mediterranean",
        heroNote:
          "Albatros Sailing is not a basic sailing school. It is a maritime institute that trains captains under real sea conditions.",
        ctaPrimary: "Apply for Captain Training",
        ctaSecondary: "Explore Charter Program →",
        verifyTitle: "License / ID Card Verification",
        verifySubtitle:
          "Enter the short code or ID number from the card to verify.",
        inputLabel: "ID / Short Code",
        inputPlaceholder: "e.g. 5324873813 or AS-EN-000123",
        verifyBtn: "Verify",
        verified: "Verified",
        notFound: "Record not found",
        invalid: "Invalid format",
        detailsTitle: "Card Details",
        fieldId: "ID",
        fieldName: "Name",
        fieldProgram: "Program",
        fieldIssue: "Issued",
        fieldValid: "Valid Until",
        footerLine: "ACADEMY • OFFSHORE CAPTAIN TRAINING • CURATED ROUTES",
        langTR: "TR",
        langEN: "EN",
      },
    } as const;

    return dict[lang];
  }, [lang]);

  // --- Mock verification DB (şimdilik demo). Sonra API'ye bağlarız.
  const mockDB = useMemo(() => {
    return new Map<
      string,
      { name: string; program: string; issueDate: string; validUntil: string }
    >([
      [
        "5324873813",
        {
          name: "Erdinç Pulat",
          program: "Offshore Captain Training",
          issueDate: "2026-02-01",
          validUntil: "2027-02-01",
        },
      ],
      [
        "AS-TR-000123",
        {
          name: "Erdinç Pulat",
          program: "Charter Skipper Assessment",
          issueDate: "2026-01-15",
          validUntil: "2027-01-15",
        },
      ],
      [
        "AS-EN-000123",
        {
          name: "Erdinç Pulat",
          program: "Offshore Captain Training",
          issueDate: "2026-01-15",
          validUntil: "2027-01-15",
        },
      ],
    ]);
  }, []);

  function normalizeId(input: string) {
    return input.trim().toUpperCase();
  }

  function isValidFormat(input: string) {
    // numeric: 6-14 digits OR code: AS-XX-000123
    const numeric = /^[0-9]{6,14}$/;
    const code = /^AS-(TR|EN)-[0-9]{6}$/;
    return numeric.test(input) || code.test(input);
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const key = normalizeId(idValue);

    if (!key || !isValidFormat(key)) {
      setResult({ status: "invalid_format", id: key || idValue });
      return;
    }

    const record = mockDB.get(key);
    if (!record) {
      setResult({ status: "not_found", id: key });
      return;
    }

    setResult({
      status: "verified",
      id: key,
      name: record.name,
      program: record.program,
      issueDate: record.issueDate,
      validUntil: record.validUntil,
    });
  }

  const badge =
    result?.status === "verified"
      ? {
          text: t.verified,
          cls: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30",
        }
      : result?.status === "not_found"
      ? {
          text: t.notFound,
          cls: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30",
        }
      : result?.status === "invalid_format"
      ? {
          text: t.invalid,
          cls: "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/30",
        }
      : null;

  return (
  ="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background Video */}
    <div className="absolute inset-0 -z-10">
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
    </div>

    {/* İçerik */}
    <div className="relative z-10">
      {/* Kartın burada */}
    </div>

  </main>
)

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/hero.jpg')" }}
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

  {/* Content */}
  <div className="relative z-10">
    {/* Kart içeriğin burada */}
  </div>

</main>>
      {/* Background Video */}
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/poster.jpg" // <-- varsa public/poster.jpg koy. Yoksa sorun değil.
        >
          {/* Video dosyanı public klasörüne koy: public/hero.mp4 */}
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Premium overlay + vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
        <div className="absolute inset-0 [background:radial-gradient(80%_60%_at_50%_35%,rgba(255,255,255,0.10),rgba(0,0,0,0.65))]" />
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.85)]" />
      </div>

      {/* Top Bar */}
      <header className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] tracking-[0.28em] uppercase text-white/70">
            {t.topPill}
          </div>

          {/* Language toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang("tr")}
              className={`rounded-full px-3 py-1 text-xs tracking-wider ${
                lang === "tr"
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
              aria-label="Türkçe"
            >
              {t.langTR}
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-full px-3 py-1 text-xs tracking-wider ${
                lang === "en"
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
              aria-label="English"
            >
              {t.langEN}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-5xl font-extrabold tracking-[0.12em] md:text-6xl">
              {t.brand}
            </h1>

            <div className="mt-6 space-y-2 text-white/80">
              <div className="text-lg font-medium">{t.institute}</div>
              <div className="text-sm tracking-wide text-white/70">
                {t.locations}
              </div>
            </div>

            <p className="mt-7 max-w-xl text-sm leading-relaxed text-white/75">
              {t.heroNote}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#training"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:opacity-90"
              >
                {t.ctaPrimary}
              </a>

              <a
                href="#charter"
                className="rounded-full border border-white/35 bg-black/20 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Premium card preview (visual block) */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
              <div className="flex items-center justify-between">
                <div className="text-xs tracking-[0.25em] text-white/60">
                  ID CARD • DIGITAL VERIFICATION
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400/70 shadow-[0_0_18px_rgba(52,211,153,0.55)]" />
              </div>

              <div className="mt-5">
                <div className="text-2xl font-bold tracking-wide">
                  {t.verifyTitle}
                </div>
                <div className="mt-2 text-sm text-white/70">
                  {t.verifySubtitle}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/60">{t.inputLabel}</div>
                <div className="mt-1 font-mono text-lg tracking-wider text-white/90">
                  {idValue ? normalizeId(idValue) : "AS-TR-000123"}
                </div>
              </div>

              {badge && (
                <div
                  className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs ${badge.cls}`}
                >
                  {badge.text}
                </div>
              )}

              <div className="mt-6 text-xs text-white/45">
                SOLAS / STCW references • Watermark • QR/Barcode ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section
        id="verify"
        className="mx-auto max-w-6xl px-6 pb-20 pt-4"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs tracking-[0.28em] uppercase text-white/60">
                Verification Center
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-wide">
                {t.verifyTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                {t.verifySubtitle}
              </p>
            </div>
            <div className="text-xs text-white/45">
              Tip: demo için <span className="font-mono">5324873813</span> veya{" "}
              <span className="font-mono">AS-TR-000123</span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Form */}
            <form
              onSubmit={handleVerify}
              className="rounded-2xl border border-white/10 bg-black/25 p-6"
            >
              <label className="block text-xs tracking-wide text-white/60">
                {t.inputLabel}
              </label>

              <div className="mt-3 flex gap-3">
                <input
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/35"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
                >
                  {t.verifyBtn}
                </button>
              </div>

              {badge && (
                <div
                  className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs ${badge.cls}`}
                >
                  {badge.text}
                </div>
              )}

              <div className="mt-6 text-xs leading-relaxed text-white/50">
                • Numeric IDs: 6–14 digits
                <br />
                • Code format: <span className="font-mono">AS-TR-000123</span> /{" "}
                <span className="font-mono">AS-EN-000123</span>
              </div>
            </form>

            {/* Result / Card visual */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-6">
              {/* watermark-ish background */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
                <div className="absolute left-6 top-6 text-[64px] font-black tracking-[0.22em]">
                  SOLAS
                </div>
                <div className="absolute bottom-6 right-6 text-[52px] font-black tracking-[0.22em]">
                  STCW
                </div>
              </div>

              <div className="relative">
                <div className="text-xs tracking-[0.25em] uppercase text-white/60">
                  {t.detailsTitle}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-white/60">{t.fieldId}</div>
                      <div className="mt-1 font-mono text-lg tracking-wider">
                        {result?.id
                          ? result.id
                          : lang === "tr"
                          ? "AS-TR-000123"
                          : "AS-EN-000123"}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-white/60">STATUS</div>
                      <div
                        className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs ${
                          result?.status === "verified"
                            ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30"
                            : "bg-white/10 text-white/65 ring-1 ring-white/10"
                        }`}
                      >
                        {result?.status === "verified" ? t.verified : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-white/60">{t.fieldName}</div>
                      <div className="mt-1 text-base text-white/90">
                        {result?.status === "verified"
                          ? result.name
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">
                        {t.fieldProgram}
                      </div>
                      <div className="mt-1 text-base text-white/90">
                        {result?.status === "verified"
                          ? result.program
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">{t.fieldIssue}</div>
                      <div className="mt-1 font-mono text-sm text-white/85">
                        {result?.status === "verified"
                          ? result.issueDate
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">{t.fieldValid}</div>
                      <div className="mt-1 font-mono text-sm text-white/85">
                        {result?.status === "verified"
                          ? result.validUntil
                          : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xs text-white/45">
                      Watermark • Barcode • Anti-tamper
                    </div>
                    <div className="h-10 w-24 rounded-md border border-white/15 bg-black/30">
                      {/* fake barcode */}
                      <div className="flex h-full items-end gap-[2px] px-2 pb-1">
                        {Array.from({ length: 22 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-[2px] bg-white/60"
                            style={{ height: `${20 + ((i * 7) % 16)}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-white/45">
                  If you need a real backend verification, we’ll connect this to
                  an API route + database.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dummy anchors for your existing buttons */}
      <section id="training" className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/80">
          <div className="text-xs tracking-[0.28em] uppercase text-white/60">
            Training
          </div>
          <div className="mt-3 text-xl font-semibold text-white">
            Offshore Captain Training
          </div>
          <p className="mt-2 max-w-3xl text-sm text-white/70">
            (Placeholder) Buraya eğitim haftaları, modüller, rota, sertifikasyon
            ve başvuru detaylarını ekleyeceğiz.
          </p>
        </div>
      </section>

      <section id="charter" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/80">
          <div className="text-xs tracking-[0.28em] uppercase text-white/60">
            Charter
          </div>
          <div className="mt-3 text-xl font-semibold text-white">
            Explore Charter Program
          </div>
          <p className="mt-2 max-w-3xl text-sm text-white/70">
            (Placeholder) Buraya charter program detayları, destinasyonlar ve
            curated routes ekleyeceğiz.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 pb-10">
        <div className="text-center text-xs tracking-[0.40em] uppercase text-white/55">
          {t.footerLine}
        </div>
      </footer>
    </main>
  );
}