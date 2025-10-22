// Detects ranges like: $50,000–$70,000, €2.400–€2.800, £15–£18/hr
const CURRENCY = /(\$|€|£)?\s?(\d{2,3}(?:[.,]\d{3})*|\d{3,6})/;
const RANGE = new RegExp(`${CURRENCY.source}\\s?[-–]\\s?${CURRENCY.source}`);

function inferUnit(
  text: string,
): "hour" | "year" | "month" | "day" | "unknown" {
  const t = text.toLowerCase();
  if (/hour|hr\b/.test(t)) return "hour";
  if (/year|yr\b|annual/.test(t)) return "year";
  if (/month|mo\b/.test(t)) return "month";
  if (/day\b|daily/.test(t)) return "day";
  return "unknown";
}

export function detectSalary(text: string) {
  const m = text.match(RANGE);
  if (!m) return null;
  const toNum = (s: string) => Number(s.replace(/[^\d]/g, ""));
  const [, c1, v1, c2, v2] = m;
  const currency = (c1 || c2 || "$") === "€"
    ? "EUR"
    : (c1 || c2 || "$") === "£"
    ? "GBP"
    : "USD";
  return { min: toNum(v1), max: toNum(v2), currency, unit: inferUnit(text) };
}

// Helper: explicit check for presence of both min and max amounts
export function hasPayRange(min?: number, max?: number) {
  return typeof min === "number" && typeof max === "number" && min > 0 &&
    max > 0 && max >= min;
}
