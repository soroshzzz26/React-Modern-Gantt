# React Modern Gantt

A flexible, customizable Gantt chart component for React applications with drag-and-drop task scheduling, dark mode support, progress tracking, and multiple view modes.

[![npm version](https://img.shields.io/npm/v/react-modern-gantt.svg)](https://www.npmjs.com/package/react-modern-gantt)
[![license](https://img.shields.io/npm/l/react-modern-gantt.svg)](https://github.com/MikaStiebitz/React-Modern-Gantt/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-modern-gantt.svg)](https://bundlephobia.com/result?p=react-modern-gantt)

![Light](https://github.com/user-attachments/assets/cbde6c0b-48f1-4233-a935-72f2b6147162)
![Dark](https://github.com/user-attachments/assets/110b971a-0386-42b8-a237-d7d1d6eae132)

# ![LIVE DEMO](react-gantt-demo.vercel.app)

## Features

-   📊 **Interactive timeline** with drag-and-drop task scheduling
-   🎨 **Fully customizable** with Tailwind CSS or custom styling
-   🕒 **Multiple view modes** (Day, Week, Month, Quarter, Year)
-   🌙 **Dark mode support** built-in
-   📱 **Responsive design** that works across devices
-   📈 **Progress tracking** with visual indicators and interactive updates
-   🔄 **Task dependencies** and relationship management
-   🎯 **Event handling** for clicks, updates, selections
-   🧩 **Composable API** with extensive custom render props for advanced customization
-   🌊 **Smooth animations** with configurable speeds and thresholds
-   🔄 **Auto-scrolling** during drag operations

## Compatibility

React Modern Gantt is designed to be compatible with a wide range of project setups:

-   **React**: Works with React 17, 18, and 19
-   **Tailwind CSS**: Compatible with both Tailwind CSS v3 and v4
-   **TypeScript/JavaScript**: Full TypeScript type definitions included, but works perfectly with JavaScript projects too

## Installation & Usage

### Simple Installation

```bash
npm install react-modern-gantt
# or
yarn add react-modern-gantt
```

### Zero-Configuration Usage

```jsx
import GanttChart from "react-modern-gantt";

function MyApp() {
  const tasks = [
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
      ],
    },
    // More groups...
  ];

  const handleTaskUpdate = (groupId, updatedTask) => {
    console.log("Task updated:", updatedTask);
    // Update your state here
  };

  return (

  );
}
```

That's it! No additional configuration required. The component comes fully styled and ready to use.

### Advanced Usage Options

If you need more control, you can use specific imports:

```jsx
// Standard GanttChart component (you'll need to import CSS separately)
import { GanttChart } from "react-modern-gantt";
import "react-modern-gantt/dist/index.css";

// Fully styled version (explicit import, same as default)
import { GanttChartWithStyles } from "react-modern-gantt";

// Next.js specific version
import { NextGanttChart } from "react-modern-gantt";
```

### Typescript Support

Full TypeScript definitions are included. Import types as needed:

```tsx
import { GanttChart, Task, TaskGroup, ViewMode } from "react-modern-gantt";

// Define your tasks with proper typing
const tasks: TaskGroup[] = [
    // Your typed tasks here
];
```

## Core Concepts

React Modern Gantt is built around a few key concepts:

1. **Task Groups** - Collections of tasks, typically representing teams or departments
2. **Tasks** - Individual work items with start and end dates
3. **View Modes** - Different timeline scales (Day, Week, Month, Quarter, Year)
4. **Interactions** - Drag, resize, click, and other user interactions

## Component Props

### GanttChart

The main component for rendering a Gantt chart.

#### Data and Configuration Props

| Prop                    | Type          | Default              | Description                                              |
| ----------------------- | ------------- | -------------------- | -------------------------------------------------------- |
| `tasks`                 | `TaskGroup[]` | `[]`                 | Array of task groups                                     |
| `startDate`             | `Date`        | Auto                 | Start date of the chart (defaults to earliest task date) |
| `endDate`               | `Date`        | Auto                 | End date of the chart (defaults to latest task date)     |
| `title`                 | `string`      | `"Project Timeline"` | Title displayed at the top of the chart                  |
| `currentDate`           | `Date`        | `new Date()`         | Current date for the today marker                        |
| `showCurrentDateMarker` | `boolean`     | `true`               | Whether to show the today marker                         |
| `todayLabel`            | `string`      | `"Today"`            | Label for today marker                                   |
| `editMode`              | `boolean`     | `true`               | Whether tasks can be dragged/resized                     |
| `headerLabel`           | `string`      | `"Resources"`        | Header label for the task list column                    |
| `showProgress`          | `boolean`     | `false`              | Whether to show progress indicators                      |
| `darkMode`              | `boolean`     | `false`              | Whether to use dark mode                                 |
| `locale`                | `string`      | `'default'`          | Locale for date formatting                               |
| `viewMode`              | `ViewMode`    | `ViewMode.MONTH`     | Timeline display mode (day, week, month, quarter, year)  |
| `showViewModeSelector`  | `boolean`     | `true`               | Whether to show the view mode selector                   |
| `smoothDragging`        | `boolean`     | `true`               | Enable smooth animations for dragging operations         |
| `movementThreshold`     | `number`      | `3`                  | Minimum pixel movement threshold to reduce jitter        |
| `animationSpeed`        | `number`      | `0.25`               | Animation speed for smooth transitions (0.1-1)           |
| `fontSize`              | `string`      | `'inherit'`          | Base font size                                           |
| `rowHeight`             | `number`      | `40`                 | Height of task rows in pixels                            |
| `styles`                | `GanttStyles` | `{}`                 | Custom style classes                                     |

#### Custom Render Props

These props allow advanced customization of each component part:

| Prop                     | Type                                                                       | Description                             |
| ------------------------ | -------------------------------------------------------------------------- | --------------------------------------- |
| `renderTaskList`         | `(props: TaskListRenderProps) => ReactNode`                                | Custom render for the task list sidebar |
| `renderTask`             | `(props: TaskRenderProps) => ReactNode`                                    | Custom render for individual task bars  |
| `renderTooltip`          | `(props: TooltipRenderProps) => ReactNode`                                 | Custom render for task tooltips         |
| `renderViewModeSelector` | `(props: ViewModeSelectorRenderProps) => ReactNode`                        | Custom render for view mode tabs        |
| `renderHeader`           | `(props: HeaderRenderProps) => ReactNode`                                  | Custom render for the chart header      |
| `renderTimelineHeader`   | `(props: TimelineHeaderRenderProps) => ReactNode`                          | Custom render for timeline header       |
| `getTaskColor`           | `(props: TaskColorProps) => { backgroundColor, borderColor?, textColor? }` | Customize task colors                   |

#### Event Handlers

| Prop                | Type                                           | Description                                               |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| `onTaskUpdate`      | `(groupId: string, updatedTask: Task) => void` | Called when a task is moved, resized, or progress updated |
| `onTaskClick`       | `(task: Task, group: TaskGroup) => void`       | Called when a task is clicked                             |
| `onTaskSelect`      | `(task: Task, isSelected: boolean) => void`    | Called when a task is selected                            |
| `onTaskDoubleClick` | `(task: Task) => void`                         | Called when a task is double-clicked                      |
| `onGroupClick`      | `(group: TaskGroup) => void`                   | Called when a group is clicked                            |
| `onViewModeChange`  | `(viewMode: ViewMode) => void`                 | Called when view mode changes                             |

## Task and TaskGroup Interfaces

```typescript
interface Task {
    id: string; // Unique identifier
    name: string; // Task name
    startDate: Date; // Start date
    endDate: Date; // End date
    color?: string; // Task color (Tailwind class or CSS color)
    percent?: number; // Completion percentage (0-100)
    dependencies?: string[]; // IDs of dependent tasks
    [key: string]: any; // Additional custom properties
}

interface TaskGroup {
    id: string; // Unique identifier
    name: string; // Group name
    description?: string; // Group description
    icon?: string; // Optional icon (HTML string)
    tasks: Task[]; // Array of tasks in this group
    [key: string]: any; // Additional custom properties
}
```

## View Modes

The component supports five different view modes to adapt to different timeline needs:

| View Mode | Description            | Best Used For                                |
| --------- | ---------------------- | -------------------------------------------- |
| `DAY`     | Shows individual days  | Detailed short-term planning (days/weeks)    |
| `WEEK`    | Shows weeks            | Short to medium-term planning (weeks/months) |
| `MONTH`   | Shows months (default) | Medium-term planning (months/quarters)       |
| `QUARTER` | Shows quarters         | Medium to long-term planning (quarters/year) |
| `YEAR`    | Shows years            | Long-term planning (years)                   |

```jsx
import { GanttChart, ViewMode } from "react-modern-gantt";

// Using string literals
<GanttChart tasks={tasks} viewMode="day" />

// Using the ViewMode enum
<GanttChart tasks={tasks} viewMode={ViewMode.DAY} />
```

## Customization

### Using Custom Styles

React Modern Gantt supports easy customization with Tailwind CSS classes or your own CSS:

```jsx
<GanttChart
    tasks={tasks}
    styles={{
        container: "border-2 border-blue-200",
        title: "text-2xl text-blue-800",
        taskList: "bg-blue-50",
        timeline: "bg-gray-50",
        todayMarker: "bg-red-500",
        taskRow: "hover:bg-slate-50",
        tooltip: "shadow-lg",
    }}
    onTaskUpdate={handleTaskUpdate}
/>
```

### Dark Mode

Dark mode is built-in and easy to enable:

```jsx
<GanttChart tasks={tasks} darkMode={true} onTaskUpdate={handleTaskUpdate} />
```

### Custom Render Functions

You can customize virtually every aspect of the Gantt chart with custom render functions:

#### Custom Task Rendering

```jsx
<GanttChart
    tasks={tasks}
    renderTask={({ task, leftPx, widthPx, topPx, isHovered, isDragging, showProgress }) => (
        <div
            className={`absolute h-8 rounded flex items-center px-2
                ${isHovered ? "ring-2 ring-blue-500" : ""}
                ${task.color || "bg-blue-500"}`}
            style={{
                left: `${leftPx}px`,
                width: `${widthPx}px`,
                top: `${topPx}px`,
            }}>
            <div className="text-white truncate">{task.name}</div>
            {showProgress && (
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/20 rounded-full">
                    <div className="h-full bg-white/80 rounded-full" style={{ width: `${task.percent || 0}%` }} />
                </div>
            )}
        </div>
    )}
/>
```

#### Custom View Mode Selector

```jsx
<GanttChart
    tasks={tasks}
    renderViewModeSelector={({ activeMode, onChange, darkMode }) => (
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
                className={`px-3 py-1 rounded ${activeMode === "day" ? "bg-blue-500 text-white" : "text-gray-700"}`}
                onClick={() => onChange("day")}>
                Day
            </button>
            <button
                className={`px-3 py-1 rounded ${activeMode === "month" ? "bg-blue-500 text-white" : "text-gray-700"}`}
                onClick={() => onChange("month")}>
                Month
            </button>
            <button
                className={`px-3 py-1 rounded ${activeMode === "year" ? "bg-blue-500 text-white" : "text-gray-700"}`}
                onClick={() => onChange("year")}>
                Year
            </button>
        </div>
    )}
/>
```

#### Custom Header

```jsx
<GanttChart
    tasks={tasks}
    renderHeader={({ title, darkMode, viewMode, onViewModeChange }) => (
        <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                {title}
            </h1>
            <div className="flex space-x-4 items-center">
                <span className="text-sm text-gray-500">Current view:</span>
                <select
                    value={viewMode}
                    onChange={e => onViewModeChange(e.target.value)}
                    className="border rounded p-1">
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="quarter">Quarter</option>
                    <option value="year">Year</option>
                </select>
            </div>
        </div>
    )}
/>
```

### Custom Colors and Styling

You can customize task colors in multiple ways:

```jsx
// 1. Using the color property on tasks
const tasks = [
    {
        id: "task-1",
        name: "High Priority Task",
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 0, 15),
        color: "bg-red-500", // Using Tailwind class
        percent: 50,
    },
];

// 2. Using the getTaskColor prop for dynamic coloring
<GanttChart
    tasks={tasks}
    getTaskColor={({ task, isHovered, isDragging }) => {
        // Logic to determine color based on task properties
        if (task.percent === 100) {
            return {
                backgroundColor: "bg-green-500",
                borderColor: "border-green-700",
                textColor: "text-white",
            };
        }

        if (task.dependencies && task.dependencies.length > 0) {
            return {
                backgroundColor: "bg-amber-500",
                textColor: "text-white",
            };
        }

        // Default color
        return {
            backgroundColor: "bg-blue-500",
            textColor: "text-white",
        };
    }}
/>;
```

## Handling Task Updates

Handle task updates with custom logic:

```jsx
const handleTaskUpdate = (groupId, updatedTask) => {
    // Validate dates
    if (updatedTask.startDate > updatedTask.endDate) {
        alert("Start date cannot be after end date");
        return;
    }

    // Check for progress updates
    const originalTask = tasks.find(group => group.id === groupId)?.tasks.find(task => task.id === updatedTask.id);

    if (originalTask && originalTask.percent !== updatedTask.percent) {
        console.log(`Progress updated: ${originalTask.percent}% → ${updatedTask.percent}%`);
    }

    // Update state
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
```

## Exported Utility Functions and Classes

React Modern Gantt exports several utility functions and classes:

### Common Utility Functions

| Function                | Description                                  |
| ----------------------- | -------------------------------------------- |
| `formatDate`            | Format a date with different display options |
| `getMonthsBetween`      | Get array of months between two dates        |
| `getDaysInMonth`        | Get number of days in a month                |
| `detectTaskOverlaps`    | Detect and group overlapping tasks           |
| `calculateTaskPosition` | Calculate position of a task                 |
| `formatDateRange`       | Format a date range as a string              |
| `calculateDuration`     | Calculate duration between two dates         |
| `findEarliestDate`      | Find earliest date in task groups            |
| `findLatestDate`        | Find latest date in task groups              |

### Utility Classes

```jsx
import { TaskManager, CollisionManager } from "react-modern-gantt";

// Calculate task position
const { leftPx, widthPx } = TaskManager.calculateTaskPixelPosition(
    task,
    startDate,
    endDate,
    totalMonths,
    monthWidth,
    ViewMode.MONTH
);

// Check for collisions
const wouldCollide = CollisionManager.wouldCollide(taskToMove, allTasks, ViewMode.MONTH);
```

## Advanced Examples

### Using Multiple View Modes

```jsx
import { useState } from "react";
import { GanttChart, ViewMode } from "react-modern-gantt";

function MultiViewGantt() {
    const [viewMode, setViewMode] = useState(ViewMode.MONTH);

    const handleViewModeChange = newMode => {
        setViewMode(newMode);
        console.log(`View mode changed to: ${newMode}`);
    };

    return (
        <GanttChart
            tasks={tasks}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            // Only show Day, Month and Year options
            renderViewModeSelector={({ activeMode, onChange, darkMode }) => (
                <div className="flex rounded-lg border overflow-hidden">
                    <button
                        className={`px-3 py-1 ${activeMode === ViewMode.DAY ? "bg-indigo-600 text-white" : "bg-white"}`}
                        onClick={() => onChange(ViewMode.DAY)}>
                        Day
                    </button>
                    <button
                        className={`px-3 py-1 ${
                            activeMode === ViewMode.MONTH ? "bg-indigo-600 text-white" : "bg-white"
                        }`}
                        onClick={() => onChange(ViewMode.MONTH)}>
                        Month
                    </button>
                    <button
                        className={`px-3 py-1 ${
                            activeMode === ViewMode.YEAR ? "bg-indigo-600 text-white" : "bg-white"
                        }`}
                        onClick={() => onChange(ViewMode.YEAR)}>
                        Year
                    </button>
                </div>
            )}
        />
    );
}
```

### Task Progress Updates

```jsx
const handleTaskUpdate = (groupId, updatedTask) => {
    // Check if this is a progress update
    const existingTask = findTaskById(updatedTask.id);

    if (existingTask && existingTask.percent !== updatedTask.percent) {
        // This is a progress update
        console.log(`Task ${updatedTask.id} progress updated to ${updatedTask.percent}%`);

        // Special handling for completed tasks
        if (updatedTask.percent === 100 && existingTask.percent < 100) {
            console.log(`Task ${updatedTask.id} is now complete!`);
            // Maybe trigger some notification or update other dependent tasks?
        }
    } else {
        // This is a date/position update
        console.log(`Task ${updatedTask.id} dates updated:`, {
            startDate: updatedTask.startDate,
            endDate: updatedTask.endDate,
        });
    }

    // Update your state with the new task data
    updateTasksState(groupId, updatedTask);
};
```

## Browser Support

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
