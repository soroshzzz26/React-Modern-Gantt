import React from "react";
import { Task, TaskColorProps } from "../utils/types";
interface TaskItemProps {
    task: Task;
    leftPx: number;
    widthPx: number;
    topPx: number;
    isHovered: boolean;
    isDragging: boolean;
    editMode: boolean;
    showProgress?: boolean;
    instanceId: string;
    renderTask?: (props: {
        task: Task;
        leftPx: number;
        widthPx: number;
        topPx: number;
        isHovered: boolean;
        isDragging: boolean;
        editMode: boolean;
        showProgress?: boolean;
    }) => React.ReactNode;
    getTaskColor?: (props: TaskColorProps) => {
        backgroundColor: string;
        borderColor?: string;
        textColor?: string;
    };
    onMouseDown: (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => void;
    onMouseEnter: (event: React.MouseEvent, task: Task) => void;
    onMouseLeave: () => void;
    onClick: (event: React.MouseEvent, task: Task) => void;
}
/**
 * TaskItem Component
 *
 * Renders a single task bar in the Gantt chart
 * Supports dragging, resizing, and progress display
 * Now with custom rendering capabilities
 */
declare const TaskItem: React.FC<TaskItemProps>;
export default TaskItem;
