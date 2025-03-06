import React from "react";
export interface GanttHeaderProps {
    children?: React.ReactNode;
    className?: string;
}
/**
 * GanttHeader Component
 *
 * Customizable header component for the task list section
 *
 * @example
 * <GanttHeader className="font-bold text-indigo-600">Teams & Resources</GanttHeader>
 */
declare const GanttHeader: React.FC<GanttHeaderProps>;
export default GanttHeader;
