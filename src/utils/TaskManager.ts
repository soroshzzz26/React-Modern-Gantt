import { Task, ViewMode } from "./types";
import {
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    differenceInQuarters,
    differenceInYears,
    addDays,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfQuarter,
    endOfQuarter,
    startOfYear,
    endOfYear,
    isWithinInterval,
} from "date-fns";

/**
 * TaskManager with ViewMode support
 *
 * Manages operations on tasks like calculating positions, dates, etc.
 * Supports different view modes (day, week, month, quarter, year)
 */
export class TaskManager {
    /**
     * Calculate the new dates for a task based on pixel position
     * Takes view mode into account
     */
    public static calculateDatesFromPosition(
        left: number,
        width: number,
        startDate: Date,
        endDate: Date,
        totalUnits: number,
        unitWidth: number,
        viewMode: ViewMode = ViewMode.MONTH
    ): { newStartDate: Date; newEndDate: Date } {
        try {
            // Make sure we're working with valid numbers
            const safeLeft = isNaN(left) ? 0 : left;
            const safeWidth = isNaN(width) || width < 20 ? 20 : width;

            // Calculate the time range of the entire timeline
            const timelineStartTime = startDate.getTime();
            const timelineEndTime = endDate.getTime();
            const timelineDuration = timelineEndTime - timelineStartTime;

            // Calculate milliseconds per pixel
            const msPerPixel = timelineDuration / (totalUnits * unitWidth);

            // Convert pixel position to time offsets
            const startOffset = safeLeft * msPerPixel;
            const durationMs = safeWidth * msPerPixel;

            // Create new Date objects from the calculated times
            let newStartDate = new Date(timelineStartTime + startOffset);
            let newEndDate = new Date(timelineStartTime + startOffset + durationMs);

            // Special handling for day view mode to ensure proper day boundaries
            if (viewMode === ViewMode.DAY) {
                // Set to the start of the day
                newStartDate = new Date(
                    newStartDate.getFullYear(),
                    newStartDate.getMonth(),
                    newStartDate.getDate(),
                    0,
                    0,
                    0,
                    0
                );

                // Set to the end of the day
                newEndDate = new Date(
                    newEndDate.getFullYear(),
                    newEndDate.getMonth(),
                    newEndDate.getDate(),
                    23,
                    59,
                    59,
                    999
                );
            } else {
                newStartDate = startOfDay(newStartDate);
                newEndDate = endOfDay(newEndDate);
            }

            // Ensure dates don't extend beyond the timeline boundaries
            if (newStartDate < startDate) {
                newStartDate = new Date(startDate);
            }

            if (newEndDate > endDate) {
                newEndDate = new Date(endDate);
            }

            return { newStartDate, newEndDate };
        } catch (error) {
            console.error("Error calculating dates from position:", error);
            return {
                newStartDate: new Date(startDate),
                newEndDate: new Date(endDate),
            };
        }
    }
    /**
     * Create an updated task with new dates
     */
    public static createUpdatedTask(task: Task, newStartDate: Date, newEndDate: Date): Task {
        // Create a clean copy with all original properties
        return {
            ...task,
            startDate: new Date(newStartDate),
            endDate: new Date(newEndDate),
        };
    }

    /**
     * Calculates position and width for a task in pixels
     * Takes view mode into account
     */
    public static calculateTaskPixelPosition(
        task: Task,
        startDate: Date,
        endDate: Date,
        totalUnits: number,
        unitWidth: number,
        viewMode: ViewMode = ViewMode.MONTH
    ): { leftPx: number; widthPx: number } {
        try {
            // Ensure we have valid dates
            if (!(task.startDate instanceof Date) || !(task.endDate instanceof Date)) {
                throw new Error("Invalid dates in task");
            }

            // Normalize dates based on view mode for consistent calculations
            let timelineStartTime = startDate.getTime();
            let timelineEndTime = endDate.getTime();
            let taskStartTime = Math.max(task.startDate.getTime(), startDate.getTime());
            let taskEndTime = Math.min(task.endDate.getTime(), endDate.getTime());

            // Apply special handling for day view mode
            if (viewMode === ViewMode.DAY) {
                // Ensure consistent day boundaries
                const startOfDayTime = new Date(startDate).setHours(0, 0, 0, 0);
                const endOfDayTime = new Date(endDate).setHours(23, 59, 59, 999);
                timelineStartTime = startOfDayTime;
                timelineEndTime = endOfDayTime;

                // Also normalize task times to day boundaries for proper alignment
                const taskStartDay = new Date(taskStartTime).setHours(0, 0, 0, 0);
                const taskEndDay = new Date(taskEndTime).setHours(23, 59, 59, 999);
                taskStartTime = taskStartDay;
                taskEndTime = taskEndDay;
            }

            // Calculate the full timeline range
            const totalTimelineRange = timelineEndTime - timelineStartTime;

            // Convert time differences to pixel positions
            const distanceFromStart = taskStartTime - timelineStartTime;
            const taskDuration = taskEndTime - taskStartTime;

            // Calculate percentages of total timeline
            const leftPercent = distanceFromStart / totalTimelineRange;
            const widthPercent = taskDuration / totalTimelineRange;

            // Calculate pixel positions
            const totalPixelWidth = totalUnits * unitWidth;
            let leftPx = leftPercent * totalPixelWidth;
            let widthPx = widthPercent * totalPixelWidth;

            // Add day view specific adjustments for proper alignment
            if (viewMode === ViewMode.DAY) {
                // Ensure tasks snap to day boundaries
                leftPx = Math.floor(leftPx / unitWidth) * unitWidth;

                // Ensure minimum day width and adjust to day boundaries
                widthPx = Math.max(unitWidth, Math.ceil(widthPx / unitWidth) * unitWidth);
            }

            // Apply view mode specific adjustments for minimum width
            // Different view modes should have different minimum visible widths
            const minWidthByViewMode = {
                [ViewMode.DAY]: 20, // Min width for day view
                [ViewMode.WEEK]: 20, // Min width for week view
                [ViewMode.MONTH]: 20, // Min width for month view
                [ViewMode.QUARTER]: 30, // Min width for quarter view
                [ViewMode.YEAR]: 40, // Min width for year view
            };

            // Ensure minimum width
            const minWidth = minWidthByViewMode[viewMode] || 20;
            widthPx = Math.max(minWidth, widthPx);

            // Ensure not extending beyond timeline
            const maxWidth = totalPixelWidth - leftPx;
            widthPx = Math.min(maxWidth, widthPx);

            return { leftPx, widthPx };
        } catch (error) {
            console.error("Error calculating task position:", error, task);
            // Return a default position as fallback
            return { leftPx: 0, widthPx: 20 };
        }
    }

    /**
     * Get live dates from element position during drag
     */
    public static getLiveDatesFromElement(
        taskEl: HTMLElement | null,
        startDate: Date,
        endDate: Date,
        totalUnits: number,
        unitWidth: number,
        viewMode: ViewMode = ViewMode.MONTH
    ): { startDate: Date; endDate: Date } {
        try {
            if (!taskEl) {
                return { startDate: new Date(startDate), endDate: new Date(endDate) };
            }

            const left = parseFloat(taskEl.style.left || "0");
            const width = parseFloat(taskEl.style.width || "0");

            const { newStartDate, newEndDate } = this.calculateDatesFromPosition(
                left,
                width,
                startDate,
                endDate,
                totalUnits,
                unitWidth,
                viewMode
            );

            return { startDate: newStartDate, endDate: newEndDate };
        } catch (error) {
            console.error("Error getting live dates:", error);
            return { startDate: new Date(startDate), endDate: new Date(endDate) };
        }
    }

    /**
     * Format a date for display
     */
    public static formatDate(date: Date, locale: string = "default", viewMode: ViewMode = ViewMode.MONTH): string {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return "Invalid date";
        }

        // Different formats based on view mode
        let options: Intl.DateTimeFormatOptions;

        switch (viewMode) {
            case ViewMode.DAY:
                options = { year: "numeric", month: "short", day: "numeric" };
                break;
            case ViewMode.WEEK:
                options = { year: "numeric", month: "short", day: "numeric" };
                break;
            case ViewMode.MONTH:
                options = { year: "numeric", month: "short", day: "numeric" };
                break;
            case ViewMode.QUARTER:
                options = { year: "numeric", month: "short" };
                break;
            case ViewMode.YEAR:
                options = { year: "numeric" };
                break;
            default:
                options = { year: "numeric", month: "short", day: "numeric" };
        }

        return date.toLocaleDateString(locale, options);
    }

    /**
     * Calculate duration between dates based on the view mode
     */
    public static getDuration(
        start: Date,
        end: Date,
        viewMode: ViewMode = ViewMode.MONTH
    ): { value: number; unit: string } {
        try {
            // Ensure dates are valid
            if (!(start instanceof Date) || !(end instanceof Date) || isNaN(start.getTime()) || isNaN(end.getTime())) {
                return { value: 0, unit: "days" };
            }

            // Handle dates in the wrong order
            const earlierDate = start < end ? start : end;
            const laterDate = start < end ? end : start;

            // Calculate based on view mode
            switch (viewMode) {
                case ViewMode.DAY:
                    const days = differenceInDays(laterDate, earlierDate) + 1;
                    return { value: days, unit: days === 1 ? "day" : "days" };

                case ViewMode.WEEK:
                    const weeks = differenceInWeeks(laterDate, earlierDate) + 1;
                    return { value: weeks, unit: weeks === 1 ? "week" : "weeks" };

                case ViewMode.MONTH:
                    const months = differenceInMonths(laterDate, earlierDate) + 1;
                    return { value: months, unit: months === 1 ? "month" : "months" };

                case ViewMode.QUARTER:
                    const quarters = differenceInQuarters(laterDate, earlierDate) + 1;
                    return { value: quarters, unit: quarters === 1 ? "quarter" : "quarters" };

                case ViewMode.YEAR:
                    const years = differenceInYears(laterDate, earlierDate) + 1;
                    return { value: years, unit: years === 1 ? "year" : "years" };

                default:
                    const defaultDays = differenceInDays(laterDate, earlierDate) + 1;
                    return { value: defaultDays, unit: defaultDays === 1 ? "day" : "days" };
            }
        } catch (error) {
            console.error("Error calculating duration:", error);
            return { value: 0, unit: "days" };
        }
    }

    /**
     * Check if two date ranges overlap
     */
    public static datesOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
        return (
            isWithinInterval(startA, { start: startB, end: endB }) ||
            isWithinInterval(endA, { start: startB, end: endB }) ||
            isWithinInterval(startB, { start: startA, end: endA }) ||
            isWithinInterval(endB, { start: startA, end: endA })
        );
    }
}
