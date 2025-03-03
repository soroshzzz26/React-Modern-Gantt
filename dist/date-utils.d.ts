/**
 * Date utility functions for Gantt chart components
 */
/**
 * Gets the number of days in a month
 */
export declare function getDaysInMonth(year: number, month: number): number;
/**
 * Format a date according to specified format
 */
export declare function formatDate(date: Date, format?: string): string;
/**
 * Calculate the difference in days between two dates
 */
export declare function daysBetween(startDate: Date, endDate: Date): number;
/**
 * Add days to a date
 */
export declare function addDays(date: Date, days: number): Date;
/**
 * Get the first day of the month for a date
 */
export declare function getFirstDayOfMonth(date: Date): Date;
/**
 * Get the last day of the month for a date
 */
export declare function getLastDayOfMonth(date: Date): Date;
/**
 * Check if two date ranges overlap
 */
export declare function dateRangesOverlap(startDate1: Date, endDate1: Date, startDate2: Date, endDate2: Date): boolean;
/**
 * Calculate the percentage position of a date within a date range
 */
export declare function getDatePositionPercentage(date: Date, rangeStart: Date, rangeEnd: Date): number;
