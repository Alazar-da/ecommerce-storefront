// utils/fetchAnalytics.ts
export async function fetchAnalytics(days = 30) {
  const res = await fetch(`/api/admin/analytics?days=${days}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load analytics");
  return res.json();
}

export async function fetchSummary() {
  const res = await fetch("/api/admin/summary", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load summary");
  return res.json();
}

export async function createOrRefreshSummary() {
  const res = await fetch("/api/admin/summary", { method: "PUT" });
  if (!res.ok) throw new Error("Failed to refresh summary");
  return res.json();
}
