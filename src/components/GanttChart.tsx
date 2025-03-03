import React, { useState, useRef } from "react";
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

    // Drag state for tasks
    const [draggingTask, setDraggingTask] = useState<{ task: Task; person: Person } | null>(null);
    const [dragType, setDragType] = useState<"move" | "resize-left" | "resize-right" | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

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

    // Event handlers
    const handleTaskClick = (event: React.MouseEvent, task: Task, person: Person) => {
        if (onTaskClick && !draggingTask) {
            onTaskClick(task, person);
        }
    };

    const handleTaskMouseEnter = (event: React.MouseEvent, task: Task, person: Person) => {
        if (!draggingTask) {
            setHoveredTask({ task, person });
            setTooltipPosition({ x: event.clientX, y: event.clientY });
        }
    };

    const handleTaskMouseLeave = () => {
        if (!draggingTask) {
            setHoveredTask(null);
        }
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        // Update tooltip position
        if (hoveredTask) {
            setTooltipPosition({ x: event.clientX, y: event.clientY });
        }

        // Handle task dragging
        if (draggingTask && dragType && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const deltaX = event.clientX - dragStartX;
            const deltaPercentage = (deltaX / rect.width) * 100;

            // Find corresponding task element
            const taskEl = document.querySelector(`[data-task-id="${draggingTask.task.id}"]`) as HTMLElement;
            if (!taskEl) return;

            // Get current position and dimensions
            const currentLeft = parseFloat(taskEl.style.left);
            const currentWidth = parseFloat(taskEl.style.width);

            // Calculate duration in months
            const taskMonths =
                (draggingTask.task.endDate.getTime() - draggingTask.task.startDate.getTime()) /
                (30 * 24 * 60 * 60 * 1000); // Approximate month duration

            if (dragType === "move") {
                // Move the entire task
                const newLeft = Math.max(0, Math.min(100 - currentWidth, currentLeft + deltaPercentage));
                taskEl.style.left = `${newLeft}%`;
            } else if (dragType === "resize-left") {
                // Resize from left side
                const maxDelta = currentWidth - 5; // Minimum width of 5%
                const constrainedDelta = Math.min(maxDelta, deltaPercentage);
                const newLeft = Math.max(0, currentLeft + constrainedDelta);
                const newWidth = Math.max(5, currentWidth - constrainedDelta);

                taskEl.style.left = `${newLeft}%`;
                taskEl.style.width = `${newWidth}%`;
            } else if (dragType === "resize-right") {
                // Resize from right side
                const newWidth = Math.max(5, Math.min(100 - currentLeft, currentWidth + deltaPercentage));
                taskEl.style.width = `${newWidth}%`;
            }

            setDragStartX(event.clientX);
        }
    };

    const handleMouseDown = (
        event: React.MouseEvent,
        task: Task,
        person: Person,
        type: "move" | "resize-left" | "resize-right"
    ) => {
        if (!editMode) return;

        event.preventDefault();
        event.stopPropagation();

        setDraggingTask({ task, person });
        setDragType(type);
        setDragStartX(event.clientX);

        // Add document-level event listeners
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseUp = () => {
        if (draggingTask && dragType && containerRef.current) {
            // Find corresponding task element
            const taskEl = document.querySelector(`[data-task-id="${draggingTask.task.id}"]`) as HTMLElement;
            if (taskEl) {
                // Get final position and dimensions
                const left = parseFloat(taskEl.style.left);
                const width = parseFloat(taskEl.style.width);

                // Convert percentage position to months
                const startMonthIndex = Math.floor((left / 100) * totalMonths);
                const durationMonths = Math.ceil((width / 100) * totalMonths);

                // Calculate new dates
                if (startMonthIndex >= 0 && startMonthIndex < months.length) {
                    const newStartMonth = months[startMonthIndex];
                    let newEndMonthIndex = startMonthIndex + durationMonths - 1;

                    // Ensure end month is within range
                    if (newEndMonthIndex >= months.length) {
                        newEndMonthIndex = months.length - 1;
                    }

                    const newEndMonth = months[newEndMonthIndex];

                    // Create new dates preserving day if possible
                    const newStartDate = new Date(
                        newStartMonth.getFullYear(),
                        newStartMonth.getMonth(),
                        Math.min(
                            draggingTask.task.startDate.getDate(),
                            getDaysInMonth(newStartMonth.getFullYear(), newStartMonth.getMonth())
                        )
                    );

                    const newEndDate = new Date(
                        newEndMonth.getFullYear(),
                        newEndMonth.getMonth(),
                        Math.min(
                            draggingTask.task.endDate.getDate(),
                            getDaysInMonth(newEndMonth.getFullYear(), newEndMonth.getMonth())
                        )
                    );

                    // Create updated task
                    const updatedTask = {
                        ...draggingTask.task,
                        startDate: newStartDate,
                        endDate: newEndDate,
                    };

                    // Call update callback
                    if (onTaskUpdate) {
                        onTaskUpdate(draggingTask.person.id, updatedTask);
                    }
                }
            }
        }

        // Reset drag state
        setDraggingTask(null);
        setDragType(null);
        document.removeEventListener("mouseup", handleMouseUp);
    };

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

                {/* Container for tasks and today marker */}
                <div className="relative">
                    {/* Today marker - Only rendered once */}
                    {showCurrentDateMarker && currentMonthIndex >= 0 && (
                        <div
                            className={`absolute top-0 w-px ${markerClass} z-10`}
                            style={{
                                left: `${((currentMonthIndex + 0.5) / months.length) * 100}%`,
                                height: `${getTotalHeight()}px`,
                            }}
                            data-testid="today-marker">
                            <div
                                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${markerClass} px-1 py-0.5 rounded text-xs text-white whitespace-nowrap`}>
                                Today
                            </div>
                        </div>
                    )}

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

                                                // Check if this task is currently hovered
                                                const isHovered = hoveredTask?.task.id === task.id;
                                                const isDragging = draggingTask?.task.id === task.id;
                                                const showHandles = (isHovered || isDragging) && editMode;

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
                                                        onMouseDown={e => handleMouseDown(e, task, person, "move")}
                                                        onMouseEnter={e => handleTaskMouseEnter(e, task, person)}
                                                        onMouseLeave={handleTaskMouseLeave}
                                                        data-testid={`task-${task.id}`}
                                                        data-task-id={task.id}>
                                                        {/* Left resize handle - only visible on hover/drag */}
                                                        {showHandles && (
                                                            <div
                                                                className="absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-l"
                                                                onMouseDown={e => {
                                                                    e.stopPropagation();
                                                                    handleMouseDown(e, task, person, "resize-left");
                                                                }}
                                                            />
                                                        )}

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

                                                        {/* Right resize handle - only visible on hover/drag */}
                                                        {showHandles && (
                                                            <div
                                                                className="absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-r"
                                                                onMouseDown={e => {
                                                                    e.stopPropagation();
                                                                    handleMouseDown(e, task, person, "resize-right");
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tooltip */}
            {hoveredTask && !draggingTask && (
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

// Helper function to get days in month
function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

export default GanttChart;
