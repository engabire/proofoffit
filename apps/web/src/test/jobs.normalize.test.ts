import { describe, expect, it } from "vitest";
import {
  dedupe,
  isValidJob,
  normalizeJob,
  sortByPostedDesc,
} from "@/app/api/jobs/helpers";

describe("normalizeJob helpers", () => {
  it("prefers datetime_utc when present", () => {
    const job = normalizeJob({
      job_posted_at_datetime_utc: "2025-01-01T00:00:00Z",
      job_title: "Analyst",
      employer_name: "Acme",
      job_apply_link: "https://example.com",
    });
    expect(job.posted_at).toBe("2025-01-01T00:00:00Z");
  });

  it("falls back to timestamp when datetime_utc missing", () => {
    const timestamp = 1_700_000_000;
    const job = normalizeJob({
      job_posted_at_timestamp: timestamp,
      job_title: "Analyst",
      employer_name: "Acme",
      job_apply_link: "https://example.com",
    });
    expect(job.posted_at).toBe(new Date(timestamp * 1000).toISOString());
  });

  it("maps required fields for validity checks", () => {
    const job = normalizeJob({
      job_title: "Software Engineer",
      employer_name: "Acme Inc.",
      job_apply_link: "https://example.com",
    });
    expect(isValidJob(job)).toBe(true);
  });

  it("dedupes title/company/location combinations", () => {
    const base = {
      id: "1",
      title: "Software Engineer",
      company: "Acme Inc.",
      location: "NY",
      via: "",
      url: "https://example.com",
      posted_at: "",
      description: "",
    };
    const deduped = dedupe([base, { ...base, id: "2" }]);
    expect(deduped).toHaveLength(1);
  });

  it("sorts jobs by posted_at descending", () => {
    const earlier = {
      id: "1",
      title: "Role",
      company: "Acme",
      location: "",
      via: "",
      url: "https://example.com",
      posted_at: "2020-01-01T00:00:00Z",
      description: "",
    };
    const newer = {
      ...earlier,
      id: "2",
      posted_at: "2025-01-01T00:00:00Z",
    };
    const sorted = [earlier, newer].sort(sortByPostedDesc);
    expect(sorted[0].id).toBe("2");
  });
});
