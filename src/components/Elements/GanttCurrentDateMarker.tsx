import React from "react";

interface GanttCurrentDateMarkerProps {
    children?: React.ReactNode;
    className?: string;
    markerClassName?: string;
}

export const GanttCurrentDateMarker: React.FC<GanttCurrentDateMarkerProps> = ({
    children = "Today",
    className = "",
    markerClassName = "bg-red-500",
}) => {
    return (
        <div className={`px-1 py-0.5 rounded text-xs text-white whitespace-nowrap ${markerClassName} ${className}`}>
            {children}
        </div>
    );
};
