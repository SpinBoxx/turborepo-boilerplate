import { cn } from "@zanadeal/ui";

type BookingStatsLiveStatus = "connected" | "connecting" | "disconnected";

const LIVE_STATUS_LABELS: Record<BookingStatsLiveStatus, string> = {
  connected: "Live",
  connecting: "Connexion",
  disconnected: "Hors ligne",
};

export function BookingStatsLiveIndicator({
  status,
}: {
  status: BookingStatsLiveStatus;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
      <span
        className={cn(
          "size-2 rounded-full",
          status === "connected" && "bg-emerald-500",
          status === "connecting" && "bg-amber-500",
          status === "disconnected" && "bg-destructive",
        )}
      />
      <span className="text-muted-foreground">
        {LIVE_STATUS_LABELS[status]}
      </span>
    </div>
  );
}
