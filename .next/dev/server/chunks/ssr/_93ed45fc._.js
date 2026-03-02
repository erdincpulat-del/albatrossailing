module.exports = [
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"001459ece7a8bdf3eecf16995731a5d9e23fdd5801":"generateCodeAndShort","007462141bc7fd20473becc26b03c290c443562de1":"listLicenses","00e2a1dc1d28c06a3fe4e9a74c831212afa4ab8cb1":"adminLogout","40b243ab591f032952f322bcc3135266f673ef6a0d":"upsertLicense","40b988f46293a02e3bdaf3298daddbac6014906d3e":"adminLogin","40da87ec6ab534d10759c964bdedb4c8cb66a8d531":"deleteLicense","60b0354a56d7540f6f52336677acc74a737a70df32":"setStatus"},"",""] */ __turbopack_context__.s([
    "adminLogin",
    ()=>adminLogin,
    "adminLogout",
    ()=>adminLogout,
    "deleteLicense",
    ()=>deleteLicense,
    "generateCodeAndShort",
    ()=>generateCodeAndShort,
    "listLicenses",
    ()=>listLicenses,
    "setStatus",
    ()=>setStatus,
    "upsertLicense",
    ()=>upsertLicense
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/supabaseServer'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
function requireAdmin() {
    const ok = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])().get("admin_ok")?.value === "1";
    if (!ok) throw new Error("unauthorized");
}
async function adminLogin(password) {
    if (password !== process.env.ADMIN_PASSWORD) return {
        ok: false
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])().set("admin_ok", "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 8
    });
    return {
        ok: true
    };
}
async function adminLogout() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])().set("admin_ok", "0", {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 0
    });
    return {
        ok: true
    };
}
async function listLicenses() {
    requireAdmin();
    const supabase = supabaseServer();
    const { data, error } = await supabase.from("licenses").select("id, code, short_code, full_name, role, program, issue_date, valid_until, location, status, created_at").order("created_at", {
        ascending: false
    }).limit(200);
    if (error) throw new Error("list_failed");
    return data ?? [];
}
async function upsertLicense(payload) {
    requireAdmin();
    const supabase = supabaseServer();
    const code = payload.code.trim().toUpperCase();
    const short_code = payload.short_code?.trim().toUpperCase() || null;
    const qr_url = short_code ? `https://albatrossailing.com/verify?code=${encodeURIComponent(code)}&sc=${encodeURIComponent(short_code)}` : `https://albatrossailing.com/verify?code=${encodeURIComponent(code)}`;
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
        qr_url
    };
    const { error } = await supabase.from("licenses").upsert(clean, {
        onConflict: "code"
    });
    if (error) throw new Error("upsert_failed");
    return {
        ok: true
    };
}
async function setStatus(code, status) {
    requireAdmin();
    const supabase = supabaseServer();
    const { error } = await supabase.from("licenses").update({
        status
    }).eq("code", code.trim().toUpperCase());
    if (error) throw new Error("status_failed");
    return {
        ok: true
    };
}
async function deleteLicense(code) {
    requireAdmin();
    const supabase = supabaseServer();
    const { error } = await supabase.from("licenses").delete().eq("code", code.trim().toUpperCase());
    if (error) throw new Error("delete_failed");
    return {
        ok: true
    };
}
async function generateCodeAndShort() {
    requireAdmin();
    const supabase = supabaseServer();
    const { data: codeData, error: codeErr } = await supabase.rpc("next_license_code");
    if (codeErr) throw new Error("code_gen_failed");
    let short = "";
    for(let i = 0; i < 10; i++){
        const { data: scData, error: scErr } = await supabase.rpc("gen_short_code");
        if (scErr) throw new Error("short_gen_failed");
        short = String(scData).trim().toUpperCase();
        const { data: exists, error: exErr } = await supabase.from("licenses").select("id").eq("short_code", short).limit(1);
        if (exErr) throw new Error("short_check_failed");
        if (!exists || exists.length === 0) break;
        short = "";
    }
    if (!short) throw new Error("short_collision");
    return {
        code: String(codeData),
        short_code: short
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    adminLogin,
    adminLogout,
    listLicenses,
    upsertLicense,
    setStatus,
    deleteLicense,
    generateCodeAndShort
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(adminLogin, "40b988f46293a02e3bdaf3298daddbac6014906d3e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(adminLogout, "00e2a1dc1d28c06a3fe4e9a74c831212afa4ab8cb1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listLicenses, "007462141bc7fd20473becc26b03c290c443562de1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(upsertLicense, "40b243ab591f032952f322bcc3135266f673ef6a0d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setStatus, "60b0354a56d7540f6f52336677acc74a737a70df32", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteLicense, "40da87ec6ab534d10759c964bdedb4c8cb66a8d531", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(generateCodeAndShort, "001459ece7a8bdf3eecf16995731a5d9e23fdd5801", null);
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/page.tsx [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/page.tsx [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "001459ece7a8bdf3eecf16995731a5d9e23fdd5801",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateCodeAndShort"],
    "007462141bc7fd20473becc26b03c290c443562de1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listLicenses"],
    "00e2a1dc1d28c06a3fe4e9a74c831212afa4ab8cb1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminLogout"],
    "40b243ab591f032952f322bcc3135266f673ef6a0d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["upsertLicense"],
    "40b988f46293a02e3bdaf3298daddbac6014906d3e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminLogin"],
    "40da87ec6ab534d10759c964bdedb4c8cb66a8d531",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteLicense"],
    "60b0354a56d7540f6f52336677acc74a737a70df32",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setStatus"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/app/page.tsx [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_93ed45fc._.js.map