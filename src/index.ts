// Main components
export { default as GanttChart } from "./components/GanttChart";
export { default as TaskEditor } from "./components/TaskEditor";

// Types and models
export type { Task, Person, GanttTheme, GanttChartProps } from "./models";

// Utility functions
export {
    DEFAULT_THEME,
    formatMonth,
    getMonthsBetween,
    calculateTaskPosition,
    detectTaskOverlaps,
    findEarliestDate,
    findLatestDate,
} from "./models";
