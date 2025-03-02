import React, { useState, useRef, useEffect } from "react";
import {
    TaskRowProps,
    Task,
    detectCollisions,
    formatDate,
    DateDisplayFormat,
    getDuration,
    calculateTaskPosition,
} from "../models";

/**
 * TaskRow Component
 *
 * Displays and manages the tasks for a person/resource
 */
const TaskRow: React.FC<TaskRowProps> = ({
    person,
    startDate,
    endDate,
    columnWidth,
    theme,
    onTaskUpdate,
    onTaskClick,
}) => {
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);
    const [dragType, setDragType] = useState<"move" | "resize-start" | "resize-end" | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const rowRef = useRef<HTMLDivElement>(null);

    // Get the position and width for a task based on its dates
    const getTaskDisplay = (task: Task) => {
        return calculateTaskPosition(task, startDate, endDate, columnWidth);
    };

    // Format date for display
    const formatDateForDisplay = (date: Date) => {
        return formatDate(date, DateDisplayFormat.FULL_DATE);
    };

    // Handle mouse down on a task (for drag to move or resize)
    const handleMouseDown = (e: React.MouseEvent, task: Task, type: "move" | "resize-start" | "resize-end") => {
        e.preventDefault();
        setDraggingTask(task);
        setDragType(type);
        setDragStartX(e.clientX);
        updateTooltipPosition(e);

        // Add the mouse up listener to the document
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleDocumentMouseMove);
    };

    // Handle mouse move for tooltips and dragging
    const handleMouseMove = (e: React.MouseEvent) => {
        if (hoveredTask) {
            updateTooltipPosition(e);
        }
    };

    // Handle document mouse move for dragging tasks
    const handleDocumentMouseMove = (e: MouseEvent) => {
        if (!draggingTask || !dragType || !rowRef.current) return;

        const rect = rowRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragStartX;

        // Calculate days per pixel based on column width
        const daysPerPixel = getDuration(startDate, endDate) / rect.width;
        const daysDelta = deltaX * daysPerPixel;

        let newStartDate = new Date(draggingTask.startDate);
        let newEndDate = new Date(draggingTask.endDate);

        if (dragType === "move") {
            // Move the entire task
            newStartDate = new Date(newStartDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
            newEndDate = new Date(newEndDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
        } else if (dragType === "resize-start") {
            // Resize from the start (move start date)
            newStartDate = new Date(newStartDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
        } else if (dragType === "resize-end") {
            // Resize from the end (move end date)
            newEndDate = new Date(newEndDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
        }

        // Ensure the task stays within the timeline boundaries
        if (newStartDate < startDate) {
            newStartDate = new Date(startDate);
            if (dragType === "move") {
                const duration = getDuration(draggingTask.startDate, draggingTask.endDate);
                newEndDate = new Date(newStartDate.getTime() + duration * 24 * 60 * 60 * 1000);
            }
        }

        if (newEndDate > endDate) {
            newEndDate = new Date(endDate);
            if (dragType === "move") {
                const duration = getDuration(draggingTask.startDate, draggingTask.endDate);
                newStartDate = new Date(newEndDate.getTime() - duration * 24 * 60 * 60 * 1000);
            }
        }

        // Ensure end date is not before start date
        if (newEndDate < newStartDate) {
            if (dragType === "resize-start") {
                newStartDate = new Date(newEndDate);
            } else {
                newEndDate = new Date(newStartDate);
            }
        }

        // Update the task
        const updatedTask = { ...draggingTask, startDate: newStartDate, endDate: newEndDate };
        if (onTaskUpdate) {
            onTaskUpdate(person.id, updatedTask);
        }

        setDraggingTask(updatedTask);
        setDragStartX(e.clientX);
    };

    // Handle mouse up after dragging
    const handleMouseUp = () => {
        setDraggingTask(null);
        setDragType(null);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleDocumentMouseMove);
    };

    // Update tooltip position
    const updateTooltipPosition = (e: React.MouseEvent) => {
        if (rowRef.current) {
            const rect = rowRef.current.getBoundingClientRect();
            setTooltipPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    // Click handler for tasks
    const handleTaskClick = (e: React.MouseEvent, task: Task) => {
        e.stopPropagation();
        if (onTaskClick) {
            onTaskClick(task, person);
        }
    };

    // Clean up event listeners
    useEffect(() => {
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleDocumentMouseMove);
        };
    }, []);

    // Group tasks into rows to avoid overlapping
    const taskRows = detectCollisions(person.tasks);
    const rowHeight = taskRows.length * 40; // 40px per task row

    // Define some theme-based classes
    const tooltipBgClass = theme?.tooltipBackground || "bg-white";
    const tooltipTextClass = theme?.tooltipText || "text-gray-700";

    return (
        <div
            className="task-row relative border-b border-gray-200"
            style={{ height: `${Math.max(60, rowHeight)}px` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredTask(null)}
            ref={rowRef}>
            {/* Render each task in its appropriate row */}
            {taskRows.map((rowTasks, rowIndex) =>
                rowTasks.map(task => {
                    const { left, width, isOutOfRange } = getTaskDisplay(task);

                    // Skip tasks outside the visible range
                    if (isOutOfRange) return null;

                    // Determine if task is being hovered or dragged
                    const isActive = hoveredTask?.id === task.id || draggingTask?.id === task.id;

                    return (
                        <React.Fragment key={task.id}>
                            <div
                                className={`absolute h-8 rounded-md ${
                                    task.color || "bg-blue-500"
                                } z-10 flex items-center px-2 text-xs text-white font-medium cursor-move shadow-sm hover:shadow transition-shadow duration-150`}
                                style={{
                                    left,
                                    width,
                                    top: `${rowIndex * 40 + 4}px`,
                                }}
                                onMouseDown={e => handleMouseDown(e, task, "move")}
                                onMouseEnter={() => setHoveredTask(task)}
                                onClick={e => handleTaskClick(e, task)}>
                                {/* Task name with ellipsis if too long */}
                                <span className="truncate select-none">{task.name}</span>

                                {/* Task progress indicator (optional) */}
                                {task.percent !== undefined && (
                                    <div className="absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full"
                                            style={{ width: `${task.percent}%` }}></div>
                                    </div>
                                )}

                                {/* Resize handles (only shown when active) */}
                                {isActive && (
                                    <>
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
                                            onMouseDown={e => {
                                                e.stopPropagation();
                                                handleMouseDown(e, task, "resize-start");
                                            }}>
                                            <div className="absolute left-[3px] w-1 h-[16px] top-1/2 -translate-y-1/2 bg-white rounded-full"></div>
                                        </div>
                                        <div
                                            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
                                            onMouseDown={e => {
                                                e.stopPropagation();
                                                handleMouseDown(e, task, "resize-end");
                                            }}>
                                            <div className="absolute right-[3px] w-1 h-[16px] top-1/2 -translate-y-1/2 bg-white rounded-full"></div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Tooltip */}
                            {isActive && (
                                <div
                                    className={`absolute z-50 ${tooltipBgClass} border border-gray-200 rounded-md shadow-lg p-3 text-xs select-none`}
                                    style={{
                                        left: `${tooltipPosition.x + 10}px`,
                                        top: `${tooltipPosition.y - 80}px`,
                                        minWidth: "200px",
                                    }}>
                                    <div className="font-bold mb-1 text-sm">{task.name}</div>
                                    <div className={`${tooltipTextClass} grid grid-cols-2 gap-x-3 gap-y-1`}>
                                        <div className="font-semibold">Start:</div>
                                        <div>{formatDateForDisplay(task.startDate)}</div>
                                        <div className="font-semibold">End:</div>
                                        <div>{formatDateForDisplay(task.endDate)}</div>
                                        <div className="font-semibold">Duration:</div>
                                        <div>{getDuration(task.startDate, task.endDate)} days</div>
                                        {task.percent !== undefined && (
                                            <>
                                                <div className="font-semibold">Progress:</div>
                                                <div>{task.percent}%</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })
            )}
        </div>
    );
};

export default TaskRow;
