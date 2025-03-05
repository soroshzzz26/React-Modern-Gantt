/**
 * Core data models for the simplified Gantt chart
 */

// Basic types
export interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
    percent?: number;
    dependencies?: string[];
}

export interface Person {
    id: string;
    name: string;
    role?: string;
    avatar?: string;
    tasks: Task[];
}

// Theme configuration
export interface GanttTheme {
    headerBackground?: string;
    headerText?: string;
    backgroundHighlight?: string;
    borderColor?: string;
    todayMarkerColor?: string;
}

// Component props
export interface GanttChartProps {
    people: Person[];
    startDate?: Date;
    endDate?: Date;
    title?: string;
    currentDate?: Date;
    showCurrentDateMarker?: boolean;
    todayLabel?: string;
    editMode?: boolean;
    theme?: GanttTheme;
    headerLabel?: string;
    showProgress?: boolean;
    onTaskUpdate?: (personId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, person: Person) => void;
}

export interface TaskRowProps {
    person: Person;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    onTaskUpdate: (personId: string, updatedTask: Task) => void;
}

export interface NameListProps {
    people: Person[];
    showAvatar?: boolean;
    showTaskCount?: boolean;
    theme?: GanttTheme;
}

export interface TimelineProps {
    startDate: Date;
    endDate: Date;
    columnWidth: number;
    theme?: GanttTheme;
    children?: React.ReactNode;
    scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

export enum DateDisplayFormat {
    MONTH_YEAR = "month-year",
    FULL_DATE = "full-date",
    SHORT_DATE = "short-date",
}

// Default theme
export const DEFAULT_THEME: GanttTheme = {
    headerBackground: "bg-white",
    headerText: "text-gray-700",
    backgroundHighlight: "bg-blue-50",
    borderColor: "border-gray-200",
    todayMarkerColor: "bg-red-500",
};

/**
 * Formats a date to display just the month
 */
export function formatMonth(date: Date): string {
    return date.toLocaleString("default", { month: "short" });
}

/**
 * Format date according to specified format
 */
export function formatDate(date: Date, format: DateDisplayFormat = DateDisplayFormat.FULL_DATE): string {
    switch (format) {
        case DateDisplayFormat.MONTH_YEAR:
            return date.toLocaleString("default", { month: "short", year: "2-digit" });
        case DateDisplayFormat.SHORT_DATE:
            return date.toLocaleString("default", { month: "short", day: "numeric" });
        case DateDisplayFormat.FULL_DATE:
        default:
            return date.toLocaleString("default", { month: "short", day: "numeric", year: "numeric" });
    }
}

/**
 * Gets an array of months between two dates
 */
export function getMonthsBetween(startDate: Date, endDate: Date): Date[] {
    const months: Date[] = [];
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

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
 * Get days in month
 */
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Get standard day markers for timeline (1, 8, 15, 22, 29)
 */
export function getStandardDayMarkers(): number[] {
    return [1, 8, 15, 22, 29];
}

/**
 * Calculates the position and width of a task in percentage
 */
export function calculateTaskPosition(
    task: Task,
    startDate: Date,
    endDate: Date
): {
    left: string;
    width: string;
} {
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
 */
export function detectTaskOverlaps(tasks: Task[]): Task[][] {
    const rows: Task[][] = [];

    tasks.forEach(task => {
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
 */
export function findEarliestDate(people: Person[]): Date {
    let earliestDate = new Date();

    people.forEach(person => {
        person.tasks.forEach(task => {
            if (task.startDate < earliestDate) {
                earliestDate = new Date(task.startDate);
            }
        });
    });

    // Return first day of the month
    return new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
}

/**
 * Finds the latest end date from all tasks
 */
export function findLatestDate(people: Person[]): Date {
    let latestDate = new Date();

    people.forEach(person => {
        person.tasks.forEach(task => {
            if (task.endDate > latestDate) {
                latestDate = new Date(task.endDate);
            }
        });
    });

    // Return last day of the month
    return new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 0);
}
