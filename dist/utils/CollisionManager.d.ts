import { Task } from "../models";
/**
 * Manages the detection and resolution of task collisions
 */
export declare class CollisionManager {
    /**
     * Detects overlapping tasks and organizes them into rows
     */
    static detectOverlaps(tasks: Task[]): Task[][];
    /**
     * Check if a task would collide with any other tasks in the list
     */
    static wouldCollide(task: Task, allTasks: Task[], excludeTaskId?: string): boolean;
    /**
     * Calculates a preview of how tasks would be arranged with an updated task
     */
    static getPreviewArrangement(updatedTask: Task, allTasks: Task[]): Task[][];
}
