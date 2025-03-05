import React from "react";
import { TaskGroup, GanttTheme } from "@/utils/types";

interface GanttTaskListProps {
    tasks?: TaskGroup[];
    headerLabel?: string;
    showIcon?: boolean;
    showTaskCount?: boolean;
    theme?: GanttTheme;
    className?: string;
}

export const GanttTaskList: React.FC<GanttTaskListProps> = ({
    tasks = [],
    headerLabel = "Resources",
    showIcon = false,
    showTaskCount = false,
    theme,
    className = "",
}) => {
    return (
        <div className={`w-40 flex-shrink-0 z-10 bg-white shadow-sm ${className}`}>
            <div className="p-2 font-semibold text-gray-700 border-r border-b border-gray-200 h-10.5">
                {headerLabel}
            </div>

            {tasks.map(taskGroup => {
                if (!taskGroup) return null;

                return (
                    <div
                        key={`task-group-${taskGroup.id || "unknown"}`}
                        className="p-2 border-r border-b border-gray-200 font-medium">
                        <div className="font-medium">{taskGroup.name || "Unnamed"}</div>
                        {taskGroup.description && <div className="text-xs text-gray-500">{taskGroup.description}</div>}
                    </div>
                );
            })}
        </div>
    );
};
