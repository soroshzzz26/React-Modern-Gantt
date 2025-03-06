/**
 * Core utility functions for the Gantt chart
 */
import { Task, TaskGroup, DateDisplayFormat } from "./utils/types";

/**
 * Formats a date to display just the month
 * @param date The date to format
 * @param locale Optional locale string (default is user's locale)
 */
export function formatMonth(date: Date, locale = "default"): string {
    return date.toLocaleString(locale, { month: "short" });
}

/**
 * Format date according to specified format
 * @param date The date to format
 * @param format The desired format (from DateDisplayFormat enum)
 * @param locale Optional locale string
 */
export function formatDate(
    date: Date,
    format: DateDisplayFormat = DateDisplayFormat.FULL_DATE,
    locale = "default"
): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return "Invalid date";
    }

    switch (format) {
        case DateDisplayFormat.MONTH_YEAR:
            return date.toLocaleString(locale, { month: "short", year: "2-digit" });
        case DateDisplayFormat.SHORT_DATE:
            return date.toLocaleString(locale, { month: "short", day: "numeric" });
        case DateDisplayFormat.FULL_DATE:
        default:
            return date.toLocaleString(locale, { month: "short", day: "numeric", year: "numeric" });
    }
}

/**
 * Gets an array of months between two dates
 * @param startDate The beginning date
 * @param endDate The ending date
 */
export function getMonthsBetween(startDate: Date, endDate: Date): Date[] {
    const months: Date[] = [];

    // Ensure valid dates
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        console.warn("getMonthsBetween: Invalid date parameters");
        return [new Date()];
    }

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    // Iterate through years and months
    for (let year = startYear; year <= endYear; year++) {
        const monthStart = year === startYear ? startMonth : 0;
        const monthEnd = year === endYear ? endMonth : 11;

        for (let month = monthStart; month <= monthEnd; month++) {
            months.push(new Date(year, month, 1));
        }
    }

    return months;
}

/**
 * Get days in a specific month
 * @param year The year
 * @param month The month (0-11)
 */
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Get standard day markers for timeline (1, 8, 15, 22, 29)
 * Can be customized for different week markers
 */
export function getStandardDayMarkers(): number[] {
    return [1, 8, 15, 22, 29];
}

/**
 * Calculates the position and width of a task in percentage
 * @param task The task to position
 * @param startDate The timeline start date
 * @param endDate The timeline end date
 */
export function calculateTaskPosition(
    task: Task,
    startDate: Date,
    endDate: Date
): {
    left: string;
    width: string;
} {
    // Ensure valid dates
    if (!(task.startDate instanceof Date) || !(task.endDate instanceof Date)) {
        console.warn("calculateTaskPosition: Invalid task dates", task);
        return { left: "0%", width: "10%" };
    }

    // Normalize dates to first day of month
    const timelineStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const timelineEnd = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0); // Last day of end month

    // Calculate total months
    const months = getMonthsBetween(timelineStart, timelineEnd);
    const totalMonths = months.length;

    // Calculate task start position
    const taskStartYear = task.startDate.getFullYear();
    const taskStartMonth = task.startDate.getMonth();
    const taskStartMonthIndex = months.findIndex(
        date => date.getFullYear() === taskStartYear && date.getMonth() === taskStartMonth
    );

    // If task starts before timeline, clamp to timeline start
    const adjustedStartIndex = taskStartMonthIndex < 0 ? 0 : taskStartMonthIndex;

    // Calculate task end position
    const taskEndYear = task.endDate.getFullYear();
    const taskEndMonth = task.endDate.getMonth();
    const taskEndMonthIndex = months.findIndex(
        date => date.getFullYear() === taskEndYear && date.getMonth() === taskEndMonth
    );

    // If task ends after timeline, clamp to timeline end
    const adjustedEndIndex = taskEndMonthIndex < 0 ? months.length - 1 : taskEndMonthIndex;

    // Calculate percentage positions
    // Add 1 to width to make tasks include their full end month
    const leftPercent = (adjustedStartIndex / totalMonths) * 100;
    const widthPercent = ((adjustedEndIndex - adjustedStartIndex + 1) / totalMonths) * 100;

    return {
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
    };
}

/**
 * Detects task overlaps and organizes them into rows
 * @param tasks Array of tasks to analyze for overlaps
 */
export function detectTaskOverlaps(tasks: Task[]): Task[][] {
    // Validate input
    if (!Array.isArray(tasks)) {
        console.warn("detectTaskOverlaps: Invalid tasks array");
        return [];
    }

    // Filter out tasks with invalid dates
    const validTasks = tasks.filter(task => task && task.startDate instanceof Date && task.endDate instanceof Date);

    if (validTasks.length === 0) {
        return [];
    }

    const rows: Task[][] = [];

    validTasks.forEach(task => {
        let placed = false;

        // Check each existing row for collisions
        for (let i = 0; i < rows.length; i++) {
            // A task can be placed in this row if it doesn't overlap with ANY task in the row
            const hasCollision = rows[i].some(existingTask => {
                // Check if date ranges overlap
                return !(task.startDate >= existingTask.endDate || task.endDate <= existingTask.startDate);
            });

            // If no collision in this row, place the task here
            if (!hasCollision) {
                rows[i].push(task);
                placed = true;
                break;
            }
        }

        // If task couldn't be placed in any existing row, create a new row
        if (!placed) {
            rows.push([task]);
        }
    });

    return rows;
}

/**
 * Finds the earliest start date from all tasks
 * @param taskGroups Array of task groups to analyze
 */
export function findEarliestDate(taskGroups: TaskGroup[]): Date {
    if (!Array.isArray(taskGroups) || taskGroups.length === 0) {
        return new Date();
    }

    let earliestDate = new Date();
    let foundAnyValidDate = false;

    taskGroups.forEach(group => {
        if (!group || !Array.isArray(group.tasks)) return;

        group.tasks.forEach(task => {
            if (task && task.startDate instanceof Date) {
                // If this is the first valid date, use it directly
                if (!foundAnyValidDate) {
                    earliestDate = new Date(task.startDate);
                    foundAnyValidDate = true;
                }
                // Otherwise, compare with current earliest
                else if (task.startDate < earliestDate) {
                    earliestDate = new Date(task.startDate);
                }
            }
        });
    });

    // If we didn't find any valid dates, return today - 1 month
    if (!foundAnyValidDate) {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth() - 1, 1);
    }

    // Return first day of the month
    return new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
}

/**
 * Finds the latest end date from all tasks
 * @param taskGroups Array of task groups to analyze
 */
export function findLatestDate(taskGroups: TaskGroup[]): Date {
    if (!Array.isArray(taskGroups) || taskGroups.length === 0) {
        return new Date();
    }

    let latestDate = new Date();
    let foundAnyValidDate = false;

    taskGroups.forEach(group => {
        if (!group || !Array.isArray(group.tasks)) return;

        group.tasks.forEach(task => {
            if (task && task.endDate instanceof Date) {
                // If this is the first valid date, use it directly
                if (!foundAnyValidDate) {
                    latestDate = new Date(task.endDate);
                    foundAnyValidDate = true;
                }
                // Otherwise, compare with current latest
                else if (task.endDate > latestDate) {
                    latestDate = new Date(task.endDate);
                }
            }
        });
    });

    // If we didn't find any valid dates, return today + 2 months
    if (!foundAnyValidDate) {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth() + 2, 0);
    }

    // Return last day of the month
    return new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 0);
}

/**
 * Formats a date range as a string
 * @param startDate The start date
 * @param endDate The end date
 */
export function formatDateRange(startDate: Date, endDate: Date, locale = "default"): string {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        return "Invalid date range";
    }

    const start = formatDate(startDate, DateDisplayFormat.SHORT_DATE, locale);
    const end = formatDate(endDate, DateDisplayFormat.SHORT_DATE, locale);

    return `${start} - ${end}`;
}

/**
 * Calculate the duration in days between two dates
 * @param startDate The start date
 * @param endDate The end date
 */
export function calculateDuration(startDate: Date, endDate: Date): number {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        return 0;
    }

    // Handle dates in the wrong order
    if (startDate > endDate) {
        [startDate, endDate] = [endDate, startDate];
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
