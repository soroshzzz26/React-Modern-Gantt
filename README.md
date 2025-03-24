# React Modern Gantt

A flexible, customizable Gantt chart component for React applications with drag-and-drop task scheduling, dark mode support, progress tracking, and multiple view modes.

[![npm version](https://img.shields.io/npm/v/react-modern-gantt.svg)](https://www.npmjs.com/package/react-modern-gantt)
[![license](https://img.shields.io/npm/l/react-modern-gantt.svg)](https://github.com/MikaStiebitz/React-Modern-Gantt/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-modern-gantt.svg)](https://bundlephobia.com/result?p=react-modern-gantt)

<p align="center">
  <img src="https://github.com/user-attachments/assets/bc5ab980-6a28-4010-83bc-a88ae81bb6fa" alt="React Modern Gantt in Dark Mode" width="800" />
</p>

<p align="center">
  <a href="https://react-gantt-demo.vercel.app/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/View-LIVE_DEMO-blue?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Components](#-components)
- [Task & TaskGroup Data Structure](#-task--taskgroup-data-structure)
- [View Modes](#-view-modes)
- [Customization](#-customization)
- [Event Handling](#-event-handling)
- [Dark Mode](#-dark-mode)
- [Advanced Examples](#-advanced-examples)
- [Browser Support](#-browser-support)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

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

## 📦 Installation

### NPM

```bash
npm install react-modern-gantt
```

### Yarn

```bash
yarn add react-modern-gantt
```

## 🚀 Quick Start

```jsx
import React, { useState } from "react";
import GanttChart from "react-modern-gantt";
// ⚠️ IMPORTANT: Don't forget to import the styles!
import "react-modern-gantt/dist/index.css";

function App() {
    const [tasks, setTasks] = useState([
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
    ]);

    const handleTaskUpdate = (groupId, updatedTask) => {
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

    return <GanttChart tasks={tasks} onTaskUpdate={handleTaskUpdate} darkMode={false} showProgress={true} />;
}
```

> 📌 **Note:** Make sure to import the CSS file to apply all necessary styles:
> `import "react-modern-gantt/dist/index.css";`
> Without this import, the component will not be styled correctly.

### Using CSS styles

The Gantt chart requires CSS styles that are shipped separately from the component code. You have two options:

#### Option 1: Import CSS file (Recommended)

```js
// In your application entry point (e.g., App.js or index.js)
import "react-modern-gantt/dist/index.css";
```

#### Option 2: Reference CSS in HTML

```html
<!-- In your HTML file -->
<link rel="stylesheet" href="https://unpkg.com/react-modern-gantt@0.5.0/dist/index.css" />
```

## 🧩 Components

### Main Components

- **`GanttChart`**: The main component for rendering a Gantt chart
- **`TaskItem`**: Individual task bars
- **`TaskList`**: The left sidebar with task groups
- **`Timeline`**: The header timeline display
- **`ViewModeSelector`**: Controls for switching between timeline views

### Utility Components

- **`Tooltip`**: Information tooltip for tasks
- **`TodayMarker`**: Vertical line indicating the current date

## 📊 Task & TaskGroup Data Structure

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

## 🕒 View Modes

The component supports five different view modes to adapt to different timeline needs:

| View Mode | Description    | Best Used For                                |
| --------- | -------------- | -------------------------------------------- |
| `DAY`     | Shows days     | Detailed short-term planning (days/weeks)    |
| `WEEK`    | Shows weeks    | Short to medium-term planning (weeks/months) |
| `MONTH`   | Shows months   | Medium-term planning (months/quarters)       |
| `QUARTER` | Shows quarters | Medium to long-term planning (quarters/year) |
| `YEAR`    | Shows years    | Long-term planning (years)                   |

```jsx
import { GanttChart, ViewMode } from "react-modern-gantt";

// Using string literals
<GanttChart tasks={tasks} viewMode="day" />

// Using the ViewMode enum
<GanttChart tasks={tasks} viewMode={ViewMode.DAY} />
```

## 🎨 Customization

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

### Custom Styles

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

### Custom Rendering

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

## 🎯 Event Handling

Handle various interactions with the Gantt chart:

```jsx
<GanttChart
    tasks={tasks}
    onTaskUpdate={(groupId, updatedTask) => {
        console.log(`Task ${updatedTask.id} updated in group ${groupId}`);
        // Update your state here
        updateTasks(groupId, updatedTask);
    }}
    onTaskClick={(task, group) => {
        console.log(`Task ${task.id} clicked in group ${group.id}`);
        // Do something when a task is clicked
        selectTask(task.id);
    }}
    onTaskSelect={(task, isSelected) => {
        console.log(`Task ${task.id} selection state: ${isSelected}`);
        // Handle selection state changes
    }}
    onGroupClick={group => {
        console.log(`Group ${group.id} clicked`);
        // Do something when a group is clicked
    }}
    onViewModeChange={viewMode => {
        console.log(`View mode changed to: ${viewMode}`);
        // Handle view mode changes
    }}
/>
```

## 🌙 Dark Mode

Dark mode is built-in and easy to enable:

```jsx
<GanttChart tasks={tasks} darkMode={true} onTaskUpdate={handleTaskUpdate} />
```

## 🔄 Advanced Examples

### Custom Task Rendering by Status

```jsx
<GanttChart
    tasks={tasks}
    getTaskColor={({ task }) => {
        // Task is complete
        if (task.percent === 100) {
            return {
                backgroundColor: "#22c55e", // Green
                borderColor: "#166534",
                textColor: "#ffffff",
            };
        }

        // Task has dependencies
        if (task.dependencies?.length > 0) {
            return {
                backgroundColor: "#f59e0b", // Orange
                textColor: "#ffffff",
            };
        }

        // High priority task
        if (task.priority === "high") {
            return {
                backgroundColor: "#ef4444", // Red
                textColor: "#ffffff",
            };
        }

        // Default color
        return {
            backgroundColor: "#3b82f6", // Blue
            textColor: "#ffffff",
        };
    }}
/>
```

### Custom Tooltip for Detailed Information

```jsx
<GanttChart
    tasks={tasks}
    renderTooltip={({ task, position, dragType, startDate, endDate }) => (
        <div className="custom-tooltip">
            <h3>{task.name}</h3>

            {dragType && (
                <div className="drag-indicator">{dragType === "move" ? "Moving task..." : "Resizing task..."}</div>
            )}

            <div className="date-range">
                {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
            </div>

            <div className="progress-section">
                <div className="progress-label">Progress: {task.percent || 0}%</div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${task.percent || 0}%` }} />
                </div>
            </div>

            {task.assignee && <div className="assignee">Assigned to: {task.assignee}</div>}
        </div>
    )}
/>
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ❓ FAQ

### Can I change the date format in the timeline?

Yes, you can use the `locale` prop to change the date formatting:

```jsx
<GanttChart
    tasks={tasks}
    locale="de-DE" // For German formatting
/>
```

### How do I handle updates to tasks?

The Gantt chart is a controlled component, so updates are handled through the `onTaskUpdate` callback:

```jsx
const handleTaskUpdate = (groupId, updatedTask) => {
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

### Can I make the Gantt chart read-only?

Yes, set the `editMode` prop to `false`:

```jsx
<GanttChart tasks={tasks} editMode={false} />
```

### How do I disable progress indicators?

Set the `showProgress` prop to `false`:

```jsx
<GanttChart tasks={tasks} showProgress={false} />
```

### Can I customize the visual appearance of specific tasks?

Yes, use the `getTaskColor` function:

```jsx
<GanttChart
    tasks={tasks}
    getTaskColor={({ task }) => ({
        backgroundColor: task.isUrgent ? "#ef4444" : "#3b82f6",
        textColor: "white",
    })}
/>
```

### Why are my styles not loading?

If your Gantt chart appears without styling, make sure you've imported the CSS file:

```js
import "react-modern-gantt/dist/index.css";
```

This import should be included in your application's entry point or in the component where you use the Gantt chart.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
