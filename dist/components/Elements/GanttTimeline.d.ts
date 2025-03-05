import React from "react";
import { GanttTheme } from "@/utils/types";
interface GanttTimelineProps {
    months?: Date[];
    currentMonthIndex?: number;
    theme?: GanttTheme;
    className?: string;
}
export declare const GanttTimeline: React.FC<GanttTimelineProps>;
export {};
