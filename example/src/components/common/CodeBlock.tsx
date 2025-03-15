import React, { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import { useTheme } from "../../context/ThemeContext";
import { ClipboardIcon, ClipboardCheckIcon } from "lucide-react";

interface CodeBlockProps {
    code: string;
    language: string;
    showLineNumbers?: boolean;
    caption?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, showLineNumbers = true, caption }) => {
    const { darkMode } = useTheme();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Highlight code when component mounts or when code/language changes
        Prism.highlightAll();
    }, [code, language, darkMode]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative my-6">
            {caption && (
                <div
                    className={`px-4 py-2 text-sm font-medium ${
                        darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                    } rounded-t-lg border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    {caption}
                </div>
            )}
            <div className={`relative rounded-lg ${caption ? "rounded-t-none" : ""} overflow-hidden`}>
                <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                    aria-label="Copy code">
                    {copied ? <ClipboardCheckIcon className="h-5 w-5" /> : <ClipboardIcon className="h-5 w-5" />}
                </button>
                <pre
                    className={`${showLineNumbers ? "line-numbers" : ""} ${
                        darkMode ? "bg-gray-900" : "bg-gray-50"
                    } p-4 overflow-x-auto`}>
                    <code className={`language-${language}`}>{code}</code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
