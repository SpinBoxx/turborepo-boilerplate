import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingStatsFiltersInput } from "@zanadeal/api/features/booking-stats";
import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/orpc";
import { getBookingStatsSnapshot } from "./booking-stats.api";

export type BookingStatsRealtimeState = {
  lastEventAt: Date | null;
  status: "connecting" | "connected" | "disconnected";
};

export function bookingStatsKeys() {
  return {
    all: ["booking-stats"] as const,
    snapshot: (filters: BookingStatsFiltersInput) =>
      ["booking-stats", "snapshot", filters] as const,
  };
}

export function useBookingStatsSnapshot(filters: BookingStatsFiltersInput) {
  return useQuery({
    queryKey: bookingStatsKeys().snapshot(filters),
    queryFn: () => getBookingStatsSnapshot(filters),
  });
}

export function useBookingStatsEvents() {
  const queryClient = useQueryClient();
  const [state, setState] = useState<BookingStatsRealtimeState>({
    lastEventAt: null,
    status: "connecting",
  });

  const eventsUrl = useMemo(() => {
    return `${getApiBaseUrl().replace(/\/$/, "")}/api/booking-stats/events`;
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(eventsUrl, { withCredentials: true });

    eventSource.addEventListener("stats.connected", () => {
      setState((previous) => ({ ...previous, status: "connected" }));
    });

    eventSource.addEventListener("stats.invalidate", () => {
      setState({ lastEventAt: new Date(), status: "connected" });
      queryClient.invalidateQueries({ queryKey: bookingStatsKeys().all });
    });

    eventSource.onerror = () => {
      setState((previous) => ({ ...previous, status: "disconnected" }));
    };

    return () => {
      eventSource.close();
    };
  }, [eventsUrl, queryClient]);

  return state;
}
