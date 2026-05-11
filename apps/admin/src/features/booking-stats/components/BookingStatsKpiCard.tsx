import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@zanadeal/ui";
import type { LucideIcon } from "lucide-react";

export function BookingStatsKpiCard({
  description,
  icon: Icon,
  label,
  value,
}: {
  description?: string;
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Card className="relative gap-3 rounded-lg py-4">
      <CardHeader className="flex-row items-center justify-between gap-3 px-4">
        <div>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="mt-2 text-2xl tabular-nums">{value}</CardTitle>
        </div>
        <div className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-md bg-muted">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
      </CardHeader>
      {description ? (
        <CardContent className="px-4 text-muted-foreground text-xs">
          {description}
        </CardContent>
      ) : null}
    </Card>
  );
}
