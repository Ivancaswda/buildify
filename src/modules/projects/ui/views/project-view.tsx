'use client'
import {Button} from "@/components/ui/button";
import React, {Suspense, useState} from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Fragment} from "@/generated/prisma";
import MessagesContainer from "@/modules/projects/ui/components/messages-container";
import ProjectHeader from "@/modules/projects/ui/components/project-header";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import FragmentWeb from "@/modules/projects/ui/components/fragment-web";
import {CodeIcon, CrownIcon, EyeIcon, FoldersIcon, Loader2Icon, LogOut} from "lucide-react";
import Link from "next/link";
import CodeView from "@/components/code-view";
import FileExplorer from "@/components/file-explorer";
import {LoaderThree} from "@/components/ui/loader";
import Image from "next/image";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/use-auth";
import {Skeleton} from "@/components/ui/skeleton";

interface Props {
    projectId: string,

}

const ProjectView = ({projectId}: Props) => {
    const router = useRouter()
    const {user, logout}  = useAuth()
    console.log(projectId)
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
    const [tabState, setTabState] = useState<'preview' | 'code'>('preview')
    return (
        <div className="h-screen bg-background">
            <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg border shadow-sm"
            >

                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className="flex flex-col min-h-0"
                >
                    <Suspense fallback={<div className='flex items-center w-full h-full justify-center flex-col gap-4 '>
                        <Loader2Icon className='text-primary animate-spin'/>
                    </div>}>
                        <ProjectHeader projectId={projectId} />
                    </Suspense>

                    <Suspense fallback={<div className='flex items-center w-full h-full justify-center flex-col gap-4 '>
                        <Loader2Icon className='text-primary animate-spin'/>
                    </div>}>
                        <MessagesContainer
                            setActiveFragment={setActiveFragment}
                            activeFragment={activeFragment}
                            projectId={projectId}
                        />
                    </Suspense>
                </ResizablePanel>


                <ResizableHandle withHandle className="bg-muted hover:bg-muted-foreground/30 transition-colors">
                    <div className="w-1.5 h-full mx-auto rounded-full bg-muted-foreground/40 hover:bg-primary transition-colors cursor-col-resize" />
                </ResizableHandle>


                <ResizablePanel defaultSize={65} minSize={40}>
                    <Tabs className='h-full gap-y-0' value={tabState}
                          onValueChange={(value) => setTabState(value as 'preview' | 'code')}>
                        <div className='w-full flex items-center p-2 border-b gap-x-2'>
                            <TabsList className='h-8 p-0 border rounded-md'>
                                <TabsTrigger value='preview' className='rounded-md' >
                                    <EyeIcon/>
                                    <span>Сайт</span>
                                </TabsTrigger>
                                <TabsTrigger value='code' className='rounded-md' >
                                    <CodeIcon/>
                                    <span>Код</span>
                                </TabsTrigger>


                            </TabsList>

                            <div className='ml-auto flex items-center gap-x-2'>

                                <Button asChild={true} size='sm' variant='default'>
                                    <Link href='/pricing' >
                                        <CrownIcon/> Получить vip
                                    </Link>
                                </Button>
                                <div>
                                    <DropdownMenu >
                                        <DropdownMenuTrigger>
                                            <Avatar>

                                                <AvatarImage src={user?.avatarUrl}/>
                                                <AvatarFallback className='bg-primary'>
                                                    {user?.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent >
                                            <DropdownMenuItem className='flex items-center gap-3' onClick={() => {
                                                router.push('/my-projects')
                                            }}>
                                                <FoldersIcon/>
                                               Мой проекты
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='flex items-center gap-3' onClick={() => {
                                                logout()
                                                router.push('/sign-up')
                                                toast.success('Logout!')

                                            }}>
                                                <LogOut/>
                                                Выйти
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                </div>
                            </div>

                        </div>
                        <TabsContent value='preview' >
                            {activeFragment ? (
                                <FragmentWeb data={activeFragment} />
                            ) : (
                                <Skeleton className="w-full h-full rounded-lg" />
                            )}
                        </TabsContent>
                        <TabsContent value='code' className='min-h-0' >
                            {!!activeFragment?.files ? <FileExplorer files={activeFragment.files as {[path: string]: string}}  /> :
                                <CodeView lang='ts' code=''/>   }
                        </TabsContent>


                    </Tabs>

                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
export default ProjectView
