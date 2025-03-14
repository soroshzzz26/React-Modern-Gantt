/**
 * Type definitions for React Modern Gantt
 */
import React from "react";

// Basic task and group types
export interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color?: string;
    percent?: number;
    dependencies?: string[];
    // Additional data can be attached by the user
    [key: string]: any;
}

export interface TaskGroup {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    tasks: Task[];
    // Additional data can be attached by the user
    [key: string]: any;
}

// Component styles
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

// Custom render function types
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
    position: { x: number; y: number };
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

// Main component props
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
    showViewModeSelector?: boolean; // New prop to control ViewModeSelector visibility
    smoothDragging?: boolean; // New prop to control smooth dragging
    movementThreshold?: number; // Movement threshold to reduce jiggling

    // Custom rendering functions
    renderTaskList?: (props: TaskListRenderProps) => React.ReactNode;
    renderTask?: (props: TaskRenderProps) => React.ReactNode;
    renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
    getTaskColor?: (props: TaskColorProps) => {
        backgroundColor: string;
        borderColor?: string;
        textColor?: string;
    };

    // Event handlers
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
    onTaskDoubleClick?: (task: Task) => void;
    onGroupClick?: (group: TaskGroup) => void;
    onViewModeChange?: (viewMode: ViewMode) => void;

    // Visual customization
    fontSize?: string;
    rowHeight?: number;
    timeStep?: number;
    unitWidth?: number;
}

// Individual component props
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
    smoothDragging?: boolean; // New prop to control smooth dragging
    movementThreshold?: number; // New prop for movement threshold
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
    viewMode?: ViewMode;
    scrollContainerRef?: React.RefObject<HTMLDivElement> | null;

    // Custom render functions
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
    position: { x: number; y: number };
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

// View Mode enum
export enum ViewMode {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    QUARTER = "quarter",
    YEAR = "year",
}

// Date format options
export enum DateDisplayFormat {
    MONTH_YEAR = "month-year",
    FULL_DATE = "full-date",
    SHORT_DATE = "short-date",
}

// Interaction states for custom hooks
export interface TaskInteraction {
    draggingTask: Task | null;
    dragType: "move" | "resize-left" | "resize-right" | null;
    dragStartX: number;
    hoveredTask: Task | null;
    tooltipPosition: { x: number; y: number };
    previewTask: Task | null;
}
