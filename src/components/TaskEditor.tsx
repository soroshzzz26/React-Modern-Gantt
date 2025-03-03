import React, { useEffect, useRef, useState } from "react";
import { Person, Task, getMonthsBetween } from "../models";

interface TaskEditorProps {
    people: Person[];
    startDate: Date;
    endDate: Date;
    onTaskUpdate?: (personId: string, updatedTask: Task) => void;
}

/**
 * TaskEditor Component
 *
 * Adds drag & drop edit capabilities to the GanttChart
 */
const TaskEditor: React.FC<TaskEditorProps> = ({ people, startDate, endDate, onTaskUpdate }) => {
    // State for tracking drag operations
    const [dragState, setDragState] = useState<{
        isDragging: boolean;
        personId: string | null;
        taskId: string | null;
        dragType: "move" | "resize-left" | "resize-right" | null;
        startX: number;
        startLeft: number;
        startWidth: number;
        task: Task | null;
    }>({
        isDragging: false,
        personId: null,
        taskId: null,
        dragType: null,
        startX: 0,
        startLeft: 0,
        startWidth: 0,
        task: null,
    });

    // Reference to the container element
    const containerRef = useRef<HTMLDivElement>(null);

    // Collect and prepare data for calculations
    const months = getMonthsBetween(startDate, endDate);
    const totalMonths = months.length;

    // Start dragging operation
    const startDrag = (
        e: React.MouseEvent,
        personId: string,
        taskId: string,
        dragType: "move" | "resize-left" | "resize-right"
    ) => {
        e.preventDefault();
        e.stopPropagation();

        // Find the task element
        const taskEl = document.querySelector(`[data-task-id="${taskId}"]`) as HTMLElement;
        if (!taskEl || !containerRef.current) return;

        // Find the person and task data
        const person = people.find(p => p.id === personId);
        if (!person) return;

        const task = person.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Get element dimensions
        const containerRect = containerRef.current.getBoundingClientRect();
        const taskRect = taskEl.getBoundingClientRect();

        // Calculate position as percentage
        const startLeft = ((taskRect.left - containerRect.left) / containerRect.width) * 100;
        const startWidth = (taskRect.width / containerRect.width) * 100;

        // Set drag state
        setDragState({
            isDragging: true,
            personId,
            taskId,
            dragType,
            startX: e.clientX,
            startLeft,
            startWidth,
            task,
        });

        // Add mouse event listeners to document
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        console.log("Started dragging:", { personId, taskId, dragType });
    };

    // Handle mouse movement during drag
    const handleMouseMove = (e: MouseEvent) => {
        if (!dragState.isDragging || !containerRef.current) return;

        // Calculate mouse movement as percentage of container width
        const containerRect = containerRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragState.startX;
        const deltaPercentage = (deltaX / containerRect.width) * 100;

        // Find the task element
        const taskEl = document.querySelector(`[data-task-id="${dragState.taskId}"]`) as HTMLElement;
        if (!taskEl) return;

        // Update element position based on drag type
        if (dragState.dragType === "move") {
            // Move entire task
            const newLeft = dragState.startLeft + deltaPercentage;
            // Constrain to container
            const constrainedLeft = Math.max(0, Math.min(100 - dragState.startWidth, newLeft));
            taskEl.style.left = `${constrainedLeft}%`;
        } else if (dragState.dragType === "resize-left") {
            // Resize from left side
            const maxDelta = dragState.startWidth - 5; // Minimum width of 5%
            const constrainedDelta = Math.min(maxDelta, deltaPercentage);
            const newLeft = dragState.startLeft + constrainedDelta;
            const newWidth = dragState.startWidth - constrainedDelta;

            if (newLeft >= 0 && newWidth >= 5) {
                taskEl.style.left = `${newLeft}%`;
                taskEl.style.width = `${newWidth}%`;
            }
        } else if (dragState.dragType === "resize-right") {
            // Resize from right side
            const newWidth = Math.max(5, dragState.startWidth + deltaPercentage);
            const maxWidth = 100 - dragState.startLeft;
            const constrainedWidth = Math.min(maxWidth, newWidth);

            taskEl.style.width = `${constrainedWidth}%`;
        }
    };

    // Handle mouse up to end drag
    const handleMouseUp = () => {
        // Skip if we're not dragging or missing critical data
        if (!dragState.isDragging || !dragState.taskId || !dragState.personId || !dragState.task) {
            cleanup();
            return;
        }

        // Find the task element
        const taskEl = document.querySelector(`[data-task-id="${dragState.taskId}"]`) as HTMLElement;
        if (!taskEl || !containerRef.current) {
            cleanup();
            return;
        }

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
                    dragState.task.startDate.getDate(),
                    getDaysInMonth(newStartMonth.getFullYear(), newStartMonth.getMonth())
                )
            );

            const newEndDate = new Date(
                newEndMonth.getFullYear(),
                newEndMonth.getMonth(),
                Math.min(
                    dragState.task.endDate.getDate(),
                    getDaysInMonth(newEndMonth.getFullYear(), newEndMonth.getMonth())
                )
            );

            // Create updated task
            const updatedTask = {
                ...dragState.task,
                startDate: newStartDate,
                endDate: newEndDate,
            };

            console.log("Updating task:", {
                personId: dragState.personId,
                taskId: dragState.taskId,
                from: {
                    start: dragState.task.startDate,
                    end: dragState.task.endDate,
                },
                to: {
                    start: newStartDate,
                    end: newEndDate,
                },
            });

            // Call update callback
            if (onTaskUpdate) {
                onTaskUpdate(dragState.personId, updatedTask);
            }
        }

        // Cleanup
        cleanup();
    };

    // Clean up after drag operation
    const cleanup = () => {
        setDragState({
            isDragging: false,
            personId: null,
            taskId: null,
            dragType: null,
            startX: 0,
            startLeft: 0,
            startWidth: 0,
            task: null,
        });

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none" data-testid="task-editor">
            {/* We render transparent overlays for each task to enable editing */}
            {people.map(person => (
                <div key={person.id} className="w-full h-full relative">
                    {person.tasks.map(task => {
                        // Find all task elements to overlay them
                        const taskElements = document.querySelectorAll(`[data-task-id="${task.id}"]`);
                        if (!taskElements.length) return null;

                        // Get the first task element (there should only be one per task)
                        const taskEl = taskElements[0] as HTMLElement;
                        if (!taskEl) return null;

                        // Get position and size from the actual task element
                        const rect = taskEl.getBoundingClientRect();
                        if (!containerRef.current) return null;

                        const containerRect = containerRef.current.getBoundingClientRect();
                        const taskLeft = taskEl.style.left || "0%";
                        const taskWidth = taskEl.style.width || "0%";
                        const taskTop = taskEl.style.top || "0px";

                        return (
                            <div
                                key={task.id}
                                className="absolute pointer-events-auto cursor-move"
                                style={{
                                    left: taskLeft,
                                    width: taskWidth,
                                    top: taskTop,
                                    height: "32px",
                                }}
                                onMouseDown={e => startDrag(e, person.id, task.id, "move")}>
                                {/* Left resize handle */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
                                    onMouseDown={e => {
                                        e.stopPropagation();
                                        startDrag(e, person.id, task.id, "resize-left");
                                    }}
                                />

                                {/* Right resize handle */}
                                <div
                                    className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
                                    onMouseDown={e => {
                                        e.stopPropagation();
                                        startDrag(e, person.id, task.id, "resize-right");
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

// Helper function to get days in month
function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

export default TaskEditor;
