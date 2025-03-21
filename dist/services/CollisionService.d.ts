import { Task, ViewMode } from "@/types";
/**
 * Service for detecting and resolving task collisions/overlaps
 * Used for arranging tasks in rows to prevent visual overlapping
 */
export declare class CollisionService {
    /**
     * Detects overlapping tasks and organizes them into rows
     * Using precise visual overlap detection
     */
    static detectOverlaps(tasks: Task[], viewMode?: ViewMode): Task[][];
    /**
     * Check if tasks visually overlap
     * Uses a more precise algorithm that matches visual representation based on view mode
     */
    static tasksVisuallyOverlap(taskA: Task, taskB: Task, viewMode?: ViewMode): boolean;
    /**
     * Get appropriate collision buffer based on view mode
     * Smaller buffer for minute/hour view, larger for year view
     */
    private static getCollisionBufferByViewMode;
    /**
     * Check if a task would collide with any other tasks in the list
     */
    static wouldCollide(task: Task, allTasks: Task[], viewMode?: ViewMode, excludeTaskId?: string): boolean;
    /**
     * Calculates a preview of how tasks would be arranged with an updated task
     */
    static getPreviewArrangement(updatedTask: Task, allTasks: Task[], viewMode?: ViewMode): Task[][];
}
