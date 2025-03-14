import React, { useRef, useState, useEffect } from "react";
import { GanttChartProps, TaskGroup, Task, ViewMode } from "../utils/types";
import {
    getMonthsBetween as modelsGetMonthsBetween,
    detectTaskOverlaps,
    findEarliestDate,
    findLatestDate,
} from "../models";
import TaskRow from "./TaskRow";
import Timeline from "./Timeline";
import TodayMarker from "./TodayMarker";
import ViewModeSelector from "./ViewModeSelector";
import TaskList from "./TaskList";
import { addDays, addWeeks, startOfWeek, addQuarters, startOfQuarter, addYears, startOfYear } from "date-fns";
import "../styles/gantt.css";

/**
 * GanttChart Component with ViewMode support
 *
 * A modern, customizable Gantt chart for project timelines
 * Enhanced with smooth dragging and animations
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
    locale = "default",
    styles = {},
    viewMode = ViewMode.MONTH,
    showViewModeSelector = true,
    smoothDragging = true,
    movementThreshold = 3,
    animationSpeed = 0.25, // New prop for controlling animation speed (0-1)

    // Component render functions
    renderTaskList,
    renderTask,
    renderTooltip,
    getTaskColor,

    // Core event handlers
    onTaskUpdate,
    onTaskClick,

    // Advanced event handlers
    onTaskSelect,
    onTaskDoubleClick,
    onGroupClick,
    onViewModeChange,

    // Visual customization
    fontSize,
    rowHeight = 40,
    timeStep,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // State for view mode and unit properties
    const [activeViewMode, setActiveViewMode] = useState<ViewMode>(viewMode);
    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
    const [viewUnitWidth, setViewUnitWidth] = useState<number>(150); // Default width for a month
    const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);

    // Calculate timeline bounds
    const derivedStartDate = customStartDate || findEarliestDate(tasks);
    const derivedEndDate = customEndDate || findLatestDate(tasks);

    // Helper functions for different view modes
    const getTimeUnits = () => {
        switch (activeViewMode) {
            case ViewMode.DAY:
                return getDaysBetween(derivedStartDate, derivedEndDate);
            case ViewMode.WEEK:
                return getWeeksBetween(derivedStartDate, derivedEndDate);
            case ViewMode.MONTH:
                return modelsGetMonthsBetween(derivedStartDate, derivedEndDate);
            case ViewMode.QUARTER:
                return getQuartersBetween(derivedStartDate, derivedEndDate);
            case ViewMode.YEAR:
                return getYearsBetween(derivedStartDate, derivedEndDate);
            default:
                return modelsGetMonthsBetween(derivedStartDate, derivedEndDate);
        }
    };

    // Get days between dates - Use consistent start of day for proper alignment
    const getDaysBetween = (start: Date, end: Date): Date[] => {
        const days: Date[] = [];

        // Ensure we work with the start of day for proper alignment
        let currentDate = new Date(start);
        currentDate.setHours(0, 0, 0, 0);

        const endDateAdjusted = new Date(end);
        endDateAdjusted.setHours(23, 59, 59, 999);

        while (currentDate <= endDateAdjusted) {
            // Create a new date object to avoid reference issues
            days.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
        }

        return days;
    };

    // Get weeks between dates - Fixed to start from the right date
    const getWeeksBetween = (start: Date, end: Date): Date[] => {
        const weeks: Date[] = [];

        // Start from exactly the start date, no adjustment
        let currentDate = new Date(start);

        while (currentDate <= end) {
            weeks.push(new Date(currentDate));
            currentDate = addDays(currentDate, 7);
        }

        return weeks;
    };

    // Get quarters between dates
    const getQuartersBetween = (start: Date, end: Date): Date[] => {
        const quarters: Date[] = [];
        let currentDate = startOfQuarter(new Date(start));

        while (currentDate <= end) {
            quarters.push(new Date(currentDate));
            currentDate = addQuarters(currentDate, 1);
        }

        return quarters;
    };

    // Get years between dates
    const getYearsBetween = (start: Date, end: Date): Date[] => {
        const years: Date[] = [];
        let currentDate = startOfYear(new Date(start));

        while (currentDate <= end) {
            years.push(new Date(currentDate));
            currentDate = addYears(currentDate, 1);
        }

        return years;
    };

    // Get time units for the current view mode
    const timeUnits = getTimeUnits();
    const totalUnits = timeUnits.length;

    // Find current unit index for highlighting
    const getCurrentUnitIndex = (): number => {
        const today = new Date();

        switch (activeViewMode) {
            case ViewMode.DAY:
                return timeUnits.findIndex(
                    date =>
                        date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear()
                );
            case ViewMode.WEEK:
                // This needs to compare actual dates, not just week starts
                return timeUnits.findIndex(date => {
                    const weekEndDate = new Date(date);
                    weekEndDate.setDate(date.getDate() + 6);
                    return today >= date && today <= weekEndDate;
                });
            case ViewMode.MONTH:
                return timeUnits.findIndex(
                    date => date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
                );
            case ViewMode.QUARTER:
                const todayQuarter = Math.floor(today.getMonth() / 3);
                return timeUnits.findIndex(
                    date =>
                        Math.floor(date.getMonth() / 3) === todayQuarter && date.getFullYear() === today.getFullYear()
                );
            case ViewMode.YEAR:
                return timeUnits.findIndex(date => date.getFullYear() === today.getFullYear());
            default:
                return -1;
        }
    };

    const currentUnitIndex = getCurrentUnitIndex();

    // Handle auto-scrolling state
    const handleAutoScrollingChange = (isScrolling: boolean) => {
        setIsAutoScrolling(isScrolling);
        if (scrollContainerRef.current) {
            if (isScrolling) {
                scrollContainerRef.current.classList.add("rmg-auto-scrolling");
            } else {
                scrollContainerRef.current.classList.remove("rmg-auto-scrolling");
            }
        }
    };

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

    const handleViewModeChange = (newMode: ViewMode) => {
        setActiveViewMode(newMode);

        // Adjust unit width based on view mode
        switch (newMode) {
            case ViewMode.DAY:
                setViewUnitWidth(50); // Slightly wider for days to accommodate weekday
                break;
            case ViewMode.WEEK:
                setViewUnitWidth(80); // Narrow for weeks
                break;
            case ViewMode.MONTH:
                setViewUnitWidth(150); // Default for months
                break;
            case ViewMode.QUARTER:
                setViewUnitWidth(180); // Wider for quarters
                break;
            case ViewMode.YEAR:
                setViewUnitWidth(200); // Widest for years
                break;
            default:
                setViewUnitWidth(150);
        }

        // Call the external handler if provided
        if (onViewModeChange) {
            onViewModeChange(newMode);
        }
    };

    // Initialize view mode
    useEffect(() => {
        handleViewModeChange(viewMode);
    }, [viewMode]);

    // Apply custom animation speed to CSS variables
    useEffect(() => {
        if (containerRef.current) {
            const speedValue = Math.max(0.1, Math.min(1, animationSpeed || 0.25));
            containerRef.current.style.setProperty("--rmg-animation-speed", speedValue.toString());
        }
    }, [animationSpeed, containerRef.current]);

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
            style={
                {
                    ...style,
                    "--gantt-unit-width": `${viewUnitWidth}px`,
                } as React.CSSProperties
            }
            data-testid="gantt-chart">
            <div className="p-6 border-b border-gantt-border">
                <div className="flex justify-between items-center">
                    <h1 className={`text-2xl font-bold text-gantt-text ${mergedStyles.title}`}>{title}</h1>

                    {/* View Mode Selector - conditionally rendered based on showViewModeSelector prop */}
                    {showViewModeSelector && (
                        <div className="flex space-x-2">
                            <ViewModeSelector
                                activeMode={activeViewMode}
                                onChange={handleViewModeChange}
                                darkMode={darkMode}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="relative flex">
                {/* Task List (left sidebar) - conditionally use custom render function if provided */}
                {renderTaskList ? (
                    renderTaskList({
                        tasks,
                        headerLabel,
                        onGroupClick,
                        viewMode: activeViewMode,
                    })
                ) : (
                    <TaskList
                        tasks={tasks}
                        headerLabel={headerLabel}
                        onGroupClick={onGroupClick}
                        className={mergedStyles.taskList}
                        viewMode={activeViewMode}
                    />
                )}

                {/* Timeline and Tasks (right content) */}
                <div
                    ref={scrollContainerRef}
                    className={`flex-grow overflow-x-auto rmg-gantt-scroll-container ${
                        isAutoScrolling ? "rmg-auto-scrolling" : ""
                    }`}>
                    <div className="min-w-max">
                        {/* Timeline header */}
                        <Timeline
                            months={timeUnits}
                            currentMonthIndex={currentUnitIndex}
                            locale={locale}
                            className={mergedStyles.timeline}
                            viewMode={activeViewMode}
                            unitWidth={viewUnitWidth}
                        />

                        <div className="relative">
                            {/* Today marker */}
                            {showCurrentDateMarker && currentUnitIndex >= 0 && (
                                <TodayMarker
                                    currentMonthIndex={currentUnitIndex}
                                    height={getTotalHeight()}
                                    label={todayLabel}
                                    dayOfMonth={currentDate.getDate()}
                                    className={mergedStyles.todayMarker}
                                    viewMode={activeViewMode}
                                    unitWidth={viewUnitWidth}
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
                                        totalMonths={totalUnits}
                                        monthWidth={viewUnitWidth}
                                        editMode={editMode}
                                        showProgress={showProgress}
                                        onTaskUpdate={handleTaskUpdate}
                                        onTaskClick={handleTaskClick}
                                        onTaskSelect={handleTaskSelect}
                                        onAutoScrollChange={handleAutoScrollingChange}
                                        className={mergedStyles.taskRow}
                                        tooltipClassName={mergedStyles.tooltip}
                                        viewMode={activeViewMode}
                                        scrollContainerRef={scrollContainerRef}
                                        smoothDragging={smoothDragging}
                                        movementThreshold={movementThreshold}
                                        animationSpeed={animationSpeed}
                                        // Pass down custom render props
                                        renderTask={renderTask}
                                        renderTooltip={renderTooltip}
                                        getTaskColor={getTaskColor}
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
