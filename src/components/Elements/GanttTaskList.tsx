import React from "react";
import { TaskGroup } from "@/utils/types";

interface GanttTaskListProps {
    tasks?: TaskGroup[];
    headerLabel?: string;
    showIcon?: boolean;
    showTaskCount?: boolean;
    className?: string;
}

export const GanttTaskList: React.FC<GanttTaskListProps> = ({
    tasks = [],
    headerLabel = "Resources",
    showIcon = false,
    showTaskCount = false,
    className = "",
}) => {
    return (
        <div className={`w-40 flex-shrink-0 z-10 bg-gantt-bg shadow-sm ${className}`}>
            <div className="p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10.5">
                {headerLabel}
            </div>

            {tasks.map(taskGroup => {
                if (!taskGroup) return null;

                return (
                    <div
                        key={`task-group-${taskGroup.id || "unknown"}`}
                        className="p-2 border-r border-b border-gantt-border font-medium text-gantt-text bg-gantt-bg">
                        <div className="font-medium">{taskGroup.name || "Unnamed"}</div>
                        {taskGroup.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{taskGroup.description}</div>
                        )}
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
