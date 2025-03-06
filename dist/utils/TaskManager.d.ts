import { Task } from "./types";
/**
 * Manages operations on tasks like calculating positions, dates, etc.
 */
export declare class TaskManager {
    /**
     * Calculate the new dates for a task based on pixel position
     */
    static calculateDatesFromPosition(left: number, width: number, startDate: Date, endDate: Date, totalMonths: number, monthWidth: number): {
        newStartDate: Date;
        newEndDate: Date;
    };
    /**
     * Create an updated task with new dates
     */
    static createUpdatedTask(task: Task, newStartDate: Date, newEndDate: Date): Task;
    /**
     * Calculates position and width for a task in pixels
     */
    static calculateTaskPixelPosition(task: Task, startDate: Date, endDate: Date, totalMonths: number, monthWidth: number): {
        leftPx: number;
        widthPx: number;
    };
    /**
     * Get live dates from element position during drag
     */
    static getLiveDatesFromElement(taskEl: HTMLElement | null, startDate: Date, endDate: Date, totalMonths: number, monthWidth: number): {
        startDate: Date;
        endDate: Date;
    };
    /**
     * Format a date for display
     */
    static formatDate(date: Date, locale?: string): string;
    /**
     * Calculate duration between dates in days
     */
    static getDuration(start: Date, end: Date): number;
    /**
     * Get month name (formatted)
     */
    static getMonthName(date: Date, locale?: string): string;
    /**
     * Get days in month
     */
    static getDaysInMonth(date: Date): number;
    /**
     * Check if two date ranges overlap
     */
    static datesOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean;
}
