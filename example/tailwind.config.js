/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../src/**/*.{js,ts,jsx,tsx}", // Für die React Modern Gantt-Komponenten
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "gantt-bg": "var(--color-gantt-bg)",
                "gantt-text": "var(--color-gantt-text)",
                "gantt-border": "var(--color-gantt-border)",
                "gantt-highlight": "var(--color-gantt-highlight)",
                "gantt-marker": "var(--color-gantt-marker)",
                "gantt-task": "var(--color-gantt-task)",
                "gantt-task-text": "var(--color-gantt-task-text)",
            },
        },
    },
    plugins: [],
};
