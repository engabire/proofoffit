import { useCallback, useEffect, useMemo, useState } from "react";

export type Recency = "today" | "last_3_days" | "week" | "month";

export type JobSummary = {
  id: string;
  title: string;
  company: string;
  location: string;
  via: string;
  url: string;
  posted_at: string;
  description: string;
};

type JobsResponse = {
  items: JobSummary[];
  page: number;
  recency: Recency;
  count: number;
};

type FetchState = {
  data: JobSummary[];
  page: number;
  recency: Recency;
  count: number;
};

const INITIAL_STATE: FetchState = {
  data: [],
  page: 1,
  recency: "last_3_days",
  count: 0,
};

async function fetchJobs(
  url: string,
  signal: AbortSignal,
): Promise<JobsResponse> {
  const response = await fetch(url, { cache: "no-store", signal });

  if (response.ok) {
    return response.json();
  }

  let detail = "";
  let retryAfterSeconds: number | null = null;

  try {
    const payload = await response.clone().json();

    if (payload?.error === "rate_limited") {
      const retryAfterHeader = response.headers.get("Retry-After");
      if (retryAfterHeader) {
        const parsed = Number.parseInt(retryAfterHeader, 10);
        if (Number.isFinite(parsed)) {
          retryAfterSeconds = parsed;
        }
      }
      const waitMessage = retryAfterSeconds
        ? `Please wait ${retryAfterSeconds} seconds and try again.`
        : "Please try again shortly.";
      detail = `Rate limit exceeded. ${waitMessage}`;
    } else if (typeof payload?.error === "string") {
      detail = payload.error;
    } else if (typeof payload?.message === "string") {
      detail = payload.message;
    }
  } catch {
    // ignore parsing errors; fallback to text below
  }

  if (!detail) {
    detail = (await response.text().catch(() => "")) || response.statusText;
  } else {
    await response.text().catch(() => "");
  }

  const message = `HTTP ${response.status} ${detail}`.trim();
  throw new Error(message);
}

export function useJobs(
  q: string,
  loc: string,
  recency: Recency,
  page: number,
) {
  const [state, setState] = useState<FetchState>({
    ...INITIAL_STATE,
    recency,
    page,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [refreshNonce, setRefreshNonce] = useState(0);

  const trimmedQuery = q.trim();

  const key = useMemo(() => {
    if (!trimmedQuery) return null;
    const params = new URLSearchParams();
    params.set("q", trimmedQuery);
    params.set("loc", loc || "");
    params.set("recency", recency);
    params.set("page", String(Math.max(1, page || 1)));
    params.set("nonce", String(refreshNonce));
    return `/api/jobs?${params.toString()}`;
  }, [trimmedQuery, loc, recency, page, refreshNonce]);

  const refresh = useCallback(() => {
    setRefreshNonce((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (!key) {
      setState({
        data: [],
        page: Math.max(1, page || 1),
        recency,
        count: 0,
      });
      setError(undefined);
      setIsLoading(false);
      return () => controller.abort();
    }

    let mounted = true;
    setIsLoading(true);
    setError(undefined);

    fetchJobs(key, controller.signal)
      .then((result) => {
        if (!mounted) return;
        setState({
          data: Array.isArray(result.items) ? result.items : [],
          page: result.page ?? Math.max(1, page || 1),
          recency: result.recency ?? recency,
          count: result.count ?? 0,
        });
      })
      .catch((err) => {
        if (!mounted && controller.signal.aborted) return;
        setError(err as Error);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [key, page, recency]);

  return {
    data: state.data,
    page: state.page,
    recency: state.recency,
    count: state.count,
    isLoading,
    error,
    refresh,
  };
}
