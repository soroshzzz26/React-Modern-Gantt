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
        <div className={`rmg-task-list ${className}`} data-rmg-component="task-list">
            {/* Header with adjusted structure for view mode */}
            {needsHierarchicalDisplay ? (
                // For day/week view, we need a double-height header
                <>
                    {/* First row - empty to match the month/year header */}
                    <div className="rmg-task-list-header"></div>
                    {/* Second row - actual header label */}
                    <div className="rmg-task-list-header">{headerLabel}</div>
                </>
            ) : (
                // Standard single-height header for other views
                <div className="rmg-task-list-header">{headerLabel}</div>
            )}

            {/* Task Groups */}
            {validTasks.map(taskGroup => {
                if (!taskGroup) return null;

                const groupHeight = getGroupHeight(taskGroup);

                return (
                    <div
                        key={`task-group-${taskGroup.id || "unknown"}`}
                        className="rmg-task-group"
                        style={{ height: `${groupHeight}px` }}
                        onClick={() => handleGroupClick(taskGroup)}
                        data-testid={`task-group-${taskGroup.id || "unknown"}`}
                        data-rmg-component="task-group"
                        data-group-id={taskGroup.id}>
                        <div className="rmg-task-group-content">
                            {/* Icon (if enabled) */}
                            {showIcon && taskGroup.icon && (
                                <span
                                    className="rmg-task-group-icon"
                                    dangerouslySetInnerHTML={{ __html: taskGroup.icon }}
                                    data-rmg-component="task-group-icon"
                                />
                            )}

                            {/* Group name */}
                            <div className="rmg-task-group-name" data-rmg-component="task-group-name">
                                {taskGroup.name || "Unnamed"}
                            </div>
                        </div>

                        {/* Description (if available and enabled) */}
                        {showDescription && taskGroup.description && (
                            <div className="rmg-task-group-description" data-rmg-component="task-group-description">
                                {taskGroup.description}
                            </div>
                        )}

                        {/* Task count (if enabled) */}
                        {showTaskCount && taskGroup.tasks && taskGroup.tasks.length > 0 && (
                            <div className="rmg-task-group-count" data-rmg-component="task-group-count">
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
