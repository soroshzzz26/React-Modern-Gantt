/**
 * Theme management utilities for React Modern Gantt
 */
import { GanttTheme } from "./types";

/**
 * Default light theme
 */
export const lightTheme: GanttTheme = {
    background: "#ffffff",
    text: "#1f2937",
    border: "#e5e7eb",
    highlight: "#eff6ff",
    marker: "#ef4444",
    task: "#3b82f6",
    taskText: "#ffffff",
    tooltip: "#ffffff",
    tooltipText: "#1f2937",
    tooltipBorder: "#e5e7eb",
    progress: "rgba(0, 0, 0, 0.2)",
    progressFill: "#ffffff",
};

/**
 * Default dark theme
 */
export const darkTheme: GanttTheme = {
    background: "#1f2937",
    text: "#f3f4f6",
    border: "#374151",
    highlight: "#374151",
    marker: "#ef4444",
    task: "#4f46e5",
    taskText: "#ffffff",
    tooltip: "#1f2937",
    tooltipText: "#f3f4f6",
    tooltipBorder: "#374151",
    progress: "rgba(0, 0, 0, 0.3)",
    progressFill: "#e5e7eb",
};

/**
 * Custom theme presets
 */
export const themePresets = {
    // Blue theme
    blue: {
        highlight: "#e6f1fe",
        marker: "#2563eb",
        task: "#3b82f6",
    },

    // Green theme
    green: {
        highlight: "#dcfce7",
        marker: "#16a34a",
        task: "#22c55e",
    },

    // Purple theme
    purple: {
        highlight: "#f3e8ff",
        marker: "#9333ea",
        task: "#a855f7",
    },

    // Amber theme
    amber: {
        highlight: "#fef3c7",
        marker: "#d97706",
        task: "#f59e0b",
    },

    // Red theme
    red: {
        highlight: "#fee2e2",
        marker: "#dc2626",
        task: "#ef4444",
    },

    // Gray theme
    gray: {
        highlight: "#f3f4f6",
        marker: "#4b5563",
        task: "#6b7280",
    },
};

/**
 * Merges a custom theme with a base theme
 * @param baseTheme The base theme to start with
 * @param customTheme The custom theme properties to apply
 * @returns A merged theme
 */
export function mergeTheme(baseTheme: GanttTheme, customTheme?: GanttTheme): GanttTheme {
    if (!customTheme) return baseTheme;

    return {
        ...baseTheme,
        ...customTheme,
    };
}

/**
 * Applies a theme to CSS variables
 * @param theme The theme to apply
 * @param selector The CSS selector to apply the theme to (default: ':root')
 */
export function applyThemeToCssVariables(theme: GanttTheme, selector: string = ":root"): void {
    const root = document.querySelector(selector) as HTMLElement;
    if (!root) return;

    // Only set properties that exist in the theme
    if (theme.background) root.style.setProperty("--rmg-bg", theme.background);
    if (theme.text) root.style.setProperty("--rmg-text", theme.text);
    if (theme.border) root.style.setProperty("--rmg-border", theme.border);
    if (theme.highlight) root.style.setProperty("--rmg-highlight", theme.highlight);
    if (theme.marker) root.style.setProperty("--rmg-marker", theme.marker);
    if (theme.task) root.style.setProperty("--rmg-task", theme.task);
    if (theme.taskText) root.style.setProperty("--rmg-task-text", theme.taskText);
    if (theme.tooltip) root.style.setProperty("--rmg-tooltip-bg", theme.tooltip);
    if (theme.tooltipText) root.style.setProperty("--rmg-tooltip-text", theme.tooltipText);
    if (theme.tooltipBorder) root.style.setProperty("--rmg-tooltip-border", theme.tooltipBorder);
    if (theme.progress) root.style.setProperty("--rmg-progress-bg", theme.progress);
    if (theme.progressFill) root.style.setProperty("--rmg-progress-fill", theme.progressFill);
}

/**
 * Creates a themed style object for inline styling
 * @param theme The theme to use
 * @param isDarkMode Whether to apply dark mode styles
 * @returns A style object for React inline styles
 */
export function createThemedStyles(theme: GanttTheme, isDarkMode: boolean = false): React.CSSProperties {
    // Base theme to use
    const baseTheme = isDarkMode ? darkTheme : lightTheme;
    const mergedTheme = mergeTheme(baseTheme, theme);

    return {
        "--rmg-bg": mergedTheme.background,
        "--rmg-text": mergedTheme.text,
        "--rmg-border": mergedTheme.border,
        "--rmg-highlight": mergedTheme.highlight,
        "--rmg-marker": mergedTheme.marker,
        "--rmg-task": mergedTheme.task,
        "--rmg-task-text": mergedTheme.taskText,
        "--rmg-tooltip-bg": mergedTheme.tooltip,
        "--rmg-tooltip-text": mergedTheme.tooltipText,
        "--rmg-tooltip-border": mergedTheme.tooltipBorder,
        "--rmg-progress-bg": mergedTheme.progress,
        "--rmg-progress-fill": mergedTheme.progressFill,
    } as React.CSSProperties;
}
