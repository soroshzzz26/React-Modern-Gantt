import React, { useRef, useEffect, useState } from "react";
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
const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ activeMode, onChange, darkMode, availableModes }) => {
    // Default view modes
    const defaultViewModes = [
        { id: ViewMode.DAY, label: "Day" },
        { id: ViewMode.WEEK, label: "Week" },
        { id: ViewMode.MONTH, label: "Month" },
        { id: ViewMode.QUARTER, label: "Quarter" },
        { id: ViewMode.YEAR, label: "Year" },
    ];

    // Filter view modes based on availableModes prop if provided
    const viewModes = availableModes
        ? defaultViewModes.filter(mode => availableModes.includes(mode.id))
        : defaultViewModes;

    const containerRef = useRef<HTMLDivElement>(null);
    const [highlightStyle, setHighlightStyle] = useState({ left: "0px", width: "0px" });

    useEffect(() => {
        const updateHighlightStyle = () => {
            if (containerRef.current) {
                const activeButton = containerRef.current.querySelector(`[aria-selected="true"]`);
                if (activeButton) {
                    const { offsetLeft, offsetWidth } = activeButton as HTMLElement;
                    setHighlightStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` });
                }
            }
        };

        updateHighlightStyle();
        window.addEventListener("resize", updateHighlightStyle);
        return () => window.removeEventListener("resize", updateHighlightStyle);
    }, [activeMode]);

    const containerClass = `
        relative inline-flex rounded-full p-0.5
        ${darkMode ? "bg-gray-800/80" : "bg-gray-100/90"}
        transition-all duration-300 ease-in-out shadow-sm
        border ${darkMode ? "border-gray-700" : "border-gray-200"}
    `;

    const tabClass = (isActive: boolean) => `
        relative z-10 px-3 py-1 text-xs font-medium
        transition-all duration-200 ease-in-out
        ${
            isActive
                ? "text-white"
                : darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
        }
        focus:outline-none
    `;

    return (
        <div className="relative flex items-center">
            <div ref={containerRef} className={containerClass} role="tablist" aria-label="View mode options">
                <span
                    className={`
                        absolute z-0 inset-0.5 rounded-full
                        transition-all duration-300 ease-out transform
                        ${darkMode ? "bg-indigo-600" : "bg-indigo-500"}
                    `}
                    style={highlightStyle}
                    aria-hidden="true"
                />

                {viewModes.map(mode => (
                    <button
                        key={mode.id}
                        role="tab"
                        aria-selected={activeMode === mode.id}
                        aria-controls={`panel-${mode.id}`}
                        className={`${tabClass(activeMode === mode.id)} rounded-full`}
                        onClick={() => onChange(mode.id)}>
                        {mode.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ViewModeSelector;
