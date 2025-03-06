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

    // Calculate task rows based on collision detection
    const taskRows = previewTask
        ? CollisionManager.getPreviewArrangement(previewTask, taskGroup.tasks)
        : CollisionManager.detectOverlaps(taskGroup.tasks);

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

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        // Update tooltip position on mouse move
        if (e instanceof MouseEvent && e.type === "mousemove") {
            if (hoveredTask && rowRef.current) {
                const mouseEvent = e as MouseEvent;
                const rect = rowRef.current.getBoundingClientRect();
                setTooltipPosition({
                    x: mouseEvent.clientX - rect.left + 20,
                    y: mouseEvent.clientY - rect.top,
                });
            }
        } else {
            updateTooltipPosition(e as React.MouseEvent);
        }

        // Handle task dragging and resizing
        if (draggingTask && dragType && rowRef.current) {
            try {
                const deltaX = e.clientX - dragStartX;
                if (deltaX === 0) return;

                const totalWidth = totalMonths * monthWidth;

                // Find the task element being dragged
                const taskEl = document.querySelector(
                    `[data-task-id="${draggingTask.id}"][data-instance-id="${instanceId.current}"]`
                ) as HTMLElement;

                if (!taskEl) return;

                const currentLeft = parseFloat(taskEl.style.left || "0");
                const currentWidth = parseFloat(taskEl.style.width || "0");

                let newLeft = currentLeft;
                let newWidth = currentWidth;

                // Handle different drag types
                if (dragType === "move") {
                    // Move task (constrain to timeline bounds)
                    newLeft = Math.max(0, Math.min(totalWidth - currentWidth, currentLeft + deltaX));
                    taskEl.style.left = `${newLeft}px`;
                } else if (dragType === "resize-left") {
                    // Resize from left (minimum width = 20px)
                    const maxDelta = currentWidth - 20;
                    const constrainedDelta = Math.min(maxDelta, deltaX);
                    newLeft = Math.max(0, currentLeft + constrainedDelta);
                    newWidth = Math.max(20, currentWidth - constrainedDelta);

                    taskEl.style.left = `${newLeft}px`;
                    taskEl.style.width = `${newWidth}px`;
                } else if (dragType === "resize-right") {
                    // Resize from right (minimum width = 20px)
                    newWidth = Math.max(20, Math.min(totalWidth - currentLeft, currentWidth + deltaX));
                    taskEl.style.width = `${newWidth}px`;
                }

                // Calculate new dates based on position
                const { newStartDate, newEndDate } = TaskManager.calculateDatesFromPosition(
                    newLeft,
                    newWidth,
                    validStartDate,
                    validEndDate,
                    totalMonths,
                    monthWidth,
                    viewMode
                );

                // Update the preview task with new dates
                const updatedTask = TaskManager.createUpdatedTask(draggingTask, newStartDate, newEndDate);
                setPreviewTask(updatedTask);
                updatePreviewTask(updatedTask);

                // Update drag start position for next move
                setDragStartX(e.clientX);
            } catch (error) {
                console.error("Error in handleMouseMove:", error);
            }
        }
    };

    const handleMouseDown = (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => {
        if (!editMode) return;

        event.preventDefault();
        event.stopPropagation();

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
            draggingTaskRef.current = null;
            previewTaskRef.current = null;

            // Remove global event listeners
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        }
    };

    // Apply task updates when not dragging
    useEffect(() => {
        if (!draggingTask && previewTask && onTaskUpdate) {
            onTaskUpdate(taskGroup.id, previewTask);
        }
    }, [draggingTask, previewTask, taskGroup.id, onTaskUpdate]);

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
