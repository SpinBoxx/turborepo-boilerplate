import type { BookingStatsFiltersInput } from "@zanadeal/api/features/booking-stats";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@zanadeal/ui";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
  PAYMENT_PROVIDERS,
  type BookingStatus,
  type PaymentProvider,
} from "../booking-stats.constants";
import { toDateInputValue } from "../utils/booking-stats-format";

export function BookingStatsFilters({
  filters,
  onChange,
}: {
  filters: BookingStatsFiltersInput;
  onChange: (filters: BookingStatsFiltersInput) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      <div className="space-y-1.5">
        <Label htmlFor="booking-stats-start">Début</Label>
        <Input
          id="booking-stats-start"
          type="date"
          value={filters.startDate ? toDateInputValue(filters.startDate) : ""}
          onChange={(event) =>
            onChange({
              ...filters,
              startDate: event.target.value
                ? new Date(`${event.target.value}T00:00:00.000Z`)
                : undefined,
            })
          }
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="booking-stats-end">Fin</Label>
        <Input
          id="booking-stats-end"
          type="date"
          value={filters.endDate ? toDateInputValue(filters.endDate) : ""}
          onChange={(event) =>
            onChange({
              ...filters,
              endDate: event.target.value
                ? new Date(`${event.target.value}T23:59:59.999Z`)
                : undefined,
            })
          }
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="booking-stats-status">Statut</Label>
        <Select
          value={filters.statuses?.[0] ?? "all"}
          onValueChange={(value) =>
            onChange({
              ...filters,
              statuses: value === "all" ? undefined : [value as BookingStatus],
            })
          }
        >
          <SelectTrigger id="booking-stats-status" className="w-full">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {BOOKING_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {BOOKING_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="booking-stats-payment-provider">Provider</Label>
        <Select
          value={filters.paymentProvider ?? "all"}
          onValueChange={(value) =>
            onChange({
              ...filters,
              paymentProvider:
                value === "all" ? undefined : (value as PaymentProvider),
            })
          }
        >
          <SelectTrigger id="booking-stats-payment-provider" className="w-full">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {PAYMENT_PROVIDERS.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="booking-stats-granularity">Granularité</Label>
        <Select
          value={filters.granularity ?? "day"}
          onValueChange={(value) =>
            onChange({
              ...filters,
              granularity: value as BookingStatsFiltersInput["granularity"],
            })
          }
        >
          <SelectTrigger id="booking-stats-granularity" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Jour</SelectItem>
            <SelectItem value="month">Mois</SelectItem>
            <SelectItem value="year">Année</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
