import type {
  BookingStatsFiltersInput,
  BookingStatsSnapshot,
} from "@zanadeal/api/features/booking-stats";

export type BookingStatus =
  BookingStatsSnapshot["statusBreakdown"][number]["status"];
export type PaymentProvider = NonNullable<
  BookingStatsFiltersInput["paymentProvider"]
>;

export const BOOKING_STATUSES = [
  "PENDING_VALIDATION",
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "NO_SHOW",
] as const satisfies readonly BookingStatus[];

export const PAYMENT_PROVIDERS = [
  "ORANGE_MONEY",
  "STRIPE",
  "MANUAL",
] as const satisfies readonly PaymentProvider[];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  CANCELLED: "Annulées",
  CHECKED_IN: "En cours",
  CHECKED_OUT: "Terminées",
  CONFIRMED: "Confirmées",
  NO_SHOW: "No-show",
  PENDING_VALIDATION: "En attente",
  REJECTED: "Rejetées",
};

export function getBookingStatusBadgeVariant(status: BookingStatus) {
  if (status === "CONFIRMED" || status === "CHECKED_IN") {
    return "default";
  }

  if (status === "CANCELLED" || status === "REJECTED") {
    return "destructive";
  }

  return "secondary";
}
