import React, { useRef, useState } from "react";
import { GanttChartProps, TaskGroup, Task } from "../utils/types";
import { getMonthsBetween, detectTaskOverlaps, findEarliestDate, findLatestDate } from "../models";
import TaskRow from "./TaskRow";
import Timeline from "./Timeline";
import TodayMarker from "./TodayMarker";
import TaskList from "./TaskList";
import "../styles/gantt.css";

/**
 * GanttChart Component
 *
 * A modern, customizable Gantt chart for project timelines
 *
 * @example
 * // Basic usage
 * <GanttChart
 *   tasks={tasks}
 *   onTaskUpdate={handleUpdate}
 *   showProgress={true}
 * />
 *
 * // With custom styles
 * <GanttChart
 *   tasks={tasks}
 *   onTaskUpdate={handleUpdate}
 *   styles={{
 *     container: "border-2 border-blue-200",
 *     title: "text-2xl text-blue-800",
 *     taskList: "bg-blue-50"
 *   }}
 * />
 */
const GanttChart: React.FC<GanttChartProps> = ({
    tasks = [],
    startDate: customStartDate,
    endDate: customEndDate,
    title = "Project Timeline",
    currentDate = new Date(),
    showCurrentDateMarker = true,
    todayLabel = "Today",
    editMode = true,
    headerLabel = "Resources",
    showProgress = false,
    darkMode = false,
    showWeeks = false,
    showDays = false,
    locale = "default",
    styles = {},

    // Core event handlers
    onTaskUpdate,
    onTaskClick,

    // Advanced event handlers
    onTaskSelect,
    onTaskDoubleClick,
    onGroupClick,

    // Visual customization
    fontSize,
    rowHeight = 40,
    timeStep,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // State for selected tasks
    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

    // Calculate timeline bounds
    const derivedStartDate = customStartDate || findEarliestDate(tasks);
    const derivedEndDate = customEndDate || findLatestDate(tasks);

    const months = getMonthsBetween(derivedStartDate, derivedEndDate);
    const totalMonths = months.length;

    // Find current month index for highlighting
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const currentMonthIndex = months.findIndex(
        month => month.getMonth() === currentMonth && month.getFullYear() === currentYear
    );

    // Calculate total height based on task rows
    const getTotalHeight = () => {
        let height = 0;
        tasks.forEach(group => {
            if (group && Array.isArray(group.tasks)) {
                const taskRows = detectTaskOverlaps(group.tasks);
                height += Math.max(60, taskRows.length * rowHeight + 20);
            } else {
                height += 60;
            }
        });
        return height;
    };

    // Task interaction handlers
    const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
        if (onTaskUpdate) {
            try {
                const ensuredTask = {
                    ...updatedTask,
                    startDate:
                        updatedTask.startDate instanceof Date ? updatedTask.startDate : new Date(updatedTask.startDate),
                    endDate: updatedTask.endDate instanceof Date ? updatedTask.endDate : new Date(updatedTask.endDate),
                };

                onTaskUpdate(groupId, ensuredTask);
            } catch (error) {
                console.error("Error in handleTaskUpdate:", error);
            }
        }
    };

    const handleTaskClick = (task: Task, group: TaskGroup) => {
        if (onTaskClick) {
            try {
                onTaskClick(task, group);
            } catch (error) {
                console.error("Error in handleTaskClick:", error);
            }
        }
    };

    const handleTaskSelect = (task: Task, isSelected: boolean) => {
        // Update selected state
        setSelectedTaskIds(prev => {
            if (isSelected) {
                return [...prev, task.id];
            } else {
                return prev.filter(id => id !== task.id);
            }
        });

        // Call handler if provided
        if (onTaskSelect) {
            try {
                onTaskSelect(task, isSelected);
            } catch (error) {
                console.error("Error in onTaskSelect handler:", error);
            }
        }
    };

    const handleTaskDoubleClick = (task: Task) => {
        if (onTaskDoubleClick) {
            try {
                onTaskDoubleClick(task);
            } catch (error) {
                console.error("Error in onTaskDoubleClick handler:", error);
            }
        }
    };

    const handleGroupClick = (group: TaskGroup) => {
        if (onGroupClick) {
            try {
                onGroupClick(group);
            } catch (error) {
                console.error("Error in onGroupClick handler:", error);
            }
        }
    };

    const style: React.CSSProperties = {
        fontSize: fontSize || "inherit",
    };

    // Apply dark mode class if enabled
    const themeClass = darkMode ? "dark" : "";

    // Default styles that can be overridden by props
    const defaultStyles = {
        container: "",
        title: "",
        header: "",
        taskList: "",
        timeline: "",
        taskRow: "",
        todayMarker: "",
        tooltip: "",
    };

    // Merge default styles with provided styles
    const mergedStyles = { ...defaultStyles, ...styles };

    return (
        <div
            ref={containerRef}
            className={`rmg-gantt-chart w-full bg-gantt-bg text-gantt-text rounded-xl shadow-lg overflow-hidden ${themeClass} ${mergedStyles.container}`}
            style={style}
            data-testid="gantt-chart">
            <div className="p-6 border-b border-gantt-border">
                <h1 className={`text-2xl font-bold text-gantt-text ${mergedStyles.title}`}>{title}</h1>
            </div>

            <div className="relative flex">
                {/* Task List (left sidebar) */}
                <TaskList
                    tasks={tasks}
                    headerLabel={headerLabel}
                    onGroupClick={handleGroupClick}
                    className={mergedStyles.taskList}
                />

                {/* Timeline and Tasks (right content) */}
                <div ref={scrollContainerRef} className="flex-grow overflow-x-auto">
                    <div className="min-w-max">
                        {/* Timeline header */}
                        <Timeline
                            months={months}
                            currentMonthIndex={currentMonthIndex}
                            showWeeks={showWeeks}
                            showDays={showDays}
                            locale={locale}
                            className={mergedStyles.timeline}
                        />

                        <div className="relative">
                            {/* Today marker */}
                            {showCurrentDateMarker && currentMonthIndex >= 0 && (
                                <TodayMarker
                                    currentMonthIndex={currentMonthIndex}
                                    height={getTotalHeight()}
                                    label={todayLabel}
                                    dayOfMonth={currentDay}
                                    className={mergedStyles.todayMarker}
                                />
                            )}

                            {/* Tasks */}
                            {tasks.map(group => {
                                if (!group || !group.id) return null;

                                return (
                                    <TaskRow
                                        key={`task-row-${group.id}`}
                                        taskGroup={group}
                                        startDate={derivedStartDate}
                                        endDate={derivedEndDate}
                                        totalMonths={totalMonths}
                                        monthWidth={150}
                                        editMode={editMode}
                                        showProgress={showProgress}
                                        onTaskUpdate={handleTaskUpdate}
                                        onTaskClick={handleTaskClick}
                                        onTaskSelect={handleTaskSelect}
                                        className={mergedStyles.taskRow}
                                        tooltipClassName={mergedStyles.tooltip}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
