import React, { useState } from "react";
import { GanttChart } from "react-modern-gantt";

const GanttChartDemo = () => {
    // Demo data
    const [people, setPeople] = useState([
        {
            id: "1",
            name: "Alice Johnson",
            role: "Frontend Developer",
            tasks: [
                {
                    id: "task-1",
                    name: "Website Redesign",
                    startDate: new Date(2023, 0, 1),
                    endDate: new Date(2023, 2, 15),
                    color: "bg-emerald-500",
                    percent: 100,
                },
                {
                    id: "task-2",
                    name: "Mobile Responsiveness",
                    startDate: new Date(2023, 3, 1),
                    endDate: new Date(2023, 4, 30),
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
                    startDate: new Date(2023, 1, 15),
                    endDate: new Date(2023, 3, 15),
                    color: "bg-blue-500",
                    percent: 90,
                },
                {
                    id: "task-4",
                    name: "Database Optimization",
                    startDate: new Date(2023, 4, 1),
                    endDate: new Date(2023, 5, 30),
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
                    startDate: new Date(2023, 0, 1),
                    endDate: new Date(2023, 0, 31),
                    color: "bg-red-500",
                    percent: 100,
                },
                {
                    id: "task-6",
                    name: "Implementation Oversight",
                    startDate: new Date(2023, 1, 1),
                    endDate: new Date(2023, 5, 30),
                    color: "bg-gray-500",
                    percent: 65,
                },
            ],
        },
    ]);

    const [currentMonth, setCurrentMonth] = useState(new Date(2023, 3, 15)); // April 15, 2023
    const [editMode, setEditMode] = useState(true);

    // Handler for task updates
    const handleTaskUpdate = (personId: any, updatedTask: any) => {
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

    // Handler for task clicks
    const handleTaskClick = (task: any, person: any) => {
        console.log(
            `Clicked on "${task.name}" (${
                person.name
            })\nStart: ${task.startDate.toLocaleDateString()}\nEnd: ${task.endDate.toLocaleDateString()}`
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Controls */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Project Timeline (2023)</h1>

                    <div className="flex space-x-4 items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Current Month:</span>
                            <select
                                className="rounded border border-gray-300 px-2 py-1"
                                value={currentMonth.getMonth()}
                                onChange={e => setCurrentMonth(new Date(2023, parseInt(e.target.value), 15))}>
                                <option value={0}>January</option>
                                <option value={1}>February</option>
                                <option value={2}>March</option>
                                <option value={3}>April</option>
                                <option value={4}>May</option>
                                <option value={5}>June</option>
                                <option value={6}>July</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setEditMode(!editMode)}
                            className={`px-4 py-2 rounded ${
                                editMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"
                            } text-white transition`}>
                            {editMode ? "Edit Mode: ON" : "Edit Mode: OFF"}
                        </button>
                    </div>
                </div>

                {/* Gantt Chart with Editor */}
                <div className="relative">
                    <GanttChart
                        people={people}
                        title="Project Timeline"
                        currentDate={currentMonth}
                        editMode={editMode}
                        showCurrentDateMarker={true}
                        onTaskClick={handleTaskClick}
                    />
                </div>

                {/* Legend */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Task Legend</h2>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
                            <span className="text-sm">Website Redesign</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-violet-500 rounded mr-2"></div>
                            <span className="text-sm">Mobile Responsiveness</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                            <span className="text-sm">API Development</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                            <span className="text-sm">Database Optimization</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                            <span className="text-sm">Planning Phase</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
                            <span className="text-sm">Implementation Oversight</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">© 2025 React Modern Gantt - MIT License</div>
            </div>
        </div>
    );
};

export default GanttChartDemo;
