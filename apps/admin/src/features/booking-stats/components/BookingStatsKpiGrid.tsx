import type { BookingStatsSnapshot } from "@zanadeal/api/features/booking-stats";
import { Activity, CalendarClock, CircleDollarSign, Users } from "lucide-react";
import { formatStoredMoney } from "../utils/booking-stats-format";
import { BookingStatsKpiCard } from "./BookingStatsKpiCard";

export function BookingStatsKpiGrid({
  snapshot,
}: {
  snapshot: BookingStatsSnapshot;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <BookingStatsKpiCard
        icon={Activity}
        label="Bookings"
        value={snapshot.summary.totalBookings.toLocaleString("fr-FR")}
        description={`${snapshot.summary.pendingValidationCount} en attente de validation`}
      />
      <BookingStatsKpiCard
        icon={CircleDollarSign}
        label="Montant payé"
        value={formatStoredMoney(
          snapshot.summary.grossPaid.amount,
          snapshot.summary.grossPaid.currency,
        )}
        description={`${formatStoredMoney(snapshot.summary.platformFee.amount, snapshot.summary.platformFee.currency)} de frais plateforme`}
      />
      <BookingStatsKpiCard
        icon={CalendarClock}
        label="Nuitées"
        value={snapshot.summary.nightsCount.toLocaleString("fr-FR")}
        description={`${snapshot.summary.quantityCount} chambre(s) réservée(s)`}
      />
      <BookingStatsKpiCard
        icon={Users}
        label="Voyageurs"
        value={snapshot.summary.guestCount.toLocaleString("fr-FR")}
        description={`${snapshot.summary.activeQuotesCount} quote(s) active(s)`}
      />
    </div>
  );
}
