import { Task, ViewMode } from "./types";
/**
 * TaskManager with ViewMode support
 *
 * Manages operations on tasks like calculating positions, dates, etc.
 * Supports different view modes (day, week, month, quarter, year)
 */
export declare class TaskManager {
    /**
     * Calculate the new dates for a task based on pixel position
     * Takes view mode into account
     */
    static calculateDatesFromPosition(left: number, width: number, startDate: Date, endDate: Date, totalUnits: number, unitWidth: number, viewMode?: ViewMode): {
        newStartDate: Date;
        newEndDate: Date;
    };
    /**
     * Create an updated task with new dates
     */
    static createUpdatedTask(task: Task, newStartDate: Date, newEndDate: Date): Task;
    /**
     * Calculates position and width for a task in pixels
     * Takes view mode into account
     */
    static calculateTaskPixelPosition(task: Task, startDate: Date, endDate: Date, totalUnits: number, unitWidth: number, viewMode?: ViewMode): {
        leftPx: number;
        widthPx: number;
    };
    /**
     * Get live dates from element position during drag
     */
    static getLiveDatesFromElement(taskEl: HTMLElement | null, startDate: Date, endDate: Date, totalUnits: number, unitWidth: number, viewMode?: ViewMode): {
        startDate: Date;
        endDate: Date;
    };
    /**
     * Format a date for display
     */
    static formatDate(date: Date, locale?: string, viewMode?: ViewMode): string;
    /**
     * Calculate duration between dates based on the view mode
     */
    static getDuration(start: Date, end: Date, viewMode?: ViewMode): {
        value: number;
        unit: string;
    };
    /**
     * Check if two date ranges overlap
     */
    static datesOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean;
}
