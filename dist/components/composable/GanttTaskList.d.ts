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
declare const GanttTaskList: React.FC<GanttTaskListProps>;
export default GanttTaskList;
