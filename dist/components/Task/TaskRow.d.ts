import React from "react";
import { Person, Task } from "../../models";
interface TaskRowProps {
    person: Person;
    startDate: Date;
    endDate: Date;
    totalMonths: number;
    monthWidth: number;
    editMode?: boolean;
    onTaskUpdate?: (personId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, person: Person) => void;
}
/**
 * TaskRow Component
 *
 * Displays and manages the tasks for a single person
 */
declare const TaskRow: React.FC<TaskRowProps>;
export default TaskRow;
