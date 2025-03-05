import React from "react";
import { Person, GanttTheme } from "../models";
import { detectTaskOverlaps } from "../models";

export interface NameListProps {
    people: Person[];
    headerLabel?: string;
    showAvatar?: boolean;
    showTaskCount?: boolean;
    theme?: GanttTheme;
}

/**
 * NameList Component
 *
 * Displays the list of people/resources on the left side of the Gantt chart
 */
const NameList: React.FC<NameListProps> = ({
    people,
    headerLabel = "Resource",
    showAvatar = false,
    showTaskCount = false,
    theme = {},
}) => {
    // Validate people array
    const validPeople = Array.isArray(people) ? people : [];

    return (
        <div className="w-40 flex-shrink-0 z-10 bg-white shadow-sm">
            <div className="p-2 font-semibold text-gray-700 border-r border-b border-gray-200 h-10.5">
                {headerLabel}
            </div>

            {validPeople.map(person => {
                if (!person) return null;

                const tasks = Array.isArray(person.tasks) ? person.tasks : [];
                const taskRows = detectTaskOverlaps(tasks);
                const rowHeight = Math.max(60, taskRows.length * 40 + 20);

                return (
                    <div
                        key={`person-${person.id || "unknown"}`}
                        className="p-2 border-r border-b border-gray-200 font-medium"
                        style={{ height: `${rowHeight}px` }}
                        data-testid={`person-label-${person.id || "unknown"}`}>
                        <div className="font-medium">{person.name || "Unnamed"}</div>
                        {person.role && <div className="text-xs text-gray-500">{person.role}</div>}
                    </div>
                );
            })}
        </div>
    );
};

export default NameList;
