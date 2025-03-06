import React from "react";

interface GanttTitleProps {
    children?: React.ReactNode;
    className?: string;
}

export const GanttTitle: React.FC<GanttTitleProps> = ({ children = "Project Timeline", className = "" }) => {
    return <h1 className={`text-2xl font-bold text-gantt-text ${className}`}>{children}</h1>;
};
