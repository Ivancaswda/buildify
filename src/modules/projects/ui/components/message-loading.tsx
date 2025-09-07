import Image from "next/image";
import React, { useState, useEffect } from "react";

const ShimmerMessages = () => {
    const messages = ['Слушаем', 'Думаем', 'Генерируем', 'Отправляем', 'Получаем', 'Загружаем']
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        }, 2000)

        return () => {
            clearInterval(interval)
        }
    }, [messages.length])

    return (
        <div className='flex items-center gap-2'>
            <span className='text-base text-muted-foreground animate-pulse '>
                {messages[currentMessageIndex]}
            </span>
        </div>
    )
}

const MessageLoading = () => {
    return (
        <div className='flex flex-col group px-2 pb-4'>
            <div className='flex items-center gap-2 pl-2 mb-2'>
                <Image src='/logo2.png' alt='logo' width={28} className='shrink-0 rounded-lg' height={28}/>
            </div>
            <div className='pl-0.5 flex flex-col '>
                <ShimmerMessages/>
            </div>
        </div>
    )
}

export default MessageLoading
