'use client'
import React from 'react'
import ProjectList from "@/modules/home/ui/components/project-list";
import Image from "next/image";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/use-auth";
import {FoldersIcon, LogOut} from "lucide-react";

const Page = () => {
    const router = useRouter()
    const {user, logout} = useAuth()
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-between px-4 mt-3 items-center'>
                <Image onClick={() => router.push('/')} className='hidden cursor-pointer md:block'
                       width={50}
                       height={50}
                       alt='logo'
                       src='/logo2.png'/>
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>

                                <AvatarImage src={user?.avatarUrl}/>
                                <AvatarFallback className='bg-primary text-white'>
                                    {user?.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => {
                                router.push('/my-projects')
                            }}>
                                <FoldersIcon/>
                                мои проекты
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
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

            <ProjectList/>
        </div>
    )
}
export default Page
