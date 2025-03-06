import React from "react";

export interface GanttTimelineProps {
    months?: Date[];
    currentMonthIndex?: number;
    showWeeks?: boolean;
    showDays?: boolean;
    locale?: string;
    className?: string;
    children?: React.ReactNode;
}

/**
 * GanttTimeline Component
 *
 * Customizable timeline header component
 *
 * @example
 * <GanttTimeline className="text-sm bg-gray-50 border-b border-indigo-100" showWeeks={true} />
 */
const GanttTimeline: React.FC<GanttTimelineProps> = ({
    months = [],
    currentMonthIndex = -1,
    showWeeks = false,
    showDays = false,
    locale = "default",
    className = "",
    children,
}) => {
    return (
        <div className={`rmg-gantt-timeline flex border-b border-gantt-border ${className}`}>
            {children || (
                <>
                    {months.map((month, index) => {
                        const formatMonthYear = (date: Date) => {
                            if (!(date instanceof Date)) return "";
                            return date.toLocaleString(locale, { month: "short", year: "2-digit" });
                        };

                        return (
                            <div
                                key={index}
                                className={`w-[var(--gantt-month-width)] flex-shrink-0 p-2 font-semibold text-center text-gantt-text ${
                                    index === currentMonthIndex ? "bg-gantt-highlight" : ""
                                }`}>
                                {formatMonthYear(month)}
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default GanttTimeline;
