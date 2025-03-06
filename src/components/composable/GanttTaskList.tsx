import React from "react";
import { TaskGroup } from "../../utils/types";

export interface GanttTaskListProps {
    tasks?: TaskGroup[];
    headerLabel?: string;
    showIcon?: boolean;
    showTaskCount?: boolean;
    showDescription?: boolean;
    className?: string;
    children?: React.ReactNode;
    onGroupClick?: (group: TaskGroup) => void;
}

/**
 * GanttTaskList Component
 *
 * Customizable task list sidebar component
 *
 * @example
 * <GanttTaskList showIcon={true} showTaskCount={true} className="w-48 bg-gray-50" />
 */
const GanttTaskList: React.FC<GanttTaskListProps> = ({
    tasks = [],
    headerLabel = "Resources",
    showIcon = false,
    showTaskCount = false,
    showDescription = true,
    className = "",
    children,
    onGroupClick,
}) => {
    return (
        <div className={`rmg-gantt-task-list w-40 flex-shrink-0 z-10 bg-gantt-bg shadow-sm ${className}`}>
            {children || (
                <>
                    <div className="p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10.5">
                        {headerLabel}
                    </div>
                </>
            )}
        </div>
    );
};

export default GanttTaskList;
