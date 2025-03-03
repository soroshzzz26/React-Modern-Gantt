// Main components
export { default as GanttChart } from "./components/GanttChart";

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
