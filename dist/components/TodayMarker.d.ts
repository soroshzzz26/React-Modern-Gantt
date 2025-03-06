import React from "react";
interface TodayMarkerProps {
    currentMonthIndex: number;
    height: number;
    markerClass?: string;
    label?: string;
}
/**
 * TodayMarker Component
 *
 * Displays a vertical line indicating the current date
 */
declare const TodayMarker: React.FC<TodayMarkerProps>;
export default TodayMarker;
