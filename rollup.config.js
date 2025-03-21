import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import autoprefixer from "autoprefixer";
import { createFilter } from "@rollup/pluginutils";
import pkg from "./package.json" assert { type: "json" };

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
            plugins: [autoprefixer()],
            minimize: true,
            modules: false,
            // Change to TRUE to inject CSS into JS (for self-contained styling)
            inject: true,
            // Still extract the CSS for those who want to import it directly
            extract: "index.css",
            config: {
                path: "./postcss.config.mjs",
                ctx: {
                    env: "production",
                },
            },
        }),
        terser(),
    ],
    external: ["react", "react-dom", "date-fns"],
};
