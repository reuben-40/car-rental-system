// Pure business rules mirrored from the backend services (availability.py, pricing.py).
// The real app trusts POST /bookings/quote; these exist so the mock service behaves identically.
import type { DateRange, Extra, Quote } from "./types";

export const TAX_RATE = 0.16;
export const DEPOSIT_RATE = 0.2;
export const BLOCKING_STATUSES = ["pending", "confirmed", "active"] as const;

const DAY = 86_400_000;
const toUtc = (iso: string) => Date.parse(iso + "T00:00:00Z");

/** Whole days between start and end (end exclusive). */
export function daysBetween(start: string, end: string): number {
  return Math.round((toUtc(end) - toUtc(start)) / DAY);
}

/** Overlap rule: new_start < existing_end AND new_end > existing_start */
export function overlaps(a: DateRange, b: DateRange): boolean {
  return a.start_date < b.end_date && a.end_date > b.start_date;
}

// Work in cents to avoid float drift (backend uses Decimal ROUND_HALF_UP).
const cents = (n: number) => Math.round(n * 100);
const kes = (c: number) => c / 100;

export function calculateQuote(dailyRate: number, start: string, end: string, extras: Extra[]): Quote {
  const days = daysBetween(start, end);
  const subtotal = cents(dailyRate) * days;
  const extras_total = extras.reduce((s, e) => s + cents(e.price) * (e.per_day ? days : 1), 0);
  const taxable = subtotal + extras_total;
  const tax = Math.round(taxable * TAX_RATE);
  const total = taxable + tax;
  return {
    days,
    daily_rate: dailyRate,
    subtotal: kes(subtotal),
    extras_total: kes(extras_total),
    tax: kes(tax),
    total_amount: kes(total),
    deposit: kes(Math.round(total * DEPOSIT_RATE)),
  };
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  return new Date(toUtc(iso) + n * DAY).toISOString().slice(0, 10);
}

export function formatKES(n: number): string {
  return "KES " + n.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function formatDate(iso: string): string {
  return new Date(toUtc(iso)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
