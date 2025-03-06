/**
 * Core type definitions for React Modern Gantt
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

// Theme customization
export interface GanttTheme {
    background?: string;
    text?: string;
    border?: string;
    highlight?: string;
    marker?: string;
    task?: string;
    taskText?: string;
    tooltip?: string;
    progress?: string;
    progressFill?: string;
    // More theme options can be added here
    [key: string]: string | undefined;
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
    theme?: GanttTheme;
    darkMode?: boolean;
    locale?: string;
    showWeeks?: boolean;
    showDays?: boolean;

    // Event handlers
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
    onTaskDoubleClick?: (task: Task) => void;
    onGroupClick?: (group: TaskGroup) => void;

    // Visual customization
    fontSize?: string;
    rowHeight?: number;
    timeStep?: number;

    // Children for composition
    children?: React.ReactNode;
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
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
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
}

export interface TimelineProps {
    months: Date[];
    currentMonthIndex: number;
    showWeeks?: boolean;
    showDays?: boolean;
    locale?: string;
    className?: string;
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
}

export interface TodayMarkerProps {
    currentMonthIndex: number;
    height: number;
    label?: string;
    dayOfMonth?: number;
    className?: string;
}

// Date format options
export enum DateDisplayFormat {
    MONTH_YEAR = "month-year",
    FULL_DATE = "full-date",
    SHORT_DATE = "short-date",
}

// View options
export enum ViewMode {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    QUARTER = "quarter",
    YEAR = "year",
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
