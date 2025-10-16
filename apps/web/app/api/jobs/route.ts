import { NextRequest, NextResponse } from "next/server";
import {
  QuerySchema,
  dedupe,
  ensureRapidApiKey,
  fetchWithTimeout,
  normalizeJob,
  RAPID_HOST,
  sortByPostedDesc,
  isValidJob,
} from "./helpers";

export const runtime = "edge";
export const dynamic = "force-dynamic";

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

  let rapidApiKey: string;
  try {
    rapidApiKey = ensureRapidApiKey();
  } catch {
    return NextResponse.json({ error: "missing_key" }, { status: 500 });
  }
  const { q, loc, recency, page } = parsed.data;
  const trimmedQuery = q.trim();

  if (!trimmedQuery) {
    return NextResponse.json({ items: [], page, recency, count: 0 });
  }

  const composed = trimmedQuery + (loc ? ` in ${loc}` : "");

  const endpoint = `https://${RAPID_HOST}/search?query=${encodeURIComponent(
    composed,
  )}&page=${page}&num_pages=1&date_posted=${recency}`;

  let response: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await fetchWithTimeout(endpoint, {
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": RAPID_HOST,
        },
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (response.ok) break;
    } catch (error) {
      if (attempt === 1) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error("jobs.search.upstream_timeout", { error });
        }
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

  if (process.env.NODE_ENV !== 'production') {

    // eslint-disable-next-line no-console
    console.log("jobs.search", {
    q: trimmedQuery,
    loc,
    recency,
    page,
    count: items.length,
  });

  }

  return NextResponse.json({ items, page, recency, count: items.length });
}
