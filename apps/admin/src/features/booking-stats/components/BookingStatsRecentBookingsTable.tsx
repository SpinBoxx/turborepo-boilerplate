import type { BookingStatsSnapshot } from "@zanadeal/api/features/booking-stats";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@zanadeal/ui";
import {
  BOOKING_STATUS_LABELS,
  getBookingStatusBadgeVariant,
} from "../booking-stats.constants";
import {
  formatDateTime,
  formatStoredMoney,
} from "../utils/booking-stats-format";

export function BookingStatsRecentBookingsTable({
  snapshot,
}: {
  snapshot: BookingStatsSnapshot;
}) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Derniers bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hôtel</TableHead>
              <TableHead>Chambre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Arrivée</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {snapshot.recentBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="max-w-48 truncate">
                  {booking.hotelName}
                </TableCell>
                <TableCell className="max-w-48 truncate">
                  {booking.roomTitle}
                </TableCell>
                <TableCell>
                  <Badge variant={getBookingStatusBadgeVariant(booking.status)}>
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </Badge>
                </TableCell>
                <TableCell>{formatDateTime(booking.checkInDate)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatStoredMoney(booking.totalAmount, booking.currency)}
                </TableCell>
              </TableRow>
            ))}
            {snapshot.recentBookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Aucun booking récent.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
