import React from "react";
import { TooltipRenderProps } from "../utils/types";
import { TooltipProps } from "../utils/types";
/**
 *  Tooltip Component
 *
 * Displays a tooltip with task information
 * Adapts date display based on view mode
 * Now supports custom rendering
 */
declare const Tooltip: React.FC<TooltipProps & {
    renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
}>;
export default Tooltip;
