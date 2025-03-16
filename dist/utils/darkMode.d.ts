/**
 * Dark mode utilities for React Modern Gantt
 */
/**
 * Checks if dark mode is active based on HTML/document root class
 */
export declare const isDarkMode: () => boolean;
/**
 * Get conditional classes for dark mode
 * @param lightClasses - Classes for light mode
 * @param darkClasses - Classes for dark mode
 * @returns Combined class string
 */
export declare const darkModeClass: (lightClasses: string, darkClasses: string) => string;
/**
 * Helper for commonly used dark mode color pairs
 */
export declare const darkModeColors: {
    bg: string;
    bgSecondary: string;
    bgHover: string;
    text: string;
    textSecondary: string;
    border: string;
    borderSecondary: string;
    taskBar: string;
    taskBarHover: string;
    marker: string;
};
