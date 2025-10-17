"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import {
  formatTimeAgo,
  getDomainIcon,
  type ScrapedItem,
  scrapingClient,
} from "@/lib/scraping/client";
import { ExternalLink, RefreshCw, Search } from "lucide-react";

export function ScrapedItemsList() {
  const [items, setItems] = useState<ScrapedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [domains, setDomains] = useState<string[]>([]);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const result = await scrapingClient.getLatestItems({
        domain: selectedDomain || undefined,
        search: search || undefined,
        limit: 50,
      });
      setItems(result.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [selectedDomain, search]);

  useEffect(() => {
    loadItems();
    loadDomains();

    // Subscribe to real-time updates
    const unsubscribe = scrapingClient.subscribeToUpdates((payload) => {
      // eslint-disable-next-line no-console
      console.log("Real-time update:", payload);
      if (payload.eventType === "INSERT") {
        setItems((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setItems((prev) =>
          prev.map((item) => item.id === payload.new.id ? payload.new : item)
        );
      }
    });

    return unsubscribe;
  }, [loadItems]);

  const loadDomains = async () => {
    try {
      const domainList = await scrapingClient.getDomains();
      setDomains(domainList);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to load domains:", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadItems();
  };

  if (loading && items.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading scraped content...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕷️ Scraped Content
            <Badge variant="secondary">{items.length} items</Badge>
          </CardTitle>
          <CardDescription>
            Real-time feed of ethically scraped job market data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search titles and authors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All domains</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {getDomainIcon(domain)} {domain}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Search
            </button>

            <button
              type="button"
              onClick={loadItems}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </form>

          {error && (
            <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items List */}
      {items.length === 0 && !loading
        ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              No items found. Try adjusting your search or filters.
            </CardContent>
          </Card>
        )
        : (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getDomainIcon(item.source_domain)}{" "}
                          {item.source_domain}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(item.last_seen_at)}
                        </span>
                        {item.changed_at && (
                          <Badge variant="secondary" className="text-xs">
                            Updated {formatTimeAgo(item.changed_at)}
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                        {item.title}
                      </h3>

                      {item.author && (
                        <p className="text-muted-foreground text-sm mb-2">
                          by {item.author}
                        </p>
                      )}

                      {item.metadata && Object.keys(item.metadata).length > 0 &&
                        (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.metadata.tags?.map((
                              tag: string,
                              index: number,
                            ) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className="flex-shrink-0">
                      <a
                        href={item.canonical_item_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-primary hover:text-primary/80 border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        First seen: {formatTimeAgo(item.first_seen_at)}
                      </span>
                      <span>ID: {item.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
