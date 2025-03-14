import { TaskGroup } from "@/types";
/**
 * Finds the earliest start date from all tasks
 */
export declare function findEarliestDate(taskGroups: TaskGroup[]): Date;
/**
 * Finds the latest end date from all tasks
 */
export declare function findLatestDate(taskGroups: TaskGroup[]): Date;
