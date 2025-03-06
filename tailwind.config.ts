// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./example/src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                // Gantt chart colors
                gantt: {
                    bg: "var(--gantt-bg)",
                    text: "var(--gantt-text)",
                    border: "var(--gantt-border)",
                    highlight: "var(--gantt-highlight)",
                    marker: "var(--gantt-marker)",
                    task: "var(--gantt-task)",
                    "task-text": "var(--gantt-task-text)",
                },
            },
        },
    },
    plugins: [],
};

export default config;
