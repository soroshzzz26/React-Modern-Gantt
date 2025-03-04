import React from "react";
import { Task } from "../../models";

interface TaskRendererProps {
    task: Task;
    leftPx: number;
    widthPx: number;
    topPx: number;
    isHovered: boolean;
    isDragging: boolean;
    editMode: boolean;
    onMouseDown: (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => void;
    onMouseEnter: (event: React.MouseEvent, task: Task) => void;
    onMouseLeave: () => void;
    onClick: (event: React.MouseEvent, task: Task) => void;
}

/**
 * Renders a single task bar in the Gantt chart
 */
const TaskRenderer: React.FC<TaskRendererProps> = ({
    task,
    leftPx,
    widthPx,
    topPx,
    isHovered,
    isDragging,
    editMode,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onClick,
}) => {
    // Determine if we should show resize handles
    const showHandles = (isHovered || isDragging) && editMode;

    // Ensure we have valid task data
    if (!task || !task.id) {
        console.warn("TaskRenderer: Invalid task data", task);
        return null;
    }

    return (
        <div
            className={`absolute h-8 rounded ${
                task.color || "bg-blue-500"
            } flex items-center px-2 text-xs text-white font-medium ${editMode ? "cursor-move" : "cursor-pointer"}`}
            style={{
                left: `${Math.max(0, leftPx)}px`,
                width: `${Math.max(20, widthPx)}px`,
                top: `${topPx}px`,
            }}
            onClick={e => onClick(e, task)}
            onMouseDown={e => onMouseDown(e, task, "move")}
            onMouseEnter={e => onMouseEnter(e, task)}
            onMouseLeave={onMouseLeave}
            data-testid={`task-${task.id}`}
            data-task-id={task.id}>
            {/* Left resize handle - only visible on hover/drag */}
            {showHandles && (
                <div
                    className="absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-l"
                    onMouseDown={e => {
                        e.stopPropagation();
                        onMouseDown(e, task, "resize-left");
                    }}
                />
            )}

            <div className="truncate select-none">{task.name || "Unnamed Task"}</div>

            {/* Progress bar */}
            {typeof task.percent === "number" && (
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${task.percent}%` }} />
                </div>
            )}

            {/* Right resize handle - only visible on hover/drag */}
            {showHandles && (
                <div
                    className="absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-r"
                    onMouseDown={e => {
                        e.stopPropagation();
                        onMouseDown(e, task, "resize-right");
                    }}
                />
            )}
        </div>
    );
};

export default TaskRenderer;
