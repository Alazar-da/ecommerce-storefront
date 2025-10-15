// utils/fetchSummary.ts

export const fetchSummary = async () => {
  const res = await fetch("/api/admin/summary", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
};

export const createOrUpdateSummary = async () => {
  const res = await fetch("/api/admin/summary", { method: "PUT" });
  if (!res.ok) throw new Error("Failed to create/update summary");
  return res.json();
};
