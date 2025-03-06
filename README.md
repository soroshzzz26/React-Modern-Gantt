# React Modern Gantt

A modern, customizable Gantt chart component for React applications. This package provides an intuitive interface for creating interactive project timelines with drag and resize capabilities.

![React Modern Gantt Screenshot](https://via.placeholder.com/800x400?text=React+Modern+Gantt)

## Features

-   📅 Interactive timeline with drag and resize capabilities
-   🎨 Fully customizable appearance with Tailwind CSS
-   🌓 Built-in dark mode support
-   📱 Responsive design that works on all screen sizes
-   🔄 Event-based architecture for easy integration
-   📊 Support for task progress indicators
-   🏷️ Tooltips with detailed task information
-   🏃‍♂️ High-performance rendering even with large datasets
-   📦 Lightweight with minimal dependencies

## Installation

```bash
npm install react-modern-gantt
# or
yarn add react-modern-gantt
```

## Basic Usage

```jsx
import React, { useState } from "react";
import { GanttChart } from "react-modern-gantt";

const BasicGantt = () => {
    const [taskGroups, setTaskGroups] = useState([
        {
            id: "1",
            name: "Development Team",
            description: "Frontend Developers",
            tasks: [
                {
                    id: "task-1",
                    name: "Website Redesign",
                    startDate: new Date(2023, 0, 1),
                    endDate: new Date(2023, 2, 15),
                    color: "bg-blue-500",
                    percent: 75,
                },
            ],
        },
        // Add more task groups here
    ]);

    const handleTaskUpdate = (groupId, updatedTask) => {
        setTaskGroups(currentGroups =>
            currentGroups.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
                      }
                    : group
            )
        );
    };

    return <GanttChart tasks={taskGroups} title="Project Timeline" onTaskUpdate={handleTaskUpdate} />;
};

export default BasicGantt;
```

## Dark Mode Support

React Modern Gantt fully supports dark mode through Tailwind CSS's dark mode class. Simply add the `dark` class to any parent element to activate dark mode:

```jsx
<div className="dark">
    <GanttChart tasks={taskGroups} title="Project Timeline" onTaskUpdate={handleTaskUpdate} />
</div>
```

## Advanced Configuration

### Props

The `GanttChart` component accepts the following props:

| Prop                    | Type          | Default              | Description                                        |
| ----------------------- | ------------- | -------------------- | -------------------------------------------------- |
| `tasks`                 | `TaskGroup[]` | Required             | Array of task groups with their tasks              |
| `startDate`             | `Date`        | Auto                 | Start date of the chart (earliest task by default) |
| `endDate`               | `Date`        | Auto                 | End date of the chart (latest task by default)     |
| `title`                 | `string`      | `"Project Timeline"` | Title displayed at the top of the chart            |
| `currentDate`           | `Date`        | Current date         | Date to show the "today" marker                    |
| `showCurrentDateMarker` | `boolean`     | `true`               | Whether to show the current date marker            |
| `todayLabel`            | `string`      | `"Today"`            | Label for the current date marker                  |
| `editMode`              | `boolean`     | `true`               | Whether tasks can be dragged and resized           |
| `headerLabel`           | `string`      | `"Resources"`        | Label for the task list header                     |
| `showProgress`          | `boolean`     | `false`              | Whether to show task completion percentage         |
| `fontSize`              | `string`      | `"inherit"`          | Font size for the chart                            |
| `rowHeight`             | `number`      | `40`                 | Height of each task row in pixels                  |
| `timeStep`              | `number`      | -                    | Step size for time increments                      |
| `children`              | `ReactNode`   | -                    | Custom components for composition                  |

### Event Handlers

| Prop                | Type                                           | Description                            |
| ------------------- | ---------------------------------------------- | -------------------------------------- |
| `onTaskUpdate`      | `(groupId: string, updatedTask: Task) => void` | Called when a task is moved or resized |
| `onTaskClick`       | `(task: Task, group: TaskGroup) => void`       | Called when a task is clicked          |
| `onTaskSelect`      | `(task: Task, isSelected: boolean) => void`    | Called when a task is selected         |
| `onTaskDoubleClick` | `(task: Task) => void`                         | Called when a task is double-clicked   |

### Data Types

```typescript
interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
    percent?: number; // Optional: task completion percentage
    dependencies?: string[]; // Optional: IDs of tasks this depends on
}

interface TaskGroup {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    tasks: Task[];
}
```

## Customizing with Composition

You can use composition to customize the Gantt chart by passing components as children:

```jsx
import { GanttChart, GanttTitle, GanttHeader, GanttCurrentDateMarker } from "react-modern-gantt";

const CustomGantt = () => {
    return (
        <GanttChart tasks={taskGroups} onTaskUpdate={handleTaskUpdate}>
            <GanttTitle>Custom Project Timeline</GanttTitle>
            <GanttHeader>Team Members</GanttHeader>
            <GanttCurrentDateMarker>Today</GanttCurrentDateMarker>
        </GanttChart>
    );
};
```

## Handling Events

### Task Updates (Move & Resize)

```jsx
const handleTaskUpdate = (groupId, updatedTask) => {
    console.log(`Task ${updatedTask.id} was updated`);

    // Update your state with the new task dates
    setTaskGroups(currentGroups =>
        currentGroups.map(group =>
            group.id === groupId
                ? {
                      ...group,
                      tasks: group.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
                  }
                : group
        )
    );

    // Optionally save to backend
    saveTaskToBackend(groupId, updatedTask);
};
```

### Task Clicks and Selection

```jsx
const handleTaskClick = (task, group) => {
    console.log(`Clicked on task ${task.name} belonging to ${group.name}`);
};

const handleTaskSelect = (task, isSelected) => {
    console.log(`Task ${task.name} is now ${isSelected ? "selected" : "deselected"}`);
    setSelectedTasks(prev => (isSelected ? [...prev, task.id] : prev.filter(id => id !== task.id)));
};

const handleTaskDoubleClick = task => {
    console.log(`Double-clicked on task ${task.name}`);
    // You could show a modal with task details
    setSelectedTask(task);
    setTaskDetailsModalOpen(true);
};
```

## Browser Support

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## Styling and Customization

### Task Colors

You can customize task colors using Tailwind CSS classes. The component includes several predefined task color classes that work in both light and dark modes:

```jsx
// Example task with predefined color class
{
    id: "task-1",
    name: "Frontend Development",
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 1, 15),
    color: "bg-task-blue", // Uses the predefined color class
    percent: 75
}
```

Predefined color classes include:

-   `bg-task-blue`
-   `bg-task-green`
-   `bg-task-purple`
-   `bg-task-orange`
-   `bg-task-amber`
-   `bg-task-indigo`
-   `bg-task-cyan`
-   `bg-task-pink`

You can also use any standard Tailwind CSS background color class:

```jsx
{
    id: "task-2",
    name: "Backend Development",
    startDate: new Date(2023, 1, 1),
    endDate: new Date(2023, 2, 15),
    color: "bg-emerald-500", // Standard Tailwind color
    percent: 60
}
```

### Customizing CSS Variables

For more advanced customization, you can override the CSS variables:

```css
:root {
    /* Light mode customization */
    --gantt-bg: #ffffff;
    --gantt-text: #1f2937;
    --gantt-border: #e5e7eb;
    --gantt-highlight: #f0f9ff; /* Custom highlight color */
    --gantt-marker: #f43f5e; /* Custom marker color */
    --gantt-task: #3b82f6;
    --gantt-task-text: #ffffff;
}

.dark {
    /* Dark mode customization */
    --gantt-bg: #111827;
    --gantt-text: #f9fafb;
    --gantt-border: #374151;
    --gantt-highlight: #1e3a8a; /* Custom dark highlight */
    --gantt-marker: #f43f5e;
    --gantt-task: #4f46e5;
    --gantt-task-text: #ffffff;
}
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Todo

-   Fix Scrollable Task Table (If too many tasks appear)
-   More precise day indicator in Timeline
