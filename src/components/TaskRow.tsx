import React, { useState, useRef, useEffect } from "react";
import { Person, Task, detectTaskOverlaps, calculateTaskPosition } from "../models";

interface TaskRowProps {
    person: Person;
    startDate: Date;
    endDate: Date;
    totalMonths: number;
    monthWidth: number;
    editMode?: boolean;
    onTaskUpdate?: (personId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, person: Person) => void;
}

/**
 * TaskRow Component
 *
 * Displays and manages the tasks for a single person
 */
const TaskRow: React.FC<TaskRowProps> = ({
    person,
    startDate,
    endDate,
    totalMonths,
    monthWidth,
    editMode = true,
    onTaskUpdate,
    onTaskClick,
}) => {
    // Hover and drag states
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);
    const [dragType, setDragType] = useState<"move" | "resize-left" | "resize-right" | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Reference to the row element
    const rowRef = useRef<HTMLDivElement>(null);

    // Calculate task rows to avoid overlaps
    const taskRows = detectTaskOverlaps(person.tasks);

    // Use 40px per row for height calculation, with a minimum of 60px
    // Add some padding at the bottom (20px)
    const rowHeight = Math.max(60, taskRows.length * 40 + 20);

    // Event handlers
    const handleTaskClick = (event: React.MouseEvent, task: Task) => {
        if (onTaskClick && !draggingTask) {
            onTaskClick(task, person);
        }
    };

    const handleTaskMouseEnter = (event: React.MouseEvent, task: Task) => {
        if (!draggingTask) {
            setHoveredTask(task);
            updateTooltipPosition(event);
        }
    };

    const handleTaskMouseLeave = () => {
        if (!draggingTask) {
            setHoveredTask(null);
        }
    };

    const updateTooltipPosition = (e: React.MouseEvent) => {
        if (rowRef.current) {
            const rect = rowRef.current.getBoundingClientRect();
            setTooltipPosition({
                x: e.clientX - rect.left + 20,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        // Update tooltip position for hover
        if (e instanceof MouseEvent && e.type === "mousemove") {
            if (hoveredTask) {
                const mouseEvent = e as MouseEvent;
                setTooltipPosition({
                    x: mouseEvent.clientX - (rowRef.current?.getBoundingClientRect().left || 0) + 20,
                    y: mouseEvent.clientY - (rowRef.current?.getBoundingClientRect().top || 0),
                });
            }
        } else {
            updateTooltipPosition(e as React.MouseEvent);
        }

        // Handle task dragging
        if (draggingTask && dragType && rowRef.current) {
            const rect = rowRef.current.getBoundingClientRect();
            const totalWidth = totalMonths * monthWidth;
            const deltaX = e.clientX - dragStartX;

            // Find the task element
            const taskEl = document.querySelector(`[data-task-id="${draggingTask.id}"]`) as HTMLElement;
            if (!taskEl) return;

            // Get current position and dimensions
            const currentLeft = parseFloat(taskEl.style.left);
            const currentWidth = parseFloat(taskEl.style.width);

            if (dragType === "move") {
                // Move the entire task
                const newLeft = Math.max(0, Math.min(totalWidth - currentWidth, currentLeft + deltaX));
                taskEl.style.left = `${newLeft}px`;
            } else if (dragType === "resize-left") {
                // Resize from left side
                const maxDelta = currentWidth - 20; // Minimum width
                const constrainedDelta = Math.min(maxDelta, deltaX);
                const newLeft = Math.max(0, currentLeft + constrainedDelta);
                const newWidth = Math.max(20, currentWidth - constrainedDelta);

                taskEl.style.left = `${newLeft}px`;
                taskEl.style.width = `${newWidth}px`;
            } else if (dragType === "resize-right") {
                // Resize from right side
                const newWidth = Math.max(20, Math.min(totalWidth - currentLeft, currentWidth + deltaX));
                taskEl.style.width = `${newWidth}px`;
            }

            setDragStartX(e.clientX);
        }
    };

    const handleMouseDown = (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => {
        if (!editMode) return;

        event.preventDefault();
        event.stopPropagation();

        setDraggingTask(task);
        setDragType(type);
        setDragStartX(event.clientX);

        // Add document-level event listeners
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
    };

    const handleMouseUp = () => {
        if (draggingTask && dragType && rowRef.current) {
            // Find the task element
            const taskEl = document.querySelector(`[data-task-id="${draggingTask.id}"]`) as HTMLElement;
            if (taskEl) {
                // Get final position and dimensions
                const left = parseFloat(taskEl.style.left);
                const width = parseFloat(taskEl.style.width);

                // Convert pixel position to date
                const msPerPixel = (endDate.getTime() - startDate.getTime()) / (totalMonths * monthWidth);
                const startOffset = left * msPerPixel;
                const durationMs = width * msPerPixel;

                // Calculate new dates
                const newStartDate = new Date(startDate.getTime() + startOffset);
                const newEndDate = new Date(newStartDate.getTime() + durationMs);

                // Create updated task
                const updatedTask = {
                    ...draggingTask,
                    startDate: newStartDate,
                    endDate: newEndDate,
                };

                // Call update callback
                if (onTaskUpdate) {
                    onTaskUpdate(person.id, updatedTask);
                }
            }
        }

        // Reset drag state
        setDraggingTask(null);
        setDragType(null);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
    };

    // Cleanup event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        };
    }, []);

    // Format date for tooltip
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    // Calculate duration between dates
    const getDuration = (start: Date, end: Date) => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get live date from element position during drag
    const getLiveDateFromElement = (taskId: string, dateType: "start" | "end"): Date => {
        const taskEl = document.querySelector(`[data-task-id="${taskId}"]`) as HTMLElement;
        if (!taskEl) return dateType === "start" ? startDate : endDate;

        const left = parseFloat(taskEl.style.left || "0");
        const width = parseFloat(taskEl.style.width || "0");

        // Calculate milliseconds per pixel
        const msPerPixel = (endDate.getTime() - startDate.getTime()) / (totalMonths * monthWidth);

        // Calculate date based on position
        if (dateType === "start") {
            const startOffset = left * msPerPixel;
            return new Date(startDate.getTime() + startOffset);
        } else {
            const endOffset = (left + width) * msPerPixel;
            return new Date(startDate.getTime() + endOffset);
        }
    };

    // Handle empty task list
    if (!person.tasks || person.tasks.length === 0) {
        return <div className="relative h-16">No tasks available</div>;
    }

    return (
        <div
            className="relative border-b border-gray-200"
            style={{ height: `${rowHeight}px` }}
            onMouseMove={e => handleMouseMove(e)}
            onMouseLeave={() => setHoveredTask(null)}
            ref={rowRef}
            data-testid={`task-row-${person.id}`}>
            {/* Tasks by row to avoid overlaps */}
            {taskRows.map((rowTasks, rowIndex) => (
                <React.Fragment key={`task-row-${rowIndex}`}>
                    {rowTasks.map(task => {
                        // Get position information
                        const { left, width } = calculateTaskPosition(task, startDate, endDate);

                        // Convert percentage to pixels
                        const leftPx = (parseFloat(left) * totalMonths * monthWidth) / 100;
                        const widthPx = (parseFloat(width) * totalMonths * monthWidth) / 100;

                        // Check interaction states
                        const isHovered = hoveredTask?.id === task.id;
                        const isDragging = draggingTask?.id === task.id;
                        const showHandles = (isHovered || isDragging) && editMode;

                        return (
                            <div
                                key={`task-${task.id}`}
                                className={`absolute h-8 rounded ${
                                    task.color
                                } flex items-center px-2 text-xs text-white font-medium ${
                                    editMode ? "cursor-move" : "cursor-pointer"
                                }`}
                                style={{
                                    left: `${leftPx}px`,
                                    width: `${widthPx}px`,
                                    top: `${rowIndex * 40 + 10}px`, // 40px per row with 10px offset for better spacing
                                }}
                                onClick={e => handleTaskClick(e, task)}
                                onMouseDown={e => handleMouseDown(e, task, "move")}
                                onMouseEnter={e => handleTaskMouseEnter(e, task)}
                                onMouseLeave={handleTaskMouseLeave}
                                data-testid={`task-${task.id}`}
                                data-task-id={task.id}>
                                {/* Left resize handle - only visible on hover/drag */}
                                {showHandles && (
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-l"
                                        onMouseDown={e => {
                                            e.stopPropagation();
                                            handleMouseDown(e, task, "resize-left");
                                        }}
                                    />
                                )}

                                <div className="truncate select-none">{task.name}</div>

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
                                            handleMouseDown(e, task, "resize-right");
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}

            {/* Tooltip */}
            {(hoveredTask || draggingTask) && (
                <div
                    className="absolute z-20 bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs select-none"
                    style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y - 40}px`,
                        minWidth: "150px",
                    }}>
                    <div className="font-bold mb-1">{(draggingTask || hoveredTask)?.name}</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        <div className="font-semibold">Start:</div>
                        <div>
                            {dragType && draggingTask
                                ? // Calculate and show live date during drag
                                  formatDate(getLiveDateFromElement(draggingTask.id, "start"))
                                : formatDate((draggingTask || hoveredTask)!.startDate)}
                        </div>
                        <div className="font-semibold">End:</div>
                        <div>
                            {dragType && draggingTask
                                ? // Calculate and show live date during drag
                                  formatDate(getLiveDateFromElement(draggingTask.id, "end"))
                                : formatDate((draggingTask || hoveredTask)!.endDate)}
                        </div>
                        <div className="font-semibold">Duration:</div>
                        <div>
                            {dragType && draggingTask
                                ? // Calculate live duration
                                  getDuration(
                                      getLiveDateFromElement(draggingTask.id, "start"),
                                      getLiveDateFromElement(draggingTask.id, "end")
                                  )
                                : getDuration(
                                      (draggingTask || hoveredTask)!.startDate,
                                      (draggingTask || hoveredTask)!.endDate
                                  )}{" "}
                            days
                        </div>
                        {(draggingTask || hoveredTask)?.percent !== undefined && (
                            <>
                                <div className="font-semibold">Progress:</div>
                                <div>{(draggingTask || hoveredTask)!.percent}%</div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskRow;
