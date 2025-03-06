import React, { useState } from "react";
import {
    GanttChart,
    GanttTitle,
    GanttHeader,
    GanttMarker,
    GanttTaskList,
    GanttTimeline,
    TaskGroup,
    Task,
    mergeTheme,
    lightTheme,
    darkTheme,
} from "react-modern-gantt";
import "./App.css";

// Define initial task data
const generateInitialTasks = (): TaskGroup[] => {
    // Set dates relative to current date for easier demo
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
                {
                    id: "task-3",
                    name: "Database Schema",
                    startDate: new Date(currentYear, currentMonth + 1, 15),
                    endDate: new Date(currentYear, currentMonth + 2, 30),
                    color: "bg-task-cyan",
                    percent: 35,
                    dependencies: ["task-2"],
                },
            ],
        },
        {
            id: "marketing",
            name: "Marketing",
            description: "Marketing Team",
            tasks: [
                {
                    id: "task-4",
                    name: "Campaign Planning",
                    startDate: new Date(currentYear, currentMonth - 1, 15),
                    endDate: new Date(currentYear, currentMonth, 28),
                    color: "bg-purple-500",
                    percent: 100,
                },
                {
                    id: "task-5",
                    name: "Content Creation",
                    startDate: new Date(currentYear, currentMonth + 1, 1),
                    endDate: new Date(currentYear, currentMonth + 2, 15),
                    color: "bg-violet-600",
                    percent: 50,
                    dependencies: ["task-4"],
                },
            ],
        },
        {
            id: "design",
            name: "Design",
            description: "UI/UX Team",
            tasks: [
                {
                    id: "task-6",
                    name: "Wireframing",
                    startDate: new Date(currentYear, currentMonth - 1, 10),
                    endDate: new Date(currentYear, currentMonth, 20),
                    color: "bg-amber-500",
                    percent: 100,
                },
                {
                    id: "task-7",
                    name: "Visual Design",
                    startDate: new Date(currentYear, currentMonth, 25),
                    endDate: new Date(currentYear, currentMonth + 2, 5),
                    color: "bg-orange-500",
                    percent: 70,
                    dependencies: ["task-6"],
                },
            ],
        },
        {
            id: "product",
            name: "Product",
            description: "Product Management",
            tasks: [
                {
                    id: "task-8",
                    name: "Requirements",
                    startDate: new Date(currentYear, currentMonth - 2, 1),
                    endDate: new Date(currentYear, currentMonth - 1, 30),
                    color: "bg-task-indigo",
                    percent: 100,
                },
                {
                    id: "task-9",
                    name: "User Testing",
                    startDate: new Date(currentYear, currentMonth + 2, 10),
                    endDate: new Date(currentYear, currentMonth + 3, 25),
                    color: "bg-task-indigo",
                    percent: 0,
                    dependencies: ["task-1", "task-3", "task-7"],
                },
            ],
        },
    ];
};

// Custom theme presets
const customLightTheme = mergeTheme(lightTheme, {
    highlight: "#f0f9ff",
    marker: "#f43f5e",
    task: "#3b82f6",
});

const customDarkTheme = mergeTheme(darkTheme, {
    background: "#0f172a",
    text: "#f8fafc",
    border: "#1e293b",
    highlight: "#1e3a8a",
    marker: "#f43f5e",
    task: "#4f46e5",
});

// Component for controls section
const Controls: React.FC<{
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
    darkMode: boolean;
    setDarkMode: (mode: boolean) => void;
    showProgress: boolean;
    setShowProgress: (show: boolean) => void;
    showWeeks: boolean;
    setShowWeeks: (show: boolean) => void;
    showDays: boolean;
    setShowDays: (show: boolean) => void;
    className?: string;
}> = ({
    editMode,
    setEditMode,
    darkMode,
    setDarkMode,
    showProgress,
    setShowProgress,
    showWeeks,
    setShowWeeks,
    showDays,
    setShowDays,
    className = "",
}) => (
    <div
        className={`controls flex flex-wrap items-center gap-4 ${
            darkMode ? "text-gray-300" : "text-gray-700"
        } ${className}`}>
        <div className="control-item">
            <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium">Edit Mode</span>
                <div
                    className={`toggle-switch relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        editMode ? "bg-indigo-600" : "bg-gray-300"
                    }`}>
                    <span
                        className={`switch-handle inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
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

        <div className="control-item">
            <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium">Dark Mode</span>
                <div
                    className={`toggle-switch relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? "bg-indigo-600" : "bg-gray-300"
                    }`}>
                    <span
                        className={`switch-handle inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            darkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                    />
                </div>
            </label>
        </div>

        <div className="control-item">
            <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium">Progress</span>
                <div
                    className={`toggle-switch relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showProgress ? "bg-indigo-600" : "bg-gray-300"
                    }`}>
                    <span
                        className={`switch-handle inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
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

        <div className="control-item">
            <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium">Show Weeks</span>
                <div
                    className={`toggle-switch relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showWeeks ? "bg-indigo-600" : "bg-gray-300"
                    }`}>
                    <span
                        className={`switch-handle inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            showWeeks ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={showWeeks}
                        onChange={() => setShowWeeks(!showWeeks)}
                    />
                </div>
            </label>
        </div>

        <div className="control-item">
            <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium">Show Days</span>
                <div
                    className={`toggle-switch relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showDays ? "bg-indigo-600" : "bg-gray-300"
                    }`}>
                    <span
                        className={`switch-handle inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            showDays ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={showDays}
                        onChange={() => setShowDays(!showDays)}
                    />
                </div>
            </label>
        </div>
    </div>
);

// Main demo component
const GanttChartDemo = () => {
    // State for different variants
    const [basicTasks, setBasicTasks] = useState<TaskGroup[]>(generateInitialTasks());
    const [customTasks, setCustomTasks] = useState<TaskGroup[]>(generateInitialTasks());

    // State for controls
    const [basicEditMode, setBasicEditMode] = useState(true);
    const [customEditMode, setCustomEditMode] = useState(true);
    const [basicDarkMode, setBasicDarkMode] = useState(false);
    const [customDarkMode, setCustomDarkMode] = useState(true);
    const [basicShowProgress, setBasicShowProgress] = useState(true);
    const [customShowProgress, setCustomShowProgress] = useState(true);
    const [basicShowWeeks, setBasicShowWeeks] = useState(false);
    const [customShowWeeks, setCustomShowWeeks] = useState(true);
    const [basicShowDays, setBasicShowDays] = useState(false);
    const [customShowDays, setCustomShowDays] = useState(false);

    // Selected task tracking
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    // Task update handlers
    const handleBasicTaskUpdate = (groupId: string, updatedTask: Task) => {
        setBasicTasks(prevTasks =>
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

    const handleCustomTaskUpdate = (groupId: string, updatedTask: Task) => {
        setCustomTasks(prevTasks =>
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

    // Task selection handler
    const handleTaskSelect = (task: Task, isSelected: boolean) => {
        setSelectedTaskId(isSelected ? task.id : null);
    };

    // Task double-click handler
    const handleTaskDoubleClick = (task: Task) => {
        alert(
            `Task Details:\n\nName: ${task.name}\nDuration: ${Math.ceil(
                (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)
            )} days\nProgress: ${task.percent || 0}%`
        );
    };

    return (
        <div
            className={`demo-container min-h-screen p-8 ${
                basicDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
            }`}>
            {/* Header */}
            <header className="mx-auto mb-12 max-w-6xl text-center">
                <h1 className={`mb-3 text-4xl font-bold ${basicDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                    React Modern Gantt
                </h1>
                <p className={`text-lg ${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    A modern, customizable Gantt chart component for React applications
                </p>
            </header>

            <div className="mx-auto max-w-6xl space-y-16">
                {/* Basic Gantt Chart */}
                <section className={`rounded-xl ${basicDarkMode ? "bg-gray-800" : "bg-white"} p-6 shadow-lg`}>
                    <h2 className={`mb-6 text-2xl font-bold ${basicDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                        Basic Gantt Chart
                    </h2>
                    <p className={`mb-6 ${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Simple implementation with core props. Try dragging tasks to reschedule or resize them.
                    </p>

                    <Controls
                        editMode={basicEditMode}
                        setEditMode={setBasicEditMode}
                        darkMode={basicDarkMode}
                        setDarkMode={setBasicDarkMode}
                        showProgress={basicShowProgress}
                        setShowProgress={setBasicShowProgress}
                        showWeeks={basicShowWeeks}
                        setShowWeeks={setBasicShowWeeks}
                        showDays={basicShowDays}
                        setShowDays={setBasicShowDays}
                        className="mb-6"
                    />

                    <div
                        className={`rounded-lg border ${basicDarkMode ? "border-gray-700" : "border-gray-200"} shadow`}>
                        <GanttChart
                            tasks={basicTasks}
                            title="Project Roadmap 2025"
                            headerLabel="Teams"
                            showProgress={basicShowProgress}
                            editMode={basicEditMode}
                            darkMode={basicDarkMode}
                            showWeeks={basicShowWeeks}
                            showDays={basicShowDays}
                            onTaskUpdate={handleBasicTaskUpdate}
                            onTaskSelect={handleTaskSelect}
                            onTaskDoubleClick={handleTaskDoubleClick}
                        />
                    </div>
                </section>

                {/* Custom Gantt Chart */}
                <section className={`rounded-xl ${customDarkMode ? "bg-gray-800" : "bg-white"} p-6 shadow-lg`}>
                    <h2 className={`mb-6 text-2xl font-bold ${customDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                        Custom Gantt Chart
                    </h2>
                    <p className={`mb-6 ${customDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Advanced implementation with composition components and custom theme. Double-click a task to
                        view details.
                    </p>

                    <Controls
                        editMode={customEditMode}
                        setEditMode={setCustomEditMode}
                        darkMode={customDarkMode}
                        setDarkMode={setCustomDarkMode}
                        showProgress={customShowProgress}
                        setShowProgress={setCustomShowProgress}
                        showWeeks={customShowWeeks}
                        setShowWeeks={setCustomShowWeeks}
                        showDays={customShowDays}
                        setShowDays={setCustomShowDays}
                        className="mb-6"
                    />

                    <div
                        className={`rounded-lg border ${
                            customDarkMode ? "border-gray-700" : "border-gray-200"
                        } shadow`}>
                        <GanttChart
                            tasks={customTasks}
                            onTaskUpdate={handleCustomTaskUpdate}
                            onTaskDoubleClick={handleTaskDoubleClick}
                            onTaskSelect={handleTaskSelect}
                            editMode={customEditMode}
                            darkMode={customDarkMode}
                            theme={customDarkMode ? customDarkTheme : customLightTheme}
                            showProgress={customShowProgress}
                            showWeeks={customShowWeeks}
                            showDays={customShowDays}
                            rowHeight={45}>
                            <GanttTitle
                                className={`text-2xl font-bold ${
                                    customDarkMode ? "text-indigo-300" : "text-indigo-800"
                                }`}>
                                Product Development Roadmap
                            </GanttTitle>

                            <GanttHeader
                                className={`${customDarkMode ? "text-indigo-300" : "text-indigo-600"} font-medium`}>
                                Team Overview
                            </GanttHeader>

                            <GanttMarker className="bg-pink-500">Today</GanttMarker>

                            <GanttTaskList
                                showIcon={true}
                                showTaskCount={true}
                                className={`w-48 ${
                                    customDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-indigo-100"
                                } border-r`}
                            />

                            <GanttTimeline
                                className={`text-sm ${
                                    customDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-indigo-100"
                                } border-b`}
                            />
                        </GanttChart>
                    </div>
                </section>

                {/* Features Section */}
                <section className={`rounded-xl ${basicDarkMode ? "bg-gray-800" : "bg-white"} p-6 shadow-lg`}>
                    <h2 className={`mb-6 text-2xl font-bold ${basicDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                        Key Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`feature-card p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                Interactive Tasks
                            </h3>
                            <p className={`${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Drag, resize, and click interactions for intuitive schedule management
                            </p>
                        </div>

                        <div className={`feature-card p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                Dark Mode Support
                            </h3>
                            <p className={`${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Built-in light and dark themes with easy customization
                            </p>
                        </div>

                        <div className={`feature-card p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                Progress Tracking
                            </h3>

                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                Progress Tracking
                            </h3>
                            <p className={`${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Visual indicators for task completion with percentage display
                            </p>
                        </div>

                        <div className={`feature-card p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                Composition API
                            </h3>
                            <p className={`${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Flexible customization through composable components
                            </p>
                        </div>

                        <div className={`feature-card p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                Responsive Design
                            </h3>
                            <p className={`${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Works seamlessly across desktop and mobile devices
                            </p>
                        </div>

                        <div className={`feature-card p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                Dependencies
                            </h3>
                            <p className={`${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Support for task dependencies and relationship tracking
                            </p>
                        </div>
                    </div>
                </section>

                {/* Usage Examples Section */}
                <section className={`rounded-xl ${basicDarkMode ? "bg-gray-800" : "bg-white"} p-6 shadow-lg`}>
                    <h2 className={`mb-6 text-2xl font-bold ${basicDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                        Usage Examples
                    </h2>

                    <div className={`code-example p-4 rounded-lg ${basicDarkMode ? "bg-gray-900" : "bg-gray-50"} mb-6`}>
                        <h3 className={`text-lg font-semibold mb-2 ${basicDarkMode ? "text-white" : "text-gray-800"}`}>
                            Basic Implementation
                        </h3>
                        <pre
                            className={`p-4 rounded ${
                                basicDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                            } overflow-x-auto`}>
                            {`import { GanttChart } from 'react-modern-gantt';

<GanttChart
  tasks={tasks}
  title="Project Timeline"
  showProgress={true}
  onTaskUpdate={handleTaskUpdate}
/>`}
                        </pre>
                    </div>

                    <div className={`code-example p-4 rounded-lg ${basicDarkMode ? "bg-gray-900" : "bg-gray-50"} mb-6`}>
                        <h3 className={`text-lg font-semibold mb-2 ${basicDarkMode ? "text-white" : "text-gray-800"}`}>
                            Customization with Composition
                        </h3>
                        <pre
                            className={`p-4 rounded ${
                                basicDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                            } overflow-x-auto`}>
                            {`import { GanttChart, GanttTitle, GanttHeader } from 'react-modern-gantt';

<GanttChart tasks={tasks} onTaskUpdate={handleTaskUpdate}>
  <GanttTitle className="text-2xl text-indigo-800">
    Custom Project Timeline
  </GanttTitle>
  <GanttHeader className="font-bold">
    Teams & Resources
  </GanttHeader>
</GanttChart>`}
                        </pre>
                    </div>

                    <div className={`code-example p-4 rounded-lg ${basicDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                        <h3 className={`text-lg font-semibold mb-2 ${basicDarkMode ? "text-white" : "text-gray-800"}`}>
                            Theme Customization
                        </h3>
                        <pre
                            className={`p-4 rounded ${
                                basicDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                            } overflow-x-auto`}>
                            {`import { GanttChart, mergeTheme, lightTheme } from 'react-modern-gantt';

// Create a custom theme
const customTheme = mergeTheme(lightTheme, {
  highlight: '#eff6ff',
  marker: '#ef4444',
  task: '#3b82f6',
});

<GanttChart
  tasks={tasks}
  theme={customTheme}
  onTaskUpdate={handleTaskUpdate}
/>`}
                        </pre>
                    </div>
                </section>

                {/* Getting Started Section */}
                <section className={`rounded-xl ${basicDarkMode ? "bg-gray-800" : "bg-white"} p-6 shadow-lg`}>
                    <h2 className={`mb-6 text-2xl font-bold ${basicDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                        Getting Started
                    </h2>

                    <div className="space-y-4">
                        <div className={`step p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                1. Installation
                            </h3>
                            <pre
                                className={`p-4 rounded ${
                                    basicDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                                }`}>
                                npm install react-modern-gantt
                            </pre>
                        </div>

                        <div className={`step p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                2. Import Component
                            </h3>
                            <pre
                                className={`p-4 rounded ${
                                    basicDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                                }`}>
                                {`import { GanttChart } from 'react-modern-gantt';`}
                            </pre>
                        </div>

                        <div className={`step p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                3. Prepare Task Data
                            </h3>
                            <pre
                                className={`p-4 rounded ${
                                    basicDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                                } overflow-x-auto`}>
                                {`const tasks = [
  {
    id: "team-1",
    name: "Engineering",
    description: "Development Team",
    tasks: [
      {
        id: "task-1",
        name: "Website Redesign",
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 2, 15),
        color: "bg-blue-500",
        percent: 75,
      },
      // More tasks...
    ]
  },
  // More groups...
];`}
                            </pre>
                        </div>

                        <div className={`step p-4 rounded-lg ${basicDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3
                                className={`text-lg font-semibold mb-2 ${
                                    basicDarkMode ? "text-white" : "text-gray-800"
                                }`}>
                                4. Render Component
                            </h3>
                            <pre
                                className={`p-4 rounded ${
                                    basicDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                                } overflow-x-auto`}>
                                {`<GanttChart
  tasks={tasks}
  title="Project Timeline"
  showProgress={true}
  onTaskUpdate={(groupId, updatedTask) => {
    // Update your task data here
  }}
/>`}
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer
                    className={`mt-12 border-t ${
                        basicDarkMode ? "border-gray-700" : "border-gray-200"
                    } pt-6 text-center text-sm ${basicDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <p>React Modern Gantt - A flexible, customizable Gantt chart component for React</p>
                    <p className="mt-2">MIT License &copy; {new Date().getFullYear()}</p>
                </footer>
            </div>
        </div>
    );
};

export default GanttChartDemo;
