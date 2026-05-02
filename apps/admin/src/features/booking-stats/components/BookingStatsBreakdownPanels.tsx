import type { BookingStatsSnapshot } from "@zanadeal/api/features/booking-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@zanadeal/ui";
import { BOOKING_STATUS_LABELS } from "../booking-stats.constants";

export function BookingStatsBreakdownPanels({
  snapshot,
}: {
  snapshot: BookingStatsSnapshot;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Statuts booking</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {snapshot.statusBreakdown.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              <span className="text-sm">
                {BOOKING_STATUS_LABELS[item.status]}
              </span>
              <span className="font-medium tabular-nums">{item.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Paiements</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {snapshot.paymentBreakdown
            .filter((item) => item.count > 0)
            .map((item) => (
              <div
                key={`${item.provider}-${item.status}`}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
              >
                <span className="text-sm">
                  {item.provider.replace("_", " ")} · {item.status}
                </span>
                <span className="font-medium tabular-nums">{item.count}</span>
              </div>
            ))}
          {snapshot.paymentBreakdown.every((item) => item.count === 0) ? (
            <p className="text-muted-foreground text-sm">
              Aucun paiement sur la période.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
