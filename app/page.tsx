"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [licenseCode, setLicenseCode] = useState("YC-0002475");
  const [shortCode, setShortCode] = useState("7H2K-9Q");

  // Hydration sorunu yaşamamak için: absolute domain yok, sadece relative path
  const verifyPath = useMemo(() => {
    const code = encodeURIComponent(licenseCode.trim());
    const sc = encodeURIComponent(shortCode.trim());
    return `/verify?code=${code}&sc=${sc}`;
  }, [licenseCode, shortCode]);

  function goVerify() {
    router.push(verifyPath);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO (Video burada, sayfanın tamamını kaplamaz) */}
      <section className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
        {/* Video layer */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay (yazılar net olsun) */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
            <div className="text-center">
              <div className="text-2xl font-semibold tracking-wide">
                ALBATROS SAILING
              </div>
              <div className="mt-1 text-sm text-white/70">
                License / ID Card Verification
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/25"
                value={licenseCode}
                onChange={(e) => setLicenseCode(e.target.value)}
                placeholder="License Code (e.g. YC-0002475)"
              />

              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/25"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                placeholder="Short Code (e.g. 7H2K-9Q)"
              />

              <button
                onClick={goVerify}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500 active:bg-blue-700"
              >
                Open Verification Page →
              </button>

              <div className="text-xs text-white/50 break-all">
                {verifyPath}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALT BÖLÜM */}
      <section className="mx-auto max-w-5xl px-4 py-10 text-white/75">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          Buraya alt içerikler gelebilir (bilgi, açıklama, footer vs.)
        </div>
      </section>
    </main>
  );
}