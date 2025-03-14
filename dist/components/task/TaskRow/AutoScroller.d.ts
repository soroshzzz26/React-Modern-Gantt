/// <reference types="react" />
export declare class AutoScroller {
    private scrolling;
    private speed;
    private direction;
    private scrollTimerId;
    private containerRef;
    private onChange?;
    constructor(containerRef: React.RefObject<HTMLDivElement | null>, onChange?: (isScrolling: boolean) => void);
    checkForScrolling(clientX: number): void;
    startScrolling(): void;
    stopScrolling(): void;
}
