import React from "react";
import { Person, GanttTheme } from "../models";
export interface NameListProps {
    people: Person[];
    headerLabel?: string;
    showAvatar?: boolean;
    showTaskCount?: boolean;
    theme?: GanttTheme;
}
/**
 * NameList Component
 *
 * Displays the list of people/resources on the left side of the Gantt chart
 */
declare const NameList: React.FC<NameListProps>;
export default NameList;
