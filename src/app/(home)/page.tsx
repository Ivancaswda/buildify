'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import ProjectForm from "@/modules/home/ui/components/project-form";
import ProjectList from "@/modules/home/ui/components/project-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { LoaderThree } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import {ChevronDownIcon, ChevronLeftIcon, CrownIcon, FoldersIcon, LogOut, SunMoonIcon, TabletIcon, Apple} from "lucide-react";
import Link from "next/link";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";


import { Bar, BarChart, XAxis, YAxis,  CartesianGrid, ResponsiveContainer} from 'recharts';

import { format, isBefore, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {InfiniteMovingCards} from "@/components/ui/infinite-moving-cards";
import {testimonials} from "@/app/about-us/page";
import {InfiniteMovingLogos} from "@/app/(home)/infinite-moving-logos";
import {FaGoogle, FaMicrosoft, FaTelegram, FaVk} from "react-icons/fa";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);




const Page = () => {

    const router = useRouter()
    const { logout, user, loading } = useAuth()
    const trpc = useTRPC()
    const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
    const [projectStats, setProjectStats] = useState([]);
    const {theme, setTheme} = useTheme()
    console.log(user)

    useEffect(() => {
        if (projects) {
            const stats = groupProjectsByMonth(projects);
            setProjectStats(stats);
        }
    }, [projects]);

    const groupProjectsByMonth = (projects) => {
        const grouped = {};
        const currentDate = new Date();


        const startDate = new Date('2025-01-01');
        const endDate = currentDate;


        const allMonths = eachMonthOfInterval({
            start: startOfMonth(startDate),
            end: endOfMonth(endDate),
        });


        projects.forEach((project) => {
            const month = format(new Date(project.createdAt), 'yyyy-MM');
            if (!grouped[month]) {
                grouped[month] = 0;
            }
            grouped[month] += 1;
        });


        return allMonths.map((month) => {
            const monthStr = format(month, 'yyyy-MM');
            return {
                name: monthStr,
                projects: grouped[monthStr] || 0,
            };
        });
    };


    const data = {
        labels: projectStats.map(p => p.name),
        datasets: [
            {
                label: 'Проекты',
                data: projectStats.map(p => p.projects),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.6, // сглаживание линии
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center flex-col w-full h-screen gap-4">
                <LoaderThree />
                <p className="text-primary">Загрузка...</p>
            </div>
        );
    }
    const companyIcons = [

        <FaGoogle size={150} color="#4285F4" />,
        <FaMicrosoft size={150} color="#4285F4" />,
        <FaVk size={150} color="#4285F4" />,
        <FaTelegram size={150} color="#1877F2" />,
    ];
    return (
        <div className="flex flex-col mx-auto w-full">
            <div className="flex justify-between px-4 mt-3 items-center">
                <Link href='/'>
                    <Image className="hidden md:block rounded-xl"
                           width={70} height={70}
                           alt='logo'
                           src='/logo2.png' />
                </Link>

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={user?.avatarUrl} />
                                <AvatarFallback className="bg-primary text-white">
                                    {user?.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => router.push('/my-projects')}>
                                <FoldersIcon/>
                                Мои проекты
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/pricing')}>
                                <CrownIcon/>
                                Подписка Pro
                            </DropdownMenuItem>
                            {/* Dropdown для тем */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex  gap-1 px-2 text-sm items-center">
                                    <SunMoonIcon className='size-xs text-gray-500' />
                                    <span>Темы</span>

                                </DropdownMenuTrigger>
                                <DropdownMenuContent>

                                    <DropdownMenuItem onClick={() => setTheme('light')}>
                                        Светлая
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('dark')} >
                                        Темная
                                    </DropdownMenuItem>


                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenuItem
                                onClick={async () => {
                                    try {
                                        await logout(); // дожидаемся выхода
                                        toast.success('Вы вышли!');
                                        router.replace('/sign-up'); // лучше replace, чтобы нельзя было вернуться "назад"
                                    } catch (err) {
                                        toast.error('Ошибка при выходе');
                                    }
                                }}
                            >
                                <LogOut/>
                                Выйти
                            </DropdownMenuItem>


                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>

            <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
                <BackgroundRippleEffect />
                <div className="mt-60 w-full">
                    <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
                        <span className="text-primary font-bold">Buildify</span> — Ваш надежный партнер в создании сайтов
                    </h2>
                    <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
                        Мы — команда профессионалов, специализирующихся на создании современных и функциональных веб-сайтов с использованием самых передовых технологий.
                        Buildify помогает вам быстро и легко создать уникальный сайт для вашего бизнеса, личного проекта или стартапа.
                    </p>
                </div>
            </div>

            {user?.isVip && (
                <section className="mt-16 px-4 py-12 bg-gradient-to-r from-green-600 via-aqua-600 to-blue-600 text-white rounded-lg shadow-xl max-w-4xl mx-auto animate-gradient">
                    <div className="flex items-center gap-4 justify-between">
                        <div className="space-y-4">
                            {/* Заголовок с анимацией */}
                            <motion.h2
                                className="text-3xl font-bold"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                Вы теперь помогаете нам!
                            </motion.h2>
                            {/* Описание с анимацией */}
                            <motion.p
                                className="text-lg"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                Команда Buildify выражает особенную благодарность вам, так как вы оформили подписку Vip и теперь имеете безграничные возможности на нашем сайте!
                            </motion.p>
                            {/* Кнопка с эффектами */}
                            <motion.button
                                className="px-6 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                                onClick={() => router.push("/about-us")}
                                whileHover={{ scale: 1.05 }}
                            >
                                Узнать о нас
                            </motion.button>
                        </div>
                        {/* Изображение с параллакс-эффектом */}
                        <motion.div
                            className="hidden md:block"
                            initial={{ x: 100 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 1.2, type: "spring", stiffness: 50 }}
                        >
                            <Image src="/logo.png" alt="AI Features" width={300} height={200} className="rounded-lg w-[600px] h-full" />
                        </motion.div>
                    </div>
                </section>      )}
            <hr/>
            <div className="py-12 ">
                <h2 className="text-center text-2xl font-bold mb-6">Наши партнеры</h2>
                <InfiniteMovingLogos items={companyIcons} direction="left" speed="slow" gap={32} />
            </div>

            <section className="space-y-6 py-[16vh] 2xl:py-48">
                <h1 className="text-2xl md:text-5xl font-bold text-center">
                    Создайте что-нибудь уникальное с <span className="text-primary">Buildify</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground text-center">
                    Проектируйте сайты за секунды, используя новейшие технологии ИИ
                </p>
                <div className="max-w-3xl mx-auto w-full">
                    <ProjectForm />
                </div>
            </section>

            <ProjectList />
            <div className='flex items-center gap-4 text-primary font-semibold text-2xl mt-14 justify-center '>
                <h1>Ваша статистика</h1>
                <TabletIcon/>
            </div>
            <div className="mx-auto w-full max-w-3xl">
                <Line data={data} />
            </div>
            <div className="h-[40rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                />
            </div>

            <Footer/>
        </div>
    );
}
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 rounded-lg shadow-lg">
                <p className="text-sm font-bold">{`Месяц: `}</p>
                <p className="text-sm">{`Проектов: `}</p>
            </div>
        );
    }
    return null;
};

export default Page;