# React Modern Gantt

A flexible, customizable Gantt chart component for React applications with drag-and-drop task scheduling, dark mode support, and progress tracking.

[![npm version](https://img.shields.io/npm/v/react-modern-gantt.svg)](https://www.npmjs.com/package/react-modern-gantt)
[![license](https://img.shields.io/npm/l/react-modern-gantt.svg)](https://github.com/yourusername/react-modern-gantt/blob/main/LICENSE)
[![build status](https://img.shields.io/github/workflow/status/yourusername/react-modern-gantt/CI)](https://github.com/yourusername/react-modern-gantt/actions)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-modern-gantt.svg)](https://bundlephobia.com/result?p=react-modern-gantt)

![React Modern Gantt Demo](https://raw.githubusercontent.com/yourusername/react-modern-gantt/main/assets/demo.png)

## Features

-   📊 **Interactive timeline** with drag-and-drop task scheduling
-   🎨 **Fully customizable** with Tailwind CSS or custom styling
-   🌙 **Dark mode support** built-in
-   📱 **Responsive design** that works across devices
-   📈 **Progress tracking** with visual indicators
-   🔄 **Task dependencies** and relationship management
-   🎯 **Event handling** for clicks, updates, selections
-   🧩 **Composable API** for advanced customization

## Installation

```bash
npm install react-modern-gantt
# or
yarn add react-modern-gantt
```

## Quick Start

```jsx
import { GanttChart } from "react-modern-gantt";

// Create your task data
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

// Handle task updates
const handleTaskUpdate = (groupId, updatedTask) => {
    // Update your task data here
    console.log("Task updated:", updatedTask);
};

// Render the Gantt chart
function MyGanttChart() {
    return <GanttChart tasks={tasks} title="Project Timeline" showProgress={true} onTaskUpdate={handleTaskUpdate} />;
}
```

## Core Concepts

React Modern Gantt is built around a few key concepts:

1. **Task Groups** - Collections of tasks, typically representing teams or departments
2. **Tasks** - Individual work items with start and end dates
3. **Timeline** - Horizontal representation of time, typically in months
4. **Interactions** - Drag, resize, click, and other user interactions

## Component Props

### GanttChart

The main component for rendering a Gantt chart.

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
| `fontSize`              | `string`      | `'inherit'`          | Base font size                                           |
| `rowHeight`             | `number`      | `40`                 | Height of task rows in pixels                            |
| `showWeeks`             | `boolean`     | `false`              | Whether to show week markers                             |
| `showDays`              | `boolean`     | `false`              | Whether to show day markers                              |
| `styles`                | `GanttStyles` | `{}`                 | Custom style classes                                     |

### Event Handlers

| Prop                | Type                                           | Description                            |
| ------------------- | ---------------------------------------------- | -------------------------------------- |
| `onTaskUpdate`      | `(groupId: string, updatedTask: Task) => void` | Called when a task is moved or resized |
| `onTaskClick`       | `(task: Task, group: TaskGroup) => void`       | Called when a task is clicked          |
| `onTaskSelect`      | `(task: Task, isSelected: boolean) => void`    | Called when a task is selected         |
| `onTaskDoubleClick` | `(task: Task) => void`                         | Called when a task is double-clicked   |
| `onGroupClick`      | `(group: TaskGroup) => void`                   | Called when a group is clicked         |

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

## Task Properties

The Task interface supports the following properties:

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
```

## Advanced Usage

### Task Dependencies

Tasks can reference dependencies by ID:

```javascript
const tasks = [
    {
        id: "team-1",
        name: "Engineering",
        tasks: [
            {
                id: "task-1",
                name: "Design System",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 0, 15),
            },
            {
                id: "task-2",
                name: "Implementation",
                startDate: new Date(2023, 0, 16),
                endDate: new Date(2023, 1, 15),
                dependencies: ["task-1"], // Depends on task-1
            },
        ],
    },
];
```

### Custom Task Colors

Tasks can have custom colors:

```javascript
{
  id: "task-1",
  name: "High Priority Task",
  startDate: new Date(2023, 0, 1),
  endDate: new Date(2023, 0, 15),
  color: "bg-red-500", // Tailwind class
  percent: 50
}
```

### Handling Task Updates

Handle task updates with custom logic:

```jsx
const handleTaskUpdate = (groupId, updatedTask) => {
    // Validate dates
    if (updatedTask.startDate > updatedTask.endDate) {
        alert("Start date cannot be after end date");
        return;
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

## Utility Functions

React Modern Gantt exports several utility functions:

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

## Task Manager and Collision Manager

For advanced implementations, you can use the exported utility classes:

```jsx
import { TaskManager, CollisionManager } from "react-modern-gantt";

// Calculate task position
const { leftPx, widthPx } = TaskManager.calculateTaskPixelPosition(task, startDate, endDate, totalMonths, monthWidth);

// Check for collisions
const wouldCollide = CollisionManager.wouldCollide(taskToMove, allTasks);
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
