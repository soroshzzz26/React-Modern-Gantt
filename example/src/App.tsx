import React, { useState, useEffect } from "react";
import DemoBasic from "./DemoBasic";
import DemoCustomized from "./DemoCustomized";
import DemoViewModes from "./DemoViewModes";

const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);

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

    return (
        <div>
            {/* Header */}
            <header>
                <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>React Modern Gantt Demo</h1>
                <p style={{ marginBottom: "2rem", opacity: 0.8 }}>
                    Interactive demos showcasing the capabilities of the React Modern Gantt component.
                </p>
            </header>

            {/* Dark Mode Toggle */}
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Demo Sections */}
            <div className="demo-section">
                <h2 className="demo-title">Basic Usage</h2>
                <DemoBasic darkMode={darkMode} />
            </div>

            <div className="demo-section">
                <h2 className="demo-title">View Modes</h2>
                <DemoViewModes darkMode={darkMode} />
            </div>

            <div className="demo-section">
                <h2 className="demo-title">Customized Styling & Interactions</h2>
                <DemoCustomized darkMode={darkMode} />
            </div>
        </div>
    );
};

export default App;
