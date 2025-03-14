import { Task } from "@/types";
/**
 * Calculates the position and width of a task in percentage
 */
export declare function calculateTaskPosition(task: Task, startDate: Date, endDate: Date): {
    left: string;
    width: string;
};
