import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import type {
  AdditionalFieldInfo,
  Aggregate,
  ComputedStats,
  FramesConfig,
  Obj,
  StatsRange,
  StrategyConfig,
  StrategyReturnType,
} from './StatsStrategies/strategy.types';
import type { DateFrame } from '../utils/dates';

type DataConfig<DATA extends Obj, STRATEGY_CONFIG extends StrategyConfig<DATA>> = {
  /** Data transformed according to the strategy (e.g. aggregated by frame) */
  dataByFrame: ComputedStats<STRATEGY_CONFIG>[];
  /** Original data sliced by the current range (without transformation) */
  dataByRange: DATA[];
};

type RangeConfig = {
  /** Callback to change the range */
  onRangeChange: (params: { endKey: string; startKey: string }) => void;
  /** Current range (indices + keys) */
  range: StatsRange;
  /** Reset the range to its initial value */
  resetRange: () => void;
};

/**
 * Value exposed by the Stats context.
 * @template T - Type of data items
 */
export type StatContextValue<DATA extends Obj, S extends StrategyConfig<DATA>> = {
  dataContext: DataConfig<DATA, S>;
  /** Frames configuration (if supported by the strategy) */
  frames?: FramesConfig;
  getMetric: (key: keyof S['metrics'], aggregate?: Aggregate) => AdditionalFieldInfo<keyof S['metrics']> | undefined;
  metrics?: Record<string, number>;
  rangeContext: RangeConfig;
  /** Strategy used */
  strategy: StrategyReturnType<DATA, S>;
};

/** React context for stats data and chart configuration. */
export const StatsContext = createContext<StatContextValue<Obj, StrategyConfig<Obj>> | null>(null);

/** Hook to access stats context with proper typing. */
export const useStatContext = <DATA extends Obj, STRAT extends StrategyConfig<DATA>>() => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStatContext must be used within a StatsProvider');
  }
  return context as unknown as StatContextValue<DATA, STRAT>;
};

/**
 * Props for StatsProvider.
 * @template T - Type of data items
 * @template OUTPUT - Type of transformed data
 */
type StatsProviderProps<DATA extends Obj, STRATEGY_CONFIG extends StrategyConfig<DATA>> = {
  /** Raw data */
  data: DATA[];
  /** Data management strategy */
  strategy: StrategyReturnType<DATA, STRATEGY_CONFIG>;
} & PropsWithChildren;

/**
 * Generic statistics provider.
 *
 * Uses a strategy to handle different types of data:
 * - Timeline: temporal data with frames (year, month, day, hours)
 * - Category: categorical data (strings)
 *
 * @example
 * ```tsx
 * import { createTimelineStrategy } from './StatsStrategies';
 *
 * const strategy = createTimelineStrategy<{ date: string; orders: number }>();
 *
 * <StatsProvider
 *   data={data}
 *   strategy={strategy}
 *   dateFrames={{ defaultFrame: 'month', frames: ['year', 'month', 'day'] }}
 * >
 *   <MyChart />
 * </StatsProvider>
 * ```
 */
export default function StatsProvider<DATA extends Obj, STRATEGY_CONFIG extends StrategyConfig<DATA>>({
  children,
  data: initialDataFromProps,
  strategy,
}: StatsProviderProps<DATA, STRATEGY_CONFIG>) {
  const data = useMemo(() => initialDataFromProps, [initialDataFromProps]);

  const hasFramesConfig = Boolean(strategy.framesConfig);
  const [frames] = useState<DateFrame[] | undefined>(strategy.framesConfig?.framesAvailable);
  const [currentFrame, setCurrentFrame] = useState<DateFrame | undefined>(strategy.framesConfig?.defaultFrame);

  // Store range as keys (ISO dates or strings depending on the strategy)
  const [rangeKeys, setRangeKeys] = useState<{ endKey: string; startKey: string }>(() => {
    const initialRange = strategy.getInitialRange(data);
    if (strategy.framesConfig?.defaultFrame) {
      return strategy.normalizeRange(initialRange.startKey, initialRange.endKey, strategy.framesConfig.defaultFrame);
    }
    return initialRange;
  });

  // Get range indexes in the original data based on the current range keys
  const rangeIndexes = useMemo(
    () => strategy.getRangeIndexes(data, rangeKeys.startKey, rangeKeys.endKey),
    [data, rangeKeys, strategy],
  );

  // Slice original data by range to get only relevant items for the charts and metrics computation
  const dataByRange = useMemo(() => {
    return data.slice(rangeIndexes.leftIndex, rangeIndexes.rightIndex + 1);
  }, [data, rangeIndexes]);

  // Compute data according to the strategy (e.g. aggregate by frame)
  const dataByFrame = useMemo(
    () => strategy.computeStatsByFrame(dataByRange, currentFrame),
    [strategy, dataByRange, currentFrame],
  );

  /** Reset the range to its initial value */
  const resetRange = useCallback(() => {
    const initial = strategy.getInitialRange(data);
    if (hasFramesConfig && currentFrame) {
      setRangeKeys(strategy.normalizeRange(initial.startKey, initial.endKey, currentFrame));
    } else {
      setRangeKeys(initial);
    }
  }, [strategy, data, currentFrame, hasFramesConfig]);

  // Update the selected range; normalize keys when frames are enabled.
  const onRangeChange = useCallback(
    ({ endKey, startKey }: { endKey: string; startKey: string }) => {
      if (hasFramesConfig) {
        const normalized = strategy.normalizeRange(startKey, endKey, currentFrame);
        setRangeKeys(normalized);
      } else {
        setRangeKeys({ endKey, startKey });
      }
    },
    [strategy, currentFrame, hasFramesConfig],
  );

  // When frame changes, re-normalize the existing range to fit the new frame
  useEffect(() => {
    if (hasFramesConfig && currentFrame) {
      setRangeKeys((prev) => strategy.normalizeRange(prev.startKey, prev.endKey, currentFrame));
    }
  }, [currentFrame, strategy, hasFramesConfig]);

  // Frames config to provide to children components (like frame selector or charts)
  const framesConfig: FramesConfig | undefined =
    hasFramesConfig && frames && currentFrame
      ? {
          currentFrame,
          frames: frames,
          setCurrentFrame,
        }
      : undefined;

  // Compute a metric from the already computed frame data.
  const computeMetric = useCallback(
    (key: keyof STRATEGY_CONFIG['metrics'], aggregate?: Aggregate) => {
      if (!strategy.computeMetric) return undefined;
      return strategy.computeMetric(dataByFrame, key, aggregate);
    },
    [strategy, dataByFrame],
  );

  const value: StatContextValue<DATA, STRATEGY_CONFIG> = {
    dataContext: {
      dataByFrame,
      dataByRange,
    },
    frames: framesConfig,
    getMetric: computeMetric,
    rangeContext: {
      onRangeChange,
      range: {
        ...rangeIndexes,
        endKey: rangeKeys.endKey,
        startKey: rangeKeys.startKey,
      },
      resetRange,
    },
    strategy,
  };

  return <StatsContext.Provider value={value as unknown as StatContextValue<Obj, StrategyConfig<Obj>>}>{children}</StatsContext.Provider>;
}
