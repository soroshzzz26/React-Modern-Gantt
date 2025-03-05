import React from "react";
import { GanttTheme } from "@/utils/types";
export interface TimelineProps {
    months: Date[];
    currentMonthIndex: number;
    theme?: GanttTheme;
}
/**
 * Timeline Component
 *
 * Displays the month/day headers for the Gantt chart
 */
declare const Timeline: React.FC<TimelineProps>;
export default Timeline;
