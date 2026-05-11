import type { DeepKeys } from '@tanstack/react-form';
import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfYear,
} from 'date-fns';
import { fr } from 'date-fns/locale';

import type {
  AdditionalFieldType,
  Aggregate,
  ComputedStats,
  GetMetricsParam,
  MetricInfoTyped,
  StrategyConfig,
  StrategyReturnType,
} from './strategy.types';
import { isSameFrame, type DateFrame } from '../../utils/dates';
import type { Obj } from './strategy.types';

/** Parse unknown date input into a safe Date value. */
const toDateValue = (value: string | Date | undefined | null): Date => {
  if (!value) return new Date();
  if (value instanceof Date) return isValid(value) ? value : new Date();

  const isoDate = parseISO(String(value));
  if (isValid(isoDate)) return isoDate;

  const nativeDate = new Date(value);
  return isValid(nativeDate) ? nativeDate : new Date();
};

/** Normalize range keys to full frame boundaries. */
const normalizeRangeByFrame = (
  frame: DateFrame | undefined,
  startKey: string,
  endKey: string,
): { endKey: string; startKey: string } => {
  const startDate = toDateValue(startKey);
  const endDate = toDateValue(endKey);

  // Keep chronological order even when inputs are swapped.
  const [minDate, maxDate] = startDate <= endDate ? [startDate, endDate] : [endDate, startDate];

  switch (frame) {
    case 'year':
      // Expand to full years.
      return {
        endKey: endOfYear(maxDate).toISOString(),
        startKey: startOfYear(minDate).toISOString(),
      };

    case 'month':
      // Expand to full months.
      return {
        endKey: endOfMonth(maxDate).toISOString(),
        startKey: startOfMonth(minDate).toISOString(),
      };

    case 'day':
    case 'hours':
    default:
      // Expand to full days.
      return {
        endKey: endOfDay(maxDate).toISOString(),
        startKey: startOfDay(minDate).toISOString(),
      };
  }
};

/** Read a nested value using dot notation (e.g. "a.b.c"). */
const getNestedValue = <T>(obj: T, path: string): unknown => {
  if (!path) return undefined;
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

type FieldAggregate = 'sum' | 'count' | 'min' | 'max' | 'average' | 'custom';

export type AggregateFieldConfig<T> = {
  [fieldKey: string]: {
    aggregate: FieldAggregate;
    initialValue?: number;
    sourceKey: DeepKeys<T>;
  };
};

interface Props<T extends Obj> {
  strategy: T;
}

export function createTimelineStrategy<T extends Obj, S extends StrategyConfig<T>>({
  strategy,
}: Props<S>): StrategyReturnType<T, S> {
  const { dateKeyField, framesConfig, metrics } = strategy;

  const computeAggregate = (aggregate: Aggregate, values: number[]): number => {
    if (values.length === 0) {
      return 0;
    }
    const nonZeroValues = values.filter((v) => v !== 0);
    switch (aggregate) {
      case 'count':
        return values.length;
      case 'sum':
        return values.reduce((acc, curr) => acc + curr, 0);
      case 'average':
        return values.reduce((acc, curr) => acc + curr, 0) / nonZeroValues.length || 0;
      case 'min':
        return values.reduce((acc, curr) => Math.min(acc, curr), values[0] ?? 0);
      case 'max':
        return values.reduce((acc, curr) => Math.max(acc, curr), values[0] ?? 0);
      default:
        return 0;
    }
  };

  const computeStatsByFrame = (data: T[], frame: DateFrame, fieldsToAggregate: S['metrics']): ComputedStats<S>[] => {
    const firstItem = data[0];
    const lastItem = data[data.length - 1];
    if (!firstItem || !lastItem) return [];

    const startDate = toDateValue(firstItem[dateKeyField]);
    const endDate = toDateValue(lastItem[dateKeyField]);

    const periods = (() => {
      switch (frame) {
        case 'year':
          return eachYearOfInterval({ end: endDate, start: startDate });
        case 'month':
          return eachMonthOfInterval({ end: endDate, start: startDate });
        case 'day':
          return eachDayOfInterval({ end: endDate, start: startDate });
        case 'hours':
          return eachHourOfInterval({ end: endDate, start: startDate });
        default:
          return [];
      }
    })();

    /** Format the frame key for display based on the selected frame type.
     *  For example, for "month" frame, format as "MMMM-yyyy" (e.g. "January-2023"), for "year" frame, format as "yyyy", etc.
     *  This formatted key will be used as the dateKeyField value in the computed stats, so it should be unique and consistent with the frame type.
     */
    const formatFrameKey = (date: Date): string => {
      switch (frame) {
        case 'year':
          return format(date, 'yyyy');
        case 'month': {
          const yearString = format(date, 'yyyy');
          return `${format(date, 'MMMM')}-${yearString}`;
        }
        case 'day':
          return format(date, 'dd-MMMM-yyyy');
        case 'hours':
          return format(date, 'dd-MMMM-yyyy HH:00');
        default:
          return date.toISOString();
      }
    };

    return periods.map((period) => {
      const frameData = data.filter((item) => isSameFrame(String(item[dateKeyField]), period.toString(), frame));

      const aggregatedFields = Object.entries(fieldsToAggregate).reduce((acc, [fieldKey, info]) => {
        const values = frameData.map((item) => Number(getNestedValue(item, info.sourceKey)) || 0);
        acc[fieldKey as keyof S['metrics']] = computeAggregate(info.aggregate, values);
        return acc;
      }, {} as AdditionalFieldType<keyof S['metrics']>);

      return {
        ...aggregatedFields,
        [strategy.dateKeyField]: formatFrameKey(period),
      } as ComputedStats<S>;
    });
  };

  return {
    /** Compute one metric from already computed frame stats.
     *  The key corresponds to the additional field to aggregate (e.g. "totalSales"), and the aggregate type is defined in the strategy config for this field (e.g. "sum" or "average").
     *  The metric is computed across all frames in the current range, so it can be used for overall totals or averages.
     */
    computeMetric(data: ComputedStats<S>[], key: keyof S['metrics'], aggregate?: Aggregate) {
      const field = metrics[key as keyof typeof metrics];

      if (!field) return undefined;

      const valuesToAggregate = data.map((d) => Number(getNestedValue(d, key as string)) || 0);

      return {
        key: key,
        label: field.label,
        value: computeAggregate(aggregate || field.aggregate, valuesToAggregate),
        valueType: field.valueType,
      };
    },

    /** Aggregate data per selected frame period. */
    computeStatsByFrame(data: T[], frame?: DateFrame) {
      if (data.length === 0) return [];

      // Per default, if not specified, use the strategy's default frame or fallback to "day" if strategy doesn't support frames.
      const effectiveFrame: DateFrame = frame ?? framesConfig?.defaultFrame ?? 'day';

      const fieldsToAggregate = metrics;

      return computeStatsByFrame(data, effectiveFrame, fieldsToAggregate);
    },

    /** Format a key for UI display with frame-aware patterns.
     *  Different than formatFrameKey, used to format date to display it in the UI (e.g in the range display or tooltip)
     */
    formatKeyForDisplay(key: string, frame?: DateFrame) {
      const date = toDateValue(key);
      if (!isValid(date)) return key;

      const effectiveFrame = frame ?? framesConfig?.defaultFrame ?? 'day';
      const customFormat = framesConfig?.formatFrameToDisplay?.(date, effectiveFrame, format);

      switch (frame) {
        case 'year':
          return customFormat || format(date, 'yyyy', { locale: fr });
        case 'month':
          return customFormat || format(date, 'MMMM yyyy', { locale: fr });
        case 'day':
          return customFormat || format(date, 'dd MMMM yyyy', { locale: fr });
        case 'hours':
          return customFormat || format(date, 'dd MMMM yyyy HH:mm', { locale: fr });
        default:
          return customFormat || format(date, 'dd/MM/yyyy', { locale: fr });
      }
    },

    /** Format a metric value for display based on its type (e.g. price, percentage). */
    formatMetricValue(value: number, valueType) {
      switch (valueType) {
        case 'price':
          return `${value.toLocaleString()} €`;
        case 'percentage':
          return `${(value * 100).toLocaleString()} %`;
        case 'number':
        default:
          return value.toLocaleString();
      }
    },

    framesConfig,

    /** Return the full range covered by the dataset. */
    getInitialRange(data: T[]) {
      if (!data.length) {
        return { endKey: '', startKey: '' };
      }
      const firstItem = data[0];
      const lastItem = data[data.length - 1];
      if (!firstItem || !lastItem) {
        return { endKey: '', startKey: '' };
      }
      const firstDate = toDateValue(firstItem[dateKeyField]);
      const lastDate = toDateValue(lastItem[dateKeyField]);
      return {
        endKey: endOfDay(lastDate).toISOString(),
        startKey: startOfDay(firstDate).toISOString(),
      };
    },

    /** Get metric info (label and value type) by the metric key, based on the strategy config.
     *  Useful to get metric info because no aggregation is done
     */
    getMetricInfo(key: keyof S['metrics']) {
      const field = metrics[key as keyof typeof metrics];

      if (!field) {
        return {
          key,
          label: String(key),
          valueType: 'number',
        };
      }
      return {
        key,
        label: field.label,
        valueType: field.valueType,
      };
    },

    getMetrics(params: GetMetricsParam<keyof S['metrics']>): MetricInfoTyped<keyof S['metrics']>[] {
      let allMetrics = Object.entries(metrics).map(([key, field]) => ({
        key: key as keyof S['metrics'],
        label: field.label,
        valueType: field.valueType,
      }));

      // Apply sorting if specified
      // If sort is provided, sort all metrics based on the order of keys in the sort array
      const sort = params?.sort;
      if (sort) {
        allMetrics = allMetrics.sort((a, b) => {
          const indexA = sort.indexOf(a.key);
          const indexB = sort.indexOf(b.key);
          return indexA - indexB;
        });
      }

      const pick = params?.pick;
      if (pick) {
        // If pick is provided, filter metrics to include only those in the pick array and sort them based on the order in the pick array
        const allMetricSorted = allMetrics.sort((a, b) => {
          const indexA = pick.indexOf(a.key);
          const indexB = pick.indexOf(b.key);
          return indexA - indexB;
        });
        return allMetricSorted.filter((metric) => pick.includes(metric.key as keyof S['metrics']));
      }

      const exclude = params?.exclude;
      if (exclude) {
        // If exclude is provided, filter metrics to exclude those in the exclude array
        // Sorted by the sort array if provided, otherwise keep the original order
        return allMetrics.filter((metric) => exclude.includes(metric.key as keyof S['metrics']));
      }

      return allMetrics;
    },

    /** Return index bounds for items inside the time range. */
    getRangeIndexes(items: T[], startKey: string, endKey: string) {
      if (items.length === 0) {
        return { leftIndex: 0, rightIndex: -1 };
      }

      const startTime = toDateValue(startKey).getTime();
      const endTime = toDateValue(endKey).getTime();

      // First item inside or after range start.
      const leftIndex = items.findIndex((item: T) => toDateValue(item[dateKeyField]).getTime() >= startTime);

      // Last item inside or before range end.
      const rightIndex = items.findLastIndex((item: T) => toDateValue(item[dateKeyField]).getTime() <= endTime);

      return {
        leftIndex: leftIndex === -1 ? 0 : leftIndex,
        rightIndex: rightIndex === -1 ? items.length - 1 : rightIndex,
      };
    },

    /** Normalize range keys to the selected frame bounds. */
    normalizeRange(startKey: string, endKey: string, frame?: DateFrame) {
      return normalizeRangeByFrame(frame, startKey, endKey);
    },
  };
}
