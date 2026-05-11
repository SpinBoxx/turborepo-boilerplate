import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import type { LegendPayload } from "recharts";

import type {
	ChartActions,
	ChartConfig,
	ChartContextValue,
	ChartProviderProps,
	ChartStates,
	ChartZoomConfig,
} from "./Charts/charts-types";

const ChartContext = createContext<ChartContextValue<unknown> | null>(null);

/** Hook to access stats context. */
export const useChartContext = <T,>() => {
	const context = useContext(ChartContext);

	if (!context) {
		throw new Error("useChartContext must be used within a ChartProvider");
	}

	return context as ChartContextValue<T>;
};

/**
 * Chart provider that supplies data and chart configuration v */
export default function ChartProvider<T>({
	chartConfig,
	children,
	initialData,
}: ChartProviderProps<T>) {
	const data = useMemo(() => initialData, [initialData]);

	const {
		chartTypes: chartTypesFromProps,
		chartView,
		defaultFocusMetric,
	} = chartConfig;
	const [chartTypes, setChartTypes] = useState(chartTypesFromProps);
	const [focusedMetric, setFocusedMetric] = useState<string | undefined>();
	const [displayedChart, setDisplayedChart] = useState<
		keyof ChartConfig<T>["chartTypes"]
	>(
		Object.keys(
			chartConfig.chartTypes,
		)[0] as keyof ChartConfig<T>["chartTypes"],
	);

	// ZOOM CONFIG
	const [leftArea, setLeftArea] = useState<string | null>(null);
	const [rightArea, setRightArea] = useState<string | null>(null);
	const [isSelectingArea, setIsSelectingArea] = useState(false);

	const resetArea = useCallback(() => {
		setLeftArea(null);
		setRightArea(null);
		setIsSelectingArea(false);
	}, []);

	const onChangeDisplayedChart = useCallback((
		chartType: keyof ChartConfig<T>["chartTypes"],
	) => {
		setDisplayedChart(chartType);
	}, []);

	const filterChartDatakeysByFocused = useCallback((metric: string) => {
		setChartTypes(() => {
			return Object.fromEntries(
				Object.entries(chartTypesFromProps).map(([key, chartType]) => {
					return [
						key,
						{
							...chartType,
							datakeys: chartType.datakeys.filter(
								(chart) => String(chart.dataKey) === metric,
							),
						},
					];
				}),
			);
		});
	}, [chartTypesFromProps]);

	const showOnlyChartDatakey = useCallback((metric: string) => {
		setChartTypes(() => {
			return Object.fromEntries(
				Object.entries(chartTypesFromProps).map(([key, chartType]) => {
					return [
						key,
						{
							...chartType,
							datakeys: chartType.datakeys.map((chart) => {
								if (String(chart.dataKey) !== metric) {
									return { ...chart, hide: true };
								}
								return chart;
							}),
						},
					];
				}),
			);
		});
	}, [chartTypesFromProps]);

	const onFocusMetricChange = useCallback((dataKey: string) => {
		if (chartView === "single") {
			setFocusedMetric(dataKey);
			filterChartDatakeysByFocused(dataKey);
		} else if (dataKey === focusedMetric) {
			setFocusedMetric(undefined);
			setChartTypes(chartTypesFromProps);
		} else {
			setFocusedMetric(dataKey);
			showOnlyChartDatakey(dataKey);
		}
	}, [chartTypesFromProps, chartView, filterChartDatakeysByFocused, focusedMetric, showOnlyChartDatakey]);

	const onLegendClick = useCallback((payload: LegendPayload) => {
		const clickedDataKey = String(payload.dataKey);
		if (chartView === "single") {
			setFocusedMetric(clickedDataKey);
			filterChartDatakeysByFocused(clickedDataKey);
		} else if (clickedDataKey === focusedMetric) {
			setFocusedMetric(undefined);
			setChartTypes(chartTypesFromProps);
		} else {
			setFocusedMetric(clickedDataKey);
			showOnlyChartDatakey(clickedDataKey);
		}
	}, [chartTypesFromProps, chartView, filterChartDatakeysByFocused, focusedMetric, showOnlyChartDatakey]);

	const referenceLines = useMemo(() => {
		if (chartView === "single" && focusedMetric) {
			return (
				chartConfig.referenceLines?.filter(
					(refLine) => String(refLine.dataKey) === focusedMetric,
				) ?? []
			);
		}
		return chartConfig.referenceLines ?? [];
	}, [chartView, focusedMetric, chartConfig.referenceLines]);

	useEffect(() => {
		if (defaultFocusMetric) {
			setFocusedMetric(String(defaultFocusMetric));
			if (chartView === "single") {
				filterChartDatakeysByFocused(String(defaultFocusMetric));
			} else {
				showOnlyChartDatakey(String(defaultFocusMetric));
			}
		}
	}, [
		defaultFocusMetric,
		chartView,
		filterChartDatakeysByFocused,
		showOnlyChartDatakey,
	]);

	const zoomConfig = useMemo<ChartZoomConfig>(
		() => ({
			isSelectingArea,
			leftArea,
			resetArea,
			rightArea,
			setIsSelectingArea,
			setLeftArea,
			setRightArea,
		}),
		[isSelectingArea, leftArea, resetArea, rightArea],
	);

	const updatedChartConfig = useMemo<ChartConfig<T>>(
		() => ({ ...chartConfig, chartTypes, referenceLines, zoomConfig }),
		[chartConfig, chartTypes, zoomConfig, referenceLines],
	);

	const states = useMemo<ChartStates>(() => ({ focusedMetric }), [focusedMetric]);

	const actions = useMemo<ChartActions<T>>(
		() => ({
			onChangeDisplayedChart,
			onFocusMetricChange,
			onLegendClick,
		}),
		[onChangeDisplayedChart, onFocusMetricChange, onLegendClick],
	);

	const value = useMemo<ChartContextValue<T>>(
		() => ({
			actions,
			chartConfig: updatedChartConfig,
			data,
			displayedChart,
			setDisplayedChart,
			states,
			zoomConfig,
		}),
		[actions, data, updatedChartConfig, zoomConfig, displayedChart, states],
	);

	return (
		<ChartContext.Provider value={value as ChartContextValue<unknown>}>
			{children}
		</ChartContext.Provider>
	);
}
