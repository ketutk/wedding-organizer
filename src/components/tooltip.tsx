import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface CustomTooltipProps {
  trigger: ReactNode;
  content: ReactNode;
}

export function CustomTooltip({ trigger, content }: CustomTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Usage Example:
// <CustomTooltip
//   trigger={<Button variant="outline">Hover</Button>}
//   content={<p>Add to library</p>}
// />
