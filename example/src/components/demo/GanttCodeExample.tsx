import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { GanttChart, Task, TaskGroup, ViewMode } from "react-modern-gantt";
import CodeExample from "./CodeExample";

interface GanttCodeExampleProps {
    title: string;
    description?: string;
    code: string;
}

const GanttCodeExample: React.FC<GanttCodeExampleProps> = ({ title, description, code }) => {
    const { darkMode } = useTheme();

    // Generate demo task data relative to current date
    const generateDemoTasks = (): TaskGroup[] => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        return [
            {
                id: "engineering",
                name: "Engineering",
                description: "Development Team",
                tasks: [
                    {
                        id: "task-1",
                        name: "UI Components",
                        startDate: new Date(currentYear, currentMonth - 1, 5),
                        endDate: new Date(currentYear, currentMonth + 1, 15),
                        color: "bg-blue-500",
                        percent: 80,
                    },
                    {
                        id: "task-2",
                        name: "Backend API",
                        startDate: new Date(currentYear, currentMonth, 10),
                        endDate: new Date(currentYear, currentMonth + 2, 20),
                        color: "bg-emerald-500",
                        percent: 60,
                    },
                ],
            },
            {
                id: "design",
                name: "Design",
                description: "UI/UX Team",
                tasks: [
                    {
                        id: "task-3",
                        name: "Wireframing",
                        startDate: new Date(currentYear, currentMonth - 1, 10),
                        endDate: new Date(currentYear, currentMonth, 20),
                        color: "bg-amber-500",
                        percent: 100,
                    },
                ],
            },
        ];
    };

    // State for tasks and options
    const [tasks, setTasks] = useState<TaskGroup[]>(generateDemoTasks());
    const [editMode, setEditMode] = useState(true);
    const [showProgress, setShowProgress] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MONTH);

    // Task update handler
    const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
        setTasks(prevTasks =>
            prevTasks.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
                      }
                    : group
            )
        );
    };

    // Demo component to pass to CodeExample
    const DemoComponent = () => (
        <div className={`rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="mb-4 flex flex-wrap justify-end gap-4">
                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                        <span className={`mr-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Edit Mode
                        </span>
                        <div
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                editMode ? "bg-indigo-600" : "bg-gray-300"
                            }`}>
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    editMode ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={editMode}
                                onChange={() => setEditMode(!editMode)}
                            />
                        </div>
                    </label>
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                        <span className={`mr-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Progress</span>
                        <div
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                showProgress ? "bg-indigo-600" : "bg-gray-300"
                            }`}>
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    showProgress ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={showProgress}
                                onChange={() => setShowProgress(!showProgress)}
                            />
                        </div>
                    </label>
                </div>
            </div>

            <GanttChart
                tasks={tasks}
                title="Project Timeline"
                headerLabel="Teams"
                showProgress={showProgress}
                editMode={editMode}
                darkMode={darkMode}
                onTaskUpdate={handleTaskUpdate}
                onViewModeChange={setViewMode}
                viewMode={viewMode}
                styles={{
                    container: "",
                    title: "text-xl font-bold",
                    taskList: `border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`,
                    tooltip: `${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`,
                }}
            />

            <div className="mt-4 text-center">
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Try dragging tasks, resizing them, or adjusting progress bars.
                </p>
            </div>
        </div>
    );

    return (
        <CodeExample
            title={title}
            description={description}
            code={code}
            language="tsx"
            demoComponent={<DemoComponent />}
        />
    );
};

export default GanttCodeExample;
