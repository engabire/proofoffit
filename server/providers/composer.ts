import type { Job, JobProvider, JobQuery } from "../../domain/jobs";
import { createHash } from "crypto";
import { applyJurisdictionFlags } from "../rules/jurisdiction";

function fingerprint(j: Job) {
    const host = (() => {
        try {
            return new URL(j.applyUrl || "").host;
        } catch {
            return "";
        }
    })();
    const base = `${j.title.toLowerCase()}|${j.company.toLowerCase()}|${
        (j.location || "").toLowerCase()
    }|${host}`;
    return createHash("sha1").update(base).digest("hex");
}

function prefer(a: Job, b: Job) {
    // Canonicalization priority: official apply-at-source > partner ATS > government > aggregator > seed
    const rank = (s: string) => ({
        manual: 1,
        greenhouse: 1,
        lever: 1,
        ashby: 1,
        recruitee: 1,
        workable: 1,
        smartrecruiters: 1,
        usajobs: 2,
        google: 2, // kept for mocks/tests
        adzuna: 3,
        seed: 4,
    }[s as any] ?? 5);
    return rank(a.source) <= rank(b.source) ? a : b;
}

export class ProviderComposer implements JobProvider {
    constructor(private providers: JobProvider[]) {}
    async searchJobs(q: JobQuery) {
        const settled = await Promise.allSettled(
            this.providers.map((p) => p.searchJobs(q)),
        );
        const all: Job[] = settled.flatMap((r) =>
            r.status === "fulfilled" ? r.value.jobs : []
        );
        const byFp = new Map<string, Job>();
        for (const j of all) {
            const fp = fingerprint(j);
            const chosen = byFp.has(fp) ? prefer(byFp.get(fp)!, j) : j;
            byFp.set(fp, applyJurisdictionFlags(chosen)); // flag (never hide)
        }
        return { jobs: [...byFp.values()] };
    }
    async getJob(id: string) {
        return null;
    }
}

