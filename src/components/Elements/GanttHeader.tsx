import React from "react";

interface GanttHeaderProps {
    children?: React.ReactNode;
    className?: string;
}

export const GanttHeader: React.FC<GanttHeaderProps> = ({ children = "Resources", className = "" }) => {
    return <div className={`font-semibold text-gray-700 ${className}`}>{children}</div>;
};
