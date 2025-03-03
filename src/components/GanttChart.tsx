import React, { useState } from "react";
import {
    GanttChartProps,
    DEFAULT_THEME,
    Person,
    Task,
    getMonthsBetween,
    calculateTaskPosition,
    detectTaskOverlaps,
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
    // Hover state for tooltips
    const [hoveredTask, setHoveredTask] = useState<{ task: Task; person: Person } | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Find the earliest and latest dates if not provided
    const derivedStartDate = customStartDate || findEarliestDate(people);
    const derivedEndDate = customEndDate || findLatestDate(people);

    // Get all months for the timeline
    const months = getMonthsBetween(derivedStartDate, derivedEndDate);

    // Calculate current date marker position
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = months.findIndex(
        month => month.getMonth() === currentMonth && month.getFullYear() === currentYear
    );

    // Event handlers
    const handleTaskClick = (event: React.MouseEvent, task: Task, person: Person) => {
        if (onTaskClick) {
            onTaskClick(task, person);
        }
    };

    const handleTaskMouseEnter = (event: React.MouseEvent, task: Task, person: Person) => {
        setHoveredTask({ task, person });
        setTooltipPosition({ x: event.clientX, y: event.clientY });
    };

    const handleTaskMouseLeave = () => {
        setHoveredTask(null);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (hoveredTask) {
            setTooltipPosition({ x: event.clientX, y: event.clientY });
        }
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
            className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
            data-testid="gantt-chart"
            onMouseMove={handleMouseMove}>
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
                                {formatMonthYear(month)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* People and tasks */}
                {people.map(person => {
                    // Calculate how many rows of tasks we need
                    const taskRows = detectTaskOverlaps(person.tasks);
                    const rowHeight = Math.max(60, taskRows.length * 30 + 15); // Min height or 30px per row + padding

                    return (
                        <div
                            key={person.id}
                            className="flex border-b border-gray-200 hover:bg-gray-50"
                            data-testid={`person-row-${person.id}`}>
                            {/* Person info */}
                            <div
                                className="w-40 flex-shrink-0 p-2 border-r border-gray-200"
                                style={{ height: `${rowHeight}px` }}>
                                <div className="font-medium">{person.name}</div>
                                {person.role && <div className="text-xs text-gray-500">{person.role}</div>}
                            </div>

                            {/* Tasks timeline */}
                            <div className="flex-grow relative" style={{ height: `${rowHeight}px` }}>
                                {/* Tasks by row to avoid overlaps */}
                                {taskRows.map((rowTasks, rowIndex) => (
                                    <React.Fragment key={rowIndex}>
                                        {rowTasks.map(task => {
                                            // Calculate position
                                            const { left, width } = calculateTaskPosition(
                                                task,
                                                derivedStartDate,
                                                derivedEndDate
                                            );

                                            return (
                                                <div
                                                    key={task.id}
                                                    className={`absolute h-8 rounded ${
                                                        task.color
                                                    } flex items-center px-2 text-xs text-white font-medium ${
                                                        editMode ? "cursor-move" : "cursor-pointer"
                                                    }`}
                                                    style={{
                                                        left: left,
                                                        width: width,
                                                        top: `${rowIndex * 30 + 15}px`,
                                                    }}
                                                    onClick={e => handleTaskClick(e, task, person)}
                                                    onMouseEnter={e => handleTaskMouseEnter(e, task, person)}
                                                    onMouseLeave={handleTaskMouseLeave}
                                                    data-testid={`task-${task.id}`}
                                                    data-task-id={task.id}>
                                                    <div className="truncate">{task.name}</div>

                                                    {/* Progress bar */}
                                                    {task.percent !== undefined && (
                                                        <div className="absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-white rounded-full"
                                                                style={{ width: `${task.percent}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}

                                {/* Current date marker - Only rendered once per person row */}
                                {showCurrentDateMarker && currentMonthIndex >= 0 && rowHeight > 0 && (
                                    <div
                                        className={`absolute top-0 bottom-0 w-px ${markerClass} z-10`}
                                        style={{
                                            left: `${((currentMonthIndex + 0.5) / months.length) * 100}%`,
                                        }}
                                        data-testid="today-marker">
                                        {/* Only show "Today" label on first row */}
                                        {person === people[0] && (
                                            <div
                                                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${markerClass} px-1 py-0.5 rounded text-xs text-white whitespace-nowrap`}>
                                                Today
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tooltip */}
            {hoveredTask && (
                <div
                    className="fixed z-50 bg-white shadow-lg rounded-md border border-gray-200 p-3 text-xs"
                    style={{
                        left: `${tooltipPosition.x + 10}px`,
                        top: `${tooltipPosition.y - 80}px`,
                        minWidth: "200px",
                    }}>
                    <div className="font-bold mb-1 text-sm">{hoveredTask.task.name}</div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <div className="font-semibold">Start:</div>
                        <div>{hoveredTask.task.startDate.toLocaleDateString()}</div>
                        <div className="font-semibold">End:</div>
                        <div>{hoveredTask.task.endDate.toLocaleDateString()}</div>
                        {hoveredTask.task.percent !== undefined && (
                            <>
                                <div className="font-semibold">Progress:</div>
                                <div>{hoveredTask.task.percent}%</div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GanttChart;
