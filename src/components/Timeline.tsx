import React from "react";
import { TimelineProps } from "../utils/types";

/**
 * Timeline Component
 *
 * Displays the month/day headers for the Gantt chart
 * Supports highlighting the current month
 */
const Timeline: React.FC<TimelineProps> = ({
    months,
    currentMonthIndex,
    showWeeks = false,
    showDays = false,
    locale = "default",
    className = "",
}) => {
    // Format month with year for display
    const formatMonthYear = (date: Date) => {
        if (!(date instanceof Date)) return "";
        return date.toLocaleString(locale, { month: "short", year: "2-digit" });
    };

    // Format day of month
    const formatDay = (day: number) => {
        return day.toString();
    };

    // Calculate days in a month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get days for week markers (1, 8, 15, 22)
    const getWeekMarkers = () => {
        return [1, 8, 15, 22, 29];
    };

    return (
        <div className={`rmg-timeline ${className}`}>
            {/* Month headers */}
            <div className="flex border-b border-gantt-border">
                {months.map((month, index) => (
                    <div
                        key={`month-${index}`}
                        className={`w-[var(--gantt-month-width)] flex-shrink-0 p-2 font-semibold text-center text-gantt-text ${
                            index === currentMonthIndex ? "bg-gantt-highlight" : ""
                        }`}
                        data-month={month.toISOString()}>
                        {formatMonthYear(month)}
                    </div>
                ))}
            </div>

            {/* Week markers (optional) */}
            {showWeeks && (
                <div className="flex border-b border-gantt-border">
                    {months.map((month, monthIndex) => {
                        const weekMarkers = getWeekMarkers();
                        const daysInMonth = getDaysInMonth(month);
                        const dayWidth = 150 / daysInMonth; // 150px is the month width

                        return (
                            <div
                                key={`week-${monthIndex}`}
                                className="relative w-[var(--gantt-month-width)] flex-shrink-0 h-6">
                                {weekMarkers
                                    .filter(day => day <= daysInMonth)
                                    .map(day => (
                                        <div
                                            key={`week-${monthIndex}-${day}`}
                                            className="absolute top-0 bottom-0 border-l border-gantt-border"
                                            style={{ left: `${day * dayWidth}px` }}>
                                            <span className="absolute -top-1 left-1 text-xs text-gantt-text">
                                                {formatDay(day)}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Day grid (optional) */}
            {showDays && (
                <div className="flex border-b border-gantt-border">
                    {months.map((month, monthIndex) => {
                        const daysInMonth = getDaysInMonth(month);

                        return (
                            <div
                                key={`days-${monthIndex}`}
                                className="flex w-[var(--gantt-month-width)] flex-shrink-0 h-5">
                                {Array.from({ length: daysInMonth }).map((_, dayIndex) => (
                                    <div
                                        key={`day-${monthIndex}-${dayIndex}`}
                                        className="border-r border-gantt-border"
                                        style={{ width: `${100 / daysInMonth}%` }}>
                                        {dayIndex % 5 === 0 && (
                                            <span className="text-xs text-gantt-text opacity-70">{dayIndex + 1}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Timeline;
