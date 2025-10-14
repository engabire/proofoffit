import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  via: string;
  url: string;
  posted_at: string;
  description: string;
};

const Recency = z.enum(["today", "last_3_days", "week", "month"]);
const QuerySchema = z.object({
  q: z.string().trim().default(""),
  loc: z.string().trim().default(""),
  recency: Recency.default("last_3_days"),
  page: z.coerce.number().int().min(1).max(50).default(1),
});

const RAPID_HOST = "jsearch.p.rapidapi.com";
const REQUEST_TIMEOUT_MS = 8000;

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

function normalizeJob(candidate: Record<string, unknown>): Job {
  return {
    id:
      toString(candidate.job_id) ||
      toString(candidate.job_posted_at_timestamp) ||
      crypto.randomUUID(),
    title: toString(candidate.job_title),
    company: toString(candidate.employer_name),
    location: locationFrom(candidate),
    via: toString(candidate.employer_website) || toString(candidate.job_publisher),
    url: toString(candidate.job_apply_link) || toString(candidate.job_google_link),
    posted_at: postedAtFrom(candidate),
    description: toString(candidate.job_description),
  };
}

function isValidJob(job: Job): boolean {
  return Boolean(job.title && job.company && job.url);
}

function sortByPostedDesc(a: Job, b: Job): number {
  const tb = b.posted_at ? Date.parse(b.posted_at) : 0;
  const ta = a.posted_at ? Date.parse(a.posted_at) : 0;
  return tb - ta;
}

function dedupe(jobs: Job[]): Job[] {
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

async function fetchWithTimeout(
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    q: searchParams.get("q"),
    loc: searchParams.get("loc"),
    recency: searchParams.get("recency"),
    page: searchParams.get("page"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "bad_request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!env.jobs.rapidApiKey) {
    return NextResponse.json({ error: "missing_key" }, { status: 500 });
  }

  const { q, loc, recency, page } = parsed.data;
  const trimmedQuery = q.trim();
  const composed = trimmedQuery + (loc ? ` in ${loc}` : "");

  if (!trimmedQuery) {
    return NextResponse.json({ items: [], page, recency, count: 0 });
  }

  const endpoint = `https://${RAPID_HOST}/search?query=${encodeURIComponent(
    composed,
  )}&page=${page}&num_pages=1&date_posted=${recency}`;

  let response: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await fetchWithTimeout(endpoint, {
        headers: {
          "x-rapidapi-key": env.jobs.rapidApiKey,
          "x-rapidapi-host": RAPID_HOST,
        },
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (response.ok) break;
    } catch (error) {
      if (attempt === 1) {
        console.error("jobs.search.upstream_timeout", { error });
        return NextResponse.json({ error: "upstream_timeout" }, { status: 504 });
      }
    }
  }

  if (!response || !response.ok) {
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }

  const json = await response.json().catch(() => ({}));
  const raw = Array.isArray(json?.data) ? json.data : [];

  const items = dedupe(raw.map(normalizeJob).filter(isValidJob)).sort(
    sortByPostedDesc,
  );

  console.log("jobs.search", {
    q: trimmedQuery,
    loc,
    recency,
    page,
    count: items.length,
  });

  return NextResponse.json({ items, page, recency, count: items.length });
}

export const __test__ = { normalizeJob, isValidJob, sortByPostedDesc, dedupe };
