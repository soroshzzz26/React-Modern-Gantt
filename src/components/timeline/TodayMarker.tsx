import React from "react";
import { TodayMarkerProps, ViewMode } from "@/types";

/**
 * TodayMarker Component - Displays a vertical line indicating the current date
 */
const TodayMarker: React.FC<TodayMarkerProps> = ({
    currentMonthIndex,
    height,
    markerClass = "bg-red-500",
    label = "Today",
    dayOfMonth,
    className = "",
    viewMode = ViewMode.MONTH,
    unitWidth = 150,
}) => {
    if (currentMonthIndex < 0) return null;

    // Calculate the position of the marker based on view mode
    const calculateMarkerPosition = (): number => {
        const today = new Date();
        const currentDay = dayOfMonth || today.getDate();

        switch (viewMode) {
            case ViewMode.DAY:
                return currentMonthIndex * unitWidth + unitWidth / 2;

            case ViewMode.WEEK:
                const dayOfWeek = today.getDay();
                const dayPosition = dayOfWeek / 7;
                return currentMonthIndex * unitWidth + unitWidth * dayPosition;

            case ViewMode.MONTH:
                const monthDayOfWeek = today.getDay();
                const monthDayPosition = monthDayOfWeek / 7;
                return currentMonthIndex * unitWidth + unitWidth * monthDayPosition;

            case ViewMode.QUARTER:
                const monthOfQuarter = today.getMonth() % 3;
                const monthPosition = monthOfQuarter / 3;
                return currentMonthIndex * unitWidth + unitWidth * monthPosition;

            case ViewMode.YEAR:
                const monthOfYear = today.getMonth();
                const yearMonthPosition = monthOfYear / 12;
                return currentMonthIndex * unitWidth + unitWidth * yearMonthPosition;

            default:
                return currentMonthIndex * unitWidth + unitWidth / 2;
        }
    };

    const markerPosition = calculateMarkerPosition();

    return (
        <div
            className={`absolute top-0 w-px ${markerClass} z-10 ${className}`}
            style={{
                left: `${markerPosition}px`,
                height: `${height}px`,
            }}
            data-testid="today-marker">
            <div
                className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${markerClass} px-1 py-0.5 rounded text-xs text-white whitespace-nowrap`}>
                {label}
            </div>
        </div>
    );
};

export default TodayMarker;
