import React from "react";
import { TooltipRenderProps } from "@/types";
import { TooltipProps } from "@/types";
/**
 * Tooltip Component - Shows task information on hover
 */
declare const Tooltip: React.FC<TooltipProps & {
    renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
}>;
export default Tooltip;
