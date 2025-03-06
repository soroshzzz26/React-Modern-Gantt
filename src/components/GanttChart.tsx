import React, { useRef, useState, useEffect, ReactElement, Children, cloneElement, isValidElement } from "react";
import { GanttChartProps, TaskGroup, Task } from "../utils/types";
import { getMonthsBetween, detectTaskOverlaps, findEarliestDate, findLatestDate } from "../models";
import TaskRow from "./TaskRow";
import Timeline from "./Timeline";
import TodayMarker from "./TodayMarker";
import TaskList from "./TaskList";
import "../styles/gantt.css";

// Import composable components
import { GanttTitle, GanttHeader, GanttMarker, GanttTaskList, GanttTimeline, GanttTaskItem } from "./composable";

// Import types for composable components
import type { GanttTitleProps } from "./composable/GanttTitle";
import type { GanttHeaderProps } from "./composable/GanttHeader";
import type { GanttMarkerProps } from "./composable/GanttMarker";
import type { GanttTaskListProps } from "./composable/GanttTaskList";
import type { GanttTimelineProps } from "./composable/GanttTimeline";
import type { GanttTaskItemProps } from "./composable/GanttTaskItem";

// Interface for component types to use in getChildrenByType
interface ComponentTypesMap {
    title: React.ComponentType<GanttTitleProps>;
    header: React.ComponentType<GanttHeaderProps>;
    marker: React.ComponentType<GanttMarkerProps>;
    taskList: React.ComponentType<GanttTaskListProps>;
    timeline: React.ComponentType<GanttTimelineProps>;
    taskItem: React.ComponentType<GanttTaskItemProps>;
}

/**
 * GanttChart Component
 *
 * A modern, customizable Gantt chart for project timelines with both props and composable API
 *
 * @example
 * // Basic usage
 * <GanttChart
 *   tasks={tasks}
 *   onTaskUpdate={handleUpdate}
 *   showProgress={true}
 * />
 *
 * // Composition-based usage
 * <GanttChart tasks={tasks} onTaskUpdate={handleUpdate}>
 *   <GanttTitle>Custom Project Timeline</GanttTitle>
 *   <GanttHeader>Resources</GanttHeader>
 *   <GanttMarker>Today</GanttMarker>
 * </GanttChart>
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
    theme = {},
    darkMode = false,
    showWeeks = false,
    showDays = false,
    locale = "default",

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

    // Children
    children,
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

    // Component types map for getChildrenByType
    const componentTypes: ComponentTypesMap = {
        title: GanttTitle,
        header: GanttHeader,
        marker: GanttMarker,
        taskList: GanttTaskList,
        timeline: GanttTimeline,
        taskItem: GanttTaskItem,
    };

    // Type-safe get children by component type
    const getChildrenByType = <T extends keyof ComponentTypesMap>(type: T): ReactElement<any>[] => {
        return Children.toArray(children).filter(
            (child): child is ReactElement<any> => isValidElement(child) && child.type === componentTypes[type]
        ) as ReactElement<any>[];
    };

    // Find composable child elements
    const titleElements = getChildrenByType("title");
    const headerElements = getChildrenByType("header");
    const markerElements = getChildrenByType("marker");
    const taskListElements = getChildrenByType("taskList");
    const timelineElements = getChildrenByType("timeline");
    const taskItemElements = getChildrenByType("taskItem");

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

    return (
        <div
            ref={containerRef}
            className={`rmg-gantt-chart w-full bg-gantt-bg text-gantt-text rounded-xl shadow-lg overflow-hidden ${themeClass}`}
            style={style}
            data-testid="gantt-chart">
            <div className="p-6 border-b border-gantt-border">
                {/* Use custom title from children or default to prop */}
                {titleElements.length > 0 ? (
                    cloneElement<GanttTitleProps>(titleElements[0])
                ) : (
                    <GanttTitle>{title}</GanttTitle>
                )}
            </div>

            <div className="relative flex">
                {/* Task List (left sidebar) */}
                {taskListElements.length > 0 ? (
                    cloneElement<GanttTaskListProps>(taskListElements[0], {
                        tasks,
                        headerLabel,
                        onGroupClick: handleGroupClick,
                    })
                ) : (
                    <TaskList tasks={tasks} headerLabel={headerLabel} onGroupClick={handleGroupClick} />
                )}

                {/* Timeline and Tasks (right content) */}
                <div ref={scrollContainerRef} className="flex-grow overflow-x-auto">
                    <div className="min-w-max">
                        {/* Timeline header */}
                        {timelineElements.length > 0 ? (
                            cloneElement<GanttTimelineProps>(timelineElements[0], {
                                months,
                                currentMonthIndex,
                                showWeeks,
                                showDays,
                                locale,
                            })
                        ) : (
                            <Timeline
                                months={months}
                                currentMonthIndex={currentMonthIndex}
                                showWeeks={showWeeks}
                                showDays={showDays}
                                locale={locale}
                            />
                        )}

                        <div className="relative">
                            {/* Today marker */}
                            {showCurrentDateMarker &&
                                currentMonthIndex >= 0 &&
                                (markerElements.length > 0 ? (
                                    cloneElement<GanttMarkerProps>(markerElements[0], {
                                        children: todayLabel,
                                    })
                                ) : (
                                    <TodayMarker
                                        currentMonthIndex={currentMonthIndex}
                                        height={getTotalHeight()}
                                        label={todayLabel}
                                        dayOfMonth={currentDay}
                                    />
                                ))}

                            {/* Tasks - either custom items or standard rows */}
                            {taskItemElements.length > 0 ? (
                                <div className="relative">
                                    {taskItemElements.map((element, index) => {
                                        const elementProps = element.props as GanttTaskItemProps;
                                        const task = elementProps.task;
                                        const taskId = task?.id;

                                        // Safe creation of new props
                                        return cloneElement<GanttTaskItemProps>(element, {
                                            key: `custom-task-item-${index}`,
                                            isSelected: taskId ? selectedTaskIds.includes(taskId) : false,
                                            onSelect: handleTaskSelect,
                                            onClick: handleTaskClick,
                                            onDoubleClick: handleTaskDoubleClick,
                                        });
                                    })}
                                </div>
                            ) : (
                                tasks.map(group => {
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
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
