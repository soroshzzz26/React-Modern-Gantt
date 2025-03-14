/**
 * React Modern Gantt
 * A flexible, customizable Gantt chart component for React applications
 *
 * @module react-modern-gantt
 */

// Core components
export { GanttChart } from "./components/core";

// Task components
export { TaskItem, TaskList, TaskRow } from "./components/task";

// Timeline components
export { Timeline, TodayMarker } from "./components/timeline";

// UI components
export { Tooltip, ViewModeSelector } from "./components/ui";

// Types
export type {
    // Core types
    Task,
    TaskGroup,
    GanttStyles,

    // Component props
    GanttChartProps,
    TaskItemProps,
    TaskListProps,
    TaskRowProps,
    TimelineProps,
    TodayMarkerProps,
    TooltipProps,

    // Render props
    TaskRenderProps,
    TaskListRenderProps,
    TooltipRenderProps,
    ViewModeSelectorRenderProps,
    HeaderRenderProps,
    TimelineHeaderRenderProps,
    TaskColorProps,

    // Enums
    ViewMode,
    DateDisplayFormat,

    // Utility types
    TaskInteraction,
} from "./types";
