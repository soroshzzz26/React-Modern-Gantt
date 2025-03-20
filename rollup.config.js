import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import autoprefixer from "autoprefixer";
import { createFilter } from "@rollup/pluginutils";
import pkg from "./package.json";

// Detect Tailwind version - use v4 for build but ensure compatibility with v3
const isV4 = true;
const tailwindPlugin = isV4 ? require("@tailwindcss/postcss") : require("tailwindcss");

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            exports: "named",
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: "esm",
            exports: "named",
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        // Handle "use client" directive with proper sourcemap support
        {
            name: "replace-use-client",
            transform(code, id) {
                // Only apply to .tsx and .ts files
                const filter = createFilter(["**/*.ts", "**/*.tsx"]);
                if (!filter(id)) return null;

                // If the file doesn't include 'use client', return null (no transformation needed)
                if (!code.includes('"use client"') && !code.includes("'use client'")) return null;

                // Replace the directive
                return {
                    code: code.replace(/'use client';?\s*|"use client";?\s*/g, ""),
                    map: { mappings: "" },
                };
            },
        },
        // Add banner to direct users to import styles if needed
        {
            name: "add-style-warning",
            renderChunk(code, chunk, options) {
                if (chunk.fileName.endsWith(".js") || chunk.fileName.endsWith(".esm.js")) {
                    return {
                        code: `/**
 * React Modern Gantt
 *
 * IMPORTANT: You may need to import the stylesheet:
 * import "react-modern-gantt/dist/index.css";
 *
 * Or import the withStyles variant:
 * import { GanttChartWithStyles } from "react-modern-gantt";
 */
${code}`,
                        map: { mappings: "" },
                    };
                }
                return null;
            },
        },
        typescript({
            tsconfig: "./tsconfig.json",
            exclude: ["**/__tests__/**", "**/examples/**", "**/example/**"],
            compilerOptions: {
                rootDir: "./src",
                declaration: true,
                declarationDir: "dist",
            },
        }),
        postcss({
            plugins: [
                // Detect whether to use tailwindcss or @tailwindcss/postcss
                isV4 ? tailwindPlugin() : tailwindPlugin,
                autoprefixer(),
            ],
            minimize: true,
            modules: false,
            inject: false,
            // Extract styles to separate file
            extract: "index.css",
            config: {
                path: "./postcss.config.mjs",
                ctx: {
                    env: "production",
                    tailwindcss: {
                        content: ["./src/**/*.{js,jsx,ts,tsx}"],
                        safelist: [{ pattern: /.*/ }], // Include all classes
                    },
                },
            },
        }),
        terser(),
    ],
    external: ["react", "react-dom", "date-fns", "next/dynamic", "tailwindcss"],
};
