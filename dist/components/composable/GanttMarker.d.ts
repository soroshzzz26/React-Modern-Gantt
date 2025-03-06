import React from "react";
export interface GanttMarkerProps {
    children?: React.ReactNode;
    className?: string;
    markerClassName?: string;
}
/**
 * GanttMarker Component
 *
 * Customizable marker for the current date indicator
 *
 * @example
 * <GanttMarker className="bg-pink-500">Current Date</GanttMarker>
 */
declare const GanttMarker: React.FC<GanttMarkerProps>;
export default GanttMarker;
