import React from "react";
interface TodayMarkerProps {
    currentMonthIndex: number;
    height: number;
    label?: string;
    dayOfMonth?: number;
    className?: string;
}
/**
 * TodayMarker Component
 *
 * Displays a vertical line indicating the current date
 * Can be positioned at a specific day of month
 */
declare const TodayMarker: React.FC<TodayMarkerProps>;
export default TodayMarker;
