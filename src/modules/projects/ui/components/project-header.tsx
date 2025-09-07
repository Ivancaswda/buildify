import React from 'react'
import Link from "next/link";
import {useTheme} from "next-themes";
import {useSuspenseQuery} from "@tanstack/react-query";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useTRPC} from "@/trpc/client";
import {Button} from "@/components/ui/button";
import {ChevronDownIcon, ChevronLeftIcon, SunMoonIcon} from "lucide-react";

interface Props {
    projectId: string
}

const ProjectHeader = ({projectId}: Props) => {
    const trpc = useTRPC()
    const {data: project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({id: projectId}))

    const {setTheme, theme} = useTheme()

    return (
        <header className='p-2 flex justify-between items-center border-b'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild={true}>
                    <Button variant='ghost' size='sm' className='focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!'>
                        <Image src='/logo.png' alt='logo' className='object-cover rounded-lg' width={28} height={28}/>
                        <span className='text-sm font-medium'>{project.name}</span>
                        <ChevronDownIcon/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild={true}>
                        <Link href='/' >
                            <ChevronLeftIcon/>
                            <span>
                               На панель управления
                            </span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='gap-2'>
                                <SunMoonIcon/>
                            <span>Темы</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    <DropdownMenuRadioItem value='light' >
                                        <span>Светлая</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='dark' >
                                         <span>Темная</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='system' >
                                         <span>Системная</span>
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
export default ProjectHeader
