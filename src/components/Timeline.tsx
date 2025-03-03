import React from "react";
import { TimelineProps, getDaysInMonth, formatDate, DateDisplayFormat, getStandardDayMarkers } from "../models";

/**
 * Timeline Component
 *
 * Displays the month/day headers for the Gantt chart
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

    // Get the standard day markers (always 1, 8, 15, 22, 29)
    const dayMarkers = getStandardDayMarkers();

    // Apply theme classes
    const headerBgClass = theme?.headerBackground || "bg-gray-50";
    const headerTextClass = theme?.headerText || "text-gray-700";
    const borderClass = theme?.timelineBorder || "border-gray-200";
    const subheaderTextClass = theme?.timelineText || "text-gray-500";

    return (
        <div
            className="timeline flex-grow overflow-x-auto overflow-y-hidden"
            data-testid="gantt-timeline"
            ref={scrollContainerRef}>
            <div className="inline-block min-w-full">
                {/* Month headers */}
                <div
                    className="grid border-b"
                    style={{ gridTemplateColumns: `repeat(${months.length}, ${columnWidth}px)` }}
                    data-testid="timeline-months">
                    {months.map((month, index) => (
                        <div
                            key={`month-${index}`}
                            className={`border-r ${borderClass}`}
                            data-month={formatDate(month.date, DateDisplayFormat.MONTH_YEAR)}>
                            {/* Month name */}
                            <div className={`flex h-12 items-center justify-center ${headerBgClass}`}>
                                <p className={`font-semibold ${headerTextClass}`}>
                                    {formatDate(month.date, DateDisplayFormat.MONTH_YEAR)}
                                </p>
                            </div>

                            {/* Day markers - always show 5 standard days */}
                            <div
                                className={`flex h-12 items-center justify-between px-2 text-xs ${subheaderTextClass} ${headerBgClass}`}
                                data-testid="day-markers">
                                {dayMarkers.map(dayMarker => {
                                    // Handle months with fewer days by capping at the last day
                                    const displayDay = dayMarker <= month.daysInMonth ? dayMarker : month.daysInMonth;

                                    // Calculate actual date for data attribute (for testing/debugging)
                                    const markerDate = new Date(month.date);
                                    markerDate.setDate(displayDay);

                                    return (
                                        <div
                                            key={`day-${month.date.getMonth()}-${dayMarker}`}
                                            className="relative w-5 text-center"
                                            data-day={displayDay}
                                            data-date={markerDate.toISOString().split("T")[0]}>
                                            <span>{displayDay}</span>
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

                {/* Task rows container */}
                <div className="relative task-container" data-testid="task-container">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
