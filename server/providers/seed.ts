import { Job, JobProvider, JobQuery } from "../../domain/jobs";

// Example in-memory seed; replace with your actual seed.ts/JSON import
// IMPORTANT: use `seedJobs` (not `seed`) to avoid name collisions.
const seedJobs: Job[] = [
    {
        id: "seed:techcorp-swe-1",
        company: "TechCorp Inc.",
        title: "Senior Full Stack Engineer",
        description: "TypeScript, React, Node, Postgres. $120k–$160k.",
        location: "Remote (US/CA)",
        remote: true,
        salaryMin: 120000,
        salaryMax: 160000,
        currency: "USD",
        postedAt: new Date(Date.now() - 30 * 60 * 1000),
        applyUrl: "https://example.com/apply/1",
        source: "seed",
    },
];

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

export class SeedProvider implements JobProvider {
    async searchJobs(q: JobQuery) {
        await sleep(150 + Math.random() * 300); // UX-hardening latency
        let items = [...seedJobs];

        if (q.q) {
            const n = q.q.toLowerCase();
            items = items.filter((j) =>
                `${j.title} ${j.company} ${j.description ?? ""}`.toLowerCase()
                    .includes(n)
            );
        }
        if (q.location) {
            const n = q.location.toLowerCase();
            items = items.filter((j) =>
                (j.location ?? "").toLowerCase().includes(n)
            );
        }
        if (q.minSalary) {
            items = items.filter((j) => (j.salaryMin ?? 0) >= q.minSalary!);
        }

        // simulate closed job convention: ids ending with Z are closed
        items = items.map((
            j,
        ) => (j.id.endsWith("Z")
            ? { ...j, flags: { ...(j.flags || {}), closed: true } }
            : j)
        );

        items.sort((a, b) => +b.postedAt - +a.postedAt);

        const limit = q.limit ?? 20;
        const page = q.page ?? 1;
        const start = (page - 1) * limit;
        const paged = items.slice(start, start + limit);
        const nextPage = start + limit < items.length ? page + 1 : undefined;

        return { jobs: paged, nextPage };
    }
    async getJob(id: string) {
        return seedJobs.find((j) => j.id === id) ?? null;
    }
}
