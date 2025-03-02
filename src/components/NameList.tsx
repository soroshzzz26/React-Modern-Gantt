import React from "react";
import { NameListProps, detectCollisions, Person } from "../models";

/**
 * NameList Component
 *
 * Displays the list of team members/resources on the left side of the Gantt chart
 */
const NameList: React.FC<NameListProps> = ({ people, showAvatar = true, showTaskCount = true, theme }) => {
    // Theme-based class assignments
    const headerBgClass = theme?.headerBackground || "bg-gray-50";
    const headerTextClass = theme?.headerText || "text-gray-700";
    const borderClass = theme?.timelineBorder || "border-gray-200";

    return (
        <div className="name-list w-64 flex-shrink-0 bg-white border-r border-gray-200 z-10">
            {/* Header */}
            <div className={`h-24 border-b ${borderClass} ${headerBgClass} flex items-center justify-center`}>
                <span className={`font-semibold ${headerTextClass}`}>Team Members</span>
            </div>

            {/* Person rows */}
            <div className="people-list">
                {people.map((person: Person, index: number) => {
                    // Calculate rows needed based on task collisions
                    const collisionRows = detectCollisions(person.tasks);
                    const rowHeight = Math.max(60, collisionRows.length * 40); // Minimum height or 40px per row

                    // Get initial for avatar
                    const initial = person.name.charAt(0).toUpperCase();

                    return (
                        <div
                            key={person.id}
                            className={`flex items-center px-4 ${
                                index !== people.length - 1 ? `border-b ${borderClass}` : ""
                            }`}
                            style={{ height: `${rowHeight}px` }}>
                            {showAvatar &&
                                (person.avatar ? (
                                    <img src={person.avatar} alt={person.name} className="w-8 h-8 rounded-full mr-3" />
                                ) : (
                                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm mr-3">
                                        {initial}
                                    </div>
                                ))}

                            <div className="flex flex-col">
                                <div className="font-medium text-sm">{person.name}</div>
                                {person.role && <div className="text-xs text-gray-500">{person.role}</div>}
                                {showTaskCount && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        {person.tasks.length} {person.tasks.length === 1 ? "task" : "tasks"}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default NameList;
