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
const GanttHeader: React.FC<GanttHeaderProps> = ({ children = "Resources", className = "" }) => {
    return <div className={`rmg-gantt-header font-semibold text-gantt-text ${className}`}>{children}</div>;
};

export default GanttHeader;
