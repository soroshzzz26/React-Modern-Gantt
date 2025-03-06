import React from "react";
export interface GanttTimelineProps {
    months?: Date[];
    currentMonthIndex?: number;
    showWeeks?: boolean;
    showDays?: boolean;
    locale?: string;
    className?: string;
    children?: React.ReactNode;
}
/**
 * GanttTimeline Component
 *
 * Customizable timeline header component
 *
 * @example
 * <GanttTimeline className="text-sm bg-gray-50 border-b border-indigo-100" showWeeks={true} />
 */
declare const GanttTimeline: React.FC<GanttTimelineProps>;
export default GanttTimeline;
