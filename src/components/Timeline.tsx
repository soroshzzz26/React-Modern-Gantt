import React from "react";
import { TimelineProps, getDaysInMonth, formatDate, DateDisplayFormat } from "../models";

/**
 * Timeline Component
 *
 * Displays the timeline header with months and days
 */
const Timeline: React.FC<TimelineProps> = ({
    startDate,
    endDate,
    columnWidth,
    theme,
    children,
    scrollContainerRef,
}) => {
    // Generate array of months between start and end date
    const months: { date: Date; daysInMonth: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        months.push({
            date: new Date(currentDate),
            daysInMonth: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()),
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Always display 5 days per month at fixed 7-day intervals
    const getKeyDaysForMonth = (): number[] => {
        // Always return these 5 fixed days (1, 8, 15, 22, 29)
        return [1, 8, 15, 22, 29];
    };

    // Class definitions based on theme
    const headerBgClass = theme?.headerBackground || "bg-gray-50";
    const headerTextClass = theme?.headerText || "text-gray-700";
    const borderClass = theme?.timelineBorder || "border-gray-200";
    const subheaderTextClass = theme?.timelineText || "text-gray-500";

    return (
        <div className="timeline flex-grow overflow-x-auto overflow-y-hidden" ref={scrollContainerRef}>
            <div className="inline-block min-w-full">
                {/* Month headers */}
                <div
                    className="grid border-b"
                    style={{ gridTemplateColumns: `repeat(${months.length}, ${columnWidth}px)` }}>
                    {months.map((month, index) => (
                        <div key={`month-${index}`} className={`border-r ${borderClass}`}>
                            {/* Month name */}
                            <div className={`flex h-12 items-center justify-center ${headerBgClass}`}>
                                <p className={`font-semibold ${headerTextClass}`}>
                                    {formatDate(month.date, DateDisplayFormat.MONTH_YEAR)}
                                </p>
                            </div>

                            {/* Day numbers - Always show 5 days per month */}
                            <div
                                className={`flex h-12 items-center justify-between px-2 text-xs ${subheaderTextClass} ${headerBgClass}`}>
                                {getKeyDaysForMonth().map(day => {
                                    // Handle days that may not exist in the month (like 29 in February)
                                    const validDay = day <= month.daysInMonth ? day : month.daysInMonth;
                                    return (
                                        <div
                                            key={`day-${month.date.getMonth()}-${day}`}
                                            className="relative"
                                            style={{ width: "20px", textAlign: "center" }}>
                                            <span>{validDay}</span>
                                            {/* Vertical day separator line */}
                                            <div
                                                className="absolute top-full h-screen w-px bg-gray-200 -z-10"
                                                style={{
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                }}></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Task rows */}
                <div className="relative task-container">{children}</div>
            </div>
        </div>
    );
};

export default Timeline;
