import React from "react";
import { TimelineProps } from "../utils/types";
/**
 * Timeline Component
 *
 * Displays the time headers for the Gantt chart based on the current view mode
 * Supports day, week, month, quarter, and year view modes
 * Always shows the year for better context
 */
declare const Timeline: React.FC<TimelineProps>;
export default Timeline;
