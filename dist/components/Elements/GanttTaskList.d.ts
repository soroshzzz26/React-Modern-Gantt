import React from "react";
import { TaskGroup } from "@/utils/types";
interface GanttTaskListProps {
    tasks?: TaskGroup[];
    headerLabel?: string;
    showIcon?: boolean;
    showTaskCount?: boolean;
    className?: string;
}
export declare const GanttTaskList: React.FC<GanttTaskListProps>;
export {};
