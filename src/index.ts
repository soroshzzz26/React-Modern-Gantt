// Main components
export { default as GanttChart } from "./components/GanttChart";
export { default as TaskRow } from "./components/Task/TaskRow";
export { default as TaskList } from "./components/Task/TaskList";

// UI Elements for composition
export {
    GanttTitle,
    GanttHeader,
    GanttCurrentDateMarker,
    GanttTaskList,
    GanttTimeline,
    GanttTaskItem,
} from "./components/Elements";

// Types
export type {
    Task,
    TaskGroup,
    GanttTheme,
    GanttChartProps,
    TaskRowProps,
    TaskListProps,
    TimelineProps,
    DateDisplayFormat,
} from "@/utils/types";

// Utility functions
export {
    DEFAULT_THEME,
    formatMonth,
    formatDate,
    getMonthsBetween,
    getDaysInMonth,
    getStandardDayMarkers,
    calculateTaskPosition,
    detectTaskOverlaps,
    findEarliestDate,
    findLatestDate,
} from "./models";
