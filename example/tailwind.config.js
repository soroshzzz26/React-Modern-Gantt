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
                "gantt-bg": "var(--rmg-bg)",
                "gantt-text": "var(--rmg-text)",
                "gantt-border": "var(--rmg-border)",
                "gantt-highlight": "var(--rmg-highlight)",
                "gantt-marker": "var(--rmg-marker)",
                "gantt-task": "var(--rmg-task)",
                "gantt-task-text": "var(--rmg-task-text)",
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
