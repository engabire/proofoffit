"use client";

export type NonprofitTier = "N1" | "N2" | "N3" | "N4";

const tierDetails: Record<
  NonprofitTier,
  { label: string; multiplier: number; discount: string; summary: string }
> = {
  N1: {
    label: "N1 • <50 FTE",
    multiplier: 0.5,
    discount: "50% off",
    summary:
      "Community orgs / early nonprofits funded primarily by grants or donations.",
  },
  N2: {
    label: "N2 • 51–250 FTE",
    multiplier: 0.65,
    discount: "35% off",
    summary:
      "Regional nonprofits with dedicated talent teams and predictable programs.",
  },
  N3: {
    label: "N3 • 251–1,000 FTE",
    multiplier: 0.75,
    discount: "25% off",
    summary:
      "Multi-program organizations needing governance, SSO, and advanced reporting.",
  },
  N4: {
    label: "N4 • 1,000+ FTE",
    multiplier: 0.9,
    discount: "10–30% off (deal desk)",
    summary:
      "Global nonprofits with complex compliance; discount set with RevOps + funders.",
  },
};

type Props = {
  selectedTier: NonprofitTier | null;
  onSelect: (tier: NonprofitTier | null) => void;
};

export function NonprofitToggle({ selectedTier, onSelect }: Props) {
  return (
    <section className="space-y-4 rounded-xl border border-blue-100 bg-white/80 p-4 shadow-sm">
      <header className="space-y-1">
        <h3 className="text-base font-semibold text-blue-900">
          Nonprofit multipliers (applied to base price + unit costs)
        </h3>
        <p className="text-xs text-blue-700/80">
          Discounts lock automatically after eligibility. Compliance add-ons
          remain cost-based so safeguarding never slips.
        </p>
        {selectedTier && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-xs font-medium text-blue-700 underline-offset-2 hover:underline"
          >
            Reset to standard pricing
          </button>
        )}
      </header>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(tierDetails).map(([key, details]) => {
          const isActive = selectedTier === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key as NonprofitTier)}
              aria-pressed={isActive}
              className={`flex h-full flex-col gap-1 rounded-lg border p-3 text-left transition ${
                isActive
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-blue-100 hover:border-blue-300"
              }`}
            >
              <span className="text-sm font-semibold text-blue-900">
                {details.label} · {details.discount}
              </span>
              <span className="text-xs text-blue-700/80">
                {details.summary}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export const nonprofitMultipliers = Object.fromEntries(
  Object.entries(tierDetails).map(([key, value]) => [key, value.multiplier]),
) as Record<NonprofitTier, number>;
