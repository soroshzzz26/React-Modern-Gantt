// Main components
export { default as GanttChart } from "./components/GanttChart";
export { default as TaskRow } from "./components/TaskRow";

// Types and models
export type { Task, Person, GanttTheme, GanttChartProps, TaskRowProps, NameListProps, TimelineProps } from "./models";

// Utility functions
export {
    DEFAULT_THEME,
    formatMonth,
    formatDate,
    DateDisplayFormat,
    getMonthsBetween,
    getDaysInMonth,
    getStandardDayMarkers,
    calculateTaskPosition,
    detectTaskOverlaps,
    findEarliestDate,
    findLatestDate,
} from "./models";
