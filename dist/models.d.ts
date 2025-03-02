/// <reference types="react" />
export interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
    percent?: number;
    dependencies?: string[];
}
export interface Person {
    id: string;
    name: string;
    tasks: Task[];
    avatar?: string;
    role?: string;
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
    visibleColumns?: number;
    columnWidth?: number;
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
}
export declare enum DateDisplayFormat {
    MONTH_YEAR = "MONTH_YEAR",
    WEEK_DAY = "WEEK_DAY",
    DAY_MONTH = "DAY_MONTH",
    FULL_DATE = "FULL_DATE"
}
export declare const DEFAULT_THEME: GanttTheme;
export declare function formatDate(date: Date, format?: DateDisplayFormat): string;
export declare function getDaysInMonth(year: number, month: number): number;
export declare function getDuration(start: Date, end: Date): number;
export declare function calculateTaskPosition(task: Task, startDate: Date, endDate: Date, columnWidth: number): {
    left: string;
    width: string;
    isOutOfRange: boolean;
};
export declare function detectCollisions(tasks: Task[]): Task[][];
export declare function generateTimelineHeader(startDate: Date, endDate: Date): string[];
