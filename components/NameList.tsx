import React from "react";

interface Person {
    name: string;
    tasks: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        color: string;
    }[];
}

interface NameListProps {
    people: Person[];
}

const detectCollisions = (tasks: Person["tasks"]) => {
    const sortedTasks = [...tasks].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const rows: Person["tasks"][] = [];

    sortedTasks.forEach(task => {
        let placed = false;
        for (let i = 0; i < rows.length; i++) {
            const lastTaskInRow = rows[i][rows[i].length - 1];
            if (task.startDate >= lastTaskInRow.endDate) {
                rows[i].push(task);
                placed = true;
                break;
            }
        }
        if (!placed) {
            rows.push([task]);
        }
    });

    return rows;
};

export default function NameList({ people }: NameListProps) {
    return (
        <div className="w-64 flex-shrink-0 bg-gray-100  border-r">
            <div className="h-24 border-b border-gray-200 bg-gray-50 flex items-center justify-center">
                <span className="font-semibold">Team Members</span>
            </div>
            {people.map((person, index) => {
                const collisionRows = detectCollisions(person.tasks);
                const rowHeight = collisionRows.length * 40; // 32px per task row + 8px spacing
                return (
                    <div
                        key={person.name}
                        className={`flex items-center space-x-2 px-4 ${
                            index !== people.length - 1 ? "border-b border-gray-200" : ""
                        }`}>
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                            {person.name.charAt(0)}
                        </div>
                        <div className="" style={{ height: `${rowHeight}px` }}>
                            <span className="font-semibold">{person.name}</span>
                            <span className="text-xs text-gray-500">{person.tasks.length} tasks</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
