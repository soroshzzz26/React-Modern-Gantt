import React from "react";
import { TimelineProps } from "../utils/types";
/**
 * Timeline Component with hierarchical display
 *
 * Displays time headers for the Gantt chart based on the current view mode
 * Now supports a hierarchical display with two levels:
 * - Top level: Months/Years/Quarters
 * - Bottom level: Days/Weeks when appropriate
 */
declare const Timeline: React.FC<TimelineProps>;
export default Timeline;
