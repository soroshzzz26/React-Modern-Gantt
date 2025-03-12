import React, { useState, useRef, useEffect } from "react";
import { Task, TaskGroup, TaskRowProps, ViewMode } from "../utils/types";
import { CollisionManager } from "../utils/CollisionManager";
import { TaskManager } from "../utils/TaskManager";
import TaskItem from "./TaskItem";
import Tooltip from "./Tooltip";

/**
 *  TaskRow Component
 *
 * Displays and manages the tasks for a single task group
 * Supports different view modes
 */
const TaskRow: React.FC<TaskRowProps> = ({
    taskGroup,
    startDate,
    endDate,
    totalMonths,
    monthWidth,
    editMode = true,
    showProgress = false,
    className = "",
    tooltipClassName = "",
    onTaskUpdate,
    onTaskClick,
    onTaskSelect,
    viewMode = ViewMode.MONTH,
}) => {
    if (!taskGroup || !taskGroup.id || !Array.isArray(taskGroup.tasks)) {
        console.warn("TaskRow: Invalid task group data", taskGroup);
        return <div className="relative h-16 text-gantt-text">Invalid task group data</div>;
    }

    // Ensure valid dates
    const validStartDate = startDate instanceof Date ? startDate : new Date();
    const validEndDate = endDate instanceof Date ? endDate : new Date();

    // Task interaction states
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);
    const [dragType, setDragType] = useState<"move" | "resize-left" | "resize-right" | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [previewTask, setPreviewTask] = useState<Task | null>(null);
    const [initialTaskState, setInitialTaskState] = useState<{
        left: number;
        width: number;
        startDate: Date;
        endDate: Date;
    } | null>(null);

    // Refs for task interactions
    const rowRef = useRef<HTMLDivElement>(null);
    const draggingTaskRef = useRef<Task | null>(null);
    const previewTaskRef = useRef<Task | null>(null);

    // Instance ID to prevent cross-chart interactions
    const instanceId = useRef(`task-row-${Math.random().toString(36).substring(2, 11)}`);

    // Task update helpers
    const updateDraggingTask = (task: Task) => {
        setDraggingTask(task);
        draggingTaskRef.current = task;
    };

    const updatePreviewTask = (task: Task) => {
        setPreviewTask(task);
        previewTaskRef.current = task;
    };

    // Calculate task rows based on collision detection and view mode
    const taskRows = previewTask
        ? CollisionManager.getPreviewArrangement(previewTask, taskGroup.tasks, viewMode)
        : CollisionManager.detectOverlaps(taskGroup.tasks, viewMode);

    // Calculate row height based on task arrangement
    const rowHeight = Math.max(60, taskRows.length * 40 + 20);

    // Task interaction handlers
    const handleTaskClick = (event: React.MouseEvent, task: Task) => {
        if (onTaskClick && !draggingTask) {
            onTaskClick(task, taskGroup);
        }

        if (onTaskSelect) {
            onTaskSelect(task, true);
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

    const handleMouseDown = (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => {
        if (!editMode) return;

        event.preventDefault();
        event.stopPropagation();

        // Find the task element
        const taskEl = document.querySelector(
            `[data-task-id="${task.id}"][data-instance-id="${instanceId.current}"]`
        ) as HTMLElement;

        if (!taskEl) return;

        // Store the initial state
        setInitialTaskState({
            left: parseFloat(taskEl.style.left || "0"),
            width: parseFloat(taskEl.style.width || "0"),
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
        });

        // Set up dragging state
        setDraggingTask(task);
        setDragType(type);
        setDragStartX(event.clientX);
        setPreviewTask(task);

        updateDraggingTask(task);
        updatePreviewTask(task);

        // Add global event listeners
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
    };

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        // Update tooltip position
        if (e instanceof MouseEvent && hoveredTask && rowRef.current) {
            const mouseEvent = e as MouseEvent;
            const rect = rowRef.current.getBoundingClientRect();
            setTooltipPosition({
                x: mouseEvent.clientX - rect.left + 20,
                y: mouseEvent.clientY - rect.top,
            });
        } else if (!(e instanceof MouseEvent)) {
            updateTooltipPosition(e as React.MouseEvent);
        }

        // Handle task dragging and resizing
        if (draggingTask && dragType && initialTaskState && rowRef.current) {
            try {
                const taskEl = document.querySelector(
                    `[data-task-id="${draggingTask.id}"][data-instance-id="${instanceId.current}"]`
                ) as HTMLElement;

                if (!taskEl) return;

                // Calculate the total movement since drag started
                const totalDeltaX = e.clientX - dragStartX;

                // Get the timeline's total width
                const totalWidth = totalMonths * monthWidth;

                let newLeft = initialTaskState.left;
                let newWidth = initialTaskState.width;

                // Apply movement based on drag type
                switch (dragType) {
                    case "move":
                        // Move task
                        newLeft = Math.max(
                            0,
                            Math.min(totalWidth - initialTaskState.width, initialTaskState.left + totalDeltaX)
                        );

                        // Apply snapping based on view mode - improved for day view
                        if (viewMode === ViewMode.DAY) {
                            // Snap exactly to day boundaries
                            newLeft = Math.floor(newLeft / monthWidth) * monthWidth;
                        }

                        taskEl.style.left = `${newLeft}px`;
                        break;

                    case "resize-left":
                        // Resize from left (min width = 20px)
                        const maxLeftDelta = initialTaskState.width - 20;
                        const leftDelta = Math.min(maxLeftDelta, totalDeltaX);

                        newLeft = Math.max(0, initialTaskState.left + leftDelta);

                        // Apply snapping based on view mode - improved for day view
                        if (viewMode === ViewMode.DAY) {
                            newLeft = Math.floor(newLeft / monthWidth) * monthWidth;
                        }

                        // Calculate width to maintain right edge position
                        const rightEdge = initialTaskState.left + initialTaskState.width;
                        newWidth = Math.max(20, rightEdge - newLeft);

                        taskEl.style.left = `${newLeft}px`;
                        taskEl.style.width = `${newWidth}px`;
                        break;

                    case "resize-right":
                        // Resize from right (min width = 20px)
                        newWidth = Math.max(
                            20,
                            Math.min(totalWidth - initialTaskState.left, initialTaskState.width + totalDeltaX)
                        );

                        // Apply snapping based on view mode - improved for day view
                        if (viewMode === ViewMode.DAY) {
                            const rightEdge = initialTaskState.left + newWidth;
                            const snappedRightEdge = Math.ceil(rightEdge / monthWidth) * monthWidth;
                            newWidth = Math.max(20, snappedRightEdge - initialTaskState.left);
                        }

                        taskEl.style.width = `${newWidth}px`;
                        break;
                }

                // Calculate the time range for the different view modes
                const timelineRange = getTimelineRangeForViewMode(validStartDate, validEndDate, viewMode);
                const msPerPixel = timelineRange / totalWidth;

                let newStartMs = validStartDate.getTime() + newLeft * msPerPixel;
                let newEndMs = validStartDate.getTime() + (newLeft + newWidth) * msPerPixel;

                // Apply date normalization based on view mode
                const { newStartDate, newEndDate } = normalizeDatesForViewMode(
                    new Date(newStartMs),
                    new Date(newEndMs),
                    viewMode
                );

                // Create updated task with the new dates
                const updatedTask = {
                    ...draggingTask,
                    startDate: newStartDate,
                    endDate: newEndDate,
                };

                // Update preview state
                setPreviewTask(updatedTask);
                updatePreviewTask(updatedTask);
            } catch (error) {
                console.error("Error in handleMouseMove:", error);
            }
        }
    };

    // Helper function to get timeline range based on view mode
    const getTimelineRangeForViewMode = (start: Date, end: Date, viewMode: ViewMode): number => {
        // Ensure consistent time boundaries
        const startTime = new Date(start).setHours(0, 0, 0, 0);
        const endTime = new Date(end).setHours(23, 59, 59, 999);
        const fullRange = endTime - startTime;

        // For day view, ensure exact day-based calculation
        if (viewMode === ViewMode.DAY) {
            return fullRange;
        }

        return fullRange;
    };

    // Helper function to normalize dates based on view mode
    const normalizeDatesForViewMode = (
        startDate: Date,
        endDate: Date,
        viewMode: ViewMode
    ): { newStartDate: Date; newEndDate: Date } => {
        let newStartDate = new Date(startDate);
        let newEndDate = new Date(endDate);

        switch (viewMode) {
            case ViewMode.DAY:
                // Set exact day boundaries for consistent behavior
                newStartDate = new Date(
                    newStartDate.getFullYear(),
                    newStartDate.getMonth(),
                    newStartDate.getDate(),
                    0,
                    0,
                    0,
                    0
                );
                newEndDate = new Date(
                    newEndDate.getFullYear(),
                    newEndDate.getMonth(),
                    newEndDate.getDate(),
                    23,
                    59,
                    59,
                    999
                );
                break;

            case ViewMode.WEEK:
                // For week view, could snap to week boundaries but often not needed
                break;

            case ViewMode.MONTH:
                // For month view, leave the day within month as is
                break;

            case ViewMode.QUARTER:
                // For quarter view, keep the month within quarter
                break;

            case ViewMode.YEAR:
                // For year view, keep the month within year
                break;
        }

        return { newStartDate, newEndDate };
    };

    const handleMouseUp = () => {
        try {
            const currentDraggingTask = draggingTaskRef.current;
            const currentPreviewTask = previewTaskRef.current;

            // Update the task if dragging is complete
            if (currentDraggingTask && currentPreviewTask && onTaskUpdate) {
                onTaskUpdate(taskGroup.id, currentPreviewTask);
            }
        } catch (error) {
            console.error("Error in handleMouseUp:", error);
        } finally {
            // Reset all drag states
            setDraggingTask(null);
            setDragType(null);
            setPreviewTask(null);
            setInitialTaskState(null);
            draggingTaskRef.current = null;
            previewTaskRef.current = null;

            // Remove global event listeners
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        }
    };

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        };
    }, []);

    // Handle empty task groups
    if (!taskGroup.tasks || taskGroup.tasks.length === 0) {
        return <div className="relative h-16 text-gantt-text">No tasks available</div>;
    }

    return (
        <div
            className={`relative border-b border-gantt-border ${className}`}
            style={{ height: `${rowHeight}px` }}
            onMouseMove={e => handleMouseMove(e)}
            onMouseLeave={() => setHoveredTask(null)}
            ref={rowRef}
            data-testid={`task-row-${taskGroup.id}`}
            data-instance-id={instanceId.current}>
            {/* Render tasks by row to prevent overlaps */}
            {taskRows.map((rowTasks, rowIndex) => (
                <React.Fragment key={`task-row-${rowIndex}`}>
                    {rowTasks.map(task => {
                        try {
                            if (
                                !task ||
                                !task.id ||
                                !(task.startDate instanceof Date) ||
                                !(task.endDate instanceof Date)
                            ) {
                                console.warn("Invalid task data:", task);
                                return null;
                            }

                            // Calculate task position
                            const { leftPx, widthPx } = TaskManager.calculateTaskPixelPosition(
                                task,
                                validStartDate,
                                validEndDate,
                                totalMonths,
                                monthWidth,
                                viewMode
                            );

                            const isHovered = hoveredTask?.id === task.id;
                            const isDragging = draggingTask?.id === task.id;
                            const topPx = rowIndex * 40 + 10;

                            return (
                                <TaskItem
                                    key={`task-${task.id}`}
                                    task={task}
                                    leftPx={leftPx}
                                    widthPx={widthPx}
                                    topPx={topPx}
                                    isHovered={isHovered}
                                    isDragging={isDragging}
                                    editMode={editMode}
                                    showProgress={showProgress}
                                    instanceId={instanceId.current}
                                    onMouseDown={handleMouseDown}
                                    onMouseEnter={handleTaskMouseEnter}
                                    onMouseLeave={handleTaskMouseLeave}
                                    onClick={handleTaskClick}
                                />
                            );
                        } catch (error) {
                            console.error("Error rendering task:", error, task);
                            return null;
                        }
                    })}
                </React.Fragment>
            ))}

            {/* Task tooltip */}
            {(hoveredTask || draggingTask) && (
                <Tooltip
                    task={previewTask || draggingTask || hoveredTask!}
                    position={tooltipPosition}
                    dragType={dragType}
                    taskId={draggingTask?.id}
                    startDate={validStartDate}
                    endDate={validEndDate}
                    totalMonths={totalMonths}
                    monthWidth={monthWidth}
                    showProgress={showProgress}
                    instanceId={instanceId.current}
                    className={tooltipClassName}
                    viewMode={viewMode}
                />
            )}
        </div>
    );
};

export default TaskRow;
