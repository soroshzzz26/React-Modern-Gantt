# React Modern Gantt

A flexible, customizable Gantt chart component for React applications with drag-and-drop task scheduling, dark mode support, progress tracking, and multiple view modes.

[![npm version](https://img.shields.io/npm/v/react-modern-gantt.svg)](https://www.npmjs.com/package/react-modern-gantt)
[![license](https://img.shields.io/npm/l/react-modern-gantt.svg)](https://github.com/MikaStiebitz/React-Modern-Gantt/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-modern-gantt.svg)](https://bundlephobia.com/result?p=react-modern-gantt)

![Dark](https://github.com/user-attachments/assets/110b971a-0386-42b8-a237-d7d1d6eae132)

<a href="https://react-gantt-demo.vercel.app/" target="_blank" rel="noopener noreferrer">LIVE DEMO</a>

## Features

- 📊 **Interactive timeline** with drag-and-drop task scheduling
- 🎨 **Fully customizable** with CSS variables and custom classes
- 🕒 **Multiple view modes** (Day, Week, Month, Quarter, Year)
- 🌙 **Dark mode support** built-in
- 📱 **Responsive design** that works across devices
- 📈 **Progress tracking** with visual indicators and interactive updates
- 🔄 **Task dependencies** and relationship management
- 🎯 **Event handling** for clicks, updates, selections
- 🧩 **Composable API** with extensive custom render props for advanced customization
- 🌊 **Smooth animations** with configurable speeds and thresholds
- 🔄 **Auto-scrolling** during drag operations

## Compatibility

React Modern Gantt is designed to be compatible with a wide range of project setups:

- **React**: Works with React 17, 18, and 19
- **TypeScript/JavaScript**: Full TypeScript type definitions included, but works perfectly with JavaScript projects too

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
                    color: "#3b82f6",
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

    return <GanttChart tasks={tasks} onTaskUpdate={handleTaskUpdate} />;
}
```

That's it! No additional configuration required. The component comes fully styled and ready to use.

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
    color?: string; // Task color (CSS color value or hex code)
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

### CSS Variables

The easiest way to customize the appearance is by overriding CSS variables:

```css
:root {
    /* Primary colors */
    --rmg-bg-color: #f8f9fb;
    --rmg-text-color: #1a202c;
    --rmg-border-color: #e2e8f0;
    --rmg-task-color: #3182ce;
    --rmg-task-text-color: white;
    --rmg-marker-color: #e53e3e;

    /* Size variables */
    --rmg-row-height: 50px;
    --rmg-task-height: 36px;
    --rmg-border-radius: 6px;

    /* Animation speed */
    --rmg-animation-speed: 0.25;
}
```

### Using custom styles prop

For more specific customization, you can use the `styles` prop to pass custom class names:

```jsx
<GanttChart
    tasks={tasks}
    styles={{
        container: "my-gantt-container",
        title: "my-gantt-title",
        taskList: "my-task-list",
        timeline: "my-timeline",
        todayMarker: "my-today-marker",
        taskRow: "my-task-row",
        tooltip: "my-tooltip",
    }}
    onTaskUpdate={handleTaskUpdate}
/>
```

### Data Attributes for Styling

Each component has data attributes that you can use for more targeted styling:

```css
/* Style all tasks */
[data-rmg-component="task"] {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Style specific elements */
[data-rmg-component="task-group-name"] {
    font-weight: bold;
}

/* Style based on state */
[data-rmg-component="task"][data-dragging="true"] {
    opacity: 0.8;
}
```

### Custom Render Functions

For complete control, you can use custom render functions:

```jsx
<GanttChart
    tasks={tasks}
    renderTask={({ task, leftPx, widthPx, topPx, isHovered, isDragging, showProgress }) => (
        <div
            className="my-custom-task"
            style={{
                position: "absolute",
                left: `${leftPx}px`,
                width: `${widthPx}px`,
                top: `${topPx}px`,
                backgroundColor: task.color || "#3182ce",
            }}>
            <div className="my-task-label">{task.name}</div>
            {showProgress && (
                <div className="my-progress-bar">
                    <div className="my-progress-fill" style={{ width: `${task.percent || 0}%` }} />
                </div>
            )}
        </div>
    )}
/>
```

## Dark Mode

Dark mode is built-in and easy to enable:

```jsx
<GanttChart tasks={tasks} darkMode={true} onTaskUpdate={handleTaskUpdate} />
```

The component automatically applies the dark theme to all elements.

## Task Colors

You can customize task colors in multiple ways:

```jsx
// 1. Using the color property on tasks
const tasks = [
    {
        id: "task-1",
        name: "High Priority Task",
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 0, 15),
        color: "#ef4444", // Using hex color
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
                backgroundColor: "#22c55e",
                borderColor: "#166534",
                textColor: "#ffffff",
            };
        }

        if (task.dependencies && task.dependencies.length > 0) {
            return {
                backgroundColor: "#f59e0b",
                textColor: "#ffffff",
            };
        }

        // Default color
        return {
            backgroundColor: "#3b82f6",
            textColor: "#ffffff",
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

## Advanced Examples

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

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
