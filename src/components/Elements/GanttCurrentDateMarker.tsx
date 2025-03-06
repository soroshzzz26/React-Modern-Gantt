import React from "react";

interface GanttCurrentDateMarkerProps {
    children?: React.ReactNode;
    className?: string;
    markerClassName?: string;
}

export const GanttCurrentDateMarker: React.FC<GanttCurrentDateMarkerProps> = ({
    children = "Today",
    className = "",
    markerClassName = "bg-gantt-marker",
}) => {
    return (
        <div
            className={`px-1 py-0.5 rounded text-xs text-white dark:text-gray-100 whitespace-nowrap ${markerClassName} ${className}`}>
            {children}
        </div>
    );
};
