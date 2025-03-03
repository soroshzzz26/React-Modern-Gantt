import React, { useState } from "react";
import {
    TaskRowProps,
    Task,
    detectCollisions,
    formatDate,
    DateDisplayFormat,
    getDuration,
    calculateTaskPosition,
    normalizeDate,
} from "../models";

/**
 * TaskRow Component
 *
 * Displays tasks for a person in rows that avoid collisions
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
    // State for hover effects and tooltips
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Get the task display properties (position, width)
    const getTaskDisplay = (task: Task) => {
        return calculateTaskPosition(task, startDate, endDate, columnWidth);
    };

    // Format date for tooltips
    const formatDateForDisplay = (date: Date) => {
        return formatDate(date, DateDisplayFormat.FULL_DATE);
    };

    // Update tooltip position on mouse move
    const updateTooltipPosition = (e: React.MouseEvent) => {
        setTooltipPosition({
            x: e.clientX,
            y: e.clientY,
        });
    };

    // Handle task click
    const handleTaskClick = (e: React.MouseEvent, task: Task) => {
        e.stopPropagation();
        if (onTaskClick) {
            onTaskClick(task, person);
        }
    };

    // Group tasks into rows to avoid overlapping (using collision detection)
    const taskRows = detectCollisions(person.tasks);
    const rowHeight = taskRows.length * 40; // 40px per task row

    // Theme-based classes
    const tooltipBgClass = theme?.tooltipBackground || "bg-white";
    const tooltipTextClass = theme?.tooltipText || "text-gray-700";

    return (
        <div
            className="task-row relative border-b border-gray-200"
            style={{ height: `${Math.max(60, rowHeight)}px` }}
            onMouseMove={updateTooltipPosition}
            onMouseLeave={() => setHoveredTask(null)}
            data-testid={`task-row-${person.id}`}>
            {/* Render the tasks grouped by row to avoid collisions */}
            {taskRows.map((rowTasks: Task[], rowIndex: number) =>
                rowTasks.map((task: Task) => {
                    const { left, width, isOutOfRange } = getTaskDisplay(task);

                    // Skip rendering tasks outside the visible timeline
                    if (isOutOfRange) return null;

                    return (
                        <React.Fragment key={task.id}>
                            {/* Task Bar */}
                            <div
                                className={`absolute h-8 rounded-md ${
                                    task.color || "bg-blue-500"
                                } z-10 flex items-center px-2 text-xs text-white font-medium cursor-pointer shadow-sm hover:shadow`}
                                style={{
                                    left,
                                    width,
                                    top: `${rowIndex * 40 + 4}px`,
                                }}
                                onClick={e => handleTaskClick(e, task)}
                                onMouseEnter={() => setHoveredTask(task)}
                                data-testid={`task-${task.id}`}
                                data-start={normalizeDate(task.startDate).toISOString().split("T")[0]}
                                data-end={normalizeDate(task.endDate).toISOString().split("T")[0]}>
                                {/* Task name */}
                                <span className="truncate select-none">{task.name}</span>

                                {/* Progress bar (if applicable) */}
                                {task.percent !== undefined && (
                                    <div className="absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full"
                                            style={{ width: `${task.percent}%` }}></div>
                                    </div>
                                )}
                            </div>

                            {/* Tooltip (shown on hover) */}
                            {hoveredTask?.id === task.id && (
                                <div
                                    className={`fixed z-50 ${tooltipBgClass} border border-gray-200 rounded-md shadow-lg p-3 text-xs select-none`}
                                    style={{
                                        left: `${tooltipPosition.x + 10}px`,
                                        top: `${tooltipPosition.y - 80}px`,
                                        minWidth: "200px",
                                    }}
                                    data-testid={`tooltip-${task.id}`}>
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
