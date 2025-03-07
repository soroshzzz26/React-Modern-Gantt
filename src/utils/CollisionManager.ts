import { Task, ViewMode } from "@/utils/types";
import {
    isSameDay,
    isSameWeek,
    isSameMonth,
    isSameQuarter,
    isSameYear,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfQuarter,
    startOfYear,
    endOfDay,
    endOfWeek,
    endOfMonth,
    endOfQuarter,
    endOfYear,
} from "date-fns";

/**
 * Manages the detection and resolution of task collisions
 * Now with ViewMode support
 */
export class CollisionManager {
    /**
     * Detects overlapping tasks and organizes them into rows
     * Takes view mode into account for proper collision detection
     */
    public static detectOverlaps(tasks: Task[], viewMode: ViewMode = ViewMode.MONTH): Task[][] {
        if (!Array.isArray(tasks) || tasks.length === 0) {
            return [];
        }

        const rows: Task[][] = [];

        tasks.forEach(task => {
            let placed = false;

            // Check each existing row for collisions
            for (let i = 0; i < rows.length; i++) {
                // A task can be placed in this row if it doesn't overlap with ANY task in the row
                const hasCollision = rows[i].some(existingTask => {
                    // Check for overlap based on view mode
                    return this.checkTasksOverlap(task, existingTask, viewMode);
                });

                // If no collision in this row, place the task here
                if (!hasCollision) {
                    rows[i].push(task);
                    placed = true;
                    break;
                }
            }

            // If task couldn't be placed in any existing row, create a new row
            if (!placed) {
                rows.push([task]);
            }
        });

        return rows;
    }

    /**
     * Check if tasks overlap considering the view mode
     */
    public static checkTasksOverlap(taskA: Task, taskB: Task, viewMode: ViewMode = ViewMode.MONTH): boolean {
        if (!taskA.startDate || !taskA.endDate || !taskB.startDate || !taskB.endDate) {
            return false;
        }

        // Normalize dates to be consistently handled per view mode
        const { start: startA, end: endA } = this.getNormalizedDateRange(taskA.startDate, taskA.endDate, viewMode);
        const { start: startB, end: endB } = this.getNormalizedDateRange(taskB.startDate, taskB.endDate, viewMode);

        // Check if date ranges overlap using the standard overlap check
        return !(startA >= endB || endA <= startB);
    }

    /**
     * Get normalized date range based on view mode
     */
    private static getNormalizedDateRange(
        startDate: Date,
        endDate: Date,
        viewMode: ViewMode
    ): { start: Date; end: Date } {
        // Convert dates to timestamps for easier comparison
        let start = startDate.getTime();
        let end = endDate.getTime();

        // Normalize based on view mode
        switch (viewMode) {
            case ViewMode.DAY:
                // For day view, use exact day boundaries
                return {
                    start: startOfDay(startDate).getTime(),
                    end: endOfDay(endDate).getTime(),
                };

            case ViewMode.WEEK:
                // For week view, use week boundaries
                return {
                    start: startOfWeek(startDate).getTime(),
                    end: endOfWeek(endDate).getTime(),
                };

            case ViewMode.MONTH:
                // For month view, use month boundaries
                return {
                    start: startOfMonth(startDate).getTime(),
                    end: endOfMonth(endDate).getTime(),
                };

            case ViewMode.QUARTER:
                // For quarter view, use quarter boundaries
                return {
                    start: startOfQuarter(startDate).getTime(),
                    end: endOfQuarter(endDate).getTime(),
                };

            case ViewMode.YEAR:
                // For year view, use year boundaries
                return {
                    start: startOfYear(startDate).getTime(),
                    end: endOfYear(endDate).getTime(),
                };

            default:
                return { start, end };
        }
    }

    /**
     * Check if a task would collide with any other tasks in the list
     */
    public static wouldCollide(
        task: Task,
        allTasks: Task[],
        viewMode: ViewMode = ViewMode.MONTH,
        excludeTaskId?: string
    ): boolean {
        return allTasks.some(existingTask => {
            // Skip self-comparison or excluded task
            if (existingTask.id === task.id || existingTask.id === excludeTaskId) {
                return false;
            }

            // Check if tasks overlap
            return this.checkTasksOverlap(task, existingTask, viewMode);
        });
    }

    /**
     * Calculates a preview of how tasks would be arranged with an updated task
     */
    public static getPreviewArrangement(
        updatedTask: Task,
        allTasks: Task[],
        viewMode: ViewMode = ViewMode.MONTH
    ): Task[][] {
        // Create updated tasks array
        const updatedTasks = allTasks.map(task => (task.id === updatedTask.id ? updatedTask : task));

        return this.detectOverlaps(updatedTasks, viewMode);
    }
}
