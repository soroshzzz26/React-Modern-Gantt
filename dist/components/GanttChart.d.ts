import React from "react";
import { GanttChartProps } from "../utils/types";
import "../styles/gantt.css";
/**
 * GanttChart Component with ViewMode support
 *
 * A modern, customizable Gantt chart for project timelines
 * Supports different view modes while maintaining precise task positioning
 *
 * @example
 * // Basic usage with view mode
 * <GanttChart
 *   tasks={tasks}
 *   onTaskUpdate={handleUpdate}
 *   showProgress={true}
 *   viewMode={ViewMode.WEEK}
 * />
 */
declare const GanttChart: React.FC<GanttChartProps>;
export default GanttChart;
