/// <reference types="react" />
/**
 * Theme management utilities for React Modern Gantt
 */
import { GanttTheme } from "./types";
/**
 * Default light theme
 */
export declare const lightTheme: GanttTheme;
/**
 * Default dark theme
 */
export declare const darkTheme: GanttTheme;
/**
 * Custom theme presets
 */
export declare const themePresets: {
    blue: {
        highlight: string;
        marker: string;
        task: string;
    };
    green: {
        highlight: string;
        marker: string;
        task: string;
    };
    purple: {
        highlight: string;
        marker: string;
        task: string;
    };
    amber: {
        highlight: string;
        marker: string;
        task: string;
    };
    red: {
        highlight: string;
        marker: string;
        task: string;
    };
    gray: {
        highlight: string;
        marker: string;
        task: string;
    };
};
/**
 * Merges a custom theme with a base theme
 * @param baseTheme The base theme to start with
 * @param customTheme The custom theme properties to apply
 * @returns A merged theme
 */
export declare function mergeTheme(baseTheme: GanttTheme, customTheme?: GanttTheme): GanttTheme;
/**
 * Applies a theme to CSS variables
 * @param theme The theme to apply
 * @param selector The CSS selector to apply the theme to (default: ':root')
 */
export declare function applyThemeToCssVariables(theme: GanttTheme, selector?: string): void;
/**
 * Creates a themed style object for inline styling
 * @param theme The theme to use
 * @param isDarkMode Whether to apply dark mode styles
 * @returns A style object for React inline styles
 */
export declare function createThemedStyles(theme: GanttTheme, isDarkMode?: boolean): React.CSSProperties;
