import React from "react";
interface TodayMarkerProps {
    currentMonthIndex: number;
    height: number;
    label?: string;
    dayOfMonth?: number;
}
/**
 * TodayMarker Component
 *
 * Displays a vertical line indicating the current date
 */
declare const TodayMarker: React.FC<TodayMarkerProps>;
export default TodayMarker;
