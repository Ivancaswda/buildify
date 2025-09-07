import React, {Suspense} from 'react'
import {getQueryClient,trpc} from "@/trpc/server";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import MessagesContainer from "@/modules/projects/ui/components/messages-container";
import ProjectView from "@/modules/projects/ui/views/project-view";
import {Loader2Icon, TriangleAlert} from "lucide-react";
import {HydrationBoundary} from "@tanstack/react-query";
import {dehydrate} from "@tanstack/query-core";
import {LoaderThree} from "@/components/ui/loader";
import {ErrorBoundary} from "react-error-boundary";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface Props{
    params: Promise<{
        projectId: string
    }>
}

const ProjectIdPage =  async ({params}: Props) => {
    const {projectId} = await params;
    console.log(projectId)
    const queryClient = getQueryClient()
    await queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({ id: projectId }))
    await queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({ projectId }))

    console.log(projectId)

    return (
        <div className='min-h-screen'>
            <ErrorBoundary fallback={<div className='flex flex-col gap-4 w-full h-screen items-center justify-center'>
                <TriangleAlert className='text-red-500 size-20'/>
                <h1 className='text-2xl'>Неожиданная ошибка!</h1>
                <p className='text-sm'>Попрбуйте перезагрузить страницу или связаться с владельцем!</p>
                <Button variant='destructive'>
                    <Link href='/contact-us' >
                        Связаться с нами
                    </Link>

                </Button>
            </div>} >


            <Suspense fallback={<div className='flex items-center h-screen w-full justify-center flex-col gap-4 '>
                <LoaderThree/>
                <p className='text-orange-600 font-semibold'>Создаем проект...</p>

            </div>}>
                <ProjectView projectId={projectId} />
            </Suspense>
            </ErrorBoundary>

        </div>
    )
}
export default ProjectIdPage
