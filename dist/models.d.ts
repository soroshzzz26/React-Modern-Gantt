/**
 * Core data models for the simplified Gantt chart
 */
/// <reference types="react" />
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
export interface GanttTheme {
    headerBackground?: string;
    headerText?: string;
    backgroundHighlight?: string;
    borderColor?: string;
    todayMarkerColor?: string;
}
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
export declare enum DateDisplayFormat {
    MONTH_YEAR = "month-year",
    FULL_DATE = "full-date",
    SHORT_DATE = "short-date"
}
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
export declare function findEarliestDate(people: Person[]): Date;
/**
 * Finds the latest end date from all tasks
 */
export declare function findLatestDate(people: Person[]): Date;
