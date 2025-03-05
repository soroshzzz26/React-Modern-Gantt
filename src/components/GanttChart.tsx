import React, { useRef } from "react";
import {
    GanttChartProps,
    DEFAULT_THEME,
    Person,
    Task,
    getMonthsBetween,
    detectTaskOverlaps,
    findEarliestDate,
    findLatestDate,
} from "../models";
import TaskRow from "./Task/TaskRow";
import Timeline from "./Timeline";
import TodayMarker from "./TodayMarker";
import NameList from "./NameList";

/**
 * GanttChart Component
 *
 * A simple, month-based Gantt chart for project timelines
 */
const GanttChart: React.FC<GanttChartProps> = ({
    people = [],
    startDate: customStartDate,
    endDate: customEndDate,
    title = "Project Timeline",
    currentDate = new Date(),
    showCurrentDateMarker = true,
    todayLabel = "Today",
    editMode = true,
    theme = DEFAULT_THEME,
    headerLabel = "Resource",
    showProgress = false,
    onTaskUpdate,
    onTaskClick,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const validPeople = Array.isArray(people) ? people : [];

    const derivedStartDate = customStartDate || findEarliestDate(validPeople);
    const derivedEndDate = customEndDate || findLatestDate(validPeople);

    const months = getMonthsBetween(derivedStartDate, derivedEndDate);
    const totalMonths = months.length;

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = months.findIndex(
        month => month.getMonth() === currentMonth && month.getFullYear() === currentYear
    );

    const getTotalHeight = () => {
        let height = 0;
        validPeople.forEach(person => {
            if (person && Array.isArray(person.tasks)) {
                const taskRows = detectTaskOverlaps(person.tasks);
                height += Math.max(60, taskRows.length * 40 + 20);
            } else {
                height += 60;
            }
        });
        return height;
    };

    const handleTaskUpdate = (personId: string, updatedTask: Task) => {
        if (onTaskUpdate) {
            try {
                const ensuredTask = {
                    ...updatedTask,
                    startDate:
                        updatedTask.startDate instanceof Date ? updatedTask.startDate : new Date(updatedTask.startDate),
                    endDate: updatedTask.endDate instanceof Date ? updatedTask.endDate : new Date(updatedTask.endDate),
                };

                onTaskUpdate(personId, ensuredTask);
            } catch (error) {
                console.error("Error in handleTaskUpdate:", error);
            }
        } else {
            console.warn("onTaskUpdate is not defined");
        }
    };

    const handleTaskClick = (task: Task, person: Person) => {
        if (onTaskClick) {
            try {
                onTaskClick(task, person);
            } catch (error) {
                console.error("Error in handleTaskClick:", error);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
            data-testid="gantt-chart">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>

            <div className="relative flex">
                <NameList people={validPeople} headerLabel={headerLabel} theme={theme} />

                <div ref={scrollContainerRef} className="flex-grow overflow-x-auto">
                    <div className="min-w-max">
                        <Timeline months={months} currentMonthIndex={currentMonthIndex} theme={theme} />

                        <div className="relative">
                            {showCurrentDateMarker && currentMonthIndex >= 0 && (
                                <TodayMarker
                                    currentMonthIndex={currentMonthIndex}
                                    height={getTotalHeight()}
                                    markerClass={theme.todayMarkerColor}
                                    label={todayLabel}
                                />
                            )}

                            {validPeople.map(person => {
                                if (!person || !person.id) return null;

                                return (
                                    <TaskRow
                                        key={`task-row-${person.id}`}
                                        person={person}
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
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
