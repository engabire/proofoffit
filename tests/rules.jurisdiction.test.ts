import test from "node:test";
import assert from "node:assert";
import type { Job } from "../domain/jobs";
import {
    adjustScoreForJurisdiction,
    applyJurisdictionFlags,
} from "../server/rules/jurisdiction";

const baseJob = (over: Partial<Job> = {}): Job => ({
    id: "x",
    company: "Acme",
    title: "Role",
    postedAt: new Date(),
    source: "manual",
    ...over,
});

void test("US WA job without pay gets flagged and penalized ~8%", () => {
    const j = baseJob({ location: "Seattle, WA, USA" });
    const out = applyJurisdictionFlags(j);
    const flags = out.flags as any;
    assert.equal(flags?.requiresPayDisclosure, true);
    assert.ok(flags?.rankPenalty && flags.rankPenalty <= 0.92 + 1e-9);
    const score = adjustScoreForJurisdiction(90, out);
    assert.equal(score, Math.round(90 * flags.rankPenalty));
});

void test("US job with pay range remains unpenalized", () => {
    const j = baseJob({
        location: "Austin, TX, USA",
        salaryMin: 60000,
        salaryMax: 80000,
    });
    const out = applyJurisdictionFlags(j);
    assert.ok(!(out.flags as any)?.requiresPayDisclosure);
});

void test("Canada ON job without pay gets gentle penalty", () => {
    const j = baseJob({ location: "Toronto, ON, Canada" });
    const out = applyJurisdictionFlags(j);
    const flags = out.flags as any;
    assert.equal(flags?.requiresPayDisclosure, true);
    assert.ok(flags?.rankPenalty && flags.rankPenalty >= 0.95);
});
