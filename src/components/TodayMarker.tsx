import React from "react";

interface TodayMarkerProps {
    currentMonthIndex: number;
    height: number;
    markerClass?: string;
    label?: string;
}

/**
 * TodayMarker Component
 *
 * Displays a vertical line indicating the current date
 */
const TodayMarker: React.FC<TodayMarkerProps> = ({
    currentMonthIndex,
    height,
    markerClass = "bg-red-500",
    label = "Today",
}) => {
    if (currentMonthIndex < 0) return null;

    return (
        <div
            className={`absolute top-0 w-px ${markerClass} z-10`}
            style={{
                left: `${(currentMonthIndex + 0.5) * 150}px`,
                height: `${height}px`,
            }}
            data-testid="today-marker">
            <div
                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${markerClass} px-1 py-0.5 rounded text-xs text-white whitespace-nowrap`}
                style={{ top: "-10px" }}>
                {label}
            </div>
        </div>
    );
};

export default TodayMarker;
