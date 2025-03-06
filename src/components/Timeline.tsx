import React from "react";

export interface TimelineProps {
    months: Date[];
    currentMonthIndex: number;
}

/**
 * Timeline Component
 *
 * Displays the month/day headers for the Gantt chart
 */
const Timeline: React.FC<TimelineProps> = ({ months, currentMonthIndex }) => {
    // Format month with year for display
    const formatMonthYear = (date: Date) => {
        if (!(date instanceof Date)) return "";
        return date.toLocaleString("default", { month: "short", year: "2-digit" });
    };

    return (
        <div className="flex border-b border-gantt-border">
            {months.map((month, index) => (
                <div
                    key={index}
                    className={`w-[150px] flex-shrink-0 p-2 font-semibold text-center ${
                        index === currentMonthIndex ? "bg-gantt-highlight" : ""
                    }`}
                    data-month={month.toISOString()}>
                    {formatMonthYear(month)}
                </div>
            ))}
        </div>
    );
};

export default Timeline;
