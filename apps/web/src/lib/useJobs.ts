import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(
      `HTTP ${response.status} ${message || response.statusText}`,
    );
  }
  return response.json();
};

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

export function useJobs(
  q: string,
  loc: string,
  recency: Recency,
  page: number,
) {
  const params = new URLSearchParams();
  params.set("q", q || "");
  params.set("loc", loc || "");
  params.set("recency", recency);
  params.set("page", String(Math.max(1, page || 1)));

  const trimmed = q.trim();
  const key = trimmed ? `/api/jobs?${params.toString()}` : null;

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<JobsResponse>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 0,
    keepPreviousData: true as unknown as boolean,
  });

  return {
    data: data?.items ?? [],
    page: data?.page ?? Math.max(1, page),
    recency: data?.recency ?? recency,
    count: data?.count ?? 0,
    isLoading,
    error: error as Error | undefined,
    refresh: mutate,
  };
}
