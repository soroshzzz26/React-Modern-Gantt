import React, { useState, useRef } from "react";
import {
    GanttChartProps,
    DEFAULT_THEME,
    Person,
    Task,
    getMonthsBetween,
    detectTaskOverlaps,
    findEarliestDate,
    findLatestDate,
} from "../models";
import TaskRow from "./TaskRow";

/**
 * GanttChart Component
 *
 * A simple, month-based Gantt chart for project timelines
 */
const GanttChart: React.FC<GanttChartProps> = ({
    people,
    startDate: customStartDate,
    endDate: customEndDate,
    title = "Project Timeline",
    currentDate = new Date(),
    showCurrentDateMarker = true,
    editMode = true,
    theme = DEFAULT_THEME,
    onTaskUpdate,
    onTaskClick,
}) => {
    // Container refs for scrolling
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Find the earliest and latest dates if not provided
    const derivedStartDate = customStartDate || findEarliestDate(people);
    const derivedEndDate = customEndDate || findLatestDate(people);

    // Get all months for the timeline
    const months = getMonthsBetween(derivedStartDate, derivedEndDate);
    const totalMonths = months.length;

    // Calculate current date marker position
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = months.findIndex(
        month => month.getMonth() === currentMonth && month.getFullYear() === currentYear
    );

    // Calculate total container height based on all people's tasks
    const getTotalHeight = () => {
        let height = 0;
        people.forEach(person => {
            const taskRows = detectTaskOverlaps(person.tasks);
            height += Math.max(60, taskRows.length * 30 + 15);
        });
        return height;
    };

    // Apply theme classes
    const headerBgClass = theme.headerBackground || "bg-white";
    const headerTextClass = theme.headerText || "text-gray-700";
    const borderClass = theme.borderColor || "border-gray-200";
    const highlightClass = theme.backgroundHighlight || "bg-blue-50";
    const markerClass = theme.todayMarkerColor || "bg-red-500";

    // Format month with year for display
    const formatMonthYear = (date: Date) => {
        return date.toLocaleString("default", { month: "short", year: "2-digit" });
    };

    return (
        <div
            ref={containerRef}
            className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
            data-testid="gantt-chart">
            {/* Header with title */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>

            {/* Gantt content with horizontal scrolling */}
            <div className="relative flex">
                {/* Fixed Team Member column */}
                <div className="w-40 flex-shrink-0 z-10 bg-white shadow-sm">
                    {/* Header placeholder - to align with timeline */}
                    <div className="p-2 font-semibold text-gray-700 border-r border-b border-gray-200 h-12">
                        Team Member
                    </div>

                    {/* Person names */}
                    {people.map(person => {
                        const taskRows = detectTaskOverlaps(person.tasks);
                        const rowHeight = Math.max(60, taskRows.length * 30 + 15);

                        return (
                            <div
                                key={`person-${person.id}`}
                                className="p-2 border-r border-b border-gray-200 font-medium"
                                style={{ height: `${rowHeight}px` }}
                                data-testid={`person-label-${person.id}`}>
                                <div className="font-medium">{person.name}</div>
                                {person.role && <div className="text-xs text-gray-500">{person.role}</div>}
                            </div>
                        );
                    })}
                </div>

                {/* Scrollable timeline and tasks area */}
                <div ref={scrollContainerRef} className="flex-grow overflow-x-auto">
                    <div className="min-w-max">
                        {/* Timeline header */}
                        <div className="flex border-b border-gray-200">
                            {/* Month columns */}
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

                        {/* Container for tasks and today marker */}
                        <div className="relative">
                            {/* Today marker */}
                            {showCurrentDateMarker && currentMonthIndex >= 0 && (
                                <div
                                    className={`absolute top-0 w-px ${markerClass} z-10`}
                                    style={{
                                        left: `${(currentMonthIndex + 0.5) * 150}px`,
                                        height: `${getTotalHeight()}px`,
                                    }}
                                    data-testid="today-marker">
                                    <div
                                        className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${markerClass} px-1 py-0.5 rounded text-xs text-white whitespace-nowrap`}>
                                        Today
                                    </div>
                                </div>
                            )}

                            {/* Task rows */}
                            {people.map(person => (
                                <TaskRow
                                    key={`task-row-${person.id}`}
                                    person={person}
                                    startDate={derivedStartDate}
                                    endDate={derivedEndDate}
                                    totalMonths={totalMonths}
                                    monthWidth={150}
                                    editMode={editMode}
                                    onTaskUpdate={onTaskUpdate}
                                    onTaskClick={onTaskClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
