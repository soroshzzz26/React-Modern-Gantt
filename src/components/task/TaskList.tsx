import React from "react";
import { TaskGroup, ViewMode, TaskListProps } from "@/types";
import { CollisionService } from "@/services";

/**
 * TaskList Component - Displays the list of task groups on the left side of the Gantt chart
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
    viewMode,
}) => {
    // Validate task groups array
    const validTasks = Array.isArray(tasks) ? tasks : [];

    // Calculate height for each group based on tasks
    const getGroupHeight = (taskGroup: TaskGroup) => {
        if (!taskGroup.tasks || !Array.isArray(taskGroup.tasks)) {
            return 60; // Default height for empty groups
        }

        const taskRows = CollisionService.detectOverlaps(taskGroup.tasks, viewMode);
        return Math.max(60, taskRows.length * rowHeight + 20);
    };

    // Handle group click
    const handleGroupClick = (group: TaskGroup) => {
        if (onGroupClick) {
            onGroupClick(group);
        }
    };

    // Determine if we need an adjustment for hierarchical timeline header
    const needsHierarchicalDisplay = viewMode === ViewMode.DAY || viewMode === ViewMode.WEEK;

    return (
        <div className={`rmg-task-list w-40 flex-shrink-0 z-10 bg-gantt-bg shadow-sm ${className}`}>
            {/* Header with adjusted structure for view mode */}
            {needsHierarchicalDisplay ? (
                // For day/week view, we need a double-height header
                <>
                    {/* First row - empty to match the month/year header */}
                    <div className="p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"></div>
                    {/* Second row - actual header label */}
                    <div className="p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10">
                        {headerLabel}
                    </div>
                </>
            ) : (
                // Standard single-height header for other views
                <div className="p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10">
                    {headerLabel}
                </div>
            )}

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
