"use client";
import { useEffect, useState } from "react";

type Row = {
  id: string;
  created_at: string;
  provider: string;
  latency_ms: number;
  result_count: number;
};

export default function AdminSearchesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/searches");
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setRows(data.rows ?? []);
      } catch (e: any) {
        setError(e.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recent Job Searches</h1>
      <p className="text-sm text-gray-500 mb-6">
        Admin-only dashboard showing the last 100 search events (provider, latency, result count).
      </p>
      {loading && <div className="animate-pulse">Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Provider</th>
                <th className="text-left p-3">Latency (ms)</th>
                <th className="text-left p-3">Results</th>
                <th className="text-left p-3">ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">{r.provider}</td>
                  <td className="p-3">{r.latency_ms}</td>
                  <td className="p-3">{r.result_count}</td>
                  <td className="p-3 text-xs text-gray-500">{r.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
