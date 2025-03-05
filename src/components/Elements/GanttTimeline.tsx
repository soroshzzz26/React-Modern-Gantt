import React from "react";
import { GanttTheme } from "@/utils/types";

interface GanttTimelineProps {
    months?: Date[];
    currentMonthIndex?: number;
    theme?: GanttTheme;
    className?: string;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
    months = [],
    currentMonthIndex = -1,
    theme,
    className = "",
}) => {
    // Format month with year
    const formatMonthYear = (date: Date) => {
        if (!(date instanceof Date)) return "";
        return date.toLocaleString("default", { month: "short", year: "2-digit" });
    };

    // Apply theme classes
    const highlightClass = theme?.backgroundHighlight || "bg-blue-50";

    return (
        <div className={`flex border-b border-gray-200 ${className}`}>
            {months.map((month, index) => (
                <div
                    key={index}
                    className={`w-[150px] flex-shrink-0 p-2 font-semibold text-center ${
                        index === currentMonthIndex ? highlightClass : ""
                    }`}>
                    {formatMonthYear(month)}
                </div>
            ))}
        </div>
    );
};
