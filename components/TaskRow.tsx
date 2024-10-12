import React, { useState, useRef, useEffect } from "react";

interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
}

interface Person {
    name: string;
    tasks: Task[];
}

interface TaskRowProps {
    person: Person;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    onTaskUpdate: (personName: string, updatedTask: Task) => void;
}

export default function TaskRow({ person, startDate, endDate, totalDays, onTaskUpdate }: TaskRowProps) {
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);
    const [dragType, setDragType] = useState<"move" | "resize-start" | "resize-end" | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const rowRef = useRef<HTMLDivElement>(null);

    const getPositionAndWidth = (task: Task) => {
        const taskStart = (task.startDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        const taskDuration = (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 3600 * 24);
        const left = (taskStart / totalDays) * 100;
        const width = (taskDuration / totalDays) * 100;
        return { left: `${left}%`, width: `${width}%` };
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const getDuration = (start: Date, end: Date) => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleMouseDown = (e: React.MouseEvent, task: Task, type: "move" | "resize-start" | "resize-end") => {
        setDraggingTask(task);
        setDragType(type);
        setDragStartX(e.clientX);
        updateTooltipPosition(e);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        updateTooltipPosition(e);

        if (!draggingTask || !dragType || !rowRef.current) return;

        const rect = rowRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragStartX;
        const daysDelta = (deltaX / rect.width) * totalDays;

        let newStartDate = new Date(draggingTask.startDate);
        let newEndDate = new Date(draggingTask.endDate);

        if (dragType === "move") {
            newStartDate = new Date(newStartDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
            newEndDate = new Date(newEndDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
        } else if (dragType === "resize-start") {
            newStartDate = new Date(newStartDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
        } else if (dragType === "resize-end") {
            newEndDate = new Date(newEndDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
        }

        // Ensure the task stays within the diagram's time frame
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

        const updatedTask = { ...draggingTask, startDate: newStartDate, endDate: newEndDate };
        onTaskUpdate(person.name, updatedTask);
        setDraggingTask(updatedTask);
        setDragStartX(e.clientX);
    };

    const handleMouseUp = () => {
        setDraggingTask(null);
        setDragType(null);
        document.removeEventListener("mouseup", handleMouseUp);
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
        const handleMouseLeave = () => {
            setHoveredTask(null);
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const detectCollisions = (tasks: Task[]) => {
        const sortedTasks = [...tasks].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        const rows: Task[][] = [];

        sortedTasks.forEach(task => {
            let placed = false;
            for (let i = 0; i < rows.length; i++) {
                const lastTaskInRow = rows[i][rows[i].length - 1];
                if (task.startDate >= lastTaskInRow.endDate) {
                    rows[i].push(task);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                rows.push([task]);
            }
        });

        return rows;
    };

    const collisionRows = detectCollisions(person.tasks);
    const rowHeight = collisionRows.length * 40; // 32px per task row + 8px spacing

    if (!person || !person.tasks || person.tasks.length === 0) {
        return <div className="relative h-16">No tasks available</div>;
    }

    return (
        <div
            className="relative border-b"
            style={{ height: `${rowHeight}px` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredTask(null)}
            ref={rowRef}>
            {collisionRows.map((row, rowIndex) =>
                row.map(task => (
                    <React.Fragment key={task.id}>
                        <div
                            className={`absolute h-8 rounded-md ${task.color} z-10 flex items-center justify-center text-xs text-white font-semibold cursor-move`}
                            style={{
                                ...getPositionAndWidth(task),
                                top: `${rowIndex * 40 + 4}px`,
                            }}
                            onMouseDown={e => handleMouseDown(e, task, "move")}
                            onMouseEnter={() => setHoveredTask(task)}>
                            <div
                                className="absolute left-0 w-2 h-full cursor-ew-resize group"
                                onMouseDown={e => {
                                    e.stopPropagation();
                                    handleMouseDown(e, task, "resize-start");
                                }}>
                                <div className="absolute left-0 w-1 h-full bg-white opacity-0 group-hover:opacity-50 transition-opacity"></div>
                            </div>
                            <div
                                className="absolute right-0 w-2 h-full cursor-ew-resize group"
                                onMouseDown={e => {
                                    e.stopPropagation();
                                    handleMouseDown(e, task, "resize-end");
                                }}>
                                <div className="absolute right-0 w-1 h-full bg-white opacity-0 group-hover:opacity-50 transition-opacity"></div>
                            </div>
                            <span className="select-none">{task.name}</span>
                        </div>
                        {(hoveredTask === task || draggingTask === task) && (
                            <div
                                className="absolute z-20 bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs select-none"
                                style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y - 40}px` }}>
                                <div>Start: {formatDate(task.startDate)}</div>
                                <div>End: {formatDate(task.endDate)}</div>
                                <div>Duration: {getDuration(task.startDate, task.endDate)} days</div>
                            </div>
                        )}
                    </React.Fragment>
                ))
            )}
        </div>
    );
}
