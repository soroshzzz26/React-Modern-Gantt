import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "react-modern-gantt": resolve(__dirname, "../src"),
        },
    },
    optimizeDeps: {
        include: ["react-modern-gantt"],
    },
    server: {
        port: 3000,
        open: true,
    },
});
