import * as React from "react";
import GanttChart, { Task, TaskGroup, ViewMode } from "react-modern-gantt";
import { complexDemoData, yearLongProjectData } from "./data";

interface DemoViewModesProps {
    darkMode: boolean;
}

const DemoViewModes: React.FC<DemoViewModesProps> = ({ darkMode }: DemoViewModesProps) => {
    const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.MONTH);
    const [demoType, setDemoType] = React.useState<"complex" | "yearLong">("complex");
    const [tasks, setTasks] = React.useState<TaskGroup[]>(complexDemoData);

    // Handle view mode change
    const handleViewModeChange = (newMode: ViewMode) => {
        setViewMode(newMode);
        console.log("View mode changed to:", newMode);
    };

    // Handle task updates
    const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
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

    // Switch between demo types
    const handleDemoTypeChange = (type: "complex" | "yearLong") => {
        setDemoType(type);
        setTasks(type === "complex" ? complexDemoData : yearLongProjectData);

        // Set appropriate view mode for year-long project
        if (type === "yearLong" && viewMode === ViewMode.DAY) {
            setViewMode(ViewMode.MONTH);
        }
    };

    return (
        <div>
            <div className="control-panel">
                <button
                    onClick={() => handleDemoTypeChange("complex")}
                    style={{
                        backgroundColor: demoType === "complex" ? "#4f46e5" : undefined,
                        color: demoType === "complex" ? "white" : undefined,
                        padding: "5px 10px",
                    }}>
                    Complex Project
                </button>
                <button
                    onClick={() => handleDemoTypeChange("yearLong")}
                    style={{
                        backgroundColor: demoType === "yearLong" ? "#4f46e5" : undefined,
                        color: demoType === "yearLong" ? "white" : undefined,
                        padding: "5px 10px",
                    }}>
                    Year-Long Project
                </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <p>
                    This demo showcases different view modes (Day, Week, Month, Quarter, Year). The view mode selector
                    is built into the Gantt chart.
                </p>
            </div>

            <GanttChart
                tasks={tasks}
                title={demoType === "complex" ? "Complex Project" : "Year-Long Project"}
                darkMode={darkMode}
                showProgress={true}
                viewMode={viewMode}
                viewModes={[ViewMode.DAY, ViewMode.WEEK, ViewMode.MONTH, ViewMode.QUARTER, ViewMode.YEAR]}
                onViewModeChange={handleViewModeChange}
                onTaskUpdate={handleTaskUpdate}
            />
        </div>
    );
};

export default DemoViewModes;
