import React from "react";

interface TodayMarkerProps {
    currentMonthIndex: number;
    height: number;
    label?: string;
    dayOfMonth?: number; // Add optional day of month prop for more precise positioning
}

/**
 * TodayMarker Component
 *
 * Displays a vertical line indicating the current date
 */
const TodayMarker: React.FC<TodayMarkerProps> = ({ currentMonthIndex, height, label = "Today", dayOfMonth }) => {
    if (currentMonthIndex < 0) return null;

    // Calculate the position within the month based on day
    // If no day is provided, default to middle of the month (0.5)
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const dayPosition = dayOfMonth
        ? (dayOfMonth - 1) / daysInMonth // Position based on provided day (0-1 range)
        : 0.5; // Default to middle of month

    // Calculate left position (month index + day position)
    const leftPosition = (currentMonthIndex + dayPosition) * 150;

    return (
        <div
            className="absolute top-0 w-px bg-gantt-marker z-10"
            style={{
                left: `${leftPosition}px`,
                height: `${height}px`,
            }}
            data-testid="today-marker">
            <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gantt-marker px-1 py-0.5 rounded text-xs text-white dark:text-gray-100 whitespace-nowrap"
                style={{ top: "-10px" }}>
                {label}
            </div>
        </div>
    );
};

export default TodayMarker;
