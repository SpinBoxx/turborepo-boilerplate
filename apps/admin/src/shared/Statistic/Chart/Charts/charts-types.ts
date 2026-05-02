import type { PropsWithChildren, ReactNode } from "react";

import type {
	BarProps,
	CartesianGridProps,
	LegendPayload,
	LegendProps,
	LineProps,
	TooltipContentProps,
	TooltipProps,
	XAxisProps,
	YAxisProps,
} from "recharts";
import type { LabelPosition } from "recharts/types/component/Label";

export type YAxisPropsGeneric<T> = YAxisProps & { dataKey?: keyof T };
export type XAxisPropsGeneric<T> = XAxisProps & { dataKey: keyof T };

type TooltipCustomProps = TooltipProps<string | number, string> & {
	disableTooltip?: boolean;
	overrideContent?: (
		payload: TooltipContentProps<string | number, string>,
	) => ReactNode;
};

interface ReferenceLineConfig<T> {
	/**
	 * If datakey is provided, the reference line will be drawn at the value corresponding to the datakey.
	 * If provided and chartType is "single", shown when the datakey is focused, otherwise always shown.
	 * */
	dataKey?: keyof T;
	label: string;
	labelPosition: LabelPosition;
	stroke: string;
	/**
	 * The position of the reference line on the Y axis
	 */
	y: number;
}

export type BarChartProps<T> = {
	datakeys: (BarProps & { dataKey: keyof T })[];
	defaultConfig: Omit<BarProps, "dataKey">;
};

export type LineChartProps<T> = {
	datakeys: (LineProps & { dataKey: keyof T })[];
	defaultConfig: Omit<LineProps, "dataKey">;
};

export type ChartTypes<T> = {
	bar?: BarChartProps<T>;
	line?: LineChartProps<T>;
};

/** Chart configuration and mutable bar state. */
export type ChartConfig<T> = {
	cartesianGrid?: CartesianGridProps;
	chartTypes: ChartTypes<T>;
	chartView: "single" | "multiple";
	defaultFocusMetric?: keyof T;
	disabledLegend?: boolean;
	legend?: LegendProps;
	referenceLines?: ReferenceLineConfig<T>[];
	tooltip?: TooltipCustomProps;
	xAxis: XAxisPropsGeneric<T>;
	yAxis: YAxisPropsGeneric<T>[];
	zoomConfig?: ChartZoomConfig;
};

export type ChartZoomConfig = {
	isSelectingArea: boolean;
	leftArea: string | null;
	resetArea: () => void;
	rightArea: string | null;
	setIsSelectingArea: React.Dispatch<React.SetStateAction<boolean>>;
	setLeftArea: React.Dispatch<React.SetStateAction<string | null>>;
	setRightArea: React.Dispatch<React.SetStateAction<string | null>>;
};

// CHART PROVIDER PROPS
export type ChartProviderProps<T> = {
	chartConfig: ChartConfig<T>;
	initialData: T[];
} & PropsWithChildren;

// CHART CONTEXT VALUE

export type ChartStates = {
	focusedMetric: string | undefined;
};

export type ChartActions<T> = {
	onChangeDisplayedChart: (
		chartType: keyof ChartConfig<T>["chartTypes"],
	) => void;
	onFocusMetricChange: (dataKey: string) => void;
	onLegendClick: (payload: LegendPayload) => void;
};

/** Context value exposed by the stats provider. */
export type ChartContextValue<T> = {
	actions: ChartActions<T>;
	chartConfig: ChartConfig<T>;
	data: T[];
	displayedChart: keyof ChartConfig<T>["chartTypes"];
	setDisplayedChart: (chartType: keyof ChartConfig<T>["chartTypes"]) => void;
	states: ChartStates;
	zoomConfig?: ChartZoomConfig;
};
