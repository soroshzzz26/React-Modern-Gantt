import React from "react";
import { Task, TaskGroup } from "../../utils/types";
export interface GanttTaskItemProps {
    task: Task;
    group: TaskGroup;
    leftPx?: number;
    widthPx?: number;
    topPx?: number;
    isSelected?: boolean;
    editMode?: boolean;
    showProgress?: boolean;
    className?: string;
    onSelect?: (task: Task, isSelected: boolean) => void;
    onClick?: (task: Task, group: TaskGroup) => void;
    onDoubleClick?: (task: Task) => void;
    onDragStart?: (task: Task, event: React.MouseEvent) => void;
    onDragEnd?: (task: Task) => void;
}
/**
 * GanttTaskItem Component
 *
 * Customizable task bar component
 *
 * @example
 * <GanttTaskItem
 *   task={task}
 *   group={group}
 *   className="ring-2 ring-red-500"
 *   showProgress={true}
 * />
 */
declare const GanttTaskItem: React.FC<GanttTaskItemProps>;
export default GanttTaskItem;
