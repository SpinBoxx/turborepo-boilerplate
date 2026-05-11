import type { BookingStatsFiltersInput } from "@zanadeal/api/features/booking-stats";
import { Button, Card, CardContent } from "@zanadeal/ui";
import { RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import StatsProvider from "@/shared/Statistic/Stats/StatsProvider";
import { BookingStatsBreakdownPanels } from "../components/BookingStatsBreakdownPanels";
import { BookingStatsChartPanel } from "../components/BookingStatsChartPanel";
import {
  BookingStatsDashboardError,
  BookingStatsDashboardLoading,
} from "../components/BookingStatsDashboardStates";
import { BookingStatsFilters } from "../components/BookingStatsFilters";
import { BookingStatsGeneratedAt } from "../components/BookingStatsGeneratedAt";
import { BookingStatsKpiGrid } from "../components/BookingStatsKpiGrid";
import { BookingStatsLiveIndicator } from "../components/BookingStatsLiveIndicator";
import { BookingStatsRecentBookingsTable } from "../components/BookingStatsRecentBookingsTable";
import {
  useBookingStatsEvents,
  useBookingStatsSnapshot,
} from "../booking-stats.queries";
import { createBookingStatsStrategy } from "../stats/bookingsStatsStrategy";
import { createDefaultBookingStatsFilters } from "../utils/booking-stats-format";

export default function BookingStatsDashboardPage() {
  const [filters, setFilters] = useState<BookingStatsFiltersInput>(() =>
    createDefaultBookingStatsFilters(),
  );
  const realtime = useBookingStatsEvents();
  const snapshotQuery = useBookingStatsSnapshot(filters);
  const statsStrategy = useMemo(
    () => createBookingStatsStrategy(filters.granularity ?? "day"),
    [filters.granularity],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-balance font-semibold text-2xl">
            Dashboard bookings
          </h1>
          <p className="text-pretty text-muted-foreground text-sm">
            Suivi temps réel des réservations, paiements et validations hôtel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BookingStatsLiveIndicator status={realtime.status} />
          <Button
            variant="outline"
            onClick={() => void snapshotQuery.refetch()}
            disabled={snapshotQuery.isFetching}
          >
            <RefreshCcw className="size-4" aria-hidden="true" />
            Actualiser
          </Button>
        </div>
      </div>

      <Card className="rounded-lg">
        <CardContent className="pt-6">
          <BookingStatsFilters filters={filters} onChange={setFilters} />
        </CardContent>
      </Card>

      {snapshotQuery.isLoading ? <BookingStatsDashboardLoading /> : null}

      {snapshotQuery.error ? (
        <BookingStatsDashboardError
          isRetrying={snapshotQuery.isFetching}
          onRetry={() => void snapshotQuery.refetch()}
        />
      ) : null}

      {snapshotQuery.data ? (
        <>
          <BookingStatsKpiGrid snapshot={snapshotQuery.data} />

          <StatsProvider
            data={snapshotQuery.data.chartRecords}
            strategy={statsStrategy}
          >
            <BookingStatsChartPanel snapshot={snapshotQuery.data} />
          </StatsProvider>

          <BookingStatsBreakdownPanels snapshot={snapshotQuery.data} />
          <BookingStatsRecentBookingsTable snapshot={snapshotQuery.data} />
          <BookingStatsGeneratedAt
            generatedAt={snapshotQuery.data.generatedAt}
            lastEventAt={realtime.lastEventAt}
          />
        </>
      ) : null}
    </div>
  );
}
