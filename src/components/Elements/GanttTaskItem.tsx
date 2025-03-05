import React from "react";
import { Task, TaskGroup } from "@/utils/types";

interface GanttTaskItemProps {
    task: Task;
    group: TaskGroup;
    leftPx?: number;
    widthPx?: number;
    topPx?: number;
    isSelected?: boolean;
    editMode?: boolean;
    showProgress?: boolean;
    className?: string;
    onSelect?: (task: Task, isSelected: boolean) => void;
    onClick?: (task: Task, group: TaskGroup) => void;
    onDoubleClick?: (task: Task) => void;
    onDragStart?: (task: Task, event: React.MouseEvent) => void;
    onDragEnd?: (task: Task) => void;
}

export const GanttTaskItem: React.FC<GanttTaskItemProps> = ({
    task,
    group,
    leftPx = 0,
    widthPx = 100,
    topPx = 0,
    isSelected = false,
    editMode = true,
    showProgress = false,
    className = "",
    onSelect,
    onClick,
    onDoubleClick,
    onDragStart,
    onDragEnd,
}) => {
    if (!task || !task.id) {
        console.warn("GanttTaskItem: Invalid task data", task);
        return null;
    }

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) onClick(task, group);
        if (onSelect) onSelect(task, !isSelected);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (onDoubleClick) onDoubleClick(task);
    };

    return (
        <div
            className={`absolute h-8 rounded ${
                task.color || "bg-blue-500"
            } flex items-center px-2 text-xs text-white font-medium ${editMode ? "cursor-move" : "cursor-pointer"} ${
                isSelected ? "ring-2 ring-white" : ""
            } ${className}`}
            style={{
                left: `${Math.max(0, leftPx)}px`,
                width: `${Math.max(20, widthPx)}px`,
                top: `${topPx}px`,
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            data-task-id={task.id}>
            {editMode && (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-l" />
            )}

            <div className="truncate select-none">{task.name || "Unnamed Task"}</div>

            {showProgress && typeof task.percent === "number" && (
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${task.percent}%` }} />
                </div>
            )}

            {editMode && (
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-r" />
            )}
        </div>
    );
};
