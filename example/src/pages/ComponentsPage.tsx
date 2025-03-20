import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import CodeExample from "../components/demo/CodeExample";
import GanttCodeExample from "../components/demo/GanttCodeExample";
import { Link } from "react-router-dom";

// Import shadcn components
import { Card, CardContent } from "../components/ui/card";

const ComponentsPage: React.FC = () => {
    const { darkMode } = useTheme();
    const [activeSection, setActiveSection] = useState("gantt-chart");

    // Watch for hash changes to update the active section
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                setActiveSection(hash);
                // Scroll to the section
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }
        };

        // Check on mount
        handleHashChange();

        // Setup event listener
        window.addEventListener("hashchange", handleHashChange);
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    // Navigation sections
    const sections = [
        { id: "gantt-chart", label: "GanttChart" },
        { id: "task-interfaces", label: "Task Interfaces" },
        { id: "props", label: "Props" },
        { id: "events", label: "Event Handlers" },
        { id: "view-modes", label: "View Modes" },
        { id: "customization", label: "Customization" },
        { id: "examples", label: "Code Examples" },
    ];

    // Code examples
    const codeExamples = {
        ganttChartImport: `import { GanttChart, ViewMode } from 'react-modern-gantt';`,

        taskInterfaces: `// Task interface
interface Task {
  id: string;         // Unique identifier
  name: string;       // Task name
  startDate: Date;    // Start date
  endDate: Date;      // End date
  color?: string;     // Task color (Tailwind class or CSS color)
  percent?: number;   // Completion percentage (0-100)
  dependencies?: string[]; // IDs of dependent tasks
  [key: string]: any; // Additional custom properties
}

// TaskGroup interface
interface TaskGroup {
  id: string;         // Unique identifier
  name: string;       // Group name
  description?: string; // Group description
  icon?: string;      // Optional icon (HTML string)
  tasks: Task[];      // Array of tasks in this group
  [key: string]: any; // Additional custom properties
}`,

        coreProps: `<GanttChart
  tasks={tasks}                  // TaskGroup[] - Array of task groups
  title="Project Timeline"       // Title displayed at the top of the chart
  viewMode="month"               // "day", "week", "month", "quarter", "year"
  startDate={new Date()}         // Optional start date for the timeline
  endDate={new Date()}           // Optional end date for the timeline
  currentDate={new Date()}       // Date for the today marker
  showCurrentDateMarker={true}   // Whether to show the today marker
  todayLabel="Today"             // Label for today marker
  editMode={true}                // Whether tasks can be dragged/resized
  headerLabel="Resources"        // Header label for the task list column
  showProgress={true}            // Whether to show progress indicators
  darkMode={false}               // Whether to use dark mode
  showViewModeSelector={true}    // Whether to show the view mode selector
/>`,

        eventHandlers: `<GanttChart
  tasks={tasks}
  // Called when a task is moved, resized, or progress updated
  onTaskUpdate={(groupId, updatedTask) => {
    console.log("Task updated:", updatedTask);
    // Update your state here
  }}

  // Called when a task is clicked
  onTaskClick={(task, group) => {
    console.log("Task clicked:", task);
  }}

  // Called when a task is selected
  onTaskSelect={(task, isSelected) => {
    console.log("Task selection changed:", task, isSelected);
  }}

  // Called when a task is double-clicked
  onTaskDoubleClick={(task) => {
    console.log("Task double-clicked:", task);
  }}

  // Called when a group is clicked
  onGroupClick={(group) => {
    console.log("Group clicked:", group);
  }}

  // Called when view mode changes
  onViewModeChange={(viewMode) => {
    console.log("View mode changed to:", viewMode);
  }}
/>`,

        viewModes: `// Using string literals
<GanttChart tasks={tasks} viewMode="day" />
<GanttChart tasks={tasks} viewMode="week" />
<GanttChart tasks={tasks} viewMode="month" /> // Default
<GanttChart tasks={tasks} viewMode="quarter" />
<GanttChart tasks={tasks} viewMode="year" />

// Using the ViewMode enum
import { GanttChart, ViewMode } from 'react-modern-gantt';

<GanttChart tasks={tasks} viewMode={ViewMode.DAY} />
<GanttChart tasks={tasks} viewMode={ViewMode.WEEK} />
<GanttChart tasks={tasks} viewMode={ViewMode.MONTH} />
<GanttChart tasks={tasks} viewMode={ViewMode.QUARTER} />
<GanttChart tasks={tasks} viewMode={ViewMode.YEAR} />`,

        customStyling: `<GanttChart
  tasks={tasks}
  styles={{
    container: "border-2 border-blue-200 rounded-xl",
    title: "text-2xl text-blue-800 font-bold",
    taskList: "bg-blue-50 border-r border-blue-100",
    timeline: "bg-gray-50",
    todayMarker: "bg-red-500",
    taskRow: "hover:bg-slate-50",
    tooltip: "shadow-lg"
  }}
  onTaskUpdate={handleTaskUpdate}
/>`,

        customTaskRender: `<GanttChart
  tasks={tasks}
  renderTask={({ task, leftPx, widthPx, topPx, isHovered, isDragging, showProgress }) => (
    <div
      className={\`absolute h-8 rounded flex items-center px-2 \${
        isHovered ? "ring-2 ring-blue-500" : ""
      } \${task.color || "bg-blue-500"}\`}
      style={{
        left: \`\${leftPx}px\`,
        width: \`\${widthPx}px\`,
        top: \`\${topPx}px\`,
      }}>
      <div className="text-white truncate">{task.name}</div>
      {showProgress && (
        <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/20 rounded-full">
          <div
            className="h-full bg-white/80 rounded-full"
            style={{ width: \`\${task.percent || 0}%\` }}
          />
        </div>
      )}
    </div>
  )}
/>`,

        completeExample: `import React, { useState } from 'react';
import { GanttChart, Task, TaskGroup, ViewMode } from 'react-modern-gantt';

const ProjectTimeline = () => {
  // Initialize tasks
  const [tasks, setTasks] = useState<TaskGroup[]>([
    {
      id: "engineering",
      name: "Engineering",
      description: "Development Team",
      tasks: [
        {
          id: "task-1",
          name: "UI Components",
          startDate: new Date(2023, 0, 5),
          endDate: new Date(2023, 2, 15),
          color: "bg-blue-500",
          percent: 80,
        },
        {
          id: "task-2",
          name: "Backend API",
          startDate: new Date(2023, 1, 10),
          endDate: new Date(2023, 3, 20),
          color: "bg-emerald-500",
          percent: 60,
        },
        // More tasks...
      ],
    },
    // More groups...
  ]);

  // State for view mode
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MONTH);

  // Handle task updates
  const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
    // Update task in state
    setTasks(prevTasks =>
      prevTasks.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
              ),
            }
          : group
      )
    );
  };

  // Handle view mode changes
  const handleViewModeChange = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
  };

  // Custom styles
  const ganttStyles = {
    container: "border rounded-lg",
    title: "text-2xl font-bold text-indigo-800",
    taskList: "bg-gray-50 border-r",
  };

  return (
    <GanttChart
      tasks={tasks}
      title="Project Timeline"
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      onTaskUpdate={handleTaskUpdate}
      showProgress={true}
      editMode={true}
      styles={ganttStyles}
    />
  );
};

export default ProjectTimeline;`,
    };

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        // Update URL without reloading the page
        window.history.pushState(null, "", `#${id}`);
    };

    // Animations for sections
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Sidebar navigation */}
                <div className="hidden lg:block lg:col-span-3">
                    <nav className={`sticky top-24 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <h2 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Documentation
                        </h2>
                        <ul className="space-y-3">
                            {sections.map(section => (
                                <li key={section.id}>
                                    <button
                                        onClick={() => scrollToSection(section.id)}
                                        className={`block text-left w-full px-3 py-2 rounded-md transition-colors duration-200 ${
                                            activeSection === section.id
                                                ? `${
                                                      darkMode
                                                          ? "bg-gray-800 text-indigo-400"
                                                          : "bg-indigo-50 text-indigo-700"
                                                  }`
                                                : `${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`
                                        }`}>
                                        {section.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                to="/"
                                className={`flex items-center text-sm ${
                                    darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                                }`}>
                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </nav>
                </div>

                {/* Main content */}
                <div className="lg:col-span-9">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Component Documentation
                    </motion.h1>

                    {/* GanttChart Section */}
                    <motion.section
                        id="gantt-chart"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            GanttChart Component
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The main component for rendering a Gantt chart. It supports various props to customize its
                            appearance and behavior.
                        </p>

                        <CodeExample
                            title="Importing the Component"
                            description="Start by importing the GanttChart component and any related types you need."
                            code={codeExamples.ganttChartImport}
                            language="javascript"
                        />
                    </motion.section>

                    {/* Task Interfaces Section */}
                    <motion.section
                        id="task-interfaces"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Task Interfaces
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component uses two main interfaces for structuring your task data:{" "}
                            <code>Task</code> and <code>TaskGroup</code>.
                        </p>

                        <CodeExample
                            title="Task and TaskGroup Interfaces"
                            description="These interfaces define the structure of your task data."
                            code={codeExamples.taskInterfaces}
                            language="typescript"
                        />
                    </motion.section>

                    {/* Props Section */}
                    <motion.section
                        id="props"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Core Props
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component accepts several props to customize its behavior and appearance.
                        </p>

                        <GanttCodeExample
                            title="Basic Props"
                            description="Here are the most commonly used props for configuring the GanttChart."
                            code={codeExamples.coreProps}
                        />

                        <Card
                            className={`mt-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <CardContent className="pt-6">
                                <h3
                                    className={`text-lg font-semibold mb-4 ${
                                        darkMode ? "text-white" : "text-gray-900"
                                    }`}>
                                    Props Reference
                                </h3>

                                <div className={`overflow-x-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    <table className="min-w-full">
                                        <thead>
                                            <tr
                                                className={`border-b ${
                                                    darkMode ? "border-gray-700" : "border-gray-200"
                                                }`}>
                                                <th className="text-left py-3 px-4 font-semibold">Prop</th>
                                                <th className="text-left py-3 px-4 font-semibold">Type</th>
                                                <th className="text-left py-3 px-4 font-semibold">Default</th>
                                                <th className="text-left py-3 px-4 font-semibold">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                className={`border-b ${
                                                    darkMode ? "border-gray-700" : "border-gray-200"
                                                }`}>
                                                <td className="py-3 px-4 font-medium">tasks</td>
                                                <td className="py-3 px-4">TaskGroup[]</td>
                                                <td className="py-3 px-4">[]</td>
                                                <td className="py-3 px-4">Array of task groups</td>
                                            </tr>
                                            <tr
                                                className={`border-b ${
                                                    darkMode ? "border-gray-700" : "border-gray-200"
                                                }`}>
                                                <td className="py-3 px-4 font-medium">title</td>
                                                <td className="py-3 px-4">string</td>
                                                <td className="py-3 px-4">"Project Timeline"</td>
                                                <td className="py-3 px-4">Title displayed at the top of the chart</td>
                                            </tr>
                                            <tr
                                                className={`border-b ${
                                                    darkMode ? "border-gray-700" : "border-gray-200"
                                                }`}>
                                                <td className="py-3 px-4 font-medium">viewMode</td>
                                                <td className="py-3 px-4">ViewMode</td>
                                                <td className="py-3 px-4">ViewMode.MONTH</td>
                                                <td className="py-3 px-4">
                                                    Timeline display mode (day, week, month, quarter, year)
                                                </td>
                                            </tr>
                                            <tr
                                                className={`border-b ${
                                                    darkMode ? "border-gray-700" : "border-gray-200"
                                                }`}>
                                                <td className="py-3 px-4 font-medium">editMode</td>
                                                <td className="py-3 px-4">boolean</td>
                                                <td className="py-3 px-4">true</td>
                                                <td className="py-3 px-4">Whether tasks can be dragged/resized</td>
                                            </tr>
                                            <tr
                                                className={`border-b ${
                                                    darkMode ? "border-gray-700" : "border-gray-200"
                                                }`}>
                                                <td className="py-3 px-4 font-medium">showProgress</td>
                                                <td className="py-3 px-4">boolean</td>
                                                <td className="py-3 px-4">false</td>
                                                <td className="py-3 px-4">Whether to show progress indicators</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 font-medium">darkMode</td>
                                                <td className="py-3 px-4">boolean</td>
                                                <td className="py-3 px-4">false</td>
                                                <td className="py-3 px-4">Whether to use dark mode theme</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Event Handlers Section */}
                    <motion.section
                        id="events"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Event Handlers
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component provides several event handlers to respond to user interactions.
                        </p>

                        <GanttCodeExample
                            title="Event Handlers"
                            description="Use these event handlers to respond to user actions."
                            code={codeExamples.eventHandlers}
                        />
                    </motion.section>

                    {/* View Modes Section */}
                    <motion.section
                        id="view-modes"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            View Modes
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component supports five different view modes to adapt to different timeline
                            needs.
                        </p>

                        <CodeExample
                            title="Using View Modes"
                            description="You can specify the view mode using either string literals or the ViewMode enum."
                            code={codeExamples.viewModes}
                            language="jsx"
                        />
                    </motion.section>

                    {/* Customization Section */}
                    <motion.section
                        id="customization"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Customization
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component offers several ways to customize its appearance.
                        </p>

                        <GanttCodeExample
                            title="Custom Styling"
                            description="Customize the appearance of the Gantt chart using Tailwind CSS classes."
                            code={codeExamples.customStyling}
                        />
                    </motion.section>

                    {/* Examples Section */}
                    <motion.section
                        id="examples"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Complete Code Example
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Here's a complete example showing how to use the GanttChart component with state management
                            and event handling.
                        </p>

                        <GanttCodeExample
                            title="Complete Example"
                            description="A full implementation of the GanttChart with state management."
                            code={codeExamples.completeExample}
                        />
                    </motion.section>

                    {/* Back to top button with animation */}
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className={`inline-flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                                darkMode
                                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}>
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                            </svg>
                            Back to Top
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ComponentsPage;
