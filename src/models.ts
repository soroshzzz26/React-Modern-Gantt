export interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
    percent?: number; // Optional: Completion percentage
    dependencies?: string[]; // Optional: IDs of tasks this depends on
}

export interface Person {
    id: string;
    name: string;
    tasks: Task[];
    avatar?: string; // Optional: URL or initial for avatar
    role?: string; // Optional: Role description
}

export interface GanttTheme {
    headerBackground?: string;
    headerText?: string;
    timelineBackground?: string;
    timelineBorder?: string;
    timelineText?: string;
    taskDefaultColor?: string;
    highlightColor?: string;
    todayMarkerColor?: string;
    tooltipBackground?: string;
    tooltipText?: string;
}

export interface GanttChartProps {
    people: Person[];
    startDate?: Date;
    endDate?: Date;
    title?: string;
    showAvatar?: boolean;
    showTaskCount?: boolean;
    theme?: GanttTheme;
    onTaskUpdate?: (personId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, person: Person) => void;
    currentDate?: Date;
    showCurrentDateMarker?: boolean;
    visibleColumns?: number; // Number of columns visible without scrolling
    columnWidth?: number; // Width in pixels for each month column
    onProgressChange?: (personId: string, taskId: string, percent: number) => void; // New callback for progress changes
}

export interface TimelineProps {
    startDate: Date;
    endDate: Date;
    columnWidth: number;
    theme?: GanttTheme;
    children: React.ReactNode;
    scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export interface NameListProps {
    people: Person[];
    showAvatar?: boolean;
    showTaskCount?: boolean;
    theme?: GanttTheme;
}

export interface TaskRowProps {
    person: Person;
    startDate: Date;
    endDate: Date;
    columnWidth: number;
    theme?: GanttTheme;
    onTaskUpdate?: (personId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, person: Person) => void;
    onProgressChange?: (personId: string, taskId: string, percent: number) => void; // Pass through progress change handler
}

export enum DateDisplayFormat {
    MONTH_YEAR = "MONTH_YEAR",
    WEEK_DAY = "WEEK_DAY",
    DAY_MONTH = "DAY_MONTH",
    FULL_DATE = "FULL_DATE",
}

// Helper functions
export const DEFAULT_THEME: GanttTheme = {
    headerBackground: "bg-gray-50",
    headerText: "text-gray-700",
    timelineBackground: "bg-gray-50",
    timelineBorder: "border-gray-200",
    timelineText: "text-gray-500",
    taskDefaultColor: "bg-blue-500",
    highlightColor: "bg-indigo-100",
    todayMarkerColor: "bg-red-500",
    tooltipBackground: "bg-white",
    tooltipText: "text-gray-700",
};

export function formatDate(date: Date, format: DateDisplayFormat = DateDisplayFormat.MONTH_YEAR): string {
    switch (format) {
        case DateDisplayFormat.MONTH_YEAR:
            return date.toLocaleString("default", { month: "short", year: "numeric" }).toUpperCase();
        case DateDisplayFormat.WEEK_DAY:
            return date.toLocaleString("default", { weekday: "short", day: "numeric" });
        case DateDisplayFormat.DAY_MONTH:
            return date.toLocaleString("default", { day: "numeric", month: "short" });
        case DateDisplayFormat.FULL_DATE:
            return date.toLocaleDateString("default", { year: "numeric", month: "short", day: "numeric" });
        default:
            return date.toLocaleString("default", { month: "short", year: "numeric" });
    }
}

export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

export function getDuration(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateTaskPosition(
    task: Task,
    startDate: Date,
    endDate: Date,
    columnWidth: number
): {
    left: string;
    width: string;
    isOutOfRange: boolean;
} {
    // Standardize dates by setting hours to zero to avoid time-related calculation errors
    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    const taskStartTime = new Date(task.startDate);
    taskStartTime.setHours(0, 0, 0, 0);

    const taskEndTime = new Date(task.endDate);
    taskEndTime.setHours(23, 59, 59, 999);

    // Total days in the visible timeline
    const totalDays = getDuration(startTime, endTime);

    // Calculate task position
    // Zero-based index of start day (days from timeline start)
    const taskStartDay = Math.max(0, getDuration(startTime, taskStartTime));

    // End day position
    const taskEndDay = Math.min(totalDays, getDuration(startTime, taskEndTime));

    // Task width in days
    const taskDuration = Math.max(1, taskEndDay - taskStartDay); // Ensure at least 1 day width

    // Calculate days per month on average for the timeline
    const avgDaysPerMonth = totalDays / calculateMonthsBetween(startTime, endTime);

    // Calculate pixel width per day based on column width
    const dayWidth = columnWidth / avgDaysPerMonth;

    // Position and width calculations
    const left = taskStartDay * dayWidth;
    const width = taskDuration * dayWidth;

    // Check if task is outside the visible range
    const isOutOfRange = taskEndTime < startTime || taskStartTime > endTime;

    return {
        left: `${left}px`,
        width: `${width}px`,
        isOutOfRange,
    };
}

// Helper function to calculate the number of months between two dates
function calculateMonthsBetween(startDate: Date, endDate: Date): number {
    return (
        (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth() + 1 // Include both start and end months
    );
}

export function detectCollisions(tasks: Task[]): Task[][] {
    // Sort tasks by start date
    const sortedTasks = [...tasks].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const rows: Task[][] = [];

    sortedTasks.forEach(task => {
        let placed = false;
        for (let i = 0; i < rows.length; i++) {
            const lastTaskInRow = rows[i][rows[i].length - 1];
            if (task.startDate >= lastTaskInRow.endDate) {
                rows[i].push(task);
                placed = true;
                break;
            }
        }
        if (!placed) {
            rows.push([task]);
        }
    });

    return rows;
}

export function generateTimelineHeader(startDate: Date, endDate: Date): string[] {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(formatDate(currentDate, DateDisplayFormat.MONTH_YEAR));
        // Move to the next month
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dates;
}

// New function to snap a date to the timeline grid
export function snapDateToGrid(date: Date, gridSize: number = 1): Date {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const snappedDay = Math.round(day / gridSize) * gridSize;
    newDate.setDate(snappedDay);
    return newDate;
}
