import {
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

export function getDateFrames(dateString: string): string[] {
  const frames = [];

  if (/\d{4}/.test(dateString)) frames.push('year');
  if (/-(\d{2})/.test(dateString)) frames.push('month');
  if (/\d{4}-\d{2}-\d{2}/.test(dateString)) frames.push('day');
  if (/T\d{2}/.test(dateString)) frames.push('hours');
  if (/T\d{2}:\d{2}/.test(dateString)) frames.push('minutes');

  return frames;
}

export type DateFrame = 'year' | 'month' | 'day' | 'hours' | 'minutes';
export const isSameFrame = (date1: string, date2: string, frame: DateFrame): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  switch (frame) {
    case 'year':
      return d1.getFullYear() === d2.getFullYear();
    case 'month':
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
    case 'day':
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    case 'hours':
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate() &&
        d1.getHours() === d2.getHours()
      );
    case 'minutes':
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate() &&
        d1.getHours() === d2.getHours() &&
        d1.getMinutes() === d2.getMinutes()
      );
    default:
      return false;
  }
};

/** Safely parse a date string or Date object */
export const toDateValue = (value: string | Date | undefined | null): Date => {
  if (!value) {
    return new Date();
  }
  if (value instanceof Date) {
    return value;
  }
  // Try ISO parse first
  const isoDate = parseISO(value);
  if (isValid(isoDate)) {
    return isoDate;
  }
  // Fallback to native Date constructor
  return new Date(value);
};

/** Format a Date to YYYY-MM-DD string */
export const toDateKey = (date: Date): string => {
  if (!isValid(date)) {
    return '';
  }
  return format(date, 'yyyy-MM-dd');
};

/**
 * Normalize a date range based on frame type.
 * Expands to full period boundaries and returns ISO strings with time.
 * - year:  Jan 1 00:00:00 → Dec 31 23:59:59
 * - month: 1st 00:00:00 → last day 23:59:59
 * - day/hours: start of day 00:00:00 → end of day 23:59:59
 */
export const normalizeRangeByFrame = (
  frame: DateFrame | undefined,
  start: string | Date,
  end: string | Date,
): { endDate: string; startDate: string } => {
  const startDate = toDateValue(start);
  const endDate = toDateValue(end);

  if (!isValid(startDate) || !isValid(endDate)) {
    return { endDate: endDate.toISOString(), startDate: startDate.toISOString() };
  }

  const [minDate, maxDate] = startDate <= endDate ? [startDate, endDate] : [endDate, startDate];

  switch (frame) {
    case 'year':
      return {
        endDate: endOfYear(maxDate).toISOString(),
        startDate: startOfYear(minDate).toISOString(),
      };
    case 'month':
      return {
        endDate: endOfMonth(maxDate).toISOString(),
        startDate: startOfMonth(minDate).toISOString(),
      };
    case 'day':
    case 'hours':
    default:
      return {
        endDate: endOfDay(maxDate).toISOString(),
        startDate: startOfDay(minDate).toISOString(),
      };
  }
};
