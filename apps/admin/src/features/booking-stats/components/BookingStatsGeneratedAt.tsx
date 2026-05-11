import { Hotel } from "lucide-react";
import { formatDateTime } from "../utils/booking-stats-format";

export function BookingStatsGeneratedAt({
  generatedAt,
  lastEventAt,
}: {
  generatedAt: string;
  lastEventAt?: Date | null;
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-xs">
      <Hotel className="size-3.5" aria-hidden="true" />
      <span>
        Généré le {formatDateTime(generatedAt)}
        {lastEventAt
          ? ` · dernier événement ${formatDateTime(lastEventAt)}`
          : ""}
      </span>
    </div>
  );
}
