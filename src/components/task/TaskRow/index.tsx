import React, { useState, useRef, useEffect, useCallback } from "react";
import { Task, ViewMode, TaskRowProps } from "@/types";
import { TaskService } from "@/services";
import TaskItem from "@/components/task/TaskItem";
import { Tooltip } from "@/components/ui";
import { TaskAnimation, AnimationState } from "./TaskAnimation";
import { AutoScroller } from "./AutoScroller";
import { TaskRowState, TaskInteractionState } from "./TaskRowState";

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
    onAutoScrollChange,
    viewMode = ViewMode.MONTH,
    scrollContainerRef,
    smoothDragging = true,
    movementThreshold = 3,
    animationSpeed = 0.25,
    renderTask,
    renderTooltip,
    getTaskColor,
}) => {
    if (!taskGroup || !taskGroup.id || !Array.isArray(taskGroup.tasks)) {
        return <div className="relative h-16 text-gantt-text">Invalid task group data</div>;
    }

    // Ensure valid dates
    const validStartDate = startDate instanceof Date ? startDate : new Date();
    const validEndDate = endDate instanceof Date ? endDate : new Date();

    // Initialize state management
    const [taskState, setTaskState] = useState<TaskInteractionState>({
        hoveredTask: null,
        draggingTask: null,
        dragType: null,
        dragStartX: 0,
        tooltipPosition: { x: 0, y: 0 },
        previewTask: null,
        initialTaskState: null,
    });

    // Create refs
    const rowRef = useRef<HTMLDivElement>(null);
    const taskElementRef = useRef<HTMLElement | null>(null);
    const instanceId = useRef(`task-row-${Math.random().toString(36).substring(2, 11)}`);

    // Initialize helper classes
    const taskRowState = useRef(new TaskRowState(taskGroup, viewMode, setTaskState)).current;
    const autoScroller = useRef(new AutoScroller(scrollContainerRef, onAutoScrollChange)).current;
    const taskAnimation = useRef<TaskAnimation | null>(null);

    // Calculate task rows based on collision detection
    const taskRows = taskRowState.getTaskRows();

    // Calculate row height based on task arrangement
    const rowHeight = Math.max(60, taskRows.length * 40 + 20);

    // Calculate if we should use smooth dragging - DISABLED for day view
    const shouldUseSmoothDragging = smoothDragging && viewMode !== ViewMode.DAY;

    // Update dates based on visual position
    const updateDatesFromPosition = useCallback(
        (left: number, width: number) => {
            if (!taskState.draggingTask) return;

            try {
                const { newStartDate, newEndDate } = TaskService.calculateDatesFromPosition(
                    left,
                    width,
                    validStartDate,
                    validEndDate,
                    totalMonths,
                    monthWidth,
                    viewMode
                );

                const updatedTask = TaskService.createUpdatedTask(taskState.draggingTask, newStartDate, newEndDate);

                taskRowState.updatePreviewTask(updatedTask);
            } catch (error) {
                console.error("Error updating dates:", error);
            }
        },
        [taskState.draggingTask, validStartDate, validEndDate, totalMonths, monthWidth, viewMode]
    );

    // Finalize task positioning on mouse up
    const finalizeTaskPosition = useCallback(() => {
        if (!taskElementRef.current || !taskState.initialTaskState || !taskState.draggingTask) return;

        // Calculate final dates
        let finalTask = taskState.previewTask;
        if (!finalTask) return;

        // Verify final task is within timeline bounds
        const timelineStartTime = validStartDate.getTime();
        const timelineEndTime = validEndDate.getTime();

        // Ensure task dates are within bounds
        if (finalTask.startDate.getTime() < timelineStartTime) {
            finalTask = {
                ...finalTask,
                startDate: new Date(timelineStartTime),
            };
        }

        if (finalTask.endDate.getTime() > timelineEndTime) {
            finalTask = {
                ...finalTask,
                endDate: new Date(timelineEndTime),
            };
        }

        // Call update handler with the final task
        if (onTaskUpdate && finalTask) {
            try {
                onTaskUpdate(taskGroup.id, finalTask);
            } catch (error) {
                console.error("Error in onTaskUpdate:", error);
            }
        }
    }, [taskState, validStartDate, validEndDate, onTaskUpdate, taskGroup.id]);

    // Task interaction handlers
    const handleTaskClick = useCallback(
        (event: React.MouseEvent, task: Task) => {
            if (onTaskClick && !taskState.draggingTask) {
                onTaskClick(task, taskGroup);
            }

            if (onTaskSelect) {
                onTaskSelect(task, true);
            }
        },
        [onTaskClick, onTaskSelect, taskState.draggingTask, taskGroup]
    );

    const handleTaskMouseEnter = useCallback(
        (event: React.MouseEvent, task: Task) => {
            if (!taskState.draggingTask && rowRef.current) {
                const rect = rowRef.current.getBoundingClientRect();
                taskRowState.setHoveredTask(task, {
                    x: event.clientX - rect.left + 20,
                    y: event.clientY - rect.top,
                });
            }
        },
        [taskState.draggingTask, taskRowState]
    );

    const handleTaskMouseLeave = useCallback(() => {
        if (!taskState.draggingTask) {
            taskRowState.setHoveredTask(null);
        }
    }, [taskState.draggingTask, taskRowState]);

    const handleMouseDown = useCallback(
        (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => {
            if (!editMode) return;

            event.preventDefault();
            event.stopPropagation();

            // Find the task element
            const taskEl = document.querySelector(
                `[data-task-id="${task.id}"][data-instance-id="${instanceId.current}"]`
            ) as HTMLElement;

            if (!taskEl) return;
            taskElementRef.current = taskEl;

            // Store the initial state
            const initialLeft = parseFloat(taskEl.style.left || "0");
            const initialWidth = parseFloat(taskEl.style.width || "0");

            // Update task element data attribute for styling
            taskEl.setAttribute("data-dragging", "true");

            // Prepare for smooth animations
            if (shouldUseSmoothDragging) {
                taskEl.style.transition = "none"; // We'll handle the animation manually
            } else {
                taskEl.style.transition = "none";
            }

            // Set up dragging state
            taskRowState.startTaskDrag(task, type, event.clientX, initialLeft, initialWidth);

            // Initialize animation
            if (shouldUseSmoothDragging) {
                taskAnimation.current = new TaskAnimation(
                    { left: initialLeft, width: initialWidth },
                    { left: initialLeft, width: initialWidth },
                    animationSpeed
                );

                taskAnimation.current.startAnimation((position: AnimationState) => {
                    if (taskElementRef.current) {
                        taskElementRef.current.style.left = `${position.left}px`;
                        taskElementRef.current.style.width = `${position.width}px`;
                        updateDatesFromPosition(position.left, position.width);
                    }
                });
            }

            // Add global event listeners
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
        },
        [editMode, shouldUseSmoothDragging, animationSpeed, updateDatesFromPosition]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent | MouseEvent) => {
            // Store current mouse position for animation
            const clientX = e instanceof MouseEvent ? e.clientX : e.clientX;
            const clientY = e instanceof MouseEvent ? e.clientY : e.clientY;

            // Update tooltip position
            if (e instanceof MouseEvent && taskState.hoveredTask && rowRef.current) {
                const rect = rowRef.current.getBoundingClientRect();
                taskRowState.setHoveredTask(taskState.hoveredTask, {
                    x: clientX - rect.left + 20,
                    y: clientY - rect.top,
                });
            }

            // Check for auto-scrolling when dragging
            if (taskState.draggingTask && scrollContainerRef?.current) {
                autoScroller.checkForScrolling(clientX);
            }

            // Handle task dragging and resizing
            if (taskState.draggingTask && taskState.dragType && taskState.initialTaskState && rowRef.current) {
                try {
                    // Calculate the total movement since drag started
                    const totalDeltaX = clientX - taskState.dragStartX;

                    // Get the timeline's total width
                    const totalWidth = totalMonths * monthWidth;

                    // Calculate new target position based on drag type
                    let newLeft = taskState.initialTaskState.left;
                    let newWidth = taskState.initialTaskState.width;

                    switch (taskState.dragType) {
                        case "move":
                            // Move task with bounds checking
                            newLeft = Math.max(
                                0,
                                Math.min(
                                    totalWidth - taskState.initialTaskState.width,
                                    taskState.initialTaskState.left + totalDeltaX
                                )
                            );

                            // Special handling for day view (immediate snapping)
                            if (viewMode === ViewMode.DAY) {
                                newLeft = Math.round(newLeft / monthWidth) * monthWidth;
                            }
                            break;

                        case "resize-left":
                            // Resize from left with minimum width
                            const maxLeftDelta = taskState.initialTaskState.width - 20;
                            const leftDelta = Math.min(maxLeftDelta, totalDeltaX);

                            newLeft = Math.max(0, taskState.initialTaskState.left + leftDelta);

                            // Special handling for day view (immediate snapping)
                            if (viewMode === ViewMode.DAY) {
                                newLeft = Math.round(newLeft / monthWidth) * monthWidth;
                            }

                            // Calculate width to maintain right edge position
                            const rightEdge = taskState.initialTaskState.left + taskState.initialTaskState.width;
                            newWidth = Math.max(20, rightEdge - newLeft);

                            // Special handling for day view (ensure full day widths)
                            if (viewMode === ViewMode.DAY) {
                                newWidth = Math.round(newWidth / monthWidth) * monthWidth;
                                newWidth = Math.max(monthWidth, newWidth); // Minimum one day
                            }
                            break;

                        case "resize-right":
                            // Resize from right with minimum width
                            newWidth = Math.max(
                                20,
                                Math.min(
                                    totalWidth - taskState.initialTaskState.left,
                                    taskState.initialTaskState.width + totalDeltaX
                                )
                            );

                            // Special handling for day view (ensure full day widths)
                            if (viewMode === ViewMode.DAY) {
                                newWidth = Math.round(newWidth / monthWidth) * monthWidth;
                                newWidth = Math.max(monthWidth, newWidth); // Minimum one day
                            }
                            break;
                    }

                    // Apply position based on view mode and animation preference
                    if (viewMode === ViewMode.DAY && taskElementRef.current) {
                        taskElementRef.current.style.left = `${newLeft}px`;
                        taskElementRef.current.style.width = `${newWidth}px`;
                        updateDatesFromPosition(newLeft, newWidth);
                    } else if (shouldUseSmoothDragging && taskAnimation.current) {
                        taskAnimation.current.updateTargetPosition({ left: newLeft, width: newWidth });
                    } else if (taskElementRef.current) {
                        taskElementRef.current.style.left = `${newLeft}px`;
                        taskElementRef.current.style.width = `${newWidth}px`;
                        updateDatesFromPosition(newLeft, newWidth);
                    }
                } catch (error) {
                    console.error("Error in handleMouseMove:", error);
                }
            }
        },
        [
            taskState,
            scrollContainerRef,
            taskRowState,
            monthWidth,
            totalMonths,
            viewMode,
            shouldUseSmoothDragging,
            updateDatesFromPosition,
        ]
    );

    const handleMouseUp = useCallback(() => {
        try {
            // Stop animations
            if (taskAnimation.current) {
                taskAnimation.current.stopAnimation();
                taskAnimation.current = null;
            }

            // Finalize task position with snapping
            finalizeTaskPosition();

            // Clean up animation state
            if (taskElementRef.current) {
                // Reset the dragging state
                taskElementRef.current.setAttribute("data-dragging", "false");

                // Reset transitions after a short delay
                setTimeout(() => {
                    if (taskElementRef.current) {
                        taskElementRef.current.style.transition = "";
                    }
                }, 200);
            }
        } finally {
            // Stop auto-scrolling
            autoScroller.stopScrolling();

            // Reset all drag states
            taskRowState.endTaskDrag();
            taskElementRef.current = null;

            // Remove global event listeners
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        }
    }, [finalizeTaskPosition, taskRowState, autoScroller]);

    // Handle progress update
    const handleProgressUpdate = useCallback(
        (task: Task, newPercent: number) => {
            if (onTaskUpdate && taskGroup.id) {
                try {
                    // Create updated task with new progress percentage
                    const updatedTask = {
                        ...task,
                        percent: newPercent,
                    };

                    // Call the onTaskUpdate handler with the updated task
                    onTaskUpdate(taskGroup.id, updatedTask);
                } catch (error) {
                    console.error("Error updating task progress:", error);
                }
            }
        },
        [onTaskUpdate, taskGroup.id]
    );

    // Clean up event listeners and animations on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
            autoScroller.stopScrolling();

            if (taskAnimation.current) {
                taskAnimation.current.stopAnimation();
            }
        };
    }, [handleMouseUp, handleMouseMove, autoScroller]);

    // Handle empty task groups
    if (!taskGroup.tasks || taskGroup.tasks.length === 0) {
        return <div className="relative h-16 text-gantt-text">No tasks available</div>;
    }

    return (
        <div
            className={`relative border-b border-gantt-border ${className}`}
            style={{ height: `${rowHeight}px` }}
            onMouseMove={e => handleMouseMove(e)}
            onMouseLeave={handleTaskMouseLeave}
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
                                return null;
                            }

                            // Calculate task position
                            const { leftPx, widthPx } = TaskService.calculateTaskPixelPosition(
                                task,
                                validStartDate,
                                validEndDate,
                                totalMonths,
                                monthWidth,
                                viewMode
                            );

                            const isHovered = taskState.hoveredTask?.id === task.id;
                            const isDragging = taskState.draggingTask?.id === task.id;
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
                                    renderTask={renderTask}
                                    getTaskColor={getTaskColor}
                                    onProgressUpdate={handleProgressUpdate}
                                />
                            );
                        } catch (error) {
                            console.error("Error rendering task:", error);
                            return null;
                        }
                    })}
                </React.Fragment>
            ))}

            {/* Task tooltip */}
            {(taskState.hoveredTask || taskState.draggingTask) && (
                <Tooltip
                    task={taskState.previewTask || taskState.draggingTask || taskState.hoveredTask!}
                    position={taskState.tooltipPosition}
                    dragType={taskState.dragType}
                    taskId={taskState.draggingTask?.id}
                    startDate={validStartDate}
                    endDate={validEndDate}
                    totalMonths={totalMonths}
                    monthWidth={monthWidth}
                    showProgress={showProgress}
                    instanceId={instanceId.current}
                    className={tooltipClassName}
                    viewMode={viewMode}
                    renderTooltip={renderTooltip}
                />
            )}
        </div>
    );
};

export default TaskRow;
