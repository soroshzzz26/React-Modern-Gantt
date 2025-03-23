import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Expliziter Import des CSS für die Gantt-Komponente
import "react-modern-gantt/dist/index.css";

// Render the demo app
createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
