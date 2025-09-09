'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface InfiniteMovingCardsProps {
    items: React.ReactNode[];           // Любой React элемент
    direction?: 'left' | 'right';       // Направление прокрутки
    speed?: 'slow' | 'medium' | 'fast' | number; // Скорость
    gap?: number;                        // Отступ между элементами
}

const speedMap = {
    slow: 30,     // px в секунду
    medium: 60,
    fast: 120,
};

export const InfiniteMovingLogos: React.FC<InfiniteMovingCardsProps> = ({
                                                                            items,
                                                                            direction = 'left',
                                                                            speed = 'medium',
                                                                            gap = 24,
                                                                        }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    // Вычисляем ширину контента для анимации
    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.scrollWidth / 2);
        }
    }, [items]);

    const animationSpeed = typeof speed === 'number' ? speed : speedMap[speed];

    return (
        <div className="overflow-hidden relative w-full ">
            <motion.div
                ref={containerRef}
                className="flex"
                animate={{ x: direction === 'left' ? [-0, -width] : [0, width] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: width / animationSpeed, // чем больше width, тем дольше анимация
                        ease: 'linear',
                    },
                }}
            >
                {[...items, ...items].map((item, index) => (
                    <div key={index} className={`flex-shrink-0 px-20 hover:scale-105 transition-all cursor-pointer`} style={{ margin: `0 ${gap / 2}px` }}>
                        {item}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
