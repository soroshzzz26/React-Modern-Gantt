/**
 * Type definitions for React Modern Gantt
 */
import React from "react";
export interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color?: string;
    percent?: number;
    dependencies?: string[];
    [key: string]: any;
}
export interface TaskGroup {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    tasks: Task[];
    [key: string]: any;
}
export interface GanttStyles {
    container?: string;
    title?: string;
    header?: string;
    taskList?: string;
    timeline?: string;
    todayMarker?: string;
    taskRow?: string;
    taskItem?: string;
    tooltip?: string;
}
export interface TaskListRenderProps {
    tasks: TaskGroup[];
    headerLabel?: string;
    onGroupClick?: (group: TaskGroup) => void;
    viewMode: ViewMode;
}
export interface TaskRenderProps {
    task: Task;
    leftPx: number;
    widthPx: number;
    topPx: number;
    isHovered: boolean;
    isDragging: boolean;
    editMode: boolean;
    showProgress?: boolean;
}
export interface TooltipRenderProps {
    task: Task;
    position: {
        x: number;
        y: number;
    };
    dragType: "move" | "resize-left" | "resize-right" | null;
    startDate: Date;
    endDate: Date;
    viewMode: ViewMode;
}
export interface TaskColorProps {
    task: Task;
    isHovered: boolean;
    isDragging: boolean;
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
    darkMode?: boolean;
    locale?: string;
    styles?: GanttStyles;
    viewMode?: ViewMode;
    showViewModeSelector?: boolean;
    smoothDragging?: boolean;
    movementThreshold?: number;
    renderTaskList?: (props: TaskListRenderProps) => React.ReactNode;
    renderTask?: (props: TaskRenderProps) => React.ReactNode;
    renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
    getTaskColor?: (props: TaskColorProps) => {
        backgroundColor: string;
        borderColor?: string;
        textColor?: string;
    };
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
    onTaskDoubleClick?: (task: Task) => void;
    onGroupClick?: (group: TaskGroup) => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
    fontSize?: string;
    rowHeight?: number;
    timeStep?: number;
    unitWidth?: number;
}
export interface TaskRowProps {
    taskGroup: TaskGroup;
    startDate: Date;
    endDate: Date;
    totalMonths: number;
    monthWidth: number;
    editMode?: boolean;
    showProgress?: boolean;
    className?: string;
    tooltipClassName?: string;
    smoothDragging?: boolean;
    movementThreshold?: number;
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
    viewMode?: ViewMode;
    scrollContainerRef?: React.RefObject<HTMLDivElement> | null;
    renderTask?: (props: TaskRenderProps) => React.ReactNode;
    renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
    getTaskColor?: (props: TaskColorProps) => {
        backgroundColor: string;
        borderColor?: string;
        textColor?: string;
    };
}
export interface TaskListProps {
    tasks: TaskGroup[];
    headerLabel?: string;
    showIcon?: boolean;
    showTaskCount?: boolean;
    showDescription?: boolean;
    rowHeight?: number;
    className?: string;
    onGroupClick?: (group: TaskGroup) => void;
    viewMode?: ViewMode;
}
export interface TimelineProps {
    months: Date[];
    currentMonthIndex: number;
    locale?: string;
    className?: string;
    viewMode?: ViewMode;
    unitWidth?: number;
}
export interface TaskItemProps {
    task: Task;
    leftPx: number;
    widthPx: number;
    topPx: number;
    isHovered: boolean;
    isDragging: boolean;
    editMode: boolean;
    showProgress?: boolean;
    instanceId: string;
    className?: string;
    getTaskColor?: (props: TaskColorProps) => {
        backgroundColor: string;
        borderColor?: string;
        textColor?: string;
    };
    onMouseDown: (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => void;
    onMouseEnter: (event: React.MouseEvent, task: Task) => void;
    onMouseLeave: () => void;
    onClick: (event: React.MouseEvent, task: Task) => void;
}
export interface TooltipProps {
    task: Task;
    position: {
        x: number;
        y: number;
    };
    dragType: "move" | "resize-left" | "resize-right" | null;
    taskId?: string;
    startDate: Date;
    endDate: Date;
    totalMonths: number;
    monthWidth: number;
    showProgress?: boolean;
    instanceId: string;
    className?: string;
    viewMode?: ViewMode;
}
export interface TodayMarkerProps {
    currentMonthIndex: number;
    height: number;
    label?: string;
    dayOfMonth?: number;
    className?: string;
    markerClass?: string;
    viewMode?: ViewMode;
    unitWidth?: number;
}
export declare enum ViewMode {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    QUARTER = "quarter",
    YEAR = "year"
}
export declare enum DateDisplayFormat {
    MONTH_YEAR = "month-year",
    FULL_DATE = "full-date",
    SHORT_DATE = "short-date"
}
export interface TaskInteraction {
    draggingTask: Task | null;
    dragType: "move" | "resize-left" | "resize-right" | null;
    dragStartX: number;
    hoveredTask: Task | null;
    tooltipPosition: {
        x: number;
        y: number;
    };
    previewTask: Task | null;
}
