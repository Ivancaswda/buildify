'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CrownIcon, FoldersIcon, LogOut} from "lucide-react";
import {toast} from "sonner";
import {useAuth} from "@/hooks/use-auth";
import {useRouter} from "next/navigation";  // Для объединения классов

const Pricing = () => {
    const {user, logout} = useAuth()
    const router = useRouter()


    return (
        <div className="min-h-screen pb-12 px-6 sm:px-12">
            <div className='flex justify-between px-4  items-center'>
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

            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-semibold text-primary mb-6">Выберите ваш тариф</h1>
                <p className="text-lg text-muted-foreground mb-10">Получите тариф по вашему вкусу, возьмите Vip чтобы получить безлимит к нашей платформе создания сайтов</p>

                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">

                    <div className="p-8 bg-white shadow-lg rounded-xl border border-muted-foreground">
                        <h2 className="text-2xl font-semibold text-primary">Стандартный тариф</h2>
                        <p className="text-lg text-muted-foreground mt-2">Ограничено до 5 созданий вебсайтов</p>
                        <div className="mt-4">
                            <p className="text-4xl font-bold text-primary">0 рублей / месяц</p>
                            <p className="text-sm text-muted-foreground">Великолепно для тестирования и обычный проектов</p>
                        </div>
                        <div className="mt-6">
                            <Button variant="outline" className="w-full text-black" disabled>
                                Ограничено до 5 вебсайтов
                            </Button>
                        </div>
                    </div>


                    <div className="p-8 bg-white shadow-lg rounded-xl border border-primary">
                        <h2 className="text-2xl font-semibold text-primary">VIP тариф</h2>
                        <p className="text-lg text-muted-foreground mt-2">Бесконечное количество созданий</p>
                        <div className="mt-4">
                            <p className="text-4xl font-bold text-primary">299 Рублей / месяц</p>
                            <p className="text-sm text-muted-foreground">Получи безлимит и другие вип плюшки</p>
                        </div>
                        <div className="mt-6">
                            <Button  className={cn('w-full bg-primary text-white')}>
                                <a href="https://buildify-ru.lemonsqueezy.com/buy/8ca3801b-abf8-48cb-ad88-1bb031225890" target="_blank" rel="noopener noreferrer">
                                    Подписаться сейчас
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-muted-foreground mt-12">
                    <p>Оплата через <strong className="text-primary">LemonSqueezy</strong> — безопасный и удобный способ платежей. Мы используем LemonSqueezy для обработки транзакций, чтобы обеспечить вашу безопасность и удобство.</p>
                    <p className="mt-2">После нажатия на кнопку "Подписаться сейчас" вы будете перенаправлены на защищенную страницу оплаты.</p>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        Еще есть вопросы? <a href="/faq" className="text-primary hover:underline">Перейти на наш FAQ</a> или
                        <a href="/contact-us" className="text-primary hover:underline"> связаться с нами</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
