import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "q/lib/utils";

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardref<
React.ElementRef<typeof AccordionPrimitive.item>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn("border-b",
        className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) =>(
    <AccordionPrimitive.Header classname="flex">
        <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex flex-1 items-center justiffy-between py-4 text-sm font-medium cusor-pointer transaction-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
            className,
        )}
        {..props}
        >
            {children}
            <ChevronDown classname="h-4 w-4 shrink-0 text-muted-foreground transition-transform duratioin-200" />
            
    </AccordionPrimitive.Header>
))