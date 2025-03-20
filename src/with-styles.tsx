import React from "react";
import { GanttChartProps } from "./types";
import { GanttChart } from "./components/core";

// Import CSS directly to ensure it's bundled with the component
import "./styles/gantt.css";

/**
 * GanttChartWithStyles - A fully styled component with no external dependencies
 * Use this component for a zero-configuration experience.
 *
 * The styling is self-contained and doesn't require any Tailwind configuration
 * or separate CSS imports.
 */
const GanttChartWithStyles: React.FC<GanttChartProps> = props => {
    return <GanttChart {...props} />;
};

export { GanttChartWithStyles };
export default GanttChartWithStyles;
