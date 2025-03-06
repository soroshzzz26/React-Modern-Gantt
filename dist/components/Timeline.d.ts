import React from "react";
export interface TimelineProps {
    months: Date[];
    currentMonthIndex: number;
}
/**
 * Timeline Component
 *
 * Displays the month/day headers for the Gantt chart
 */
declare const Timeline: React.FC<TimelineProps>;
export default Timeline;
