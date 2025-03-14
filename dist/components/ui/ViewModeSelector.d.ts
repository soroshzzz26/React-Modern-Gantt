import React from "react";
import { ViewMode } from "@/types";
interface ViewModeSelectorProps {
    activeMode: ViewMode;
    onChange: (mode: ViewMode) => void;
    darkMode: boolean;
    availableModes?: ViewMode[];
}
/**
 * ViewModeSelector Component - Allows switching between different timeline views
 */
declare const ViewModeSelector: React.FC<ViewModeSelectorProps>;
export default ViewModeSelector;
