"use client";

import React from "react";
import { GanttChartProps } from "@/types";

// Define a dynamic import type that works with or without Next.js
let DynamicGanttChart: React.ComponentType<GanttChartProps>;

// Try to dynamically import GanttChart in a way that works in browser environments
try {
    // In Next.js environments, we'll use the dynamic import
    if (typeof window !== "undefined" && "window" in globalThis) {
        // We're in a browser environment
        const GanttChart = React.lazy(() => import("./GanttChart"));

        DynamicGanttChart = (props: GanttChartProps) => (
            <React.Suspense fallback={<div>Loading chart...</div>}>
                <GanttChart {...props} />
            </React.Suspense>
        );
    } else {
        // SSR environment - return empty component that will be replaced on client
        DynamicGanttChart = () => null;
    }
} catch (e) {
    // Fallback for non-Next.js environments
    DynamicGanttChart = () => <div>NextGanttChart requires client-side rendering. Please use GanttChart directly.</div>;
}

/**
 * NextGanttChart - A Next.js compatible version of GanttChart
 * This component ensures that the GanttChart only renders on the client side
 * and prevents hydration errors in Next.js applications.
 */
const NextGanttChart: React.FC<GanttChartProps> = props => {
    return <DynamicGanttChart {...props} />;
};

export default NextGanttChart;
