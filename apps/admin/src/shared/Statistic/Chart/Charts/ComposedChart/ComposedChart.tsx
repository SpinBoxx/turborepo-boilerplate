import { cn } from "@zanadeal/ui";
import {
  Bar,
  CartesianGrid,
  ComposedChart as ComposedChartComp,
  Label,
  Legend,
  Line,
  type MouseHandlerDataParam,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStatContext } from "@/shared/Statistic/Stats/StatsProvider";
import { useChartContext } from "../../ChartProvider";
import DefaultTooltip from "../DefaulTooltip";

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

const ComposedChart = ({ className, style }: Props) => {
  const { actions, chartConfig, data, displayedChart, states, zoomConfig } =
    useChartContext();
  const statContext: ReturnType<typeof useStatContext> | undefined =
    useStatContext();
  const {
    cartesianGrid,
    chartTypes: { bar, line },
    legend,
    referenceLines,
    tooltip,
    xAxis,
    yAxis,
  } = chartConfig;
  const { focusedMetric } = states;
  if (!zoomConfig) {
    throw new Error("ComposedChart requires ChartProvider zoomConfig");
  }

  const {
    isSelectingArea,
    leftArea,
    resetArea,
    rightArea,
    setIsSelectingArea,
    setLeftArea,
    setRightArea,
  } = zoomConfig;

  const { onLegendClick } = actions;

  const isRangeEnabled = Boolean(statContext?.rangeContext?.range);

  const onMouseDown = (e: MouseHandlerDataParam) => {
    if (!isRangeEnabled || !e.activeLabel) return;

    setIsSelectingArea(true);
    setLeftArea(e.activeLabel.toString());
  };

  const onMouseMove = (e: MouseHandlerDataParam) => {
    if (!isRangeEnabled) return;
    if (isSelectingArea && e.activeLabel) {
      setRightArea(e.activeLabel.toString());
    }
  };

  const onMouseUp = () => {
    if (!isRangeEnabled) return;

    setIsSelectingArea(false);
    if (!leftArea) {
      resetArea();
      return;
    }

    // Use raw selected keys; strategy will normalize and sort them.
    const startKey = leftArea;
    const endKey = rightArea ?? leftArea;

    if (statContext) {
      // Push selection to provider so range-dependent stats/charts update.
      statContext.rangeContext.onRangeChange({
        endKey,
        startKey,
      });
    }

    resetArea();
  };

  // Format axis/tooltip label using strategy + active frame locale rules.
  const formatDisplayKey = (key: string | number | undefined) => {
    if (key === undefined) {
      return "";
    }
    return (
      statContext?.strategy.formatKeyForDisplay(
        String(key),
        statContext?.frames?.currentFrame,
      ) ?? String(key)
    );
  };

  return (
    <ComposedChartComp
      className={cn("min-h-[250px] w-full", className)}
      data={data}
      style={style}
      responsive
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {referenceLines?.map((refLine, index) => (
        <ReferenceLine
          key={`refLine-${index}`}
          stroke={refLine.stroke}
          y={refLine.y}
        >
          <Label
            fill={refLine.stroke}
            fontSize={12}
            position={refLine.labelPosition}
            value={`${refLine.label} (${refLine.y})`}
          />
        </ReferenceLine>
      ))}
      {cartesianGrid && <CartesianGrid {...cartesianGrid} />}
      <XAxis {...xAxis} tickFormatter={(value) => formatDisplayKey(value)} />
      {yAxis.map((yAxisProps, index) => (
        <YAxis
          key={`yAxis-${index}`}
          {...yAxisProps}
          tickFormatter={(value) => {
            if (!statContext) return value;
            if (!focusedMetric) return value;
            const metricInfo =
              statContext.strategy.getMetricInfo(focusedMetric);
            if (!metricInfo) return value;
            return statContext.strategy.formatMetricValue(
              value,
              metricInfo.valueType,
            );
          }}
        />
      ))}
      {legend && (
        <Legend
          {...legend}
          formatter={(value) => (
            <span className="text-muted-foreground">
              {statContext.strategy.getMetricInfo(String(value)).label}
            </span>
          )}
          onClick={onLegendClick}
        />
      )}
      {/* @ts-ignore */}
      <Tooltip {...tooltip} content={tooltip?.content || DefaultTooltip} />
      {
        {
          bar: (
            <>
              {bar?.datakeys.map((barProps, index) => (
                <Bar
                  key={`bar-${index}`}
                  {...bar.defaultConfig}
                  {...barProps}
                />
              ))}
            </>
          ),
          line: (
            <>
              {line?.datakeys.map((lineProps, index) => (
                <Line
                  key={`line-${index}`}
                  {...line.defaultConfig}
                  {...lineProps}
                />
              ))}
            </>
          ),
        }[displayedChart]
      }
      {leftArea && rightArea ? (
        <ReferenceArea
          fill="lightgray"
          stroke="rgba(0,0,0,0.1)"
          x1={leftArea}
          x2={rightArea}
        />
      ) : null}
    </ComposedChartComp>
  );
};

export default ComposedChart;
