export interface AnimationState {
    left: number;
    width: number;
}
export declare class TaskAnimation {
    private currentPosition;
    private targetPosition;
    private animationSpeed;
    private animationFrameId;
    private lastUpdateTime;
    private velocity;
    private updateCallback?;
    constructor(currentPosition: AnimationState, targetPosition: AnimationState, animationSpeed?: number);
    startAnimation(updateCallback: (position: AnimationState) => void): void;
    stopAnimation(): void;
    updateTargetPosition(targetPosition: AnimationState): void;
    private animate;
}
