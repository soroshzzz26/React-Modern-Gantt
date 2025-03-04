import React from "react";
import { Task } from "../../models";
interface TaskTooltipProps {
    task: Task;
    position: {
        x: number;
        y: number;
    };
    dragType: "move" | "resize-left" | "resize-right" | null;
    taskId?: string;
    startDate: Date;
    endDate: Date;
    totalMonths: number;
    monthWidth: number;
}
/**
 * Displays a tooltip with task information
 */
declare const TaskTooltip: React.FC<TaskTooltipProps>;
export default TaskTooltip;
