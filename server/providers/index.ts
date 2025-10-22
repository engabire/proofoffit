import assert from "node:assert";
import type { JobProvider } from "../../domain/jobs";
import { SeedProvider } from "./seed";
import { SafeProvider } from "./safe";

export function getJobProvider(): JobProvider {
    const p = process.env.JOBS_PROVIDER ?? "seed";
    assert(
        ["seed", "google", "greenhouse"].includes(p),
        `Invalid JOBS_PROVIDER=${p}`,
    );

    const wrap = (prov: any) =>
        new SafeProvider(prov, {
            qpsCap: Number(process.env.JOBS_PROVIDER_MAX_QPS ?? 10),
            circuitFailures: 5,
            windowMs: 60_000,
        });

    switch (p) {
        case "seed":
            return new SeedProvider();
        // case 'google': return wrap(new GoogleProvider())
        // case 'greenhouse': return wrap(new GreenhouseProvider())
        default:
            return new SeedProvider();
    }
}
