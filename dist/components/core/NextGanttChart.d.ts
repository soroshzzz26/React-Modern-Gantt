import React from "react";
import { GanttChartProps } from "@/types";
/**
 * NextGanttChart - A Next.js compatible version of GanttChart
 * This component ensures that the GanttChart only renders on the client side
 * and prevents hydration errors in Next.js applications.
 */
declare const NextGanttChart: React.FC<GanttChartProps>;
export default NextGanttChart;
