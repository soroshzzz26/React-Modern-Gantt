import React from "react";
import { TimelineProps, ViewMode } from "../utils/types";
import { format, getWeek } from "date-fns";

/**
 * Timeline Component with hierarchical display
 *
 * Displays time headers for the Gantt chart based on the current view mode
 * Now supports a hierarchical display with two levels:
 * - Top level: Months/Years/Quarters
 * - Bottom level: Days/Weeks when appropriate
 */
const Timeline: React.FC<TimelineProps> = ({
    months,
    currentMonthIndex,
    locale = "default",
    className = "",
    viewMode = ViewMode.MONTH,
    unitWidth = 150,
}) => {
    // Get locale object for date-fns
    const getLocale = () => {
        if (locale === "default") return undefined;
        // This is just a placeholder. In a real implementation,
        // you would import and use locale objects from date-fns/locale
        return undefined;
    };

    // Format date based on view mode for the main timeline
    const formatDateHeader = (date: Date): string => {
        if (!(date instanceof Date)) return "";

        switch (viewMode) {
            case ViewMode.DAY:
                // For day view, just show day number
                return format(date, "d", { locale: getLocale() });
            case ViewMode.WEEK:
                // For week view, use proper ISO week number from date-fns
                const weekNum = getWeek(date);
                return `W${weekNum}`;
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

    // Format for the higher-level header (months/years)
    const formatHigherLevelHeader = (date: Date): string => {
        if (!(date instanceof Date)) return "";

        switch (viewMode) {
            case ViewMode.DAY:
            case ViewMode.WEEK:
                // For day/week views, show month and year
                return format(date, "MMM yyyy", { locale: getLocale() });
            default:
                // For other views, this isn't needed
                return "";
        }
    };

    // Get months for the higher-level header
    const getHigherLevelMonths = (): { date: Date; span: number }[] => {
        if (![ViewMode.DAY, ViewMode.WEEK].includes(viewMode) || months.length === 0) {
            return [];
        }

        const result: { date: Date; span: number }[] = [];
        let currentMonth = new Date(months[0]);
        let currentSpan = 0;

        months.forEach(date => {
            if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
                currentSpan += 1;
            } else {
                result.push({ date: currentMonth, span: currentSpan });
                currentMonth = new Date(date);
                currentSpan = 1;
            }
        });

        // Add the last month
        if (currentSpan > 0) {
            result.push({ date: currentMonth, span: currentSpan });
        }

        return result;
    };

    // Get whether we need a hierarchical display
    const needsHierarchicalDisplay = [ViewMode.DAY, ViewMode.WEEK].includes(viewMode);

    // Get higher-level months for hierarchical display
    const higherLevelMonths = getHigherLevelMonths();

    // Determine CSS width property based on viewMode
    const timeUnitWidthClass = `w-[var(--gantt-unit-width)]`;

    return (
        <div
            className={`rmg-timeline ${className}`}
            style={{ "--gantt-unit-width": `${unitWidth}px` } as React.CSSProperties}>
            {/* Higher-level header for months/years (only for day/week views) */}
            {needsHierarchicalDisplay && (
                <div className="flex border-b border-gantt-border">
                    {higherLevelMonths.map((item, index) => (
                        <div
                            key={`higher-level-${index}`}
                            className={`flex-shrink-0 p-2 font-semibold text-center text-gantt-text border-r border-gantt-border h-10`}
                            style={{ width: `${item.span * unitWidth}px` }}
                            data-timeunit-higher={item.date.toISOString()}>
                            {formatHigherLevelHeader(item.date)}
                        </div>
                    ))}
                </div>
            )}

            {/* Main time unit headers */}
            <div className="flex border-b border-gantt-border">
                {months.map((timeUnit, index) => (
                    <div
                        key={`timeunit-${index}`}
                        className={`${timeUnitWidthClass} flex-shrink-0 p-2 font-semibold text-center text-gantt-text ${
                            index === currentMonthIndex ? "bg-gantt-highlight" : ""
                        } ${needsHierarchicalDisplay ? "border-r border-gantt-border" : ""} h-10`}
                        data-timeunit={timeUnit.toISOString()}>
                        {formatDateHeader(timeUnit)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
