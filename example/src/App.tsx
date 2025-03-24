import React, { useState, useEffect } from "react";
import DemoBasic from "./DemoBasic";
import DemoCustomized from "./DemoCustomized";
import DemoViewModes from "./DemoViewModes";

const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("basic");

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    // Apply dark mode to the body element
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
            document.body.style.backgroundColor = "#1f2937";
            document.body.style.color = "#f9fafb";
        } else {
            document.body.classList.remove("dark");
            document.body.style.backgroundColor = "";
            document.body.style.color = "";
        }
    }, [darkMode]);

    // Scroll to section when changing
    useEffect(() => {
        const element = document.getElementById(`section-${activeSection}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [activeSection]);

    return (
        <div className="app-container">
            {/* Header */}
            <header className="app-header">
                <h1 className="app-title">React Modern Gantt</h1>
                <p className="app-subtitle">
                    A flexible, customizable Gantt chart component for React applications with drag-and-drop task
                    scheduling, dark mode support, progress tracking, and multiple view modes.
                </p>
            </header>

            {/* Dark Mode Toggle */}
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Section Navigation */}
            <nav className="section-nav">
                <div
                    className={`section-nav-link ${activeSection === "basic" ? "active" : ""}`}
                    onClick={() => setActiveSection("basic")}>
                    Basic Usage
                </div>
                <div
                    className={`section-nav-link ${activeSection === "viewmodes" ? "active" : ""}`}
                    onClick={() => setActiveSection("viewmodes")}>
                    View Modes
                </div>
                <div
                    className={`section-nav-link ${activeSection === "customized" ? "active" : ""}`}
                    onClick={() => setActiveSection("customized")}>
                    Customized Styling
                </div>
            </nav>

            {/* Demo Sections */}
            <div id="section-basic" className="demo-section">
                <h2 className="demo-title">Basic Usage</h2>
                <p className="demo-description">
                    This example demonstrates the default Gantt chart with minimal configuration. You can drag tasks to
                    reschedule them, resize them to change duration, and click on them to see details.
                </p>
                <DemoBasic darkMode={darkMode} />
            </div>

            <div id="section-viewmodes" className="demo-section">
                <h2 className="demo-title">View Modes</h2>
                <p className="demo-description">
                    React Modern Gantt supports multiple timeline scales including Day, Week, Month, Quarter, and Year
                    views. Toggle between different view modes to see how the chart adapts to different time frames.
                </p>
                <DemoViewModes darkMode={darkMode} />
            </div>

            <div id="section-customized" className="demo-section">
                <h2 className="demo-title">Customized Styling & Interactions</h2>
                <p className="demo-description">
                    This example showcases the powerful customization options available. Tasks have custom rendering
                    based on their state (completed, dependent, selected), custom tooltips, and dynamic coloring. Click
                    on a task to see it highlighted in yellow.
                </p>
                <DemoCustomized darkMode={darkMode} />
            </div>
        </div>
    );
};

export default App;
