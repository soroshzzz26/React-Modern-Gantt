"use client";

import React, { useRef, useEffect, useState } from "react";
import NameList from "./NameList";
import Timeline from "./Timeline";
import TaskRow from "./TaskRow";

interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
}

interface Person {
    name: string;
    tasks: Task[];
}

const initialPeople: Person[] = [
    {
        name: "Alice Johnson",
        tasks: [
            {
                id: "AJ-1",
                name: "Project A",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 3, 15),
                color: "bg-emerald-500",
            },
            {
                id: "AJ-2",
                name: "Project B",
                startDate: new Date(2023, 4, 1),
                endDate: new Date(2023, 7, 30),
                color: "bg-violet-500",
            },
            {
                id: "AJ-3",
                name: "Project C",
                startDate: new Date(2023, 8, 1),
                endDate: new Date(2023, 11, 31),
                color: "bg-yellow-500",
            },
            {
                id: "AJ-4",
                name: "Project D",
                startDate: new Date(2024, 0, 1),
                endDate: new Date(2024, 5, 30),
                color: "bg-blue-500",
            },
            {
                id: "AJ-5",
                name: "Project E",
                startDate: new Date(2024, 6, 1),
                endDate: new Date(2024, 11, 31),
                color: "bg-red-500",
            },
        ],
    },
    {
        name: "Bob Smith",
        tasks: [
            {
                id: "BS-1",
                name: "Task X",
                startDate: new Date(2023, 1, 1),
                endDate: new Date(2023, 4, 15),
                color: "bg-orange-500",
            },
            {
                id: "BS-2",
                name: "Task Y",
                startDate: new Date(2023, 5, 1),
                endDate: new Date(2023, 9, 30),
                color: "bg-pink-500",
            },
            {
                id: "BS-3",
                name: "Task Z",
                startDate: new Date(2023, 10, 1),
                endDate: new Date(2024, 2, 31),
                color: "bg-cyan-500",
            },
            {
                id: "BS-4",
                name: "Task W",
                startDate: new Date(2024, 3, 1),
                endDate: new Date(2024, 7, 31),
                color: "bg-indigo-500",
            },
            {
                id: "BS-5",
                name: "Task V",
                startDate: new Date(2024, 8, 1),
                endDate: new Date(2024, 11, 31),
                color: "bg-teal-500",
            },
        ],
    },
    {
        name: "Charlie Brown",
        tasks: [
            {
                id: "CB-1",
                name: "Initiative 1",
                startDate: new Date(2023, 2, 1),
                endDate: new Date(2023, 5, 30),
                color: "bg-green-500",
            },
            {
                id: "CB-2",
                name: "Initiative 2",
                startDate: new Date(2023, 6, 1),
                endDate: new Date(2023, 10, 31),
                color: "bg-purple-500",
            },
            {
                id: "CB-3",
                name: "Initiative 3",
                startDate: new Date(2023, 11, 1),
                endDate: new Date(2024, 3, 31),
                color: "bg-yellow-600",
            },
            {
                id: "CB-4",
                name: "Initiative 4",
                startDate: new Date(2024, 4, 1),
                endDate: new Date(2024, 8, 31),
                color: "bg-blue-600",
            },
            {
                id: "CB-5",
                name: "Initiative 5",
                startDate: new Date(2024, 9, 1),
                endDate: new Date(2024, 11, 31),
                color: "bg-red-600",
            },
        ],
    },
];

const generateDates = (startDate: Date, endDate: Date) => {
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(currentDate.toLocaleString("default", { month: "short", year: "numeric" }).toUpperCase());
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return dates;
};

export function RoadmapGantt() {
    const [people, setPeople] = useState<Person[]>(initialPeople);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollLeft, setScrollLeft] = useState(0);

    const startDate = new Date(2023, 0, 1); // January 1, 2023
    const endDate = new Date(2024, 11, 31); // December 31, 2024
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const dates = generateDates(startDate, endDate);

    const currentDate = new Date(2023, 5, 5); // June 5, 2023

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setScrollLeft(scrollContainerRef.current.scrollLeft);
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    const handleTaskUpdate = (personName: string, updatedTask: Task) => {
        setPeople(prevPeople =>
            prevPeople.map(person =>
                person.name === personName
                    ? {
                          ...person,
                          tasks: person.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
                      }
                    : person
            )
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Team Roadmap (2023-2024)</h2>
            <div className="flex border border-gray-200 rounded-lg">
                <NameList people={people} />
                <Timeline
                    people={people}
                    dates={dates}
                    startDate={startDate}
                    endDate={endDate}
                    totalDays={totalDays}
                    onTaskUpdate={handleTaskUpdate}
                    scrollContainerRef={scrollContainerRef}>
                    {people.map(person => (
                        <TaskRow
                            key={person.name}
                            person={person}
                            startDate={startDate}
                            endDate={endDate}
                            totalDays={totalDays}
                            onTaskUpdate={handleTaskUpdate}
                        />
                    ))}
                </Timeline>
            </div>
            <div className="relative mt-4">
                <div
                    className="absolute w-px h-full bg-orange-500"
                    style={{
                        left: `${
                            ((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) / totalDays) * 100
                        }%`,
                        transform: `translateX(-${scrollLeft}px)`,
                    }}></div>
            </div>
        </div>
    );
}
