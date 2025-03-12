import React from "react";
import { Task, ViewMode } from "../utils/types";
import { TaskManager } from "../utils/TaskManager";
import { TooltipProps } from "../utils/types";
import { format } from "date-fns";

/**
 *  Tooltip Component
 *
 * Displays a tooltip with task information
 * Adapts date display based on view mode
 */
const Tooltip: React.FC<TooltipProps> = ({
    task,
    position,
    dragType,
    taskId,
    startDate,
    endDate,
    totalMonths,
    monthWidth,
    showProgress = false,
    instanceId,
    className = "",
    viewMode = ViewMode.MONTH,
}) => {
    // Default values
    let displayStartDate = task.startDate;
    let displayEndDate = task.endDate;

    try {
        // If the task is being dragged/resized, get the live dates from element position
        const id = taskId || task.id;
        const taskEl = document.querySelector(
            `[data-task-id="${id}"][data-instance-id="${instanceId}"]`
        ) as HTMLElement;

        if (taskEl && (dragType || taskEl.style.left || taskEl.style.width)) {
            const dates = TaskManager.getLiveDatesFromElement(
                taskEl,
                startDate,
                endDate,
                totalMonths,
                monthWidth,
                viewMode
            );
            displayStartDate = dates.startDate;
            displayEndDate = dates.endDate;
        }
    } catch (error) {
        console.error("Error calculating live dates for tooltip:", error);
    }

    // Calculate duration based on view mode
    const duration = TaskManager.getDuration(displayStartDate, displayEndDate, viewMode);

    // Format dates based on view mode - Simplified to use a single format function
    const formatDate = (date: Date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return "Invalid date";
        }

        switch (viewMode) {
            case ViewMode.DAY:
                return format(date, "EEE, MMM d, yyyy");
            default:
                return format(date, "MMM d, yyyy");
        }
    };

    // Get action text based on drag type
    const getActionText = () => {
        if (!dragType) return null;

        switch (dragType) {
            case "move":
                return "Moving task...";
            case "resize-left":
                return "Adjusting start date...";
            case "resize-right":
                return "Adjusting end date...";
            default:
                return null;
        }
    };

    const actionText = getActionText();

    return (
        <div
            className={`rmg-task-tooltip absolute z-20 bg-[var(--rmg-tooltip-bg,#ffffff)] text-[var(--rmg-tooltip-text,#1f2937)] border border-[var(--rmg-tooltip-border,#e5e7eb)] rounded-md shadow-md p-2 text-xs select-none ${className}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y - 40}px`,
                minWidth: "200px",
            }}>
            {/* Task name */}
            <div className="font-bold mb-1">{task.name || "Unnamed Task"}</div>

            {/* Action indicator */}
            {actionText && <div className="text-xs text-blue-500 dark:text-blue-400 mb-1 italic">{actionText}</div>}

            {/* Task details */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div className="font-semibold">Start:</div>
                <div>{formatDate(displayStartDate)}</div>

                <div className="font-semibold">End:</div>
                <div>{formatDate(displayEndDate)}</div>

                <div className="font-semibold">Duration:</div>
                <div>
                    {duration.value} {duration.unit}
                </div>

                {/* Show progress if enabled */}
                {showProgress && typeof task.percent === "number" && (
                    <>
                        <div className="font-semibold">Progress:</div>
                        <div>{task.percent}%</div>
                    </>
                )}

                {/* Show dependencies if available */}
                {task.dependencies && task.dependencies.length > 0 && (
                    <>
                        <div className="font-semibold">Dependencies:</div>
                        <div>{task.dependencies.join(", ")}</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Tooltip;
