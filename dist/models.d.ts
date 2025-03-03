/**
 * Core data models for the simplified Gantt chart
 */
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
    editMode?: boolean;
    theme?: GanttTheme;
    onTaskUpdate?: (personId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, person: Person) => void;
}
export declare const DEFAULT_THEME: GanttTheme;
/**
 * Formats a date to display just the month
 */
export declare function formatMonth(date: Date): string;
/**
 * Gets an array of months between two dates
 */
export declare function getMonthsBetween(startDate: Date, endDate: Date): Date[];
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
