import React from "react";
import { Task } from "../models";
interface TaskRendererProps {
    task: Task;
    leftPx: number;
    widthPx: number;
    topPx: number;
    isHovered: boolean;
    isDragging: boolean;
    editMode: boolean;
    onMouseDown: (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => void;
    onMouseEnter: (event: React.MouseEvent, task: Task) => void;
    onMouseLeave: () => void;
    onClick: (event: React.MouseEvent, task: Task) => void;
}
/**
 * Renders a single task bar in the Gantt chart
 */
declare const TaskRenderer: React.FC<TaskRendererProps>;
export default TaskRenderer;
