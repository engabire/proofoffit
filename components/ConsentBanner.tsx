"use client";
import { useEffect, useState } from "react";

export function ConsentBanner({ policyVersion }: { policyVersion: string }) {
    const [accepted, setAccepted] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        // restore from localStorage (UX only; server is source of truth)
        const key = localStorage.getItem("consent_version");
        if (key === policyVersion) setAccepted(true);
    }, [policyVersion]);

    async function accept() {
        setBusy(true);
        try {
            const res = await fetch("/api/consent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    policy_version: policyVersion,
                    event: "policy_accept",
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            localStorage.setItem("consent_version", policyVersion);
            setAccepted(true);
        } catch (e) {
            console.error(e);
        } finally {
            setBusy(false);
        }
    }

    if (accepted) return null;
    return (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 border-t shadow-lg">
            <div className="max-w-5xl mx-auto p-4 flex flex-col md:flex-row md:items-center gap-3">
                <p className="text-sm flex-1">
                    We use your data to match you with jobs and to improve
                    recommendations. Read our
                    <a
                        className="underline ml-1"
                        href="/privacy-policy"
                        target="_blank"
                    >
                        Privacy Policy
                    </a>.
                </p>
                <button
                    onClick={accept}
                    disabled={busy}
                    className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-60"
                >
                    I Agree
                </button>
            </div>
        </div>
    );
}
