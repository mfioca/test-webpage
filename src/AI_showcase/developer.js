import React, { useState, useEffect, useCallback } from 'react';
import { DividerLine } from '../SharedComponents.js'; 
import developerData from './developer.json';
import DeveloperPrompt from './developer_prompt.js';

const Developer = () => {

    const [messages] = useState(developerData[0].messages);
    const [visibleCount, setVisibleCount] = useState(1); // Number of messages visible initially
    const [isHovered, setIsHovered] = useState(false); // Tracks if the mouse is hovering over the chat window

    const handleScroll = useCallback(
        (event) => {
            event.preventDefault(); // Prevent default scroll behavior

            const chatWindow = document.querySelector('.chat-window');
            if (!chatWindow) return;

            const { scrollTop, scrollHeight, clientHeight } = chatWindow;

            // Detect scroll direction
            const isScrollingDown = event.deltaY > 0;

            if (isScrollingDown) {
                if (scrollTop + clientHeight >= scrollHeight - 5) {
                    if (visibleCount < messages.length) {
                        setVisibleCount((prev) => prev + 1);
                    }
                }
                setTimeout(() => {
                    chatWindow.scrollTo({
                        top: chatWindow.scrollHeight,
                        behavior: 'smooth',
                    });
                }, 100);
            } else {
                if (scrollTop <= 5) {
                    if (visibleCount > 1) {
                        setVisibleCount((prev) => prev - 1);
                    }
                }
            }
        },
        [visibleCount, messages.length]
    );

    // In useEffect:
    useEffect(() => {
        const chatWindow = document.querySelector('.chat-window');
        if (!chatWindow) return;

        chatWindow.addEventListener('wheel', handleScroll);

        return () => chatWindow.removeEventListener('wheel', handleScroll);
    }, [isHovered, handleScroll]);

    return (
        <div>
            <section className="Intro">
                <h2 className="shadow">System Engineering Prompt</h2>
                <p>
                    This prompt was meticulously crafted to reflect my communication style and systematic thinking, aiming to provide tailored support for technical projects. As part of an innovative approach, I incorporated examples of negative and positive reinforcement through the use of “Negative.pdf” and “Positive.pdf” files, intending to help the system learn my preferences and expectations. Additionally, detailed troubleshooting instructions were included to facilitate effective technical problem-solving. Unfortunately, this model did not meet the intended guidelines, requiring more effort to correct its responses than to utilize its assistance effectively.    
                </p>
            </section>
            <DividerLine />
            <DeveloperPrompt />
            <DividerLine />
            <section className="Intro">
                <h2 className="shadow">Simulated Chat Conversation</h2>
                <p>
                    The chat box below showcases highlights of the successful collaboration with the model during the development of this web page.
                </p>
                <p>
                    You can hover over the chat box and scroll with your mouse wheel or use the "next Message" button below.
                </p>
            </section>
            <DividerLine />
            <div className="example-container">
                <div
                    className="chat-window"
                    onMouseEnter={() => setIsHovered(true)} // Activate hover state
                    onMouseLeave={() => setIsHovered(false)} // Deactivate hover state
                >
                    {messages.slice(0, visibleCount).map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-bubble ${msg.sender === 'assistant' ? 'user-bubble' : 'ai-bubble'}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="button-container">
                    {visibleCount < messages.length ? (
                        <button className="next-message-btn" onClick={() => setVisibleCount((prev) => prev + 1)}>
                            Next Message
                        </button>
                    ) : (
                        <button className="reset-message-btn" onClick={() => setVisibleCount(1)}>
                            Reset Chat
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Developer;