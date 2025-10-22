import test from "node:test";
import assert from "node:assert";
import { explain, fitScore } from "../server/fitscore";

void test("fitScore calculates weighted average", () => {
    const b = {
        skills: 80,
        experience: 70,
        education: 60,
        location: 50,
        salary: 40,
        culture: 30,
    };
    const score = fitScore(b);
    assert.ok(score >= 0 && score <= 100);
    assert.ok(score > 50); // should be above average
});

void test("explain generates human-readable reasons", () => {
    const b = {
        skills: 85,
        experience: 75,
        education: 60,
        location: 30,
        salary: 40,
        culture: 50,
    };
    const reasons = explain(b);
    assert.ok(reasons.length > 0);
    assert.ok(reasons.some((r) => r.includes("skills")));
});
