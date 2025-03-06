import React from "react";

interface GanttTimelineProps {
    months?: Date[];
    currentMonthIndex?: number;
    className?: string;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
    months = [],
    currentMonthIndex = -1,
    className = "",
}) => {
    // Format month with year
    const formatMonthYear = (date: Date) => {
        if (!(date instanceof Date)) return "";
        return date.toLocaleString("default", { month: "short", year: "2-digit" });
    };

    return (
        <div className={`flex border-b border-gantt-border ${className}`}>
            {months.map((month, index) => (
                <div
                    key={index}
                    className={`w-[150px] flex-shrink-0 p-2 font-semibold text-center text-gantt-text ${
                        index === currentMonthIndex ? "bg-gantt-highlight" : ""
                    }`}>
                    {formatMonthYear(month)}
                </div>
            ))}
        </div>
    );
};
