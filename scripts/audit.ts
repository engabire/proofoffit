import { promises as fs } from "fs";
import path from "path";

type Check = { name: string; pass: boolean; fix?: string; critical?: boolean };

async function exists(p: string) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function grep(pattern: RegExp, roots: string[]) {
    const hits: string[] = [];
    async function walk(dir: string) {
        for (const f of await fs.readdir(dir)) {
            const fp = path.join(dir, f);
            const st = await fs.stat(fp);
            if (
                st.isDirectory() &&
                !/node_modules|\.next|dist|build|\.git/.test(fp)
            ) await walk(fp);
            else if (st.isFile() && /\.(ts|tsx|js|mjs|cjs|sql|md)$/.test(fp)) {
                const t = await fs.readFile(fp, "utf8");
                if (pattern.test(t)) hits.push(fp);
            }
        }
    }
    for (const r of roots) if (await exists(r)) await walk(r);
    return [...new Set(hits)].sort();
}

(async () => {
    const roots = [
        "apps",
        "packages",
        "server",
        "src",
        "infra",
        "db",
        "scripts",
        "domain",
        "tests",
    ];
    const checks: Check[] = [];

    const providerIface = await grep(/export\s+interface\s+JobProvider/, roots);
    checks.push({
        name: "JobProvider interface present",
        pass: providerIface.length > 0,
        fix: "Create domain/jobs.ts with Job, JobQuery, JobProvider.",
        critical: true,
    });

    const providerFactory = await grep(/getJobProvider\(|JOBS_PROVIDER/, roots);
    checks.push({
        name: "Provider factory (env switch) present",
        pass: providerFactory.length > 0,
        fix: "server/providers/index.ts with env-driven switch { seed|google|greenhouse }.",
        critical: true,
    });

    const safeWrapper = await grep(
        /class\s+SafeProvider|Circuit\s+open|QPS\s+cap/,
        roots,
    );
    checks.push({
        name: "Circuit breaker + QPS wrapper present",
        pass: safeWrapper.length > 0,
        fix: "server/providers/safe.ts implementing circuit + token bucket.",
        critical: true,
    });

    const seedProvider = await grep(
        /class\s+SeedProvider|source:\s*['"]seed['"]/,
        roots,
    );
    checks.push({
        name: "Seed provider implemented",
        pass: seedProvider.length > 0,
        fix: "Implement SeedProvider.",
        critical: false,
    });

    const fitCore = await grep(
        /fitScore\(|weights\s*[:=]\s*{[^}]*skills/i,
        roots,
    );
    checks.push({
        name:
            "FitScore present (skills/experience/education/location/salary/culture)",
        pass: fitCore.length > 0,
        fix: "Add server/fitscore.ts",
        critical: true,
    });

    const reliabilityHook = await grep(
        /reliability|work_event|REHIRE|CONTRACT_START/,
        roots,
    );
    checks.push({
        name: "Reliability dimension or work_event schema",
        pass: reliabilityHook.length > 0,
        fix: "Add events & reliability rollup.",
        critical: false,
    });

    const consent = await grep(
        /consent_events|policy_accept|GDPR|CCPA/i,
        roots,
    );
    checks.push({
        name: "Consent logging & policy versioning",
        pass: consent.length > 0,
        fix: "Create consent_events + UI checkbox.",
        critical: true,
    });

    const salary = await grep(
        /salary[_ ]?(min|max)|\$|€|£|compensation|pay/i,
        roots,
    );
    checks.push({
        name: "Salary fields/extractor",
        pass: salary.length > 0,
        fix: "Add salaryDetector + flags.requiresPayDisclosure.",
        critical: false,
    });

    const explain = await grep(/explain\(|why this match|breakdown/i, roots);
    checks.push({
        name: "Explainability strings for matches",
        pass: explain.length > 0,
        fix: "Expose human-readable reasons.",
        critical: false,
    });

    const rateLimit = await grep(/rate[-_ ]?limit|Too Many Requests/i, roots);
    checks.push({
        name: "Rate limiting on search endpoint",
        pass: rateLimit.length > 0,
        fix: "Add express-rate-limit middleware.",
        critical: true,
    });

    const adminGuard = await grep(/role.*admin|RBAC|isAdmin/, roots);
    checks.push({
        name: "Admin RBAC guard present",
        pass: adminGuard.length > 0,
        fix: "Protect admin pages/routes.",
        critical: false,
    });

    const telemetry = await grep(/redact|telemetry|PII|ip.*redact/i, roots);
    checks.push({
        name: "Telemetry redaction",
        pass: telemetry.length > 0,
        fix: "Redact PII in logs.",
        critical: false,
    });

    const tests = await grep(/from 'node:test'|assert\(/, ["tests"]);
    checks.push({
        name: "Basic tests present",
        pass: tests.length > 0,
        fix: "Add tests under tests/",
        critical: false,
    });

    // Report
    const failCritical = checks.filter((c) => !c.pass && c.critical);
    console.log("\n=== ProofOfFit Architecture Audit ===");
    for (const c of checks) {
        const mark = c.pass ? "✔" : "✖";
        console.log(`${mark} ${c.name}`);
        if (!c.pass && c.fix) console.log(`   → ${c.fix}`);
    }
    console.log("\nJSON:", JSON.stringify(checks, null, 2));
    if (failCritical.length) {
        console.error("\nCritical audit failures present.");
        process.exit(1);
    }
})();
