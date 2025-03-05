import React from "react";
import { TaskGroup, GanttTheme } from "@/utils/types";
interface GanttTaskListProps {
    tasks?: TaskGroup[];
    headerLabel?: string;
    showIcon?: boolean;
    showTaskCount?: boolean;
    theme?: GanttTheme;
    className?: string;
}
export declare const GanttTaskList: React.FC<GanttTaskListProps>;
export {};
