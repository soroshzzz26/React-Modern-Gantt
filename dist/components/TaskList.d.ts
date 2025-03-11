import React from "react";
import { TaskGroup, ViewMode } from "../utils/types";
export interface TaskListProps {
    tasks: TaskGroup[];
    headerLabel?: string;
    showIcon?: boolean;
    showTaskCount?: boolean;
    showDescription?: boolean;
    rowHeight?: number;
    className?: string;
    onGroupClick?: (group: TaskGroup) => void;
    viewMode?: ViewMode;
}
/**
 * TaskList Component
 *
 * Displays the list of task groups on the left side of the Gantt chart
 * Now with proper header height alignment and padding
 */
declare const TaskList: React.FC<TaskListProps>;
export default TaskList;
