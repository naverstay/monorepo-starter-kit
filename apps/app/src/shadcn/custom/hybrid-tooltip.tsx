import { type PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/shadcn/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/shadcn/ui/popover";
import type { TooltipContentProps, TooltipProps, TooltipProviderProps, TooltipTriggerProps } from "@radix-ui/react-tooltip";
import type { PopoverContentProps, PopoverProps, PopoverTriggerProps } from "@radix-ui/react-popover";

const TouchContext = createContext<boolean | undefined>(undefined);
const useTouch = () => useContext(TouchContext);

const TouchProvider = (props: PropsWithChildren) => {
  const [isTouch, setTouch] = useState<boolean>();

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return <TouchContext.Provider value={isTouch} {...props} />;
};

const HybridTooltipProvider = (props: TooltipProviderProps) => {
  return <TooltipProvider delayDuration={0} {...props} />;
};

const HybridTooltip = (props: TooltipProps & PopoverProps) => {
  const isTouch = useTouch();

  return isTouch ? <Popover {...props} /> : <Tooltip {...props} />;
};

const HybridTooltipTrigger = (props: TooltipTriggerProps & PopoverTriggerProps) => {
  const isTouch = useTouch();

  return isTouch ? <PopoverTrigger {...props} /> : <TooltipTrigger {...props} />;
};

const HybridTooltipContent = (props: TooltipContentProps & PopoverContentProps) => {
  const isTouch = useTouch();

  return isTouch ? <PopoverContent {...props} /> : <TooltipContent {...props} />;
};

export { TouchProvider, HybridTooltipProvider, HybridTooltip, HybridTooltipTrigger, HybridTooltipContent };
