import React from "react";

export interface GanttTitleProps {
    children?: React.ReactNode;
    className?: string;
}

/**
 * GanttTitle Component
 *
 * Customizable title component for the Gantt chart
 *
 * @example
 * <GanttTitle className="text-2xl text-blue-800">Custom Timeline Title</GanttTitle>
 */
const GanttTitle: React.FC<GanttTitleProps> = ({ children = "Project Timeline", className = "" }) => {
    return <h1 className={`rmg-gantt-title text-2xl font-bold text-gantt-text ${className}`}>{children}</h1>;
};

export default GanttTitle;
