import React, { ReactNode } from "react";

interface TimelineProps {
    people: any[];
    dates: string[];
    startDate: Date;
    endDate: Date;
    totalDays: number;
    onTaskUpdate: (personName: string, updatedTask: any) => void;
    children: ReactNode;
    scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export default function Timeline({
    people,
    dates,
    startDate,
    endDate,
    totalDays,
    onTaskUpdate,
    children,
    scrollContainerRef,
}: TimelineProps) {
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getDaysForMonth = (month: number, year: number) => {
        const daysInMonth = getDaysInMonth(year, month);
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            if (i % 7 === 1 || i === 1 || i === daysInMonth) {
                days.push(i);
            }
        }
        return days;
    };

    if (!people) {
        return <div className="flex-grow">No data available</div>;
    }

    return (
        <div className="flex-grow overflow-x-auto" ref={scrollContainerRef}>
            <div className="inline-block min-w-full">
                <div
                    className="grid border-b"
                    style={{ gridTemplateColumns: `repeat(${dates.length}, minmax(200px, 1fr))` }}>
                    {dates.map((date, index) => {
                        const currentYear = startDate.getFullYear() + Math.floor((startDate.getMonth() + index) / 12);
                        const currentMonth = (startDate.getMonth() + index) % 12;
                        return (
                            <div key={date} className="border-r border-gray-200">
                                <div className="flex h-12 items-center justify-center bg-gray-50">
                                    <p className="font-semibold">{date}</p>
                                </div>
                                <div className="flex h-12 items-center justify-between bg-gray-50 px-2 text-xs text-gray-500">
                                    {getDaysForMonth(currentMonth, currentYear).map(day => (
                                        <span key={`${currentMonth}-${day}`}>{day}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="relative">{children}</div>
            </div>
        </div>
    );
}
