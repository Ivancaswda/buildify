'use client'
import React, {useEffect, useRef} from 'react'
import {useSuspenseQuery} from "@tanstack/react-query";
import {useTRPC} from "@/trpc/client";
import MessageCard from "@/modules/projects/ui/components/message-card";
import MessageForm from "@/modules/projects/ui/components/message-form";
import {Fragment} from "@/generated/prisma";
import MessageLoading from "@/modules/projects/ui/components/message-loading";


interface Props {
    projectId: string,
    activeFragment?: Fragment | null;
    setActiveFragment?: (fragment: Fragment | null) => void
}
const MessagesContainer = ({projectId, activeFragment, setActiveFragment}: Props) => {
    const bottomRef = useRef<HTMLDivElement>(null)
    const trpc = useTRPC()
    let lastAssistantMessageIdRef  = useRef<string | null>(null)
    const {data: messages} = useSuspenseQuery(trpc.messages.getMany.queryOptions({
        projectId: projectId
    }, {
        refetchInterval: 5000,
        suspense:false
    }))
    useEffect(() => {
        const lastAssistantMessage =
            messages.findLast((message) => message.role === 'ASSISTANT' && !!message.fragment)
        if (setActiveFragment && lastAssistantMessage?.id !== lastAssistantMessageIdRef.current && lastAssistantMessage?.fragment) {
            setActiveFragment(lastAssistantMessage.fragment)
            lastAssistantMessageIdRef.current = lastAssistantMessage.id
        }
    }, [messages, setActiveFragment])

    useEffect(() => {
        bottomRef?.current?.scrollIntoView()
    }, [messages.length])

    const lastMessage = messages[messages.length -1]
    const isLastMessageUser = lastMessage?.role === 'USER';

    return (
        <div className='flex flex-col flex-1 min-h-0'>
            <div className='flex-1 min-h-0 overflow-auto'>
                <div className='pt-2 pr-1'>
                    {messages.map((message) => (
                        <MessageCard
                            key={message.id}
                            content={message.content}
                            role={message.role}
                            fragment={message.fragment}
                            createdAt={message.createdAt}
                            isActiveFragment={activeFragment?.id === message.fragment?.id}

                            onFragmentClick={() => setActiveFragment(message?.fragment)}
                            type={message.type}
                        />
                    ))}
                    {isLastMessageUser && <MessageLoading/>}
                    <div ref={bottomRef} />
                </div>
            </div>
            <div  className='relative p-3 pt-1'>
                <div
                    className='absolute -top-6 right-0 left-0 h-6
                    bg-gradient-to-b from-transparent to-background/70 pointer-events-none'/>
                <MessageForm projectId={projectId}/>
            </div>
        </div>
    )
}
export default MessagesContainer
