import { z } from "zod";
import { env } from "@/lib/env";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  via: string;
  url: string;
  posted_at: string;
  description: string;
};

export const Recency = z.enum(["today", "last_3_days", "week", "month"]);
export const QuerySchema = z.object({
  q: z.string().trim().default(""),
  loc: z.string().trim().default(""),
  recency: Recency.default("last_3_days"),
  page: z.coerce.number().int().min(1).max(50).default(1),
});

export const RAPID_HOST = "jsearch.p.rapidapi.com";
export const REQUEST_TIMEOUT_MS = 8000;

const toString = (value: unknown) =>
  typeof value === "string" ? value : "";

const toNumber = (value: unknown) =>
  typeof value === "number" ? value : null;

function postedAtFrom(candidate: Record<string, unknown>): string {
  const direct = toString(candidate.job_posted_at_datetime_utc);
  if (direct) return direct;

  const epoch = toNumber(candidate.job_posted_at_timestamp);
  return epoch ? new Date(epoch * 1000).toISOString() : "";
}

function locationFrom(candidate: Record<string, unknown>): string {
  const city = toString(candidate.job_city);
  const state = toString(candidate.job_state);
  if (city && state) return `${city}, ${state}`;

  return city || state || toString(candidate.job_country);
}

export function normalizeJob(candidate: Record<string, unknown>): Job {
  return {
    id:
      toString(candidate.job_id) ||
      toString(candidate.job_posted_at_timestamp) ||
      crypto.randomUUID(),
    title: toString(candidate.job_title),
    company: toString(candidate.employer_name),
    location: locationFrom(candidate),
    via:
      toString(candidate.employer_website) || toString(candidate.job_publisher),
    url: toString(candidate.job_apply_link) || toString(candidate.job_google_link),
    posted_at: postedAtFrom(candidate),
    description: toString(candidate.job_description),
  };
}

export function isValidJob(job: Job): job is Job {
  return Boolean(job.title && job.company && job.url);
}

export function sortByPostedDesc(a: Job, b: Job): number {
  const tb = b.posted_at ? Date.parse(b.posted_at) : 0;
  const ta = a.posted_at ? Date.parse(a.posted_at) : 0;
  return tb - ta;
}

export function dedupe(jobs: Job[]): Job[] {
  const seen = new Set<string>();
  const result: Job[] = [];
  for (const job of jobs) {
    const key = `${job.title}|${job.company}|${job.location}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(job);
    }
  }
  return result;
}

export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  ms = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export function ensureRapidApiKey(): string {
  if (!env.jobs.rapidApiKey) {
    throw new Error("missing_key");
  }
  return env.jobs.rapidApiKey;
}
