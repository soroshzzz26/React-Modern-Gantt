import { Task, ViewMode } from "@/utils/types";
/**
 * Manages the detection and resolution of task collisions
 * Now with ViewMode support
 */
export declare class CollisionManager {
    /**
     * Detects overlapping tasks and organizes them into rows
     * Takes view mode into account for proper collision detection
     */
    static detectOverlaps(tasks: Task[], viewMode?: ViewMode): Task[][];
    /**
     * Check if tasks overlap considering the view mode
     */
    static checkTasksOverlap(taskA: Task, taskB: Task, viewMode?: ViewMode): boolean;
    /**
     * Get normalized date range based on view mode
     */
    private static getNormalizedDateRange;
    /**
     * Check if a task would collide with any other tasks in the list
     */
    static wouldCollide(task: Task, allTasks: Task[], viewMode?: ViewMode, excludeTaskId?: string): boolean;
    /**
     * Calculates a preview of how tasks would be arranged with an updated task
     */
    static getPreviewArrangement(updatedTask: Task, allTasks: Task[], viewMode?: ViewMode): Task[][];
}
