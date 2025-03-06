import React from "react";
import { TaskGroup } from "../utils/types";
import { detectTaskOverlaps } from "../models";

export interface TaskListProps {
    tasks: TaskGroup[];
    headerLabel?: string;
    showIcon?: boolean;
    showTaskCount?: boolean;
    showDescription?: boolean;
    rowHeight?: number;
    className?: string;
    onGroupClick?: (group: TaskGroup) => void;
}

/**
 * TaskList Component
 *
 * Displays the list of task groups on the left side of the Gantt chart
 */
const TaskList: React.FC<TaskListProps> = ({
    tasks = [],
    headerLabel = "Resources",
    showIcon = false,
    showTaskCount = false,
    showDescription = true,
    rowHeight = 40,
    className = "",
    onGroupClick,
}) => {
    // Validate task groups array
    const validTasks = Array.isArray(tasks) ? tasks : [];

    // Calculate height for each group based on tasks
    const getGroupHeight = (taskGroup: TaskGroup) => {
        if (!taskGroup.tasks || !Array.isArray(taskGroup.tasks)) {
            return 60; // Default height for empty groups
        }

        const taskRows = detectTaskOverlaps(taskGroup.tasks);
        return Math.max(60, taskRows.length * rowHeight + 20);
    };

    // Handle group click
    const handleGroupClick = (group: TaskGroup) => {
        if (onGroupClick) {
            onGroupClick(group);
        }
    };

    return (
        <div className={`rmg-task-list w-40 flex-shrink-0 z-10 bg-gantt-bg shadow-sm ${className}`}>
            {/* Header */}
            <div className="p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10.5">
                {headerLabel}
            </div>

            {/* Task Groups */}
            {validTasks.map(taskGroup => {
                if (!taskGroup) return null;

                const groupHeight = getGroupHeight(taskGroup);

                return (
                    <div
                        key={`task-group-${taskGroup.id || "unknown"}`}
                        className="p-2 border-r border-b border-gantt-border font-medium text-gantt-text bg-gantt-bg hover:bg-gantt-highlight transition-colors duration-150"
                        style={{ height: `${groupHeight}px` }}
                        onClick={() => handleGroupClick(taskGroup)}
                        data-testid={`task-group-${taskGroup.id || "unknown"}`}>
                        <div className="flex items-center">
                            {/* Icon (if enabled) */}
                            {showIcon && taskGroup.icon && (
                                <span className="mr-2" dangerouslySetInnerHTML={{ __html: taskGroup.icon }} />
                            )}

                            {/* Group name */}
                            <div className="font-medium truncate">{taskGroup.name || "Unnamed"}</div>
                        </div>

                        {/* Description (if available and enabled) */}
                        {showDescription && taskGroup.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                {taskGroup.description}
                            </div>
                        )}

                        {/* Task count (if enabled) */}
                        {showTaskCount && taskGroup.tasks && taskGroup.tasks.length > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {taskGroup.tasks.length} {taskGroup.tasks.length === 1 ? "task" : "tasks"}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TaskList;
