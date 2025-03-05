/**
 * Core utility functions for the Gantt chart
 */
import { Task, TaskGroup, GanttTheme, DateDisplayFormat } from "./utils/types";
export declare const DEFAULT_THEME: GanttTheme;
/**
 * Formats a date to display just the month
 */
export declare function formatMonth(date: Date): string;
/**
 * Format date according to specified format
 */
export declare function formatDate(date: Date, format?: DateDisplayFormat): string;
/**
 * Gets an array of months between two dates
 */
export declare function getMonthsBetween(startDate: Date, endDate: Date): Date[];
/**
 * Get days in month
 */
export declare function getDaysInMonth(year: number, month: number): number;
/**
 * Get standard day markers for timeline (1, 8, 15, 22, 29)
 */
export declare function getStandardDayMarkers(): number[];
/**
 * Calculates the position and width of a task in percentage
 */
export declare function calculateTaskPosition(task: Task, startDate: Date, endDate: Date): {
    left: string;
    width: string;
};
/**
 * Detects task overlaps and organizes them into rows
 */
export declare function detectTaskOverlaps(tasks: Task[]): Task[][];
/**
 * Finds the earliest start date from all tasks
 */
export declare function findEarliestDate(taskGroups: TaskGroup[]): Date;
/**
 * Finds the latest end date from all tasks
 */
export declare function findLatestDate(taskGroups: TaskGroup[]): Date;
