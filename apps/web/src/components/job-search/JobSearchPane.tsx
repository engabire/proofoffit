"use client";

import * as React from "react";
import { useJobs, Recency, JobSummary } from "@/lib/useJobs";

function useDebounced<T>(value: T, ms = 300) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);

  return debounced;
}

export default function JobSearchPane() {
  const [q, setQ] = React.useState("");
  const [loc, setLoc] = React.useState("");
  const [recency, setRecency] = React.useState<Recency>("last_3_days");
  const [page, setPage] = React.useState(1);

  const debouncedQuery = useDebounced(q, 300);
  const debouncedLocation = useDebounced(loc, 300);

  const { data, isLoading, error, refresh, count } = useJobs(
    debouncedQuery,
    debouncedLocation,
    recency,
    page,
  );

  React.useEffect(() => {
    setPage(1);
  }, [debouncedQuery, debouncedLocation, recency]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="job-role">
          Role
        </label>
        <input
          id="job-role"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Role or keywords"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-[28rem]"
        />
        <label className="sr-only" htmlFor="job-location">
          Location
        </label>
        <input
          id="job-location"
          value={loc}
          onChange={(event) => setLoc(event.target.value)}
          placeholder="Location (optional)"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-64"
        />
        <select
          value={recency}
          onChange={(event) => setRecency(event.target.value as Recency)}
          className="border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Recency filter"
        >
          <option value="today">Today</option>
          <option value="last_3_days">Last 3 days</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
        <button
          onClick={() => {
            refresh();
          }}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <StatusBar isLoading={isLoading} error={error} count={count} />

      {isLoading && <SkeletonList />}

      {!isLoading && !error && data.length === 0 && (
        <div className="rounded border bg-gray-50 p-4 text-sm text-gray-600">
          No results yet. Try a broader title, remove the location, or widen
          recency.
        </div>
      )}

      <ul className="divide-y rounded border">
        {data.map((job: JobSummary) => (
          <li key={job.id} className="p-3">
            <div className="flex justify-between gap-3">
              <div>
                <div className="font-medium">{job.title}</div>
                <div className="text-sm text-gray-600">
                  {job.company}
                  {job.location ? ` • ${job.location}` : ""}
                </div>
                <div className="text-xs text-gray-500">
                  {safeTime(job.posted_at)}
                </div>
              </div>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 items-center rounded bg-gray-900 px-3 text-white hover:bg-black"
              >
                Apply
              </a>
            </div>
            <p className="mt-2 line-clamp-3 text-sm">{job.description}</p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1 || isLoading}
          className="rounded border px-3 py-2 disabled:opacity-50"
        >
          Prev
        </button>
        <div className="text-sm">Page {page}</div>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isLoading || data.length === 0}
          className="rounded border px-3 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function StatusBar({
  isLoading,
  error,
  count,
}: {
  isLoading: boolean;
  error?: Error;
  count: number;
}) {
  if (isLoading) {
    return <div className="text-sm text-gray-600">Loading…</div>;
  }

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
        {error.message || "Error loading jobs"}
      </div>
    );
  }

  return <div className="text-sm text-gray-600">{count} results</div>;
}

function SkeletonList() {
  return (
    <ul className="divide-y rounded border animate-pulse">
      {Array.from({ length: 4 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={index} className="space-y-2 p-3">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-3 w-1/4 rounded bg-gray-200" />
          <div className="h-3 w-1/5 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-200" />
        </li>
      ))}
    </ul>
  );
}

function safeTime(iso?: string) {
  if (!iso) return "";
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return "";
  return new Date(parsed).toLocaleString();
}
