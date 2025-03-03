import React from "react";
import { Person, Task } from "../models";
interface TaskEditorProps {
    people: Person[];
    startDate: Date;
    endDate: Date;
    onTaskUpdate?: (personId: string, updatedTask: Task) => void;
}
/**
 * TaskEditor Component
 *
 * Adds drag & drop edit capabilities to the GanttChart
 */
declare const TaskEditor: React.FC<TaskEditorProps>;
export default TaskEditor;
