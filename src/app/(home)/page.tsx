'use client'
import React, {useEffect} from 'react'
import Image from "next/image";
import ProjectForm from "@/modules/home/ui/components/project-form";
import ProjectList from "@/modules/home/ui/components/project-list";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useAuth} from "@/hooks/use-auth";
import {LoaderThree} from "@/components/ui/loader";
import {useRouter} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {toast} from "sonner";
import {useRequireAuth} from "@/hooks/use-require-auth";
import {CrownIcon, FoldersIcon, LogOut} from "lucide-react";
import Link from "next/link";
const Page = () => {
    const { user, loading } = useRequireAuth("", "/sign-up");
    console.log(user)
    const router = useRouter()
    const {logout} = useAuth()
    if (loading) {
        return (
            <div className="flex items-center justify-center flex-col w-full h-screen gap-4">
                <LoaderThree />
                <p className="text-primary">Загрузка...</p>
            </div>
        );
    }
    return (
        <div className='flex flex-col max-w-5xl mx-auto w-full'>
            <div className='flex justify-between px-4 mt-3 items-center'>
                <Link href='/' >
                    <Image className='hidden md:block rounded-xl'
                           width={70}
                           height={70}
                           alt='logo'
                           src='/logo2.png'/>
                </Link>

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
                                router.push('/pricing')
                            }}>
                                <CrownIcon/>
                                <span className='text-primary font-semibold'>Pro</span>
                                 подписка
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
            <section className='space-y-6 py-[16vh] 2xl:py-48'>

                <h1 className='text-2xl md:text-5xl font-bold text-center'>
                       Создайте что-нибудь уникальное с <span className='text-primary'>Buildify</span>
                </h1>
                <p className='text-lg md:text-xl text-muted-foreground text-center'>
                   Проектируйте сайты за секунды используя новейшие технологии ИИ
                </p>
                <div className='max-w-3xl mx-auto w-full'>
                    <ProjectForm/>
                </div>
            </section>
            <ProjectList/>
        </div>
    )
}
export default Page
