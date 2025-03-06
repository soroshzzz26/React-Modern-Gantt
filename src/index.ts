/**
 * React Modern Gantt
 * A flexible, customizable Gantt chart component for React applications
 */

// Main components
export { default as GanttChart } from "./components/GanttChart";
export { default as TaskRow } from "./components/TaskRow";
export { default as TaskItem } from "./components/TaskItem";
export { default as TaskList } from "./components/TaskList";
export { default as Timeline } from "./components/Timeline";
export { default as TodayMarker } from "./components/TodayMarker";
export { default as Tooltip } from "./components/Tooltip";

// Types
export type {
    Task,
    TaskGroup,
    GanttStyles,
    GanttChartProps,
    TaskRowProps,
    TaskListProps,
    TimelineProps,
    TaskItemProps,
    TaskInteraction,
} from "./utils/types";

export { DateDisplayFormat, ViewMode } from "./utils/types";

// Utility functions
export {
    formatMonth,
    formatDate,
    formatDateRange,
    getMonthsBetween,
    getDaysInMonth,
    getStandardDayMarkers,
    calculateTaskPosition,
    calculateDuration,
    detectTaskOverlaps,
    findEarliestDate,
    findLatestDate,
} from "./models";

// Manager classes
export { CollisionManager } from "./utils/CollisionManager";
export { TaskManager } from "./utils/TaskManager";
