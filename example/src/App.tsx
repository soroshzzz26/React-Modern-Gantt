import React, { useState, useEffect } from "react";
import { GanttChart } from "react-modern-gantt";

// Define types to match the library's expected types
interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
    percent?: number;
    dependencies?: string[];
}

interface Person {
    id: string;
    name: string;
    role?: string;
    avatar?: string;
    tasks: Task[];
}

interface TaskUpdate {
    personId: string;
    taskId: string;
    startDate: Date;
    endDate: Date;
    time: string;
}

const GanttChartDemo = () => {
    // Demo data with proper typing
    const [people, setPeople] = useState<Person[]>([
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
                    startDate: new Date(2023, 0, 1),
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

    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2023, 3, 15)); // April 15, 2023
    const [editMode, setEditMode] = useState<boolean>(true);
    const [lastUpdatedTask, setLastUpdatedTask] = useState<TaskUpdate | null>(null);
    const [updateCounter, setUpdateCounter] = useState<number>(0);

    // Debugging - log whenever people changes
    useEffect(() => {
        console.log("People state updated:", people);
    }, [people]);

    // Handler for task updates with improved error handling and debugging
    const handleTaskUpdate = (personId: string, updatedTask: any) => {
        console.log("App: handleTaskUpdate called", { personId, updatedTask });

        // Add detailed console logging for debugging
        console.log("personId:", personId);
        console.log("updatedTask type:", typeof updatedTask);
        console.log(
            "updatedTask contents:",
            JSON.stringify(
                {
                    ...updatedTask,
                    startDate: updatedTask.startDate?.toString(),
                    endDate: updatedTask.endDate?.toString(),
                },
                null,
                2
            )
        );
        console.log(
            "Date types: startDate is",
            updatedTask.startDate instanceof Date ? "Date object" : typeof updatedTask.startDate,
            "endDate is",
            updatedTask.endDate instanceof Date ? "Date object" : typeof updatedTask.endDate
        );

        // Validate critical data
        if (!personId || !updatedTask || !updatedTask.id) {
            console.error("Invalid update data:", { personId, updatedTask });
            return;
        }

        // Ensure we have valid Date objects
        const startDate =
            updatedTask.startDate instanceof Date
                ? new Date(updatedTask.startDate) // Create a fresh copy to ensure reactivity
                : new Date(updatedTask.startDate);

        const endDate =
            updatedTask.endDate instanceof Date
                ? new Date(updatedTask.endDate) // Create a fresh copy to ensure reactivity
                : new Date(updatedTask.endDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error("Invalid dates in update:", {
                startDate: updatedTask.startDate,
                endDate: updatedTask.endDate,
            });
            return;
        }

        // Increment update counter to track updates
        setUpdateCounter(prev => prev + 1);

        // Keep track of the last updated task for debugging
        setLastUpdatedTask({
            personId,
            taskId: updatedTask.id,
            startDate,
            endDate,
            time: new Date().toISOString(),
        });

        // Update the state using a functional update to ensure we have the latest state
        setPeople(prevPeople => {
            // Create a deep copy of the people array
            const newPeople = [...prevPeople];

            // Find the person index
            const personIndex = newPeople.findIndex(p => p.id === personId);
            if (personIndex < 0) {
                console.error(`Person with ID ${personId} not found`);
                return prevPeople;
            }

            // Create a copy of the person object
            const person = { ...newPeople[personIndex] };

            // Find the task index
            const taskIndex = person.tasks.findIndex(t => t.id === updatedTask.id);
            if (taskIndex < 0) {
                console.error(`Task with ID ${updatedTask.id} not found for person ${personId}`);
                return prevPeople;
            }

            // Create a copy of the tasks array
            person.tasks = [...person.tasks];

            // Update the specific task with a new object
            person.tasks[taskIndex] = {
                ...person.tasks[taskIndex], // Keep all original properties
                startDate, // Update with new dates
                endDate,
                // Ensure other properties from the updatedTask are maintained
                name: updatedTask.name || person.tasks[taskIndex].name,
                color: updatedTask.color || person.tasks[taskIndex].color,
                percent: updatedTask.percent !== undefined ? updatedTask.percent : person.tasks[taskIndex].percent,
                dependencies: updatedTask.dependencies || person.tasks[taskIndex].dependencies,
            };

            // Update the person in our new array
            newPeople[personIndex] = person;

            console.log(`Task update ${updateCounter} complete:`, {
                personId,
                taskId: updatedTask.id,
                startDate: startDate.toLocaleString(),
                endDate: endDate.toLocaleString(),
            });

            return newPeople;
        });
    };

    // Handler for task clicks
    const handleTaskClick = (task: Task, person: Person) => {
        if (!task || !person) return;

        const startDate = task.startDate instanceof Date ? task.startDate.toLocaleDateString() : "Invalid date";
        const endDate = task.endDate instanceof Date ? task.endDate.toLocaleDateString() : "Invalid date";

        console.log(`Clicked on "${task.name}" (${person.name})\nStart: ${startDate}\nEnd: ${endDate}`);
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
                                <option value="0">January</option>
                                <option value="1">February</option>
                                <option value="2">March</option>
                                <option value="3">April</option>
                                <option value="4">May</option>
                                <option value="5">June</option>
                                <option value="6">July</option>
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

                {/* Debugging info */}
                {lastUpdatedTask && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                        <h3 className="font-bold text-yellow-800">Last Task Update (#{updateCounter})</h3>
                        <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto">
                            {JSON.stringify(
                                {
                                    ...lastUpdatedTask,
                                    startDate: lastUpdatedTask.startDate.toLocaleString(),
                                    endDate: lastUpdatedTask.endDate.toLocaleString(),
                                },
                                null,
                                2
                            )}
                        </pre>
                    </div>
                )}

                {/* Gantt Chart with Editor */}
                <div className="relative">
                    <GanttChart
                        people={people}
                        title="Project Timeline"
                        headerLabel="Team Members"
                        currentDate={currentMonth}
                        editMode={editMode}
                        showCurrentDateMarker={true}
                        onTaskClick={handleTaskClick}
                        onTaskUpdate={handleTaskUpdate}
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
