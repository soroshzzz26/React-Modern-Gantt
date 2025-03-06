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
export interface GanttChartProps {
    tasks: TaskGroup[];
    startDate?: Date;
    endDate?: Date;
    title?: string;
    currentDate?: Date;
    showCurrentDateMarker?: boolean;
    todayLabel?: string;
    editMode?: boolean;
    headerLabel?: string;
    showProgress?: boolean;
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
    onTaskDoubleClick?: (task: Task) => void;
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
}
export interface TimelineProps {
    months: Date[];
    currentMonthIndex: number;
}
export declare enum DateDisplayFormat {
    MONTH_YEAR = "month-year",
    FULL_DATE = "full-date",
    SHORT_DATE = "short-date"
}
