import { Task, ViewMode } from "@/types";
export declare class TaskService {
    /**
     * Calculate the new dates for a task based on pixel position
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
     * Check if two date ranges overlap
     */
    static datesOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean;
}
