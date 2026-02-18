"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, X, Mic, MicOff, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from "next-intl";
import { useUI } from '@/context/ui-context';

type Message = {
    role: "user" | "assistant";
    content: string;
    _id?: string;
    createdAt?: string;
};

export default function AiAssistant() {
    const locale = useLocale();
    const { isAiChatOpen: isOpen, setAiChatOpen: setIsOpen } = useUI();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [userId, setUserId] = useState<string>("");

    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    // 1. Initialize User ID
    useEffect(() => {
        let stored = localStorage.getItem('chat_user_id');
        if (!stored) {
            stored = 'guest_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_user_id', stored);
        }
        setUserId(stored);
    }, []);

    // 2. Fetch History & Polling
    const fetchMessages = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/chat?userId=${userId}`);
            const data = await res.json();
            if (data.messages) {
                // Map DB messages to UI format
                // senderId 'admin' usually means 'assistant'
                const formatted: Message[] = data.messages.map((m: any) => ({
                    role: m.senderId === userId ? 'user' : 'assistant',
                    content: m.content,
                    _id: m._id,
                    createdAt: m.createdAt
                }));
                // Only update if length differs or assume sync for now
                // Ideally deep compare, but for now just set
                setMessages(formatted);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (isOpen && userId) {
            fetchMessages(); // Initial fetch
            pollInterval.current = setInterval(fetchMessages, 3000); // Poll every 3s
        } else {
            if (pollInterval.current) clearInterval(pollInterval.current);
        }
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [isOpen, userId]);

    // 3. Speech Recognition Setup (Same as before)
    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = locale === 'he' ? 'he-IL' : 'en-US';
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, [locale]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !userId) return;

        const userMsg = input;
        setInput("");
        // Optimistic UI
        const tempMsg: Message = { role: "user", content: userMsg };
        setMessages(prev => [...prev, tempMsg]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, locale, userId })
            });
            const data = await res.json();

            // Server returns updated messages list (including AI reply)
            if (data.messages) {
                // Refresh logic handles this, but we can fast update
                // Actually the API returns { reply, messages: [userMsg, aiMsg] }
                // Let's just refetch or invoke fetchMessages immediately
                fetchMessages();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = (content: string) => {
        const parts = content.split(/\[([^\]]+)\]\(([^)]+)\)/g);
        if (parts.length === 1) return content;
        return parts.map((part, i) => {
            if (i % 3 === 0) return part;
            if (i % 3 === 1) {
                const url = parts[i + 1];
                return <a key={i} href={url} className="text-blue-600 underline font-bold mx-1">{part}</a>;
            }
            return null;
        });
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-20 md:bottom-4 inset-x-4 md:left-auto md:right-72 w-auto md:w-96 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-gold/20 overflow-hidden z-[1001] flex flex-col max-h-[70vh] md:max-h-[600px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gold/80 to-gold text-black p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bot className="w-6 h-6" />
                                <span className="font-bold">{locale === 'he' ? "צ'אט אונליין" : "Live Chat"}</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-10">
                                    <p>{locale === 'he' ? "שלום! איך אפשר לעזור?" : "Hello! How can I help?"}</p>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 shadow-sm border border-gold/10 rounded-bl-none'
                                        }`}>
                                        {renderContent(m.content)}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-end">
                                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gold/10 flex gap-1">
                                        <div className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-gold/50 rounded-full animate-bounce delay-75" />
                                        <div className="w-2 h-2 bg-gold/50 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
                            <button
                                onClick={toggleListening}
                                className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isListening ? (locale === 'he' ? "מקשיב..." : "Listening...") : (locale === 'he' ? "הקלד הודעה..." : "Type a message...")}
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gold text-black transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-gold text-black p-2 rounded-full hover:brightness-110 disabled:opacity-50 transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex w-24 h-24 relative items-center justify-center transition-all focus:outline-none z-50 pointer-events-auto"
            >
                <div className="absolute inset-0 bg-gold rounded-full opacity-20 animate-ping"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                    <Bot className="text-white w-8 h-8" />
                </div>
                {/* Badge */}
                <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            </motion.button>
        </div>
    );
}
