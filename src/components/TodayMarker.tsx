import React from "react";

interface TodayMarkerProps {
    currentMonthIndex: number;
    height: number;
    label?: string;
    dayOfMonth?: number;
    className?: string;
}

/**
 * TodayMarker Component
 *
 * Displays a vertical line indicating the current date
 * Can be positioned at a specific day of month
 */
const TodayMarker: React.FC<TodayMarkerProps> = ({
    currentMonthIndex,
    height,
    label = "Today",
    dayOfMonth,
    className = "",
}) => {
    if (currentMonthIndex < 0) return null;

    // Calculate the position within the month based on day
    // If no day is provided, default to middle of the month (0.5)
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const dayPosition = dayOfMonth
        ? (dayOfMonth - 1) / daysInMonth // Position based on provided day (0-1 range)
        : 0.5; // Default to middle of month

    // Calculate left position (month index + day position) * month width
    // We use CSS variables for the month width to maintain consistency
    const monthWidth = 150; // Should match the --gantt-month-width CSS variable
    const leftPosition = (currentMonthIndex + dayPosition) * monthWidth;

    return (
        <div
            className={`rmg-today-marker absolute top-0 w-px bg-gantt-marker z-10 ${className}`}
            style={{
                left: `${leftPosition}px`,
                height: `${height}px`,
            }}
            data-testid="today-marker">
            {/* Label tag */}
            <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gantt-marker px-1 py-0.5 rounded text-xs text-white dark:text-gray-100 whitespace-nowrap"
                style={{ top: "-10px" }}>
                {label}
            </div>
        </div>
    );
};

export default TodayMarker;
