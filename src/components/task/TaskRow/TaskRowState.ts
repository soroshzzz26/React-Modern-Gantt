import { Task, TaskGroup, ViewMode } from "@/types";
import { CollisionService } from "@/services";

export interface TaskInteractionState {
    hoveredTask: Task | null;
    draggingTask: Task | null;
    dragType: "move" | "resize-left" | "resize-right" | null;
    dragStartX: number;
    tooltipPosition: { x: number; y: number };
    previewTask: Task | null;
    initialTaskState: {
        left: number;
        width: number;
        startDate: Date;
        endDate: Date;
    } | null;
}

export class TaskRowState {
    private state: TaskInteractionState = {
        hoveredTask: null,
        draggingTask: null,
        dragType: null,
        dragStartX: 0,
        tooltipPosition: { x: 0, y: 0 },
        previewTask: null,
        initialTaskState: null,
    };

    private taskGroup: TaskGroup;
    private viewMode: ViewMode;
    private updateCallback: (state: TaskInteractionState) => void;

    constructor(taskGroup: TaskGroup, viewMode: ViewMode, updateCallback: (state: TaskInteractionState) => void) {
        this.taskGroup = taskGroup;
        this.viewMode = viewMode;
        this.updateCallback = updateCallback;
    }

    public getTaskRows(): Task[][] {
        return this.state.previewTask
            ? CollisionService.getPreviewArrangement(this.state.previewTask, this.taskGroup.tasks, this.viewMode)
            : CollisionService.detectOverlaps(this.taskGroup.tasks, this.viewMode);
    }

    public getState(): TaskInteractionState {
        return this.state;
    }

    public updateState(newState: Partial<TaskInteractionState>) {
        this.state = { ...this.state, ...newState };
        this.updateCallback(this.state);
    }

    // Task interaction methods
    public startTaskDrag(
        task: Task,
        type: "move" | "resize-left" | "resize-right",
        clientX: number,
        initialLeft: number,
        initialWidth: number
    ) {
        this.updateState({
            draggingTask: task,
            dragType: type,
            dragStartX: clientX,
            previewTask: task,
            initialTaskState: {
                left: initialLeft,
                width: initialWidth,
                startDate: new Date(task.startDate),
                endDate: new Date(task.endDate),
            },
        });
    }

    public endTaskDrag() {
        this.updateState({
            draggingTask: null,
            dragType: null,
            previewTask: null,
            initialTaskState: null,
        });
    }

    public setHoveredTask(task: Task | null, position?: { x: number; y: number }) {
        const newState: Partial<TaskInteractionState> = { hoveredTask: task };
        if (position) {
            newState.tooltipPosition = position;
        }
        this.updateState(newState);
    }

    public updatePreviewTask(task: Task) {
        this.updateState({ previewTask: task });
    }
}
