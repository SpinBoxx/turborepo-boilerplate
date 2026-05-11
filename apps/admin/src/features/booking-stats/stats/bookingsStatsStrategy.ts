import type { BookingStatsChartRecord } from "@zanadeal/api/features/booking-stats";
import type { BookingStatsFiltersInput } from "@zanadeal/api/features/booking-stats";
import type {
  ComputedStats,
  StrategyConfig,
} from "@/shared/Statistic/Stats/StatsStrategies/strategy.types";
import { createTimelineStrategy } from "@/shared/Statistic/Stats/StatsStrategies/timelineStrategy";
import type { ChartConfig } from "@/shared/Statistic/Chart/Charts/charts-types";

type BookingStatsGranularity = NonNullable<
  BookingStatsFiltersInput["granularity"]
>;

export const bookingStatsTimelineConfig = {
  dateKeyField: "date",
  framesConfig: {
    defaultFrame: "day" as BookingStatsGranularity,
    framesAvailable: ["day", "month", "year"],
  },
  metrics: {
    totalBookings: {
      aggregate: "sum",
      label: "Bookings",
      sourceKey: "totalBookings",
      valueType: "number",
    },
    pendingValidationCount: {
      aggregate: "sum",
      label: "En attente",
      sourceKey: "pendingValidationCount",
      valueType: "number",
    },
    confirmedCount: {
      aggregate: "sum",
      label: "Confirmées",
      sourceKey: "confirmedCount",
      valueType: "number",
    },
    cancelledCount: {
      aggregate: "sum",
      label: "Annulées",
      sourceKey: "cancelledCount",
      valueType: "number",
    },
    grossPaidAmount: {
      aggregate: "sum",
      label: "Montant payé",
      sourceKey: "grossPaidAmount",
      valueType: "number",
    },
    platformFeeAmount: {
      aggregate: "sum",
      label: "Frais plateforme",
      sourceKey: "platformFeeAmount",
      valueType: "number",
    },
    guestCount: {
      aggregate: "sum",
      label: "Voyageurs",
      sourceKey: "guestCount",
      valueType: "number",
    },
    nightsCount: {
      aggregate: "sum",
      label: "Nuitées",
      sourceKey: "nightsCount",
      valueType: "number",
    },
  },
} satisfies StrategyConfig<BookingStatsChartRecord>;

export type BookingStatsComputedRecord = ComputedStats<
  typeof bookingStatsTimelineConfig
>;

export const bookingStatsStrategy = createTimelineStrategy<
  BookingStatsChartRecord,
  typeof bookingStatsTimelineConfig
>({
  strategy: bookingStatsTimelineConfig,
});

export function createBookingStatsStrategy(
  defaultFrame: NonNullable<BookingStatsFiltersInput["granularity"]> = "day",
) {
  return createTimelineStrategy<
    BookingStatsChartRecord,
    typeof bookingStatsTimelineConfig
  >({
    strategy: {
      ...bookingStatsTimelineConfig,
      framesConfig: {
        ...bookingStatsTimelineConfig.framesConfig,
        defaultFrame,
      },
    },
  });
}

export function createBookingStatsChartConfig(): ChartConfig<BookingStatsComputedRecord> {
  return {
    cartesianGrid: { strokeDasharray: "3 3", vertical: false },
    chartTypes: {
      line: {
        defaultConfig: {
          dot: false,
          strokeWidth: 2,
          type: "monotone",
        },
        datakeys: [
          { dataKey: "totalBookings", stroke: "var(--chart-1)" },
          { dataKey: "pendingValidationCount", stroke: "var(--chart-3)" },
          { dataKey: "confirmedCount", stroke: "var(--chart-4)" },
          { dataKey: "cancelledCount", stroke: "var(--chart-5)" },
        ],
      },
    },
    chartView: "multiple",
    defaultFocusMetric: "totalBookings",
    legend: { verticalAlign: "top" },
    tooltip: {},
    xAxis: { dataKey: "date" },
    yAxis: [{ allowDecimals: false }],
  };
}
