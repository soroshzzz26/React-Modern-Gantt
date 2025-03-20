import "./styles/gantt.css";
/**
 * React Modern Gantt
 * A flexible, customizable Gantt chart component for React applications
 *
 * @module react-modern-gantt
 */

// Core components
// export { default as GanttChart } from "./components/core/GanttChart";
export { default as NextGanttChart } from "./components/core/NextGanttChart";

// Task components
export { TaskItem, TaskList, TaskRow } from "./components/task";

// Timeline components
export { Timeline, TodayMarker } from "./components/timeline";

// UI components
export { Tooltip, ViewModeSelector } from "./components/ui";

// Convenience exports with auto-styling
export { default as GanttChart } from "./with-styles";

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

    // Utility types
    TaskInteraction,
} from "./types";

// Enums
export {
    // Enums
    ViewMode,
    DateDisplayFormat,
} from "./types";

// Export utility functions for advanced usage
export { CollisionService, TaskService } from "./services";
export {
    formatDate,
    formatMonth,
    getMonthsBetween,
    getDaysInMonth,
    formatDateRange,
    calculateDuration,
    getDuration,
    findEarliestDate,
    findLatestDate,
    calculateTaskPosition,
    detectTaskOverlaps,
} from "./utils";
