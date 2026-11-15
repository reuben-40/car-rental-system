import { describe, expect, it } from "vitest";
import { calculateQuote, daysBetween, overlaps } from "./pricing";

describe("pricing", () => {
  it("3 days at 4,500 → subtotal 13,500, VAT 2,160, total 15,660", () => {
    const q = calculateQuote(4500, "2026-11-10", "2026-11-13", []);
    expect(q.days).toBe(3);
    expect(q.subtotal).toBe(13500);
    expect(q.tax).toBe(2160);
    expect(q.total_amount).toBe(15660);
  });
  it("deposit is 20% of total", () => {
    expect(calculateQuote(4500, "2026-11-10", "2026-11-13", []).deposit).toBe(3132);
  });
  it("per-day extras multiply by days, flat extras do not", () => {
    const q = calculateQuote(1000, "2026-11-10", "2026-11-12", [
      { id: 1, name: "GPS", description: "", price: 500, per_day: true },
      { id: 2, name: "Driver", description: "", price: 2000, per_day: false },
    ]);
    expect(q.extras_total).toBe(3000);
    expect(q.tax).toBe(800);
  });
});

describe("availability overlap (end exclusive)", () => {
  const existing = { start_date: "2026-11-10", end_date: "2026-11-12" };
  it("partial overlap at start and end conflicts", () => {
    expect(overlaps({ start_date: "2026-11-09", end_date: "2026-11-11" }, existing)).toBe(true);
    expect(overlaps({ start_date: "2026-11-11", end_date: "2026-11-14" }, existing)).toBe(true);
  });
  it("starting on the day the previous ends is allowed", () => {
    expect(overlaps({ start_date: "2026-11-12", end_date: "2026-11-14" }, existing)).toBe(false);
  });
  it("counts days end-exclusive", () => {
    expect(daysBetween("2026-11-10", "2026-11-12")).toBe(2);
  });
});
