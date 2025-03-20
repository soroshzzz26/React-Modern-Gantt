/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        // Detect Tailwind version and use appropriate plugin
        ...(process.env.TAILWIND_VERSION === "3" ? { tailwindcss: {} } : { "@tailwindcss/postcss": {} }),
        autoprefixer: {},
    },
};

export default config;
