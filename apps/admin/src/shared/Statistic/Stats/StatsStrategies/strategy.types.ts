import type { DeepKeys } from "@tanstack/react-form";
import type { FormatOptions } from "date-fns";
import type { DateFrame } from "../../utils/dates";

export type Aggregate = "sum" | "average" | "max" | "min" | "count";
export type MetricValueType = "price" | "percentage" | "number";

export type StatsRange = {
	endKey: string;
	leftIndex: number;
	rightIndex: number;
	startKey: string;
};

export type FramesConfig = {
	currentFrame: DateFrame;
	frames: DateFrame[];
	setCurrentFrame: (frame: DateFrame) => void;
};

export type Obj = Record<string, any>;

export type AggregateField<T> = {
	aggregate: Aggregate;
	label: string;
	sourceKey: DeepKeys<T>;
	valueType: MetricValueType;
};

export type AdditionalFieldType<Key extends PropertyKey> = {
	[K in Key]: number;
};

export type AdditionalFieldInfo<Key> = {
	key: Key;
	label: string;
	value: number;
	valueType: MetricValueType;
};

export type MetricInfoTyped<T> = {
	key: T;
	label: string;
	valueType: MetricValueType;
};

export type GetMetricsParam<KEY> = {
	exclude?: KEY[];
	pick?: KEY[];
	sort?: KEY[];
};

export type StrategyConfig<T extends Obj> = {
	dateKeyField: DeepKeys<T>;
	framesConfig?: {
		defaultFrame: DateFrame;
		formatFrameToDisplay?: (
			date: Date,
			frame: DateFrame,
			dateFnsFormat: (
				date: string | Date | number,
				format: string,
				options?: FormatOptions,
			) => string,
		) => string | undefined;
		framesAvailable: DateFrame[];
	};
	metrics: Record<string, AggregateField<T>>;
};

export type ComputedStats<T extends StrategyConfig<any>> = AdditionalFieldType<
	keyof T["metrics"]
> &
	Record<T["dateKeyField"], string>;

export type StrategyReturnType<
	DATA extends Obj,
	T extends StrategyConfig<DATA>,
> = {
	computeMetric: (
		data: ComputedStats<T>[],
		key: keyof T["metrics"],
		aggregate?: Aggregate,
	) => AdditionalFieldInfo<keyof T["metrics"]> | undefined;
	computeStatsByFrame(data: DATA[], frame?: DateFrame): ComputedStats<T>[];
	formatKeyForDisplay(key: string, frame?: DateFrame): string;
	formatMetricValue(value: number, valueType: MetricValueType): string;
	framesConfig?: T["framesConfig"];
	getInitialRange(data: DATA[]): { endKey: string; startKey: string };
	getMetricInfo(key: keyof T["metrics"]): MetricInfoTyped<keyof T["metrics"]>;
	/**
	 * Get metrics based on the provided parameters.
	 * Returns with the already computed value
	 * @param params Parameters to filter or exclude specific metrics.
	 * @returns An array of metric information objects.
	 */
	getMetrics(
		param?: GetMetricsParam<keyof T["metrics"]>,
	): MetricInfoTyped<keyof T["metrics"]>[];
	getRangeIndexes(
		items: DATA[],
		startKey: string,
		endKey: string,
	): { leftIndex: number; rightIndex: number };
	normalizeRange(
		startKey: string,
		endKey: string,
		frame?: DateFrame,
	): { endKey: string; startKey: string };
};
