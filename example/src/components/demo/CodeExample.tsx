import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import CodeBlock from "../common/CodeBlock";

// Import shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

interface CodeExampleProps {
    title: string;
    description?: string;
    code: string;
    language: string;
    demoComponent?: React.ReactNode; // Optional demo component
    showCopyButton?: boolean;
}

const CodeExample: React.FC<CodeExampleProps> = ({
    title,
    description,
    code,
    language,
    demoComponent,
    showCopyButton = true,
}) => {
    const { darkMode } = useTheme();
    const [showCode, setShowCode] = useState(true);

    // If no demo component is provided, just show the code example
    if (!demoComponent) {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                    <CardHeader
                        className={`pb-2 ${darkMode ? "border-b border-gray-700" : "border-b border-gray-200"}`}>
                        <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>{title}</CardTitle>
                        {description && (
                            <CardDescription className={darkMode ? "text-gray-400" : "text-gray-500"}>
                                {description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-1">
                            <CodeBlock code={code} language={language} showLineNumbers={true} />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    // If a demo component is provided, show both code and demo in tabs
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <CardHeader className={darkMode ? "border-b border-gray-700" : "border-b border-gray-200"}>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>{title}</CardTitle>
                            {description && (
                                <CardDescription className={darkMode ? "text-gray-400" : "text-gray-500"}>
                                    {description}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs defaultValue="demo" className="w-full">
                        <div className={`px-4 py-2 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                            <TabsList className={darkMode ? "bg-gray-800" : "bg-gray-200"}>
                                <TabsTrigger value="demo">Demo</TabsTrigger>
                                <TabsTrigger value="code">Code</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="demo" className="p-4">
                            {demoComponent}
                        </TabsContent>

                        <TabsContent value="code" className="p-0">
                            <div className={darkMode ? "bg-gray-900" : "bg-white"}>
                                <CodeBlock code={code} language={language} showLineNumbers={true} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CodeExample;
