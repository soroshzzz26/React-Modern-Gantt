import React from "react";
import { TimelineProps, ViewMode } from "../utils/types";
import { format, getDaysInMonth, getDate, getMonth, getYear, isFirstDayOfMonth } from "date-fns";

/**
 * Timeline Component
 *
 * Displays the time headers for the Gantt chart based on the current view mode
 * Supports day, week, month, quarter, and year view modes
 * Always shows the year for better context
 */
const Timeline: React.FC<TimelineProps> = ({
    months,
    currentMonthIndex,
    locale = "default",
    className = "",
    viewMode = ViewMode.MONTH,
    unitWidth = 150,
}) => {
    // Format date based on view mode
    const formatDateHeader = (date: Date): string => {
        if (!(date instanceof Date)) return "";

        switch (viewMode) {
            case ViewMode.DAY:
                // Format as "1 Jan 2023"
                return format(date, "d MMM yyyy", { locale: getLocale() });

            case ViewMode.WEEK:
                // Format as "Week 1, Jan 2023"
                const weekNum = Math.ceil(date.getDate() / 7);
                return `Week ${weekNum}, ${format(date, "MMM yyyy", { locale: getLocale() })}`;

            case ViewMode.MONTH:
                // Format as "Jan 2023"
                return format(date, "MMM yyyy", { locale: getLocale() });

            case ViewMode.QUARTER:
                // Format as "Q1 2023"
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                return `Q${quarter} ${date.getFullYear()}`;

            case ViewMode.YEAR:
                // Format as "2023"
                return date.getFullYear().toString();

            default:
                return format(date, "MMM yyyy", { locale: getLocale() });
        }
    };

    // Get locale object for date-fns
    const getLocale = () => {
        if (locale === "default") return undefined;
        // This is just a placeholder. In a real implementation,
        // you would import and use locale objects from date-fns/locale
        return undefined;
    };

    // Format day of month
    const formatDayOfMonth = (day: number): string => {
        return day.toString();
    };

    // Calculate days in month
    const getDaysInCurrentMonth = (date: Date): number => {
        return getDaysInMonth(date);
    };

    // Get week markers (1, 8, 15, 22, 29)
    const getWeekMarkers = (): number[] => {
        return [1, 8, 15, 22, 29];
    };

    // Render subheader based on view mode
    const renderSubheader = () => {
        switch (viewMode) {
            case ViewMode.DAY:
                return renderDayWeekSubheader();
            case ViewMode.WEEK:
                return renderDayWeekSubheader();
            case ViewMode.MONTH:
                return renderDayWeekSubheader();
            case ViewMode.QUARTER:
            case ViewMode.YEAR:
            default:
                return null;
        }
    };

    // Render week markers for day view
    const renderDayWeekSubheader = () => {
        return (
            <div className="flex border-b border-gantt-border">
                {months.map((day, index) => {
                    // Only show week marker on first day of the week
                    const isFirstDayOfWeek = day.getDay() === 0; // Sunday
                    if (!isFirstDayOfWeek)
                        return (
                            <div
                                key={`day-noweek-${index}`}
                                className="w-[var(--gantt-unit-width)] flex-shrink-0"></div>
                        );

                    return (
                        <div
                            key={`day-week-${index}`}
                            className="relative w-[var(--gantt-unit-width)] flex-shrink-0 h-6">
                            <div className="absolute top-0 bottom-0 border-l border-gantt-border">
                                <span className="absolute -top-1 left-1 text-xs text-gantt-text">
                                    Week {Math.ceil(day.getDate() / 7)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Determine CSS width property based on viewMode
    const timeUnitWidthClass = `w-[var(--gantt-unit-width)]`;

    return (
        <div
            className={`rmg-timeline ${className}`}
            style={{ "--gantt-unit-width": `${unitWidth}px` } as React.CSSProperties}>
            {/* Main time unit headers */}
            <div className="flex border-b border-gantt-border">
                {months.map((timeUnit, index) => (
                    <div
                        key={`timeunit-${index}`}
                        className={`${timeUnitWidthClass} flex-shrink-0 p-2 font-semibold text-center text-gantt-text ${
                            index === currentMonthIndex ? "bg-gantt-highlight" : ""
                        }`}
                        data-timeunit={timeUnit.toISOString()}>
                        {formatDateHeader(timeUnit)}
                    </div>
                ))}
            </div>

            {/* Sub-headers for weeks and days */}
            {/* {renderSubheader()} */}
        </div>
    );
};

export default Timeline;
