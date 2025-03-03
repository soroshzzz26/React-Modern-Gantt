/**
 * Date utility functions for Gantt chart components
 */

/**
 * Gets the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Format a date according to specified format
 */
export function formatDate(date: Date, format: string = "default"): string {
    switch (format) {
        case "month-year":
            return date.toLocaleDateString("default", { month: "short", year: "2-digit" });
        case "full":
            return date.toLocaleDateString("default", { year: "numeric", month: "long", day: "numeric" });
        case "iso":
            return date.toISOString().split("T")[0];
        case "month":
            return date.toLocaleDateString("default", { month: "short" });
        default:
            return date.toLocaleDateString();
    }
}

/**
 * Calculate the difference in days between two dates
 */
export function daysBetween(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Get the first day of the month for a date
 */
export function getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get the last day of the month for a date
 */
export function getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Check if two date ranges overlap
 */
export function dateRangesOverlap(startDate1: Date, endDate1: Date, startDate2: Date, endDate2: Date): boolean {
    return startDate1 < endDate2 && startDate2 < endDate1;
}

/**
 * Calculate the percentage position of a date within a date range
 */
export function getDatePositionPercentage(date: Date, rangeStart: Date, rangeEnd: Date): number {
    const totalRange = rangeEnd.getTime() - rangeStart.getTime();
    const position = date.getTime() - rangeStart.getTime();
    return (position / totalRange) * 100;
}
