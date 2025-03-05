import React, { useState, useRef, useEffect } from "react";
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
import TaskRow from "./Task/TaskRow";

/**
 * GanttChart Component
 *
 * A simple, month-based Gantt chart for project timelines
 */
const GanttChart: React.FC<GanttChartProps> = ({
    people = [], // Provide empty array as default to avoid undefined
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

    // Validate people array to ensure it's valid
    const validPeople = Array.isArray(people) ? people : [];

    // Find the earliest and latest dates if not provided
    const derivedStartDate = customStartDate || findEarliestDate(validPeople);
    const derivedEndDate = customEndDate || findLatestDate(validPeople);

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
        validPeople.forEach(person => {
            if (person && Array.isArray(person.tasks)) {
                const taskRows = detectTaskOverlaps(person.tasks);
                height += Math.max(60, taskRows.length * 40 + 20); // 40px per row + padding
            } else {
                // Default height for person with no valid tasks
                height += 60;
            }
        });
        return height;
    };

    // Apply theme classes
    const headerBgClass = theme?.headerBackground || "bg-white";
    const headerTextClass = theme?.headerText || "text-gray-700";
    const borderClass = theme?.borderColor || "border-gray-200";
    const highlightClass = theme?.backgroundHighlight || "bg-blue-50";
    const markerClass = theme?.todayMarkerColor || "bg-red-500";

    // Format month with year for display
    const formatMonthYear = (date: Date) => {
        if (!(date instanceof Date)) return "";
        return date.toLocaleString("default", { month: "short", year: "2-digit" });
    };

    // Handle task updates - this will trigger re-render and recalculate collisions
    const handleTaskUpdate = (personId: string, updatedTask: Task) => {
        if (onTaskUpdate) {
            try {
                // Ensure we have Date objects
                const ensuredTask = {
                    ...updatedTask,
                    startDate:
                        updatedTask.startDate instanceof Date ? updatedTask.startDate : new Date(updatedTask.startDate),
                    endDate: updatedTask.endDate instanceof Date ? updatedTask.endDate : new Date(updatedTask.endDate),
                };

                // Call the parent's onTaskUpdate function
                onTaskUpdate(personId, ensuredTask);
            } catch (error) {
                console.error("Error in handleTaskUpdate:", error);
            }
        } else {
            console.warn("onTaskUpdate is not defined");
        }
    };

    // Handle task clicks
    const handleTaskClick = (task: Task, person: Person) => {
        if (onTaskClick) {
            try {
                onTaskClick(task, person);
            } catch (error) {
                console.error("Error in handleTaskClick:", error);
            }
        }
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
                    <div className="p-2 font-semibold text-gray-700 border-r border-b border-gray-200 h-10.5">
                        Team Member
                    </div>

                    {/* Person names */}
                    {validPeople.map(person => {
                        if (!person) return null;

                        const tasks = Array.isArray(person.tasks) ? person.tasks : [];
                        const taskRows = detectTaskOverlaps(tasks);
                        const rowHeight = Math.max(60, taskRows.length * 40 + 20);

                        return (
                            <div
                                key={`person-${person.id || "unknown"}`}
                                className="p-2 border-r border-b border-gray-200 font-medium"
                                style={{ height: `${rowHeight}px` }}
                                data-testid={`person-label-${person.id || "unknown"}`}>
                                <div className="font-medium">{person.name || "Unnamed"}</div>
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
                            {validPeople.map(person => {
                                if (!person || !person.id) return null;

                                return (
                                    <TaskRow
                                        key={`task-row-${person.id}`}
                                        person={person}
                                        startDate={derivedStartDate}
                                        endDate={derivedEndDate}
                                        totalMonths={totalMonths}
                                        monthWidth={150}
                                        editMode={editMode}
                                        onTaskUpdate={handleTaskUpdate}
                                        onTaskClick={handleTaskClick}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
