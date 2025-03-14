import { DateDisplayFormat, ViewMode } from "../types";
/**
 * Formats a date to display just the month
 */
export declare function formatMonth(date: Date, locale?: string): string;
/**
 * Format date according to specified format
 */
export declare function formatDate(date: Date, format?: DateDisplayFormat, locale?: string): string;
/**
 * Gets an array of months between two dates
 */
export declare function getMonthsBetween(startDate: Date, endDate: Date): Date[];
/**
 * Get days in a specific month
 */
export declare function getDaysInMonth(year: number, month: number): number;
/**
 * Calculate the duration between two dates
 */
export declare function getDuration(start: Date, end: Date, viewMode?: ViewMode): {
    value: number;
    unit: string;
};
/**
 * Formats a date range as a string
 */
export declare function formatDateRange(startDate: Date, endDate: Date, locale?: string): string;
/**
 * Calculate the duration in days between two dates
 */
export declare function calculateDuration(startDate: Date, endDate: Date): number;
