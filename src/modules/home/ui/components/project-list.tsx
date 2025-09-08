'use client'
import React, {useState} from 'react'
import Link from "next/link";
import Image from "next/image";
import {useQuery} from "@tanstack/react-query";
import {useTRPC} from "@/trpc/client";
import {Button} from "@/components/ui/button";
import {formatDistanceToNow} from "date-fns";
import {useAuth} from "@/hooks/use-auth";
import {XIcon, XOctagonIcon} from "lucide-react";
import {ru} from "date-fns/locale";
import {Popover} from "@/components/ui/popover";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "@/modules/home/ui/components/modal";

const ProjectList = () => {
    const trpc = useTRPC()
    const {user} = useAuth()
    const {data:projects} = useQuery(trpc.projects.getMany.queryOptions())

    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!user) return null

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className='w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4'>
            <h2 className='text-2xl font-semibold'>
                Проекты {user.name}
            </h2>

            {projects?.length === 0 && (
                <div className=' flex-col flex gap-6 items-center justify-center'>
                    <XOctagonIcon className='text-primary size-20' />
                    <p className='text-xl'>
                        У вас пока нету проектов
                    </p>
                </div>
            )}

            {projects?.slice(0, 10).map((project) => (
                <Button asChild={true} key={project.id} variant='outline' className='font-normal h-auto justify-start w-full text-start p-4'>
                    <Link href={`/projects/${project.id}`} >
                        <div className='flex items-center gap-x-4'>
                            <Image src='/logo2.png' alt='logo' width={32} height={32} className='object-contain rounded-lg' />
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

            {projects?.length > 10 && (
                <Button variant="outline" onClick={handleOpenModal} className="w-full mt-4">
                    Показать все проекты
                </Button>
            )}


            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>

                    <ModalHeader>
                        <h1>Все проекты</h1>
                    </ModalHeader>

                    <ModalBody>
                        {projects?.map((project) => (
                            <Button asChild={true} key={project.id} variant='outline' className='font-normal h-auto justify-start w-full text-start p-4'>
                                <Link href={`/projects/${project.id}`} >
                                    <div className='flex items-center gap-x-4'>
                                        <Image src='/logo2.png' alt='logo' width={32} height={32} className='object-contain rounded-lg' />
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
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={handleCloseModal}>
                            Закрыть
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    )
}
export default ProjectList
