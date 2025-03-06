import React, { useRef, useState, useEffect, ReactElement, Children, cloneElement, isValidElement } from "react";
import { GanttChartProps, TaskGroup, Task } from "@/utils/types";
import { getMonthsBetween, detectTaskOverlaps, findEarliestDate, findLatestDate } from "../models";
import TaskRow from "./Task/TaskRow";
import Timeline from "./Timeline";
import TodayMarker from "./TodayMarker";
import TaskList from "./Task/TaskList";
import "../gantt.css";

import {
    GanttTitle,
    GanttHeader,
    GanttCurrentDateMarker,
    GanttTaskList,
    GanttTimeline,
    GanttTaskItem,
} from "./Elements";

/**
 * Enhanced GanttChart Component
 *
 * A modern, customizable Gantt chart for project timelines with both props and composable API
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

    // Core event handlers
    onTaskUpdate,
    onTaskClick,

    // Advanced event handlers
    onTaskSelect,
    onTaskDoubleClick,

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

    const derivedStartDate = customStartDate || findEarliestDate(tasks);
    const derivedEndDate = customEndDate || findLatestDate(tasks);

    const months = getMonthsBetween(derivedStartDate, derivedEndDate);
    const totalMonths = months.length;

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const currentMonthIndex = months.findIndex(
        month => month.getMonth() === currentMonth && month.getFullYear() === currentYear
    );

    // Get child components by type
    const getChildrenByType = (type: React.ComponentType<any>) => {
        return Children.toArray(children).filter(
            child => isValidElement(child) && child.type === type
        ) as ReactElement[];
    };

    const titleElements = getChildrenByType(GanttTitle);
    const headerElements = getChildrenByType(GanttHeader);
    const currentDateMarkerElements = getChildrenByType(GanttCurrentDateMarker);
    const taskListElements = getChildrenByType(GanttTaskList);
    const timelineElements = getChildrenByType(GanttTimeline);
    const taskItemElements = getChildrenByType(GanttTaskItem);

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
        } else {
            console.warn("onTaskUpdate is not defined");
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

    const style: React.CSSProperties = {
        fontSize: fontSize || "inherit",
    };

    return (
        <div
            ref={containerRef}
            className="w-full bg-gantt-bg text-gantt-text rounded-xl shadow-lg overflow-hidden"
            style={style}
            data-testid="gantt-chart">
            <div className="p-6 border-b border-gantt-border">
                {/* Use custom title from children or default to prop */}
                {titleElements.length > 0 ? cloneElement(titleElements[0]) : <GanttTitle>{title}</GanttTitle>}
            </div>

            <div className="relative flex">
                {/* Use custom taskList from children or default to TaskList component */}
                {taskListElements.length > 0 ? (
                    React.cloneElement(taskListElements[0], {
                        tasks,
                        headerLabel,
                    } as React.ComponentProps<typeof TaskList>)
                ) : (
                    <TaskList tasks={tasks} headerLabel={headerLabel} />
                )}

                <div ref={scrollContainerRef} className="flex-grow overflow-x-auto">
                    <div className="min-w-max">
                        {/* Use custom timeline from children or default to Timeline component */}
                        {timelineElements.length > 0 ? (
                            React.cloneElement(timelineElements[0], {
                                months: months,
                                currentMonthIndex: currentMonthIndex,
                            } as React.ComponentProps<typeof Timeline>)
                        ) : (
                            <Timeline months={months} currentMonthIndex={currentMonthIndex} />
                        )}

                        <div className="relative">
                            {/* Use custom currentDateMarker or default TodayMarker */}
                            {showCurrentDateMarker &&
                                currentMonthIndex >= 0 &&
                                (currentDateMarkerElements.length > 0 ? (
                                    React.cloneElement(currentDateMarkerElements[0], {
                                        label: todayLabel,
                                    } as React.HTMLAttributes<HTMLElement>)
                                ) : (
                                    <TodayMarker
                                        currentMonthIndex={currentMonthIndex}
                                        height={getTotalHeight()}
                                        label={todayLabel}
                                        dayOfMonth={currentDay}
                                    />
                                ))}

                            {/* Render tasks - either from taskItems or using TaskRow component */}
                            {taskItemElements.length > 0 ? (
                                // Custom task items
                                <div className="relative">
                                    {taskItemElements.map((element, index) => {
                                        // Create a properly typed props object
                                        const elementProps = element.props as any;
                                        const taskId = elementProps?.task?.id;

                                        // Create new props with original props maintained
                                        const newProps = {
                                            ...elementProps,
                                            key: `custom-task-item-${index}`,
                                            isSelected: taskId ? selectedTaskIds.includes(taskId) : false,
                                            onSelect: handleTaskSelect,
                                            onClick: handleTaskClick,
                                            onDoubleClick: handleTaskDoubleClick,
                                        };

                                        // Clone with all props preserved
                                        return React.cloneElement(element, newProps);
                                    })}
                                </div>
                            ) : (
                                // Default task rows
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
