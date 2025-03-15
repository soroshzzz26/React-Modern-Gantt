/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "../src/**/*.{js,jsx,ts,tsx}", // Include library components
    ],
    darkMode: "class", // Enable dark mode with class strategy
    theme: {
        extend: {
            colors: {
                // Custom colors for the Gantt chart
                "gantt-bg": "var(--rmg-bg, #ffffff)",
                "gantt-text": "var(--rmg-text, #1f2937)",
                "gantt-border": "var(--rmg-border, #e5e7eb)",
                "gantt-highlight": "var(--rmg-highlight, #eff6ff)",
                "gantt-marker": "var(--rmg-marker, #ef4444)",
                "gantt-task": "var(--rmg-task, #3b82f6)",
                "gantt-task-text": "var(--rmg-task-text, #ffffff)",
            },
            typography: {
                DEFAULT: {
                    css: {
                        code: {
                            color: "#1a202c",
                        },
                        "code::before": {
                            content: '""',
                        },
                        "code::after": {
                            content: '""',
                        },
                    },
                },
            },
        },
    },
    plugins: [],
};
