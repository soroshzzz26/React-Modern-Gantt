/**
 * Core utility functions for the Gantt chart
 */
import { Task, TaskGroup, DateDisplayFormat } from "./utils/types";
/**
 * Formats a date to display just the month
 * @param date The date to format
 * @param locale Optional locale string (default is user's locale)
 */
export declare function formatMonth(date: Date, locale?: string): string;
/**
 * Format date according to specified format
 * @param date The date to format
 * @param format The desired format (from DateDisplayFormat enum)
 * @param locale Optional locale string
 */
export declare function formatDate(date: Date, format?: DateDisplayFormat, locale?: string): string;
/**
 * Gets an array of months between two dates
 * @param startDate The beginning date
 * @param endDate The ending date
 */
export declare function getMonthsBetween(startDate: Date, endDate: Date): Date[];
/**
 * Get days in a specific month
 * @param year The year
 * @param month The month (0-11)
 */
export declare function getDaysInMonth(year: number, month: number): number;
/**
 * Get standard day markers for timeline (1, 8, 15, 22, 29)
 * Can be customized for different week markers
 */
export declare function getStandardDayMarkers(): number[];
/**
 * Calculates the position and width of a task in percentage
 * @param task The task to position
 * @param startDate The timeline start date
 * @param endDate The timeline end date
 */
export declare function calculateTaskPosition(task: Task, startDate: Date, endDate: Date): {
    left: string;
    width: string;
};
/**
 * Detects task overlaps and organizes them into rows
 * @param tasks Array of tasks to analyze for overlaps
 */
export declare function detectTaskOverlaps(tasks: Task[]): Task[][];
/**
 * Finds the earliest start date from all tasks
 * @param taskGroups Array of task groups to analyze
 */
export declare function findEarliestDate(taskGroups: TaskGroup[]): Date;
/**
 * Finds the latest end date from all tasks
 * @param taskGroups Array of task groups to analyze
 */
export declare function findLatestDate(taskGroups: TaskGroup[]): Date;
/**
 * Formats a date range as a string
 * @param startDate The start date
 * @param endDate The end date
 */
export declare function formatDateRange(startDate: Date, endDate: Date, locale?: string): string;
/**
 * Calculate the duration in days between two dates
 * @param startDate The start date
 * @param endDate The end date
 */
export declare function calculateDuration(startDate: Date, endDate: Date): number;
