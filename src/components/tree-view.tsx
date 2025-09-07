import React from 'react'
import {TreeItem} from "@/types";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroupContent,
    SidebarGroup,
    SidebarGroupAction,
    SidebarProvider, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarRail
} from "@/components/ui/sidebar";
import {ChevronRight, FileIcon, Folder, FolderIcon} from "lucide-react";
import {CollapseIcon} from "next/dist/client/components/react-dev-overlay/ui/icons/collapse-icon";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Chevron} from "react-day-picker";

interface TreeViewProps {
    data: TreeItem[]
    value?: string | null
    onSelect: (value: string) => void;
}

export const TreeView = ({data, value, onSelect}: TreeViewProps) => {



    return (
        <SidebarProvider>
            <Sidebar collapsible='none' className='w-full'>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {data.map((item, index) => (
                                    <Tree item={item}
                                          onSelect={onSelect}
                                          selectedValue={value}
                                          key={index}
                                          parentPath='' />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail/>
            </Sidebar>
        </SidebarProvider>
    )
}

interface TreeProps {
    item: TreeItem,
    selectedValue?: string | null,
    onSelect?: (value: string) => void
    parentPath: string
}
const Tree = ({item, selectedValue, onSelect, parentPath}: TreeProps) => {
    const [name, ...items] = Array.isArray(item) ? item : [item];
    const currentPath = parentPath ? `${parentPath}/${name}` : name;
    if (!items.length) {
        const isSelected = selectedValue === currentPath;


        return (
            <SidebarMenuButton isActive={isSelected} className='data-[active=true]:bg-transparent'
            onClick={() => onSelect?.(currentPath)}
            >
                <FileIcon/>
                <span className='truncate'>
                    {name}
                </span>

            </SidebarMenuButton>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible className='group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90'>
                <CollapsibleTrigger asChild={true}>
                    <SidebarMenuButton>
                        <ChevronRight className='transition-transform'/>
                        <FolderIcon/>
                        <span className='truncate'>
                            {name}
                        </span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((subItem, index) => (
                            <Tree item={subItem} parentPath={currentPath}
                                key={index} onSelect={onSelect} selectedValue={selectedValue}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>

        </SidebarMenuItem>
    )
}

