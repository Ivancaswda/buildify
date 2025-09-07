'use client'
import React, { useState } from 'react'
import { z } from 'zod'
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "@/modules/home/constants";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

const formSchema = z.object({
    value: z.string()
        .min(1, { message: 'value is required' })
        .max(10000, { message: 'Value is too long' }),
})

const ProjectForm = () => {
    const router = useRouter()
    const trpc = useTRPC()
    const [isFocused, setIsFocused] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: ""
        }
    });

    const createProject = useMutation(trpc.projects.create.mutationOptions({
        onSuccess: (data) => {
            queryClient.invalidateQueries(
                trpc.projects.getMany.queryOptions()
            );
            router.push(`/projects/${data.id}`)
        },
        onError: (error) => {
            if (error.data?.code === 'UNAUTHORIZED') {
                router.push('/sign-up')
            }

            if (error.message === "You have reached the limit of 5 websites. Please subscribe to create more.") {
                setErrorMessage(error.message);
                setIsModalOpen(true);
                setTimeout(() => router.push('/pricing'), 3000);
            } else {
                toast.error(error.message);  // Для других ошибок
            }
            toast.error(error.message)
        }
    }))

    const onSelect = (value: string) => {
        // Устанавливаем значение в форму
        form.setValue('value', value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
        // Автоматически отправляем форму
        form.handleSubmit(onSubmit)();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createProject.mutateAsync({
            value: values.value,
        })
    }

    const isPending = createProject.isPending
    const isDisabled = isPending || !form.formState.isValid

    return (
        <>
        <Form {...form}>
            <section className='space-y-6'>

                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={cn('relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all',
                          isFocused && "shadow-xs",
                      )}
                >
                    <FormField
                        control={form.control}
                        name="value"   // ✅ ОБЯЗАТЕЛЬНО
                        render={({ field }) => (
                            <TextareaAutosize
                                disabled={isPending}
                                {...field}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                minRows={2}
                                maxRows={8}
                                className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                                placeholder="Какой сайт вы бы хотели увидеть"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                        e.preventDefault()
                                        form.handleSubmit(onSubmit)(e)
                                    }
                                }}
                            />
                        )}
                    />
                    <div className='flex gap-x-2 items-end justify-between pt-2'>
                        <div className='text-[10px] text-muted-foreground font-mono'>
                            <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground '>

                                Enter
                            </kbd>
                            {' '}
                            для отправки
                        </div>
                        <Button disabled={isDisabled} className={cn('size-8 rounded-full', isDisabled && 'bg-muted-foreground border')}>
                            {isPending ? (
                                <Loader2Icon className='size-4 animate-spin' />
                            ) : (
                                <ArrowUpIcon />
                            )}
                        </Button>
                    </div>
                </form>

                <div className='flex-wrap justify-center gap-2 hidden md:flex max-w-3xl'>
                    {PROJECT_TEMPLATES.map((template) => (
                        <Button key={template.title}
                                variant='outline'
                                size='sm'
                                className='bg-white flex items-center dark:bg-sidebar'
                                onClick={() => onSelect(template.prompt)}
                        >
                            {template.emoji}
                            {' '}
                            {template.title}
                        </Button>
                    ))}
                </div>
            </section>
        </Form>

            <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ошибка</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        {errorMessage}
                    </DialogDescription>
                    <DialogFooter>
                        <Button onClick={() => setIsModalOpen(false)} variant="outline">Закрыть</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default ProjectForm
