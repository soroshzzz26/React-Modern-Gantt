import React from "react";
interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
    percent?: number;
}
interface Person {
    id: string;
    name: string;
    tasks: Task[];
}
interface TaskRowProps {
    person: Person;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    onTaskUpdate: (personId: string, updatedTask: Task) => void;
    editMode?: boolean;
}
export default function TaskRow({ person, startDate, endDate, totalDays, onTaskUpdate, editMode, }: TaskRowProps): React.JSX.Element;
export {};
