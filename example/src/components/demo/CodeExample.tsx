import React, { useState } from "react";
import CodeBlock from "../common/CodeBlock";
import { useTheme } from "../../context/ThemeContext";

interface CodeExampleProps {
    title: string;
    description?: string;
    code: string;
    language: string;
    showCopyButton?: boolean;
}

const CodeExample: React.FC<CodeExampleProps> = ({ title, description, code, language, showCopyButton = true }) => {
    const { darkMode } = useTheme();
    const [showCode, setShowCode] = useState(true);

    return (
        <div className={`mb-8 rounded-lg overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div
                className={`px-4 py-3 ${darkMode ? "bg-gray-800" : "bg-gray-50"} border-b ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                }`}>
                <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h3>
                    <button
                        onClick={() => setShowCode(!showCode)}
                        className={`px-3 py-1 text-sm rounded ${
                            darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}>
                        {showCode ? "Hide Code" : "Show Code"}
                    </button>
                </div>
                {description && (
                    <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{description}</p>
                )}
            </div>

            {showCode && (
                <div className={`${darkMode ? "bg-gray-900" : "bg-white"}`}>
                    <CodeBlock code={code} language={language} showLineNumbers={true} />
                </div>
            )}
        </div>
    );
};

export default CodeExample;
