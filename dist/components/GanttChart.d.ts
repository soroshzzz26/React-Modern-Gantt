import React from "react";
import { GanttChartProps } from "../utils/types";
import "../styles/gantt.css";
/**
 * GanttChart Component
 *
 * A modern, customizable Gantt chart for project timelines with both props and composable API
 *
 * @example
 * // Basic usage
 * <GanttChart
 *   tasks={tasks}
 *   onTaskUpdate={handleUpdate}
 *   showProgress={true}
 * />
 *
 * // Composition-based usage
 * <GanttChart tasks={tasks} onTaskUpdate={handleUpdate}>
 *   <GanttTitle>Custom Project Timeline</GanttTitle>
 *   <GanttHeader>Resources</GanttHeader>
 *   <GanttMarker>Today</GanttMarker>
 * </GanttChart>
 */
declare const GanttChart: React.FC<GanttChartProps>;
export default GanttChart;
