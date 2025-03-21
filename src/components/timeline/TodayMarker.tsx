import React from "react";
import { TodayMarkerProps, ViewMode } from "@/types";

/**
 * TodayMarker Component - Displays a vertical line indicating the current date
 * Updated to handle full height properly and improve visual appearance
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
            case ViewMode.MINUTE:
                const minuteOfHour = today.getMinutes();
                const secondOfMinute = today.getSeconds();
                // Position based on minute and seconds
                const minutePosition = (minuteOfHour + secondOfMinute / 60) / 60;
                return currentMonthIndex * unitWidth + unitWidth * minutePosition;

            case ViewMode.HOUR:
                const minuteOfCurrentHour = today.getMinutes();
                // Position based on minutes within the hour
                const hourPosition = minuteOfCurrentHour / 60;
                return currentMonthIndex * unitWidth + unitWidth * hourPosition;

            case ViewMode.DAY:
                return currentMonthIndex * unitWidth + unitWidth / 2;

            case ViewMode.WEEK:
                const dayOfWeek = today.getDay();
                // Normalize to ensure it's between 0 and 6 even with custom week configurations
                const normalizedDayOfWeek = (dayOfWeek + 7) % 7;
                // Use the normalized position for more accurate placement
                const dayPosition = normalizedDayOfWeek / 6; // Use 6 instead of 7 for better visual placement
                return currentMonthIndex * unitWidth + unitWidth * dayPosition;

            case ViewMode.MONTH:
                // Calculate position within the month based on day
                const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                const dayPercentage = (currentDay - 1) / daysInMonth;
                return currentMonthIndex * unitWidth + unitWidth * dayPercentage;

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

    // Ensure minimum height to avoid invisible marker
    const finalHeight = Math.max(100, height);

    return (
        <div
            className={`absolute top-0 w-px ${markerClass} z-10 ${className}`}
            style={{
                left: `${markerPosition}px`,
                height: `${finalHeight}px`,
                // Add subtle shadow for better visibility across backgrounds
                boxShadow: "0 0 4px rgba(239, 68, 68, 0.5)",
            }}
            data-testid="today-marker">
            <div
                className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${markerClass} px-1.5 py-0.5 rounded text-xs text-white dark:text-white whitespace-nowrap shadow-sm`}>
                {label}
            </div>
        </div>
    );
};

export default TodayMarker;
