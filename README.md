# React Modern Gantt

A modern, customizable Gantt chart component for React applications. This package provides an intuitive interface for creating interactive project timelines with drag and resize capabilities.

![React Modern Gantt Screenshot](https://via.placeholder.com/800x400?text=React+Modern+Gantt)

## Features

- 📅 Interactive timeline with drag and resize capabilities
- 🎨 Fully customizable themes and appearances
- 📱 Responsive design that works on all screen sizes
- 🔄 Event-based architecture for easy integration
- 📊 Support for task progress indicators
- 🏷️ Tooltips with detailed task information
- 🏃‍♂️ High-performance rendering even with large datasets
- 📦 Lightweight with minimal dependencies

## Installation

```bash
npm install react-modern-gantt
# or
yarn add react-modern-gantt
```

## Basic Usage

```jsx
import React, { useState } from 'react';
import { GanttChart } from 'react-modern-gantt';

const MyProject = () => {
  const [people, setPeople] = useState([
    {
      id: "1",
      name: "Alice Johnson",
      tasks: [
        {
          id: "task-1",
          name: "Website Redesign",
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 2, 15),
          color: "bg-blue-500",
          percent: 75
        }
      ]
    }
    // Add more people and tasks here
  ]);

  const handleTaskUpdate = (personId, updatedTask) => {
    setPeople(currentPeople =>
      currentPeople.map(person =>
        person.id === personId
          ? {
              ...person,
              tasks: person.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
              )
            }
          : person
      )
    );
  };

  return (
    <GanttChart
      people={people}
      title="Project Timeline"
      onTaskUpdate={handleTaskUpdate}
    />
  );
};

export default MyProject;
```

## Advanced Configuration

### Props

The `GanttChart` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `people` | `Person[]` | Required | Array of people with their tasks |
| `startDate` | `Date` | Auto | Start date of the chart (earliest task by default) |
| `endDate` | `Date` | Auto | End date of the chart (latest task by default) |
| `title` | `string` | `"Project Timeline"` | Title displayed at the top of the chart |
| `showAvatar` | `boolean` | `true` | Whether to show avatars for people |
| `showTaskCount` | `boolean` | `true` | Whether to show task count for each person |
| `theme` | `GanttTheme` | Default theme | Custom theme for the chart |
| `onTaskUpdate` | `function` | `undefined` | Callback when a task is moved or resized |
| `onTaskClick` | `function` | `undefined` | Callback when a task is clicked |
| `currentDate` | `Date` | Current date | Date to show the "today" marker |
| `showCurrentDateMarker` | `boolean` | `true` | Whether to show the current date marker |
| `visibleColumns` | `number` | `6` | Number of columns visible without scrolling |
| `columnWidth` | `number` | `200` | Width of each month column in pixels |

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

interface Person {
    id: string;
    name: string;
    tasks: Task[];
    avatar?: string; // Optional: URL or initial for avatar
    role?: string; // Optional: Role description
}

interface GanttTheme {
    headerBackground?: string;
    headerText?: string;
    timelineBackground?: string;
    timelineBorder?: string;
    timelineText?: string;
    taskDefaultColor?: string;
    highlightColor?: string;
    todayMarkerColor?: string;
    tooltipBackground?: string;
    tooltipText?: string;
}
```

### Customizing the Theme

```jsx
const customTheme = {
  headerBackground: "bg-indigo-50",
  headerText: "text-indigo-800",
  timelineBackground: "bg-gray-50",
  timelineBorder: "border-indigo-100",
  taskDefaultColor: "bg-indigo-600",
  todayMarkerColor: "bg-pink-500"
};

// Then in your component:
<GanttChart
  people={people}
  theme={customTheme}
  // ...other props
/>
```

## Handling Events

### Task Updates (Move & Resize)

```jsx
const handleTaskUpdate = (personId, updatedTask) => {
  console.log(`Task ${updatedTask.id} was updated`);

  // Update your state with the new task dates
  setPeople(currentPeople =>
    currentPeople.map(person =>
      person.id === personId
        ? {
            ...person,
            tasks: person.tasks.map(task =>
              task.id === updatedTask.id ? updatedTask : task
            )
          }
        : person
    )
  );

  // Optionally save to backend
  saveTaskToBackend(personId, updatedTask);
};
```

### Task Clicks

```jsx
const handleTaskClick = (task, person) => {
  console.log(`Clicked on task ${task.name} belonging to ${person.name}`);

  // You could show a modal with task details
  setSelectedTask(task);
  setTaskDetailsModalOpen(true);
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
