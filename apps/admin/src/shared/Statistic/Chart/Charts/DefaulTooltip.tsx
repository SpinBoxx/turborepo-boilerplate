import { cn } from "@zanadeal/ui";
import type { TooltipContentProps } from "recharts";
import { useStatContext } from "../../Stats/StatsProvider";

const DefaultTooltip = ({
  active,
  className,
  label,
  payload,
}: TooltipContentProps<string | number, string> & { className?: string }) => {
  const isVisible = active && payload && payload.length;
  const statContext = useStatContext();

  const formatLabel = (label: string | number | undefined) => {
    if (label === undefined) return "";
    return (
      statContext?.strategy.formatKeyForDisplay(
        label.toString(),
        statContext.frames?.currentFrame,
      ) ?? label.toString()
    );
  };
  const formatValue = (value: unknown, dataKey: unknown) => {
    if (typeof value !== "number") {
      if (value === null || value === undefined) {
        return "";
      }

      return Array.isArray(value) ? value.join(" - ") : String(value);
    }

    const metricInfo = statContext?.strategy.getMetricInfo(
      String(dataKey ?? ""),
    );
    return (
      statContext?.strategy.formatMetricValue(value, metricInfo?.valueType) ??
      value.toLocaleString()
    );
  };

  const getMetricLabel = (dataKey: unknown) => {
    return statContext.strategy.getMetricInfo(String(dataKey ?? "")).label;
  };

  return (
    <div
      className={cn(
        "min-w-44 rounded-md border bg-popover p-3 text-popover-foreground shadow-md",
        className,
      )}
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {isVisible && (
        <div>
          <p className="font-medium text-sm">{formatLabel(label)}</p>
          <div className="mt-2 space-y-1.5">
            {(payload ?? []).map((entry) => (
              <div
                key={entry.dataKey?.toString()}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                  <span
                    className="size-2.5 shrink-0 rounded-xs"
                    aria-hidden="true"
                    style={{
                      backgroundColor:
                        entry.color ??
                        entry.stroke ??
                        entry.fill ??
                        "currentColor",
                    }}
                  />
                  <span className="truncate">
                    {getMetricLabel(entry.dataKey)}
                  </span>
                </span>
                <span
                  className="shrink-0 font-medium tabular-nums"
                  style={{
                    color: entry.color ?? entry.stroke ?? entry.fill,
                  }}
                >
                  {formatValue(entry.value, entry.dataKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultTooltip;
