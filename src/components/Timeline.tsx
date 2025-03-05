import React from "react";
import { GanttTheme } from "../models";

export interface TimelineProps {
    months: Date[];
    currentMonthIndex: number;
    theme?: GanttTheme;
}

/**
 * Timeline Component
 *
 * Displays the month/day headers for the Gantt chart
 */
const Timeline: React.FC<TimelineProps> = ({ months, currentMonthIndex, theme = {} }) => {
    // Format month with year for display
    const formatMonthYear = (date: Date) => {
        if (!(date instanceof Date)) return "";
        return date.toLocaleString("default", { month: "short", year: "2-digit" });
    };

    // Apply theme classes
    const highlightClass = theme?.backgroundHighlight || "bg-blue-50";

    return (
        <div className="flex border-b border-gray-200">
            {months.map((month, index) => (
                <div
                    key={index}
                    className={`w-[150px] flex-shrink-0 p-2 font-semibold text-center ${
                        index === currentMonthIndex ? highlightClass : ""
                    }`}
                    data-month={month.toISOString()}>
                    {formatMonthYear(month)}
                </div>
            ))}
        </div>
    );
};

export default Timeline;
