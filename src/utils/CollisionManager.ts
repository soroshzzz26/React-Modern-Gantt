import { Task } from "../models";

/**
 * Manages the detection and resolution of task collisions
 */
export class CollisionManager {
    /**
     * Detects overlapping tasks and organizes them into rows
     */
    public static detectOverlaps(tasks: Task[]): Task[][] {
        if (!Array.isArray(tasks) || tasks.length === 0) {
            return [];
        }

        // Sort tasks by start date
        const sortedTasks = [...tasks].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        const rows: Task[][] = [];

        sortedTasks.forEach(task => {
            let placed = false;

            // Check each existing row for collisions
            for (let i = 0; i < rows.length; i++) {
                // A task can be placed in this row if it doesn't overlap with ANY task in the row
                const hasCollision = rows[i].some(existingTask => {
                    // Check if date ranges overlap
                    return !(task.startDate >= existingTask.endDate || task.endDate <= existingTask.startDate);
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
     * Check if a task would collide with any other tasks in the list
     */
    public static wouldCollide(task: Task, allTasks: Task[], excludeTaskId?: string): boolean {
        return allTasks.some(existingTask => {
            // Skip self-comparison or excluded task
            if (existingTask.id === task.id || existingTask.id === excludeTaskId) {
                return false;
            }

            // Check if date ranges overlap
            return !(task.startDate >= existingTask.endDate || task.endDate <= existingTask.startDate);
        });
    }

    /**
     * Calculates a preview of how tasks would be arranged with an updated task
     */
    public static getPreviewArrangement(updatedTask: Task, allTasks: Task[]): Task[][] {
        // Create updated tasks array
        const updatedTasks = allTasks.map(task => (task.id === updatedTask.id ? updatedTask : task));

        return this.detectOverlaps(updatedTasks);
    }
}
