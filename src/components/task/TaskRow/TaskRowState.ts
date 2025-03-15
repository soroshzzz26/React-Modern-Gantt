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
        // Use the preview task for calculating arrangement if it exists
        if (this.state.previewTask) {
            return CollisionService.getPreviewArrangement(this.state.previewTask, this.taskGroup.tasks, this.viewMode);
        }

        // Otherwise use normal collision detection
        return CollisionService.detectOverlaps(this.taskGroup.tasks, this.viewMode);
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
        // Create a deep copy of the task to avoid reference issues
        const taskCopy = {
            ...task,
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
        };

        this.updateState({
            draggingTask: taskCopy,
            dragType: type,
            dragStartX: clientX,
            previewTask: taskCopy, // Initialize previewTask with the task being dragged
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
        // Create a deep copy to ensure we're not maintaining references
        const updatedTask = {
            ...task,
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
        };

        this.updateState({ previewTask: updatedTask });
    }
}
