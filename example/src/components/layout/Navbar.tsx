import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { MenuIcon, XIcon, SearchIcon } from "lucide-react";
import { BarChartIcon } from "lucide-react";

const Navbar: React.FC = () => {
    const { darkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav
            className={`sticky top-0 z-50 ${
                darkMode ? "bg-gray-900" : "bg-white"
            } shadow-md transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <BarChartIcon className={`h-8 w-8 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                            <span className={`ml-2 text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                React Modern Gantt
                            </span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive("/")
                                        ? `${
                                              darkMode
                                                  ? "border-indigo-400 text-indigo-300"
                                                  : "border-indigo-500 text-indigo-700"
                                          }`
                                        : `${
                                              darkMode
                                                  ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-200"
                                                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                          }`
                                }`}>
                                Home
                            </Link>
                            <Link
                                to="/components"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive("/components")
                                        ? `${
                                              darkMode
                                                  ? "border-indigo-400 text-indigo-300"
                                                  : "border-indigo-500 text-indigo-700"
                                          }`
                                        : `${
                                              darkMode
                                                  ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-200"
                                                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                          }`
                                }`}>
                                Components
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="max-w-lg w-full lg:max-w-xs ml-4 hidden sm:block">
                            <label htmlFor="search" className="sr-only">
                                Search
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="search"
                                    name="search"
                                    className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 ${
                                        darkMode
                                            ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500"
                                            : "bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                                    }`}
                                    placeholder="Search docs"
                                    type="search"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <ThemeToggle className="ml-3" />

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={toggleMenu}
                                className={`p-2 rounded-md ${
                                    darkMode
                                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                                aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? (
                                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className={`pt-2 pb-3 space-y-1 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                        <Link
                            to="/"
                            className={`block pl-3 pr-4 py-2 text-base font-medium ${
                                isActive("/")
                                    ? `${
                                          darkMode
                                              ? "bg-gray-800 text-indigo-300 border-l-4 border-indigo-400"
                                              : "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                                      }`
                                    : `${
                                          darkMode
                                              ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                      }`
                            }`}
                            onClick={() => setIsOpen(false)}>
                            Home
                        </Link>
                        <Link
                            to="/components"
                            className={`block pl-3 pr-4 py-2 text-base font-medium ${
                                isActive("/components")
                                    ? `${
                                          darkMode
                                              ? "bg-gray-800 text-indigo-300 border-l-4 border-indigo-400"
                                              : "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                                      }`
                                    : `${
                                          darkMode
                                              ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                      }`
                            }`}
                            onClick={() => setIsOpen(false)}>
                            Components
                        </Link>
                        <div className="px-2 pt-2 pb-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 ${
                                        darkMode
                                            ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500"
                                            : "bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                                    }`}
                                    placeholder="Search docs"
                                    type="search"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
