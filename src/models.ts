// Main component
export { default as GanttChart } from "./components/GanttChart";

// Sub-components (exported for advanced customization)
export { default as Timeline } from "./components/Timeline";
export { default as NameList } from "./components/NameList";
export { default as TaskRow } from "./components/TaskRow";

// Types and utilities
export {
    Task,
    Person,
    GanttTheme,
    GanttChartProps,
    TimelineProps,
    NameListProps,
    TaskRowProps,
    DateDisplayFormat,
    DEFAULT_THEME,
    formatDate,
    getDaysInMonth,
    getDuration,
    calculateTaskPosition,
    detectCollisions,
    generateTimelineHeader,
} from "./models";
