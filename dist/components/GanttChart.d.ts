import React from "react";
import { GanttChartProps } from "../utils/types";
import "../styles/gantt.css";
/**
 * GanttChart Component
 *
 * A modern, customizable Gantt chart for project timelines
 *
 * @example
 * // Basic usage
 * <GanttChart
 *   tasks={tasks}
 *   onTaskUpdate={handleUpdate}
 *   showProgress={true}
 * />
 *
 * // With custom styles
 * <GanttChart
 *   tasks={tasks}
 *   onTaskUpdate={handleUpdate}
 *   styles={{
 *     container: "border-2 border-blue-200",
 *     title: "text-2xl text-blue-800",
 *     taskList: "bg-blue-50"
 *   }}
 * />
 */
declare const GanttChart: React.FC<GanttChartProps>;
export default GanttChart;
