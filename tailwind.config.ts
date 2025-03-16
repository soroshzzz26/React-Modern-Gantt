import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./example/src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                // Gantt chart colors
                gantt: {
                    bg: "var(--rmg-bg)",
                    text: "var(--rmg-text)",
                    border: "var(--rmg-border)",
                    highlight: "var(--rmg-highlight)",
                    marker: "var(--rmg-marker)",
                    task: "var(--rmg-task)",
                    "task-text": "var(--rmg-task-text)",
                },
            },
        },
    },
    plugins: [],
};

export default config;
