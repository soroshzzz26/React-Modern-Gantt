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
const GanttMarker: React.FC<GanttMarkerProps> = ({
    children = "Today",
    className = "",
    markerClassName = "bg-gantt-marker",
}) => {
    return (
        <div
            className={`rmg-gantt-marker px-1 py-0.5 rounded text-xs text-white dark:text-gray-100 whitespace-nowrap ${markerClassName} ${className}`}>
            {children}
        </div>
    );
};

export default GanttMarker;
