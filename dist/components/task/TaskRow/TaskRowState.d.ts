import { Task, TaskGroup, ViewMode } from "@/types";
export interface TaskInteractionState {
    hoveredTask: Task | null;
    draggingTask: Task | null;
    dragType: "move" | "resize-left" | "resize-right" | null;
    dragStartX: number;
    tooltipPosition: {
        x: number;
        y: number;
    };
    previewTask: Task | null;
    initialTaskState: {
        left: number;
        width: number;
        startDate: Date;
        endDate: Date;
    } | null;
}
export declare class TaskRowState {
    private state;
    private taskGroup;
    private viewMode;
    private updateCallback;
    constructor(taskGroup: TaskGroup, viewMode: ViewMode, updateCallback: (state: TaskInteractionState) => void);
    getTaskRows(): Task[][];
    getState(): TaskInteractionState;
    updateState(newState: Partial<TaskInteractionState>): void;
    startTaskDrag(task: Task, type: "move" | "resize-left" | "resize-right", clientX: number, initialLeft: number, initialWidth: number): void;
    endTaskDrag(): void;
    setHoveredTask(task: Task | null, position?: {
        x: number;
        y: number;
    }): void;
    updatePreviewTask(task: Task): void;
}
