import React from "react";
import { TaskGroup, TaskListProps } from "@/utils/types";
import { detectTaskOverlaps } from "@/models";

/**
 * TaskList Component
 *
 * Displays the list of task groups on the left side of the Gantt chart
 */
const TaskList: React.FC<TaskListProps> = ({
    tasks,
    headerLabel = "Resources",
    showIcon = false,
    showTaskCount = false,
}) => {
    // Validate task groups array
    const validTasks = Array.isArray(tasks) ? tasks : [];

    return (
        <div className="w-40 flex-shrink-0 z-10 bg-white shadow-sm">
            <div className="p-2 font-semibold text-gray-700 border-r border-b border-gray-200 h-10.5">
                {headerLabel}
            </div>

            {validTasks.map(taskGroup => {
                if (!taskGroup) return null;

                const tasks = Array.isArray(taskGroup.tasks) ? taskGroup.tasks : [];
                const taskRows = detectTaskOverlaps(tasks);
                const rowHeight = Math.max(60, taskRows.length * 40 + 20);

                return (
                    <div
                        key={`taskgroup-${taskGroup.id || "unknown"}`}
                        className="p-2 border-r border-b border-gray-200 font-medium"
                        style={{ height: `${rowHeight}px` }}
                        data-testid={`task-group-label-${taskGroup.id || "unknown"}`}>
                        <div className="font-medium">{taskGroup.name || "Unnamed"}</div>
                        {taskGroup.description && <div className="text-xs text-gray-500">{taskGroup.description}</div>}
                    </div>
                );
            })}
        </div>
    );
};

export default TaskList;
