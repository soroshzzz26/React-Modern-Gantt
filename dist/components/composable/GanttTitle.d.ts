import React from "react";
export interface GanttTitleProps {
    children?: React.ReactNode;
    className?: string;
}
/**
 * GanttTitle Component
 *
 * Customizable title component for the Gantt chart
 *
 * @example
 * <GanttTitle className="text-2xl text-blue-800">Custom Timeline Title</GanttTitle>
 */
declare const GanttTitle: React.FC<GanttTitleProps>;
export default GanttTitle;
