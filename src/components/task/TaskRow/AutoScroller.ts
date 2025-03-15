import React from "react";

export class AutoScroller {
    private scrolling: boolean = false;
    private speed: number = 0;
    private direction: "left" | "right" | null = null;
    private scrollTimerId: number | null = null;
    private containerRef: React.RefObject<HTMLDivElement | null>;
    private onChange?: (isScrolling: boolean) => void;
    private targetPositionRef?: React.MutableRefObject<{ left: number; width: number } | null>;
    private timelineLimitsRef?: React.MutableRefObject<{ minLeft: number; maxLeft: number }>;

    constructor(
        containerRef: React.RefObject<HTMLDivElement | null>,
        onChange?: (isScrolling: boolean) => void,
        targetPositionRef?: React.MutableRefObject<{ left: number; width: number } | null>,
        timelineLimitsRef?: React.MutableRefObject<{ minLeft: number; maxLeft: number }>
    ) {
        this.containerRef = containerRef;
        this.onChange = onChange;
        this.targetPositionRef = targetPositionRef;
        this.timelineLimitsRef = timelineLimitsRef;
    }

    public checkForScrolling(clientX: number) {
        const container = this.containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const edgeThreshold = 40;

        let direction: "left" | "right" | null = null;
        let scrollSpeed = 0;

        // Check if mouse is near the left edge
        if (clientX < containerRect.left + edgeThreshold) {
            direction = "left";
            // Calculate scroll speed based on proximity to edge (closer = faster)
            scrollSpeed = Math.max(1, Math.round((edgeThreshold - (clientX - containerRect.left)) / 10));
        }
        // Check if mouse is near the right edge
        else if (clientX > containerRect.right - edgeThreshold) {
            direction = "right";
            // Calculate scroll speed based on proximity to edge (closer = faster)
            scrollSpeed = Math.max(1, Math.round((clientX - (containerRect.right - edgeThreshold)) / 10));
        }

        this.direction = direction;
        this.speed = scrollSpeed;

        if (direction && !this.scrolling) {
            this.startScrolling();
        } else if (!direction && this.scrolling) {
            this.stopScrolling();
        }
    }

    public startScrolling() {
        if (this.scrolling) return;

        this.scrolling = true;
        if (this.onChange) this.onChange(true);

        const doScroll = () => {
            if (!this.scrolling || !this.containerRef.current) return;

            const container = this.containerRef.current;
            const currentScrollLeft = container.scrollLeft;
            const maxScrollLeft = container.scrollWidth - container.clientWidth;

            if (this.direction === "left") {
                if (currentScrollLeft <= 0) {
                    this.stopScrolling();
                    return;
                }

                const newScrollLeft = Math.max(0, currentScrollLeft - this.speed);
                container.scrollLeft = newScrollLeft;

                // Update target position during auto-scroll if provided
                if (this.targetPositionRef?.current && this.timelineLimitsRef?.current) {
                    const minLeft = this.timelineLimitsRef.current.minLeft;
                    const newLeft = Math.max(minLeft, this.targetPositionRef.current.left - this.speed);
                    this.targetPositionRef.current.left = newLeft;
                }
            } else if (this.direction === "right") {
                if (currentScrollLeft >= maxScrollLeft) {
                    this.stopScrolling();
                    return;
                }

                const newScrollLeft = Math.min(maxScrollLeft, currentScrollLeft + this.speed);
                container.scrollLeft = newScrollLeft;

                // Update target position during auto-scroll if provided
                if (this.targetPositionRef?.current && this.timelineLimitsRef?.current) {
                    const maxLeft = this.timelineLimitsRef.current.maxLeft - this.targetPositionRef.current.width;
                    const newLeft = Math.min(maxLeft, this.targetPositionRef.current.left + this.speed);
                    this.targetPositionRef.current.left = newLeft;
                }
            }

            // Continue scrolling if active
            if (this.scrolling) {
                this.scrollTimerId = requestAnimationFrame(doScroll);
            }
        };

        this.scrollTimerId = requestAnimationFrame(doScroll);
    }

    public stopScrolling() {
        this.scrolling = false;
        if (this.onChange) this.onChange(false);

        if (this.scrollTimerId !== null) {
            cancelAnimationFrame(this.scrollTimerId);
            this.scrollTimerId = null;
        }
    }
}
