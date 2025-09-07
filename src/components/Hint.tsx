import React from 'react'
import {TooltipProvider, Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
interface HintProps {
    children: React.ReactNode;
    text: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end'
}

const Hint = ({children, text, side, align}: HintProps) => {

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild={true}>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                        <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
export default Hint
