import React from "react";
import { Task } from "../../models";
import { TaskManager } from "../../utils/TaskManager";

interface TaskTooltipProps {
    task: Task;
    position: { x: number; y: number };
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
const TaskTooltip: React.FC<TaskTooltipProps> = ({
    task,
    position,
    dragType,
    taskId,
    startDate,
    endDate,
    totalMonths,
    monthWidth,
}) => {
    // Default to task's original dates
    let displayStartDate = task.startDate;
    let displayEndDate = task.endDate;

    // Always try to get live dates from the element's position
    try {
        // Use taskId if provided (during drag) or the task's id (after drag)
        const id = taskId || task.id;
        const taskEl = document.querySelector(`[data-task-id="${id}"]`) as HTMLElement;

        // If the element exists and has positioning styles applied
        if (taskEl && (dragType || taskEl.style.left || taskEl.style.width)) {
            // Calculate dates based on the element's current position
            const dates = TaskManager.getLiveDatesFromElement(taskEl, startDate, endDate, totalMonths, monthWidth);
            displayStartDate = dates.startDate;
            displayEndDate = dates.endDate;
        }
    } catch (error) {
        console.error("Error calculating live dates for tooltip:", error);
    }

    return (
        <div
            className="absolute z-20 bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs select-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y - 40}px`,
                minWidth: "150px",
            }}>
            <div className="font-bold mb-1">{task.name || "Unnamed Task"}</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div className="font-semibold">Start:</div>
                <div>{TaskManager.formatDate(displayStartDate)}</div>

                <div className="font-semibold">End:</div>
                <div>{TaskManager.formatDate(displayEndDate)}</div>

                <div className="font-semibold">Duration:</div>
                <div>{TaskManager.getDuration(displayStartDate, displayEndDate)} days</div>

                {typeof task.percent === "number" && (
                    <>
                        <div className="font-semibold">Progress:</div>
                        <div>{task.percent}%</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskTooltip;
