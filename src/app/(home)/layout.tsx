'use client'

import React, {useEffect, useState} from 'react'
import {useAuth} from "@/hooks/use-auth";
import {useRouter} from "next/navigation";
import {LoaderThree} from "@/components/ui/loader";
interface Props {
    children: React.ReactNode
}

const Layout = ({children}:Props) => {
    const { user, loading, refreshUser } = useAuth()
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            await refreshUser()
            setChecking(false)
        }
        checkUser()
    }, [refreshUser])

    useEffect(() => {
        if (!checking && !user) {
            router.replace('/sign-up')
        }
    }, [checking, user, router])


    if (checking || loading) {
        return (
            <div className="flex items-center justify-center flex-col w-full h-screen gap-4">
                <LoaderThree />
                <p className="text-primary">Загрузка...</p>
            </div>
        )
    }
    return (
        <main className='flex flex-col min-h-screen max-h-screen'>
            <div className='absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]'/>

            <div className='flex-1 flex flex-col '>
                <div className='absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]'/>

                {children}
            </div>

        </main>
    )
}
export default Layout
