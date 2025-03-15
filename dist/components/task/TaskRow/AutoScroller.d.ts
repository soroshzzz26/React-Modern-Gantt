import React from "react";
export declare class AutoScroller {
    private scrolling;
    private speed;
    private direction;
    private scrollTimerId;
    private containerRef;
    private onChange?;
    private targetPositionRef?;
    private timelineLimitsRef?;
    constructor(containerRef: React.RefObject<HTMLDivElement | null>, onChange?: (isScrolling: boolean) => void, targetPositionRef?: React.MutableRefObject<{
        left: number;
        width: number;
    } | null>, timelineLimitsRef?: React.MutableRefObject<{
        minLeft: number;
        maxLeft: number;
    }>);
    checkForScrolling(clientX: number): void;
    startScrolling(): void;
    stopScrolling(): void;
}
