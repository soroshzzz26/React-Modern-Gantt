import React from "react";
import { GanttChartProps } from "./types";
import "./styles/gantt.css";
/**
 * GanttChartWithStyles - A convenience component that automatically imports CSS
 * Use this component if you want to avoid manually importing styles.
 *
 * Usage:
 * import { GanttChartWithStyles } from 'react-modern-gantt';
 * // No need to import 'react-modern-gantt/dist/index.css'
 */
declare const GanttChartWithStyles: React.FC<GanttChartProps>;
export default GanttChartWithStyles;
