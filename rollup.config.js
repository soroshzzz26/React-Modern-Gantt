import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import autoprefixer from "autoprefixer";
import pkg from "./package.json";

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
        typescript({
            tsconfig: "./tsconfig.json",
            exclude: ["**/__tests__/**", "**/examples/**"],
            compilerOptions: {
                rootDir: "./src",
                declaration: true,
                declarationDir: "dist",
            },
        }),
        postcss({
            plugins: [autoprefixer()],
            minimize: true,
            extract: "dist/styles.css",
            modules: false, // Set to true if you're using CSS Modules
            inject: false, // Don't inject CSS into the page
        }),
        terser(),
    ],
    external: ["react", "react-dom", "date-fns"],
};
