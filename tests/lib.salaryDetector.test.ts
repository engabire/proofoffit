import test from "node:test";
import assert from "node:assert";
import { detectSalary } from "../server/lib/salaryDetector";

void test("detects USD yearly with commas", () => {
    const r = detectSalary("Pay range $50,000 - $70,000 per year");
    assert.ok(r);
    assert.equal(r!.currency, "USD");
    assert.equal(r!.min, 50000);
    assert.equal(r!.max, 70000);
});

void test("detects EUR monthly with dots", () => {
    const r = detectSalary("Compensation €2.400 – €2.800 / month");
    assert.ok(r);
    assert.equal(r!.currency, "EUR");
    assert.equal(r!.min, 2400);
    assert.equal(r!.max, 2800);
});
