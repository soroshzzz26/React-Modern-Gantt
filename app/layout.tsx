import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Gantt Chart",
    description: "A Gantt chart is a type of bar chart that illustrates a project schedule.",
};
export const dynamic = "force-dynamic";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <html lang="en">
                <body>{children}</body>
            </html>
        </>
    );
}
