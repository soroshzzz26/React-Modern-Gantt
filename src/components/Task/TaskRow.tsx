import React, { useState, useRef, useEffect } from "react";
import { Person, Task } from "../../models";
import { CollisionManager } from "../../utils/CollisionManager";
import { TaskManager } from "../../utils/TaskManager";
import TaskRenderer from "./TaskRenderer";
import TaskTooltip from "./TaskTooltip";

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
    // Validate person and tasks
    if (!person || !person.id || !Array.isArray(person.tasks)) {
        console.warn("TaskRow: Invalid person data", person);
        return <div className="relative h-16">Invalid person data</div>;
    }

    // Ensure dates are valid Date objects
    const validStartDate = startDate instanceof Date ? startDate : new Date();
    const validEndDate = endDate instanceof Date ? endDate : new Date();

    // States for task interaction
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);
    const [dragType, setDragType] = useState<"move" | "resize-left" | "resize-right" | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // State for preview task while dragging
    const [previewTask, setPreviewTask] = useState<Task | null>(null);

    // Reference to the row element
    const rowRef = useRef<HTMLDivElement>(null);

    // Calculate task rows to avoid overlaps
    // If we have a preview task, use it for dynamic collision detection
    const taskRows = previewTask
        ? CollisionManager.getPreviewArrangement(previewTask, person.tasks)
        : CollisionManager.detectOverlaps(person.tasks);

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
        // Update tooltip position
        if (e instanceof MouseEvent && e.type === "mousemove") {
            if (hoveredTask) {
                const mouseEvent = e as MouseEvent;
                if (rowRef.current) {
                    const rect = rowRef.current.getBoundingClientRect();
                    setTooltipPosition({
                        x: mouseEvent.clientX - rect.left + 20,
                        y: mouseEvent.clientY - rect.top,
                    });
                }
            }
        } else {
            updateTooltipPosition(e as React.MouseEvent);
        }

        // Handle task dragging
        if (draggingTask && dragType && rowRef.current) {
            try {
                // Calculate deltaX - how far we've moved since last update
                const deltaX = e.clientX - dragStartX;
                if (deltaX === 0) return; // No movement

                // Get total container width
                const totalWidth = totalMonths * monthWidth;

                // Find the task element
                const taskEl = document.querySelector(`[data-task-id="${draggingTask.id}"]`) as HTMLElement;
                if (!taskEl) return;

                // Get current position and dimensions
                const currentLeft = parseFloat(taskEl.style.left || "0");
                const currentWidth = parseFloat(taskEl.style.width || "0");

                let newLeft = currentLeft;
                let newWidth = currentWidth;

                if (dragType === "move") {
                    // Move the entire task
                    newLeft = Math.max(0, Math.min(totalWidth - currentWidth, currentLeft + deltaX));
                    taskEl.style.left = `${newLeft}px`;
                } else if (dragType === "resize-left") {
                    // Resize from left side
                    const maxDelta = currentWidth - 20; // Minimum width of 20px
                    const constrainedDelta = Math.min(maxDelta, deltaX);
                    newLeft = Math.max(0, currentLeft + constrainedDelta);
                    newWidth = Math.max(20, currentWidth - constrainedDelta);

                    taskEl.style.left = `${newLeft}px`;
                    taskEl.style.width = `${newWidth}px`;
                } else if (dragType === "resize-right") {
                    // Resize from right side
                    newWidth = Math.max(20, Math.min(totalWidth - currentLeft, currentWidth + deltaX));
                    taskEl.style.width = `${newWidth}px`;
                }

                // Update preview task for collision detection
                // Calculate new dates based on position
                const { newStartDate, newEndDate } = TaskManager.calculateDatesFromPosition(
                    newLeft,
                    newWidth,
                    validStartDate,
                    validEndDate,
                    totalMonths,
                    monthWidth
                );

                // Create the updated task for preview
                const updatedTask = TaskManager.createUpdatedTask(draggingTask, newStartDate, newEndDate);

                // Update the preview task state which triggers a re-render with new collision detection
                setPreviewTask(updatedTask);

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

        setDraggingTask(task);
        setDragType(type);
        setDragStartX(event.clientX);

        // Initialize preview task with current task
        setPreviewTask(task);

        // Add document-level event listeners
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
    };

    const handleMouseUp = () => {
        try {
            if (draggingTask && previewTask) {
                // If we have a preview task, use it for the update
                // This ensures we're using the final position/dates after drag
                if (onTaskUpdate) {
                    console.log("Calling onTaskUpdate with:", previewTask);
                    // Use setTimeout to ensure this happens after the current event cycle
                    setTimeout(() => {
                        if (onTaskUpdate) onTaskUpdate(person.id, previewTask);
                    }, 0);
                }
            }
        } catch (error) {
            console.error("Error in handleMouseUp:", error);
        } finally {
            // Always reset states and remove event listeners
            setDraggingTask(null);
            setDragType(null);
            setPreviewTask(null);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        }
    };

    // Cleanup event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        };
    }, []);

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
                        try {
                            // Validate task data
                            if (
                                !task ||
                                !task.id ||
                                !(task.startDate instanceof Date) ||
                                !(task.endDate instanceof Date)
                            ) {
                                console.warn("Invalid task data:", task);
                                return null;
                            }

                            // Calculate position in pixels
                            const { leftPx, widthPx } = TaskManager.calculateTaskPixelPosition(
                                task,
                                validStartDate,
                                validEndDate,
                                totalMonths,
                                monthWidth
                            );

                            // Check interaction states
                            const isHovered = hoveredTask?.id === task.id;
                            const isDragging = draggingTask?.id === task.id;

                            // Task render position
                            const topPx = rowIndex * 40 + 10; // 40px per row with 10px offset

                            return (
                                <TaskRenderer
                                    key={`task-${task.id}`}
                                    task={task}
                                    leftPx={leftPx}
                                    widthPx={widthPx}
                                    topPx={topPx}
                                    isHovered={isHovered}
                                    isDragging={isDragging}
                                    editMode={editMode}
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

            {/* Tooltip */}
            {(hoveredTask || draggingTask) && (
                <TaskTooltip
                    task={previewTask || draggingTask || hoveredTask!}
                    position={tooltipPosition}
                    dragType={dragType}
                    taskId={draggingTask?.id}
                    startDate={validStartDate}
                    endDate={validEndDate}
                    totalMonths={totalMonths}
                    monthWidth={monthWidth}
                />
            )}
        </div>
    );
};

export default TaskRow;
