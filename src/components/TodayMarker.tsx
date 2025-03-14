import React from "react";
import { TodayMarkerProps, ViewMode } from "../utils/types";

/**
 *  TodayMarker Component
 *
 * Displays a vertical line indicating the current date
 * Accounts for different view modes
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

        // Use provided dayOfMonth or get current day if not provided
        const currentDay = dayOfMonth || today.getDate();

        switch (viewMode) {
            case ViewMode.DAY: {
                // In day view, the marker is positioned at the center of the current day
                return currentMonthIndex * unitWidth + unitWidth / 2;
            }

            case ViewMode.WEEK: {
                // In week view, position marker based on current day within the week
                const dayOfWeek = today.getDay(); // 0-6, where 0 is Sunday
                const dayPosition = dayOfWeek / 7; // Position within the week (0-1)
                return currentMonthIndex * unitWidth + unitWidth * dayPosition;
            }

            case ViewMode.MONTH: {
                // In month view, position marker based on current day within the month
                const dayOfWeek = today.getDay(); // 0-6, where 0 is Sunday
                const dayPosition = dayOfWeek / 7; // Position within the week (0-1)
                return currentMonthIndex * unitWidth + unitWidth * dayPosition;
            }

            case ViewMode.QUARTER: {
                // In quarter view, position marker based on current month within the quarter
                const monthOfQuarter = today.getMonth() % 3; // 0-2
                const monthPosition = monthOfQuarter / 3; // Position within the quarter (0-1)
                return currentMonthIndex * unitWidth + unitWidth * monthPosition;
            }

            case ViewMode.YEAR: {
                // In year view, position marker based on current month within the year
                const monthOfYear = today.getMonth(); // 0-11
                const monthPosition = monthOfYear / 12; // Position within the year (0-1)
                return currentMonthIndex * unitWidth + unitWidth * monthPosition;
            }

            default: {
                return currentMonthIndex * unitWidth + unitWidth / 2;
            }
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
