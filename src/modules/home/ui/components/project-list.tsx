'use client'
import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {useQuery} from "@tanstack/react-query";
import {useTRPC} from "@/trpc/client";
import {Button} from "@/components/ui/button";
import {formatDistanceToNow} from "date-fns";
import {useAuth} from "@/hooks/use-auth";
import {XIcon, XOctagonIcon} from "lucide-react";
import {ru} from "date-fns/locale";

const ProjectList = () => {
    const trpc = useTRPC()
    const {user} = useAuth()
    const {data:projects} = useQuery(trpc.projects.getMany.queryOptions())

    if (!user) return  null
    return (
        <div className='w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4'>
            <h2 className='text-2xl font-semibold'>
                Проекты  {user.name}
            </h2>
            {projects?.length === 0 && (
                <div className=' flex-col flex gap-6 items-center justify-center  '>
                    <XOctagonIcon className='text-primary size-20'/>
                    <p className='text-xl '>
                        У вас пока нету проектов
                    </p>
                </div>
            )}
            {projects?.map((project) => (
                <Button asChild={true} key={project.id} variant='outline' className='font-normal h-auto justify-start w-full text-start p-4'>
                    <Link href={`/projects/${project.id}`}  >
                        <div className='flex items-center gap-x-4'>
                            <Image src='/logo2.png'  alt='logo' width={32} height={32} className='object-contain rounded-lg' />
                            <div className='flex flex-col'>
                                <h3 className='truncate font-medium'>
                                    {project.name}
                                </h3>
                                <p className='text-sm text-muted-foreground'>
                                    {formatDistanceToNow(project.updatedAt, {
                                        addSuffix: true,
                                        locale: ru
                                    })}
                                </p>
                            </div>
                        </div>
                    </Link>
                </Button>
            ))}

        </div>
    )
}
export default ProjectList
