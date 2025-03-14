export class AutoScroller {
    private scrolling = false;
    private speed = 0;
    private direction: "left" | "right" | null = null;
    private scrollTimerId: number | null = null;
    private containerRef: React.RefObject<HTMLDivElement | null>;
    private onChange?: (isScrolling: boolean) => void;

    constructor(containerRef: React.RefObject<HTMLDivElement | null>, onChange?: (isScrolling: boolean) => void) {
        this.containerRef = containerRef;
        this.onChange = onChange;
    }

    public checkForScrolling(clientX: number) {
        const container = this.containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const edgeThreshold = 40;

        let direction: "left" | "right" | null = null;
        let scrollSpeed = 0;

        if (clientX < containerRect.left + edgeThreshold) {
            direction = "left";
            scrollSpeed = Math.max(1, Math.round((edgeThreshold - (clientX - containerRect.left)) / 10));
        } else if (clientX > containerRect.right - edgeThreshold) {
            direction = "right";
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
                container.scrollLeft = Math.max(0, currentScrollLeft - this.speed);
            } else if (this.direction === "right") {
                if (currentScrollLeft >= maxScrollLeft) {
                    this.stopScrolling();
                    return;
                }
                container.scrollLeft = Math.min(maxScrollLeft, currentScrollLeft + this.speed);
            }

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
