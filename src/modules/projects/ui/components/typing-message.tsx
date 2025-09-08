import React, { useState, useEffect } from 'react';

interface TypingMessageProps {
    content: string;
    typingSpeed: number; // скорость тайпинга в миллисекундах
}

const TypingMessage = ({ content, typingSpeed }: TypingMessageProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            if (index < content.length) {
                setDisplayedText((prev) => prev + content[index]);
                index++;
            } else {
                clearInterval(intervalId);
                setIsTypingComplete(true);
            }
        }, typingSpeed);

        return () => clearInterval(intervalId);
    }, [content, typingSpeed]);

    return <span>{displayedText}</span>;
};

export default TypingMessage;
