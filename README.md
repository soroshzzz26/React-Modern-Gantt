],
},
{
id: "team-2",
name: "Marketing",
description: "Marketing Team",
tasks: [
{
id: "task-3",
name: "Content Creation",
startDate: new Date(2023, 0, 15),
endDate: new Date(2023, 1, 28),
color: "bg-violet-500",
percent: 100,
},
{
id: "task-4",
name: "Campaign Launch",
startDate: new Date(2023, 2, 1),
endDate: new Date(2023, 3, 15),
color: "bg-amber-500",
percent: 20,
},
],
},
]);

const handleTaskUpdate = (groupId, updatedTask) => {
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

return (
<GanttChart
      tasks={tasks}
      title="Project Timeline"
      showProgress={true}
      onTaskUpdate={handleTaskUpdate}
    />
);
};

export default SimpleGantt;

````

## Core Concepts

React Modern Gantt is built around a few key concepts:

1. **Task Groups** - Collections of tasks, typically representing teams or departments
2. **Tasks** - Individual work items with start and end dates
3. **Timeline** - Horizontal representation of time, typically in months
4. **Interactions** - Drag, resize, click, and other user interactions

## Component Props

### GanttChart

The main component for rendering a Gantt chart.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tasks` | `TaskGroup[]` | `[]` | Array of task groups |
| `startDate` | `Date` | Auto | Start date of the chart (defaults to earliest task date) |
| `endDate` | `Date` | Auto | End date of the chart (defaults to latest task date) |
| `title` | `string` | `"Project Timeline"` | Title displayed at the top of the chart |
| `currentDate` | `Date` | `new Date()` | Current date for the today marker |
| `showCurrentDateMarker` | `boolean` | `true` | Whether to show the today marker |
| `todayLabel` | `string` | `"Today"` | Label for today marker |
| `editMode` | `boolean` | `true` | Whether tasks can be dragged/resized |
| `headerLabel` | `string` | `"Resources"` | Header label for the task list column |
| `showProgress` | `boolean` | `false` | Whether to show progress indicators |
| `theme` | `GanttTheme` | Light theme | Theme customization object |
| `darkMode` | `boolean` | `false` | Whether to use dark mode |
| `locale` | `string` | `'default'` | Locale for date formatting |
| `fontSize` | `string` | `'inherit'` | Base font size |
| `rowHeight` | `number` | `40` | Height of task rows in pixels |
| `showWeeks` | `boolean` | `false` | Whether to show week markers |
| `showDays` | `boolean` | `false` | Whether to show day markers |

### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onTaskUpdate` | `(groupId: string, updatedTask: Task) => void` | Called when a task is moved or resized |
| `onTaskClick` | `(task: Task, group: TaskGroup) => void` | Called when a task is clicked |
| `onTaskSelect` | `(task: Task, isSelected: boolean) => void` | Called when a task is selected |
| `onTaskDoubleClick` | `(task: Task) => void` | Called when a task is double-clicked |
| `onGroupClick` | `(group: TaskGroup) => void` | Called when a group is clicked |

## Customization

### Using Themes

React Modern Gantt supports easy theme customization:

```jsx
import { GanttChart, mergeTheme, lightTheme } from 'react-modern-gantt';

// Create a custom theme
const customTheme = mergeTheme(lightTheme, {
  highlight: '#eff6ff',  // Custom highlight color
  marker: '#ef4444',     // Custom marker color
  task: '#3b82f6',       // Custom task color
});

// Use it in your component
<GanttChart
  tasks={tasks}
  theme={customTheme}
  onTaskUpdate={handleTaskUpdate}
/>
````

### Dark Mode

Dark mode is built-in and easy to enable:

```jsx
<GanttChart tasks={tasks} darkMode={true} onTaskUpdate={handleTaskUpdate} />
```

### Using Composition API

For advanced customization, use the composition API:

```jsx
import { GanttChart, GanttTitle, GanttHeader, GanttMarker, GanttTaskList } from "react-modern-gantt";

// In your component
<GanttChart tasks={tasks} onTaskUpdate={handleTaskUpdate}>
    <GanttTitle className="text-2xl text-indigo-800">Custom Project Timeline</GanttTitle>

    <GanttHeader className="font-bold text-indigo-600">Teams & Resources</GanttHeader>

    <GanttMarker className="bg-pink-500">Current Date</GanttMarker>

    <GanttTaskList showIcon={true} showTaskCount={true} className="w-48 bg-gray-50" />
</GanttChart>;
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

### Custom Task Rendering

You can customize individual task rendering:

```jsx
import { GanttChart, GanttTaskItem } from "react-modern-gantt";

<GanttChart tasks={tasks} onTaskUpdate={handleTaskUpdate}>
    {/* Custom task rendering */}
    {tasks.map(group =>
        group.tasks.map(task => (
            <GanttTaskItem
                key={task.id}
                task={task}
                group={group}
                className={task.priority === "high" ? "ring-2 ring-red-500" : ""}
            />
        ))
    )}
</GanttChart>;
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

    // Check for conflicts
    const group = tasks.find(g => g.id === groupId);
    const hasConflict = group.tasks.some(
        t => t.id !== updatedTask.id && !(updatedTask.startDate >= t.endDate || updatedTask.endDate <= t.startDate)
    );

    if (hasConflict) {
        alert("Task conflicts with another task");
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

### Custom Date Formatting

You can customize date formatting:

```jsx
import { GanttChart, formatDate, DateDisplayFormat } from "react-modern-gantt";

// Custom date formatter
const myDateFormatter = date => {
    return formatDate(date, DateDisplayFormat.SHORT_DATE, "de-DE");
};

// Use formatter in your tooltips or elsewhere
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
