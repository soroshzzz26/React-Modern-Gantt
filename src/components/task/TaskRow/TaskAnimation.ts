export interface AnimationState {
    left: number;
    width: number;
}

export class TaskAnimation {
    private animationFrameId: number | null = null;
    private lastUpdateTime: number = 0;
    private velocity = { left: 0, width: 0 };
    private updateCallback?: (position: AnimationState) => void;

    constructor(
        private currentPosition: AnimationState,
        private targetPosition: AnimationState,
        private animationSpeed: number = 0.25
    ) {}

    public startAnimation(updateCallback: (position: AnimationState) => void) {
        this.updateCallback = updateCallback;
        this.lastUpdateTime = Date.now();
        this.animate();
    }

    public stopAnimation() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    public updateTargetPosition(targetPosition: AnimationState) {
        this.targetPosition = targetPosition;

        // Start animation if it's not already running
        if (this.animationFrameId === null && this.updateCallback) {
            this.startAnimation(this.updateCallback);
        }
    }

    private animate = () => {
        const now = Date.now();
        const elapsed = now - this.lastUpdateTime;
        this.lastUpdateTime = now;

        // Smooth animation coefficient
        const easing = Math.max(0.1, Math.min(1, this.animationSpeed));

        // Calculate new position with easing
        const newLeft = this.currentPosition.left + (this.targetPosition.left - this.currentPosition.left) * easing;

        const newWidth = this.currentPosition.width + (this.targetPosition.width - this.currentPosition.width) * easing;

        // Update velocity for more natural animation
        this.velocity.left = (newLeft - this.currentPosition.left) / (elapsed || 16);
        this.velocity.width = (newWidth - this.currentPosition.width) / (elapsed || 16);

        // Update current position
        this.currentPosition = { left: newLeft, width: newWidth };

        // Apply the update
        if (this.updateCallback) {
            this.updateCallback(this.currentPosition);
        }

        // Continue animation loop
        this.animationFrameId = requestAnimationFrame(this.animate);
    };
}
