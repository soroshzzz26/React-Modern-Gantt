/**
 * Core data types for React Modern Gantt
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
export interface TaskGroup {
    id: string;
    name: string;
    description?: string;
    icon?: string;
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
    tasks: TaskGroup[];
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
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
    onTaskDoubleClick?: (task: Task) => void;
    onTaskDelete?: (task: Task) => void | boolean | Promise<any>;
    onTaskDateChange?: (task: Task, tasks: Task[]) => void | boolean | Promise<any>;
    onTaskProgressChange?: (task: Task, tasks: Task[]) => void | boolean | Promise<any>;
    fontSize?: string;
    rowHeight?: number;
    timeStep?: number;
    children?: React.ReactNode;
}
export interface TaskRowProps {
    taskGroup: TaskGroup;
    startDate: Date;
    endDate: Date;
    totalMonths: number;
    monthWidth: number;
    editMode?: boolean;
    showProgress?: boolean;
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
}
export interface TaskListProps {
    tasks: TaskGroup[];
    headerLabel?: string;
    showIcon?: boolean;
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
