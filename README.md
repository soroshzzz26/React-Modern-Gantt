# React Modern Gantt

A modern, customizable Gantt chart component for React applications. This package provides an intuitive interface for creating interactive project timelines with drag and resize capabilities.

![React Modern Gantt Screenshot](https://via.placeholder.com/800x400?text=React+Modern+Gantt)

## Features

-   📅 Interactive timeline with drag and resize capabilities
-   🎨 Fully customizable themes and appearances
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
| `theme`                 | `GanttTheme`  | Default theme        | Custom theme for the chart                         |
| `fontSize`              | `string`      | `"inherit"`          | Font size for the chart                            |
| `rowHeight`             | `number`      | `40`                 | Height of each task row in pixels                  |
| `timeStep`              | `number`      | -                    | Step size for time increments                      |
| `children`              | `ReactNode`   | -                    | Custom components for composition                  |

### Event Handlers

| Prop                   | Type                                                             | Description                                  |
| ---------------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| `onTaskUpdate`         | `(groupId: string, updatedTask: Task) => void`                   | Called when a task is moved or resized       |
| `onTaskClick`          | `(task: Task, group: TaskGroup) => void`                         | Called when a task is clicked                |
| `onTaskSelect`         | `(task: Task, isSelected: boolean) => void`                      | Called when a task is selected or deselected |
| `onTaskDoubleClick`    | `(task: Task) => void`                                           | Called when a task is double-clicked         |
| `onTaskDelete`         | `(task: Task) => void \| boolean \| Promise<any>`                | Called when a task is deleted                |
| `onTaskDateChange`     | `(task: Task, tasks: Task[]) => void \| boolean \| Promise<any>` | Called after a task's dates have changed     |
| `onTaskProgressChange` | `(task: Task, tasks: Task[]) => void \| boolean \| Promise<any>` | Called when a task's progress is updated     |

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

interface GanttTheme {
    headerBackground?: string;
    headerText?: string;
    backgroundHighlight?: string;
    borderColor?: string;
    todayMarkerColor?: string;
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
            <GanttCurrentDateMarker markerClassName="bg-pink-500">Today</GanttCurrentDateMarker>
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

## Theming

Apply custom themes to change the appearance of your Gantt chart:

```jsx
const customTheme = {
    headerBackground: "bg-indigo-50",
    headerText: "text-indigo-800",
    backgroundHighlight: "bg-blue-100",
    borderColor: "border-indigo-100",
    todayMarkerColor: "bg-pink-500",
};

// Then in your component:
<GanttChart
    tasks={taskGroups}
    theme={customTheme}
    // ...other props
/>;
```

## Browser Support

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## TODO

-   Dark/Light mode
-   Theme prop in GanttChart
-   Fix custom Today marker
-   Fix Scrollable Task Table (If too many tasks appear)
-   More percise day indicator in Timeline
-   Demo Custom chart also changes Basic tasks position
