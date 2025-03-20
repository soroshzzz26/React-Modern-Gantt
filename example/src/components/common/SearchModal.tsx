import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import {
    Command,
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
    CommandEmpty,
} from "../../components/ui/command";

// Structure containing searchable components
interface SearchItem {
    id: string;
    title: string;
    path: string;
    category: string;
    description: string;
}

// Component sections data
const searchItems: SearchItem[] = [
    {
        id: "gantt-chart",
        title: "GanttChart Component",
        path: "/components#gantt-chart",
        category: "Components",
        description: "Main component for rendering a Gantt chart",
    },
    {
        id: "task-interfaces",
        title: "Task Interfaces",
        path: "/components#task-interfaces",
        category: "API",
        description: "Interfaces for structuring task data",
    },
    {
        id: "props",
        title: "Core Props",
        path: "/components#props",
        category: "API",
        description: "Core props for the GanttChart component",
    },
    {
        id: "events",
        title: "Event Handlers",
        path: "/components#events",
        category: "API",
        description: "Event handlers for the GanttChart component",
    },
    {
        id: "view-modes",
        title: "View Modes",
        path: "/components#view-modes",
        category: "Features",
        description: "Different timeline view modes (day, week, month, quarter, year)",
    },
    {
        id: "customization",
        title: "Customization",
        path: "/components#customization",
        category: "Features",
        description: "Customize the appearance of the Gantt chart",
    },
    {
        id: "examples",
        title: "Code Examples",
        path: "/components#examples",
        category: "Examples",
        description: "Complete code examples",
    },
    {
        id: "installation",
        title: "Installation",
        path: "/#installation",
        category: "Getting Started",
        description: "Installation instructions",
    },
];

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // Handle escape key press to close modal
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    // Handle item selection
    const handleSelect = (item: SearchItem) => {
        onClose();
        navigate(item.path);

        // Scroll to the section if it's a hash link
        if (item.path.includes("#")) {
            setTimeout(() => {
                const sectionId = item.path.split("#")[1];
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`sm:max-w-2xl ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white"}`}>
                <DialogHeader>
                    <DialogTitle className={darkMode ? "text-white" : "text-gray-900"}>
                        Search Documentation
                    </DialogTitle>
                </DialogHeader>

                <Command className={darkMode ? "bg-gray-900" : "bg-white"}>
                    <CommandInput
                        placeholder="Type to search..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        className={darkMode ? "border-gray-700 text-white" : "border-gray-200"}
                    />

                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>

                        {["Getting Started", "Components", "API", "Features", "Examples"].map(category => {
                            const categoryItems = searchItems.filter(
                                item =>
                                    item.category === category &&
                                    (searchQuery === "" ||
                                        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
                            );

                            if (categoryItems.length === 0) return null;

                            return (
                                <CommandGroup key={category} heading={category}>
                                    {categoryItems.map(item => (
                                        <CommandItem
                                            key={item.id}
                                            value={item.id}
                                            onSelect={() => handleSelect(item)}
                                            className="flex flex-col items-start">
                                            <div className="text-base font-medium">{item.title}</div>
                                            <div className="text-sm text-gray-500">{item.description}</div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            );
                        })}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};

export default SearchModal;
