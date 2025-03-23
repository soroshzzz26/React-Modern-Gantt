/**
 * Predefined themes for React Modern Gantt
 * These can be applied to customize the appearance without custom CSS
 */
export interface GanttTheme {
    bgColor: string;
    textColor: string;
    borderColor: string;
    highlightColor: string;
    markerColor: string;
    taskColor: string;
    taskTextColor: string;
    tooltipBgColor: string;
    tooltipTextColor: string;
    tooltipBorderColor: string;
    progressBgColor: string;
    progressFillColor: string;
    shadowColor: string;
    shadowHoverColor: string;
    shadowDragColor: string;
    scrollbarTrackColor: string;
    scrollbarThumbColor: string;
    scrollbarThumbHoverColor: string;
}
/**
 * Default light theme
 */
export declare const defaultTheme: GanttTheme;
/**
 * Dark theme
 */
export declare const darkTheme: GanttTheme;
/**
 * Material design inspired theme
 */
export declare const materialTheme: GanttTheme;
/**
 * Applies a theme to your Gantt chart by setting CSS variables
 * @param theme The theme to apply
 * @param selector Optional CSS selector to target (defaults to :root)
 */
export declare function applyTheme(theme: GanttTheme, selector?: string): void;
