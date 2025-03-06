import React from "react";
export interface TimelineProps {
    months: Date[];
    currentMonthIndex: number;
    showWeeks?: boolean;
    showDays?: boolean;
    locale?: string;
    className?: string;
}
/**
 * Timeline Component
 *
 * Displays the month/day headers for the Gantt chart
 * Supports highlighting the current month
 */
declare const Timeline: React.FC<TimelineProps>;
export default Timeline;
