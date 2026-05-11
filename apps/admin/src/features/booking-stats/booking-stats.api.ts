import type { BookingStatsFiltersInput } from "@zanadeal/api/features/booking-stats";
import { orpc } from "@/lib/orpc";

export async function getBookingStatsSnapshot(input: BookingStatsFiltersInput) {
  return orpc.bookingStats.getSnapshot(input);
}
