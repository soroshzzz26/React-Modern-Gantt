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
    showProgress?: boolean;
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
    showProgress = false,
    onTaskUpdate,
    onTaskClick,
}) => {
    if (!person || !person.id || !Array.isArray(person.tasks)) {
        console.warn("TaskRow: Invalid person data", person);
        return <div className="relative h-16">Invalid person data</div>;
    }

    const validStartDate = startDate instanceof Date ? startDate : new Date();
    const validEndDate = endDate instanceof Date ? endDate : new Date();

    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);
    const [dragType, setDragType] = useState<"move" | "resize-left" | "resize-right" | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [previewTask, setPreviewTask] = useState<Task | null>(null);

    const rowRef = useRef<HTMLDivElement>(null);
    const draggingTaskRef = useRef<Task | null>(null);
    const previewTaskRef = useRef<Task | null>(null);

    const updateDraggingTask = (task: Task) => {
        setDraggingTask(task);
        draggingTaskRef.current = task;
    };

    const updatePreviewTask = (task: Task) => {
        setPreviewTask(task);
        previewTaskRef.current = task;
    };

    const taskRows = previewTask
        ? CollisionManager.getPreviewArrangement(previewTask, person.tasks)
        : CollisionManager.detectOverlaps(person.tasks);

    const rowHeight = Math.max(60, taskRows.length * 40 + 20);

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

        if (draggingTask && dragType && rowRef.current) {
            try {
                const deltaX = e.clientX - dragStartX;
                if (deltaX === 0) return;

                const totalWidth = totalMonths * monthWidth;
                const taskEl = document.querySelector(`[data-task-id="${draggingTask.id}"]`) as HTMLElement;
                if (!taskEl) return;

                const currentLeft = parseFloat(taskEl.style.left || "0");
                const currentWidth = parseFloat(taskEl.style.width || "0");

                let newLeft = currentLeft;
                let newWidth = currentWidth;

                if (dragType === "move") {
                    newLeft = Math.max(0, Math.min(totalWidth - currentWidth, currentLeft + deltaX));
                    taskEl.style.left = `${newLeft}px`;
                } else if (dragType === "resize-left") {
                    const maxDelta = currentWidth - 20;
                    const constrainedDelta = Math.min(maxDelta, deltaX);
                    newLeft = Math.max(0, currentLeft + constrainedDelta);
                    newWidth = Math.max(20, currentWidth - constrainedDelta);

                    taskEl.style.left = `${newLeft}px`;
                    taskEl.style.width = `${newWidth}px`;
                } else if (dragType === "resize-right") {
                    newWidth = Math.max(20, Math.min(totalWidth - currentLeft, currentWidth + deltaX));
                    taskEl.style.width = `${newWidth}px`;
                }

                const { newStartDate, newEndDate } = TaskManager.calculateDatesFromPosition(
                    newLeft,
                    newWidth,
                    validStartDate,
                    validEndDate,
                    totalMonths,
                    monthWidth
                );

                const updatedTask = TaskManager.createUpdatedTask(draggingTask, newStartDate, newEndDate);
                setPreviewTask(updatedTask);
                updatePreviewTask(updatedTask);

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
        setPreviewTask(task);

        updateDraggingTask(task);
        updatePreviewTask(task);

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
    };

    const handleMouseUp = () => {
        try {
            const currentDraggingTask = draggingTaskRef.current;
            const currentPreviewTask = previewTaskRef.current;

            if (currentDraggingTask && currentPreviewTask && onTaskUpdate) {
                onTaskUpdate(person.id, currentPreviewTask);
            }
        } catch (error) {
            console.error("Error in handleMouseUp:", error);
        } finally {
            setDraggingTask(null);
            setDragType(null);
            setPreviewTask(null);
            draggingTaskRef.current = null;
            previewTaskRef.current = null;

            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        }
    };

    useEffect(() => {
        if (!draggingTask && previewTask && onTaskUpdate) {
            onTaskUpdate(person.id, previewTask);
        }
    }, [draggingTask, previewTask, person.id, onTaskUpdate]);

    useEffect(() => {
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        };
    }, []);

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

                            const { leftPx, widthPx } = TaskManager.calculateTaskPixelPosition(
                                task,
                                validStartDate,
                                validEndDate,
                                totalMonths,
                                monthWidth
                            );

                            const isHovered = hoveredTask?.id === task.id;
                            const isDragging = draggingTask?.id === task.id;
                            const topPx = rowIndex * 40 + 10;

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
                                    showProgress={showProgress}
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
                    showProgress={showProgress}
                />
            )}
        </div>
    );
};

export default TaskRow;
