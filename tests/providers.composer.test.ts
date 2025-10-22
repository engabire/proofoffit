import test from "node:test";
import assert from "node:assert";
import type { Job, JobProvider, JobQuery } from "../domain/jobs";
import { ProviderComposer } from "../server/providers/composer";

class MockA implements JobProvider {
    async searchJobs(_q: JobQuery) {
        const jobs: Job[] = [{
            id: "manual:1",
            company: "Acme",
            title: "Engineer",
            location: "US",
            postedAt: new Date(),
            source: "manual",
        }];
        return { jobs };
    }
    async getJob() {
        return null;
    }
}
class MockB implements JobProvider {
    async searchJobs(_q: JobQuery) {
        const jobs: Job[] = [{
            id: "google:dup1",
            company: "Acme",
            title: "Engineer",
            location: "US",
            postedAt: new Date(),
            source: "google",
        }];
        return { jobs };
    }
    async getJob() {
        return null;
    }
}

void test("Composer dedup prefers manual over google", async () => {
    const c = new ProviderComposer([new MockA(), new MockB()]);
    const { jobs } = await c.searchJobs({});
    assert.equal(jobs.length, 1);
    assert.equal(jobs[0].source, "manual");
});
