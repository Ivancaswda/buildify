import React from 'react';
import { MessageRole } from "@/generated/prisma";
import { MessageType, Fragment } from "@/generated/prisma";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Code2Icon } from "lucide-react";
import { ru } from "date-fns/locale";
import Hint from "@/components/Hint";
import TypingMessage from "@/modules/projects/ui/components/typing-message";

// Интерфейсы для компонентов
interface UserMessageProps {
    content: string;
}

interface FragmentCardProps {
    fragment: Fragment;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({ fragment, isActiveFragment, onFragmentClick }: FragmentCardProps) => {
    return (
        <Button
            className={cn(
                'flex items-center text-center gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors',
                isActiveFragment && 'bg-primary text-primary-foreground border-primary hover:bg-primary'
            )}
            onClick={() => onFragmentClick(fragment)}
        >
            <Code2Icon className='size-4 mt-0.5' />
            <Hint text='Нажмите чтобы посмотреть'>
                <div className='flex flex-col flex-1'>
          <span className='text-sm font-medium line-clamp-1'>
            {fragment.title}
          </span>
                </div>
            </Hint>
        </Button>
    );
}

export const UserMessage = ({ content }: UserMessageProps) => {
    return (
        <div className='flex justify-end pb-4 pr-2 pl-10'>
            <Card className='rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words'>
                {content}
            </Card>
        </div>
    );
}

interface AssistantMessageProps {
    content: string;
    fragment: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

const AssistantMessage = ({ content, fragment, createdAt, isActiveFragment, onFragmentClick, type }: AssistantMessageProps) => {
    return (
        <div className={cn('flex flex-col group px-2 pb-4', type === 'ERROR' && 'text-red-700 dark:text-red-500')}>
            <div className='flex items-center gap-2 pl-2 mb-2'>
                <Image src='/logo2.png' alt='logo' className='rounded-full shrink-0' width={40} height={40} />
                <span className='text-sm font-medium'>Buildify</span>
                <span className='text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100'>
          {format(new Date(createdAt), "d MMMM yyyy, HH:mm", { locale: ru })}
        </span>
            </div>
            <div className='pl-8.5 flex flex-col gap-y-4'>

                <TypingMessage content={content} typingSpeed={50} />
                {fragment && type === 'RESULT' && (
                    <FragmentCard
                        fragment={fragment}
                        isActiveFragment={isActiveFragment}
                        onFragmentClick={onFragmentClick}
                    />
                )}
            </div>
        </div>
    );
}

interface MessageCardProps {
    content: string;
    role: MessageRole;
    fragment: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

const MessageCard = ({ content, role, fragment, createdAt, isActiveFragment, onFragmentClick, type }: MessageCardProps) => {
    // Обрабатываем ошибку с недостатком токенов
    if (role === 'ASSISTANT' && content === "You have reached the limit of 5 websites. Please subscribe to create more.") {
        return (
            <AssistantMessage
                content="Вы достигли лимита на создание сайтов. Пожалуйста, оформите подписку для продолжения."
                fragment={null}
                createdAt={createdAt}
                isActiveFragment={false}
                onFragmentClick={() => {}}
                type="ERROR"
            />
        );
    }


    if (role === 'ASSISTANT') {
        return (
            <AssistantMessage
                content={content}
                fragment={fragment}
                createdAt={createdAt}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        );
    }

    return (
        <div>
            <UserMessage content={content} />
        </div>
    );
}

export default MessageCard;
