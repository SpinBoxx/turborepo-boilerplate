import type { BookingStatsFiltersInput } from "@zanadeal/api/features/booking-stats";

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function createDefaultBookingStatsFilters(): BookingStatsFiltersInput {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  return {
    endDate,
    granularity: "day",
    startDate,
  };
}

export function formatStoredMoney(amount: number, currency = "MGA") {
  const normalizedAmount = amount / 100;

  return new Intl.NumberFormat("fr-FR", {
    currency,
    maximumFractionDigits: currency === "MGA" ? 0 : 2,
    style: "currency",
  }).format(normalizedAmount);
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
