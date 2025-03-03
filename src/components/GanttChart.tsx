import React, { useState, useRef } from "react";
import TaskRow from "./TaskRow";
import {
    GanttChartProps,
    DEFAULT_THEME,
    Person,
    Task,
    getMonthsBetween,
    findEarliestDate,
    findLatestDate,
} from "../models";

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
    // Find the earliest and latest dates if not provided
    const derivedStartDate = customStartDate || findEarliestDate(people);
    const derivedEndDate = customEndDate || findLatestDate(people);

    // Get all months for the timeline
    const months = getMonthsBetween(derivedStartDate, derivedEndDate);
    const totalMonths = months.length;

    // Calculate total days in the timeline for proportional calculations
    const totalDays = Math.round((derivedEndDate.getTime() - derivedStartDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate current date marker position
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = months.findIndex(
        month => month.getMonth() === currentMonth && month.getFullYear() === currentYear
    );

    const containerRef = useRef<HTMLDivElement>(null);

    // Handle task updates
    const handleTaskUpdate = (personId: string, updatedTask: Task) => {
        console.log(`GanttChart received update for task ${updatedTask.id} in person ${personId}`);
        console.log(`New dates: ${updatedTask.startDate.toISOString()} - ${updatedTask.endDate.toISOString()}`);

        if (onTaskUpdate) {
            // Pass the update to the parent component
            onTaskUpdate(personId, updatedTask);
        } else {
            // If no onTaskUpdate is provided, we should at least log this
            console.warn("No onTaskUpdate handler provided to GanttChart");
        }
    };

    // Handle task clicks
    const handleTaskClick = (task: Task, person: Person) => {
        if (onTaskClick) {
            onTaskClick(task, person);
        }
    };

    // Apply theme classes
    const headerBgClass = theme.headerBackground || "bg-white";
    const headerTextClass = theme.headerText || "text-gray-700";
    const borderClass = theme.borderColor || "border-gray-200";
    const highlightClass = theme.backgroundHighlight || "bg-blue-50";
    const markerClass = theme.todayMarkerColor || "bg-red-500";

    return (
        <div
            ref={containerRef}
            className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
            data-testid="gantt-chart">
            {/* Header with title */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>

            {/* Gantt content */}
            <div className="p-4">
                {/* Timeline header */}
                <div className="flex border-b border-gray-200">
                    {/* Name column */}
                    <div className="w-40 flex-shrink-0 p-2 font-semibold text-gray-700 border-r border-gray-200">
                        Team Member
                    </div>

                    {/* Month columns */}
                    <div className="flex-grow flex">
                        {months.map((month, index) => (
                            <div
                                key={index}
                                className={`flex-1 p-2 font-semibold text-center ${
                                    index === currentMonthIndex ? highlightClass : ""
                                }`}
                                data-month={month.toISOString()}>
                                {month.toLocaleString("default", { month: "short", year: "2-digit" })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Container for tasks and today marker */}
                <div className="relative">
                    {/* Today marker */}
                    {showCurrentDateMarker && currentMonthIndex >= 0 && (
                        <div
                            className={`absolute top-0 w-px ${markerClass} z-10`}
                            style={{
                                left: `${((currentMonthIndex + 0.5) / months.length) * 100}%`,
                                height: "100%",
                            }}
                            data-testid="today-marker">
                            <div
                                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${markerClass} px-1 py-0.5 rounded text-xs text-white whitespace-nowrap`}>
                                Today
                            </div>
                        </div>
                    )}

                    {/* People and tasks */}
                    {people.map(person => (
                        <div
                            key={person.id}
                            className="flex border-b border-gray-200 hover:bg-gray-50"
                            data-testid={`person-row-${person.id}`}>
                            {/* Person info */}
                            <div className="w-40 flex-shrink-0 p-2 border-r border-gray-200">
                                <div className="font-medium">{person.name}</div>
                                {person.role && <div className="text-xs text-gray-500">{person.role}</div>}
                            </div>

                            {/* Tasks timeline */}
                            <div className="flex-grow">
                                <TaskRow
                                    person={person}
                                    startDate={derivedStartDate}
                                    endDate={derivedEndDate}
                                    totalDays={totalDays}
                                    onTaskUpdate={handleTaskUpdate}
                                    editMode={editMode}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
