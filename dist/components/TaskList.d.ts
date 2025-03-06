import React from "react";
import { TaskGroup } from "../utils/types";
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
declare const TaskList: React.FC<TaskListProps>;
export default TaskList;
