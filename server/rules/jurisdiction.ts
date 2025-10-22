import type { Job } from "../../domain/jobs";
import { hasPayRange } from "../lib/salaryDetector";

// Non-exhaustive, pragmatic flags (code aids compliance; not legal advice)
const US_PAY_STATES = new Set(["CA", "CO", "NY", "WA"]);
const CA_PAY_PROVINCES_STRICT = new Set(["BC"]);

function parseLocation(loc?: string) {
    if (!loc) {
        return {
            country: undefined as ("US" | "CA" | undefined),
            region: undefined as string | undefined,
        };
    }
    const t = loc.toLowerCase();
    const country = /canada|\bca\b/.test(t)
        ? "CA"
        : /united states|usa|\bus\b/.test(t)
        ? "US"
        : undefined;
    const regionMatch = loc.match(
        /\b(A[LKZR]|C[AOT]|D[EC]|F[LM]|G[AU]|H[IW]|I[ADLN]|K[SY]|L[A]|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[AWR]|R[HI]|S[CD]|T[NX]|U[TS]|V[AIT]|W[AIVY])\b/,
    );
    const provinceMatch = loc.match(
        /\b(BC|AB|SK|MB|ON|QC|NB|NS|PE|NL|YT|NT|NU)\b/,
    );
    const region = (provinceMatch?.[1] || regionMatch?.[1]) as
        | string
        | undefined;
    return { country, region };
}

export function needsPayDisclosure(job: Job) {
    const { country } = parseLocation(job.location);
    if (!country) return false;
    if (hasPayRange(job.salaryMin, job.salaryMax)) return false;
    if (country === "US") return true;
    if (country === "CA") return true;
    return false;
}

export function penaltyFor(job: Job): number {
    const { country, region } = parseLocation(job.location);
    if (!needsPayDisclosure(job)) return 1;
    if (country === "US") {
        if (region && US_PAY_STATES.has(region)) return 0.92; // stricter
        return 0.95; // gentle
    }
    if (country === "CA") {
        if (region && CA_PAY_PROVINCES_STRICT.has(region)) return 0.92;
        return 0.95;
    }
    return 1;
}

export function applyJurisdictionFlags(job: Job): Job {
    const j: Job = { ...job, flags: { ...(job.flags || {}) } };
    if (needsPayDisclosure(job)) {
        (j.flags as any).requiresPayDisclosure = true;
        (j.flags as any).rankPenalty = penaltyFor(job);
    }
    return j;
}

export function adjustScoreForJurisdiction(
    baseScore: number,
    job: Job,
): number {
    const p = penaltyFor(job);
    return Math.round(baseScore * p);
}

