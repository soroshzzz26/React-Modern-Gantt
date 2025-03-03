import React, { useState } from "react";

// Beispieldaten für die GanttChart-Demo
const initialPeople = [
    {
        id: "1",
        name: "Alice Johnson",
        role: "Frontend Developer",
        tasks: [
            {
                id: "task-1",
                name: "Website Redesign",
                startDate: new Date(2023, 0, 1), // Jan 1
                endDate: new Date(2023, 2, 15), // Mar 15
                color: "bg-emerald-500",
                percent: 100,
            },
            {
                id: "task-2",
                name: "Mobile Responsiveness",
                startDate: new Date(2023, 3, 1), // Apr 1
                endDate: new Date(2023, 4, 30), // May 30
                color: "bg-violet-500",
                percent: 80,
            },
        ],
    },
    {
        id: "2",
        name: "Bob Smith",
        role: "Backend Developer",
        tasks: [
            {
                id: "task-3",
                name: "API Development",
                startDate: new Date(2023, 1, 15), // Feb 15
                endDate: new Date(2023, 3, 15), // Apr 15
                color: "bg-blue-500",
                percent: 90,
            },
            {
                id: "task-4",
                name: "Database Optimization",
                startDate: new Date(2023, 4, 1), // May 1
                endDate: new Date(2023, 5, 30), // Jun 30
                color: "bg-orange-500",
                percent: 40,
            },
        ],
    },
    {
        id: "3",
        name: "Charlie Brown",
        role: "Project Manager",
        tasks: [
            {
                id: "task-5",
                name: "Planning Phase",
                startDate: new Date(2023, 0, 1), // Jan 1
                endDate: new Date(2023, 0, 31), // Jan 31
                color: "bg-red-500",
                percent: 100,
            },
            {
                id: "task-6",
                name: "Implementation Oversight",
                startDate: new Date(2023, 1, 1), // Feb 1
                endDate: new Date(2023, 5, 30), // Jun 30
                color: "bg-gray-500",
                percent: 65,
            },
        ],
    },
];

const GanttChartComponent = () => {
    // Zustand für Personen/Tasks
    const [people, setPeople] = useState(initialPeople);

    // Zustand für das aktuelle Datum und den Bearbeitungsmodus
    const [currentDate, setCurrentDate] = useState(new Date(2023, 3, 15)); // April 15
    const [editMode, setEditMode] = useState(true);

    // Event-Handler für Task-Updates durch Drag & Drop
    const handleTaskUpdate = (personId: any, updatedTask: any) => {
        console.log("Task updated:", personId, updatedTask);

        setPeople(currentPeople =>
            currentPeople.map(person =>
                person.id === personId
                    ? {
                          ...person,
                          tasks: person.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
                      }
                    : person
            )
        );
    };

    // Event-Handler für Task-Klicks
    const handleTaskClick = (task: any, person: any) => {
        const dateFormatOptions = { year: "numeric", month: "long", day: "numeric" };
        alert(
            `Task: ${task.name}\n` +
                `Team Member: ${person.name}\n` +
                `Duration: ${task.startDate.toLocaleDateString(undefined, dateFormatOptions)} - ` +
                `${task.endDate.toLocaleDateString(undefined, dateFormatOptions)}\n` +
                `Progress: ${task.percent || 0}%`
        );
    };

    // Monatsnamen für das Dropdown
    const months = ["January", "February", "March", "April", "May", "June", "July", "August"];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header mit Controls */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Project Timeline (2023)</h1>
                            <div className="flex space-x-4 items-center">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Current Date:</span>
                                    <select
                                        className="rounded border border-gray-300 px-2 py-1"
                                        value={currentDate.getMonth()}
                                        onChange={e => setCurrentDate(new Date(2023, parseInt(e.target.value), 15))}>
                                        {months.map((month, index) => (
                                            <option key={index} value={index}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={() => setEditMode(!editMode)}
                                    className={`px-4 py-2 rounded ${
                                        editMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"
                                    } text-white transition`}>
                                    {editMode ? "Editing Mode: ON" : "Editing Mode: OFF"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Gantt Chart */}
                    <div className="p-4">
                        {/* Timeline header */}
                        <div className="flex border-b border-gray-200">
                            {/* Name column */}
                            <div className="w-40 flex-shrink-0 p-2 font-semibold text-gray-700 border-r border-gray-200">
                                Team Member
                            </div>

                            {/* Month columns */}
                            <div className="flex-grow flex">
                                {months.map((month, index) => (
                                    <div
                                        key={index}
                                        className={`flex-1 p-2 font-semibold text-center ${
                                            index === currentDate.getMonth() ? "bg-blue-50" : ""
                                        }`}>
                                        {month.substring(0, 3)} '23
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* People and tasks */}
                        {people.map(person => (
                            <div key={person.id} className="flex border-b border-gray-200 hover:bg-gray-50">
                                {/* Person name */}
                                <div className="w-40 flex-shrink-0 p-2 border-r border-gray-200">
                                    <div className="font-medium">{person.name}</div>
                                    <div className="text-xs text-gray-500">{person.role}</div>
                                </div>

                                {/* Tasks timeline */}
                                <div className="flex-grow relative" style={{ height: "60px" }}>
                                    {person.tasks.map(task => {
                                        // Calculate position based on dates
                                        const startMonth = task.startDate.getMonth();
                                        const endMonth = task.endDate.getMonth();
                                        const totalMonths = 8; // Jan to Aug

                                        const left = (startMonth / totalMonths) * 100;
                                        const width = ((endMonth - startMonth + 1) / totalMonths) * 100;

                                        return (
                                            <div
                                                key={task.id}
                                                data-task-id={task.id}
                                                className={`absolute h-8 rounded ${
                                                    task.color
                                                } flex items-center px-2 text-xs text-white font-medium ${
                                                    editMode ? "cursor-move" : "cursor-pointer"
                                                }`}
                                                style={{
                                                    left: `${left}%`,
                                                    width: `${width}%`,
                                                    top: "16px",
                                                }}
                                                onClick={() => handleTaskClick(task, person)}>
                                                <div className="truncate">{task.name}</div>

                                                {/* Progress bar */}
                                                {task.percent !== undefined && (
                                                    <div className="absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-white rounded-full"
                                                            style={{ width: `${task.percent}%` }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Resize handles (only if edit mode) */}
                                                {editMode && (
                                                    <>
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white bg-opacity-30 cursor-ew-resize rounded-l" />
                                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white bg-opacity-30 cursor-ew-resize rounded-r" />
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Current date marker - nur einmal pro Person anzeigen */}
                                    {person === people[0] && (
                                        <div
                                            className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                                            style={{
                                                left: `${((currentDate.getMonth() + 0.5) / 8) * 100}%`,
                                            }}>
                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 px-1 py-0.5 rounded text-xs text-white whitespace-nowrap">
                                                Today
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
                                <span className="text-xs">Website Redesign</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-violet-500 rounded mr-2"></div>
                                <span className="text-xs">Mobile Responsiveness</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                                <span className="text-xs">API Development</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                                <span className="text-xs">Database Optimization</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                                <span className="text-xs">Planning Phase</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
                                <span className="text-xs">Implementation Oversight</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task Drag & Drop Handler (vereinfacht) */}
                {editMode && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                        {people.map(person => (
                            <div key={`editor-${person.id}`} className="pointer-events-none">
                                {person.tasks.map(task => (
                                    <div
                                        key={`editor-${task.id}`}
                                        className="absolute pointer-events-auto"
                                        style={{
                                            // Hier würden wir dieselbe Positionsberechnung wie bei den Tasks machen
                                            opacity: 0, // Unsichtbarer Overlay für Drag & Drop
                                        }}
                                        onMouseDown={e => {
                                            // Hier würden wir den Drag & Drop starten
                                            console.log("Started drag on task:", task.id);
                                        }}></div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GanttChartComponent;
