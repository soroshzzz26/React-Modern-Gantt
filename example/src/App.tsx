import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ComponentsPage from "./pages/ComponentsPage";
import "./App.css";

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/components" element={<ComponentsPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;
