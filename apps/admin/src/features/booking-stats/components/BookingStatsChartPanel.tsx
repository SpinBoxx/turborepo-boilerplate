import type { BookingStatsSnapshot } from "@zanadeal/api/features/booking-stats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@zanadeal/ui";
import { useMemo } from "react";
import Chart from "@/shared/Statistic/Chart/Chart";
import ChartProvider from "@/shared/Statistic/Chart/ChartProvider";
import { useStatContext } from "@/shared/Statistic/Stats/StatsProvider";
import type {
  BookingStatsComputedRecord,
  bookingStatsTimelineConfig,
} from "../stats/bookingsStatsStrategy";
import { createBookingStatsChartConfig } from "../stats/bookingsStatsStrategy";

export function BookingStatsChartPanel({
  snapshot,
}: {
  snapshot: BookingStatsSnapshot;
}) {
  const statContext = useStatContext<
    BookingStatsSnapshot["chartRecords"][number],
    typeof bookingStatsTimelineConfig
  >();
  const chartConfig = useMemo(() => createBookingStatsChartConfig(), []);

  return (
    <ChartProvider<BookingStatsComputedRecord>
      chartConfig={chartConfig}
      initialData={statContext.dataContext.dataByFrame}
    >
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Évolution des bookings</CardTitle>
          <CardDescription>
            {snapshot.chartRecords.length} booking(s) dans la période
            sélectionnée
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statContext.dataContext.dataByFrame.length ? (
            <Chart className="h-[340px]" />
          ) : (
            <div className="flex h-[260px] items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
              Aucune donnée pour cette période
            </div>
          )}
        </CardContent>
      </Card>
    </ChartProvider>
  );
}
