import React, { useState, useRef, useEffect } from "react";

interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
    percent?: number;
}

interface Person {
    id: string;
    name: string;
    tasks: Task[];
}

interface TaskRowProps {
    person: Person;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    onTaskUpdate: (personId: string, updatedTask: Task) => void;
    editMode?: boolean;
}

export default function TaskRow({
    person,
    startDate,
    endDate,
    totalDays,
    onTaskUpdate,
    editMode = true,
}: TaskRowProps) {
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);
    const [dragType, setDragType] = useState<"move" | "resize-start" | "resize-end" | "adjust-progress" | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const rowRef = useRef<HTMLDivElement>(null);

    // Calculate position and width based on dates and timeline bounds
    const getPositionAndWidth = (task: Task) => {
        const taskStartMs = task.startDate.getTime();
        const taskEndMs = task.endDate.getTime();
        const timelineStartMs = startDate.getTime();
        const timelineEndMs = endDate.getTime();
        const timelineRange = timelineEndMs - timelineStartMs;

        // Calculate position as percentage of timeline
        const taskStart = Math.max(0, taskStartMs - timelineStartMs) / timelineRange;
        const taskEnd = Math.min(1, (taskEndMs - timelineStartMs) / timelineRange);
        const taskWidth = taskEnd - taskStart;

        return {
            left: `${taskStart * 100}%`,
            width: `${taskWidth * 100}%`,
        };
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const getDuration = (start: Date, end: Date) => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleMouseDown = (
        e: React.MouseEvent,
        task: Task,
        type: "move" | "resize-start" | "resize-end" | "adjust-progress"
    ) => {
        if (!editMode) return;

        e.preventDefault(); // Prevent default to avoid text selection
        e.stopPropagation(); // Stop propagation to avoid parent handlers

        setDraggingTask(task);
        setDragType(type);
        setDragStartX(e.clientX);
        updateTooltipPosition(e);

        // Add mousemove and mouseup listeners to document
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);

        console.log(`Mouse down on task ${task.id} with type ${type}`); // Debug
    };

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        if (e instanceof MouseEvent && e.type === "mousemove") {
            // This is necessary to handle the document-level mousemove event
            const mouseEvent = e as MouseEvent;
            if (hoveredTask) {
                setTooltipPosition({
                    x: mouseEvent.clientX - (rowRef.current?.getBoundingClientRect().left || 0) + 20,
                    y: mouseEvent.clientY - (rowRef.current?.getBoundingClientRect().top || 0),
                });
            }
        } else {
            // For React MouseEvent
            updateTooltipPosition(e as React.MouseEvent);
        }

        if (!draggingTask || !dragType || !rowRef.current) return;

        const rect = rowRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragStartX;
        const percentDelta = deltaX / rect.width;
        const timelineDuration = endDate.getTime() - startDate.getTime();
        const timeDelta = percentDelta * timelineDuration;

        let newStartDate = new Date(draggingTask.startDate);
        let newEndDate = new Date(draggingTask.endDate);
        let newPercent = draggingTask.percent;

        if (dragType === "move") {
            // Move the entire task
            newStartDate = new Date(newStartDate.getTime() + timeDelta);
            newEndDate = new Date(newEndDate.getTime() + timeDelta);
        } else if (dragType === "resize-start") {
            // Resize from the start
            newStartDate = new Date(newStartDate.getTime() + timeDelta);
        } else if (dragType === "resize-end") {
            // Resize from the end
            newEndDate = new Date(newEndDate.getTime() + timeDelta);
        } else if (dragType === "adjust-progress" && draggingTask.percent !== undefined) {
            // Adjust progress percentage
            const taskElements = document.querySelectorAll(`[data-task-id="${draggingTask.id}"]`);
            if (taskElements.length > 0) {
                const taskRect = taskElements[0].getBoundingClientRect();
                const taskWidth = taskRect.width;
                const offsetX = e.clientX - taskRect.left;
                newPercent = Math.max(0, Math.min(100, (offsetX / taskWidth) * 100));
            }
        }

        // Ensure the task stays within the timeline bounds
        if (newStartDate < startDate) {
            newStartDate = new Date(startDate);
            if (dragType === "move") {
                const duration = draggingTask.endDate.getTime() - draggingTask.startDate.getTime();
                newEndDate = new Date(newStartDate.getTime() + duration);
            }
        }

        if (newEndDate > endDate) {
            newEndDate = new Date(endDate);
            if (dragType === "move") {
                const duration = draggingTask.endDate.getTime() - draggingTask.startDate.getTime();
                newStartDate = new Date(newEndDate.getTime() - duration);
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

        // Create updated task
        const updatedTask = {
            ...draggingTask,
            startDate: newStartDate,
            endDate: newEndDate,
            percent: newPercent,
        };

        // Update dragging reference first
        setDraggingTask(updatedTask);

        // Then update the task data
        onTaskUpdate(person.id, updatedTask);

        // Reset start point for next delta calculation
        setDragStartX(e.clientX);

        // Debug
        console.log(`Task updated during drag: Start=${newStartDate.toISOString()}, End=${newEndDate.toISOString()}`);
    };

    const handleMouseUp = () => {
        if (draggingTask && dragType) {
            // Final update with new dates/progress
            onTaskUpdate(person.id, draggingTask);
            console.log(`Mouse up - Task updated: ${draggingTask.id}`);
        }

        setDraggingTask(null);
        setDragType(null);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove);
    };

    // Special handler for the div element itself
    const taskDivMouseDown = (e: React.MouseEvent, task: Task) => {
        if (!editMode) return;
        e.preventDefault();
        e.stopPropagation();
        console.log(`Direct task div mousedown on ${task.id}`);
        handleMouseDown(e, task, "move");
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

    useEffect(() => {
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Detect collisions between tasks and organize them into rows
    const detectCollisions = (tasks: Task[]) => {
        // Sort tasks by start date
        const sortedTasks = [...tasks].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        const rows: Task[][] = [];

        sortedTasks.forEach(task => {
            let placed = false;
            // Try to find a row where this task can be placed without overlap
            for (let i = 0; i < rows.length; i++) {
                const rowTasks = rows[i];
                // Check against all tasks in the row
                let canPlace = true;

                for (const existingTask of rowTasks) {
                    // Check if tasks overlap
                    if (!(task.endDate <= existingTask.startDate || task.startDate >= existingTask.endDate)) {
                        canPlace = false;
                        break;
                    }
                }

                if (canPlace) {
                    rows[i].push(task);
                    placed = true;
                    break;
                }
            }

            // If the task couldn't be placed in any existing row, create a new row for it
            if (!placed) {
                rows.push([task]);
            }
        });

        return rows;
    };

    const taskRows = detectCollisions(person.tasks);
    const rowHeight = Math.max(60, taskRows.length * 40); // 40px per task row

    if (!person || !person.tasks || person.tasks.length === 0) {
        return <div className="relative h-16">No tasks available</div>;
    }

    return (
        <div
            className="relative select-none"
            style={{ height: `${rowHeight}px` }}
            onMouseMove={e => handleMouseMove(e)}
            onMouseLeave={() => setHoveredTask(null)}
            ref={rowRef}>
            {taskRows.map((rowTasks, rowIndex) =>
                rowTasks.map(task => {
                    const { left, width } = getPositionAndWidth(task);
                    const isHovered = hoveredTask === task;
                    const isDragging = draggingTask === task;
                    const showControls = (isHovered || isDragging) && editMode;

                    return (
                        <React.Fragment key={task.id}>
                            <div
                                className={`absolute h-8 rounded-md ${
                                    task.color
                                } z-10 flex items-center justify-between text-xs text-white font-semibold ${
                                    editMode ? "cursor-move" : "cursor-default"
                                } task-bar select-none`}
                                data-task-id={task.id}
                                style={{
                                    left,
                                    width,
                                    top: `${rowIndex * 40 + 4}px`,
                                }}
                                onMouseDown={editMode ? e => taskDivMouseDown(e, task) : undefined}
                                onMouseEnter={() => setHoveredTask(task)}>
                                {/* Task content */}
                                <div className="truncate px-2 py-1 flex-grow">{task.name}</div>

                                {/* Left resize handle */}
                                {showControls && (
                                    <div
                                        className="absolute left-0 w-1.5 h-[90%] bg-white rounded-md cursor-ew-resize"
                                        onMouseDown={e => {
                                            e.stopPropagation();
                                            handleMouseDown(e, task, "resize-start");
                                        }}
                                    />
                                )}

                                {/* Right resize handle */}
                                {showControls && (
                                    <div
                                        className="absolute right-0 w-1.5 h-[90%] bg-white rounded-md cursor-ew-resize"
                                        onMouseDown={e => {
                                            e.stopPropagation();
                                            handleMouseDown(e, task, "resize-end");
                                        }}
                                    />
                                )}

                                {/* Progress bar */}
                                {task.percent !== undefined && (
                                    <div className="absolute bottom-1 left-1 right-1 h-1.5 bg-black bg-opacity-20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full"
                                            style={{ width: `${task.percent}%` }}
                                        />
                                        {/* Progress adjustment handle */}
                                        {showControls && (
                                            <div
                                                className="absolute top-1/2 h-3 w-3 bg-white rounded-full -translate-y-1/2 cursor-ew-resize border border-gray-400"
                                                style={{ left: `calc(${task.percent}% - 4px)` }}
                                                onMouseDown={e => {
                                                    e.stopPropagation();
                                                    handleMouseDown(e, task, "adjust-progress");
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tooltip */}
                            {(isHovered || isDragging) && (
                                <div
                                    className="absolute z-20 bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs select-none"
                                    style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y - 40}px` }}>
                                    <div className="font-bold">{task.name}</div>
                                    <div>Start: {formatDate(task.startDate)}</div>
                                    <div>End: {formatDate(task.endDate)}</div>
                                    <div>Duration: {getDuration(task.startDate, task.endDate)} days</div>
                                    {task.percent !== undefined && <div>Progress: {Math.round(task.percent)}%</div>}
                                </div>
                            )}
                        </React.Fragment>
                    );
                })
            )}
        </div>
    );
}
