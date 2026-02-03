"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function AiAssistant() {
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: locale === 'he' ? "היי! אני העוזר האישי שלך. איך אפשר לעזור?" : "Hi! I'm your AI assistant. How can I help?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [context, setContext] = useState<any>({});
    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

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

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [locale]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert(locale === 'he' ? "הדפדפן שלך לא תומך בדיבור." : "Browser does not support speech recognition.");
            return;
        }

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
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, locale, context }) // Send Context
            });
            const data = await res.json();

            if (data.context) {
                setContext(data.context); // Update Memory
            }

            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: locale === 'he' ? "סליחה, יש לי תקלה רגעית." : "Sorry, I encountered an error." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render Markdown Links: [Text](Url)
    const renderContent = (content: string) => {
        const parts = content.split(/\[([^\]]+)\]\(([^)]+)\)/g);
        if (parts.length === 1) return content;

        return parts.map((part, i) => {
            if (i % 3 === 0) return part; // Regular text
            if (i % 3 === 1) { // Link Text
                const url = parts[i + 1];
                return (
                    <a key={i} href={url} className="text-blue-600 underline font-bold hover:text-blue-800 mx-1">
                        {part}
                    </a>
                );
            }
            return null; // Skip URL part (already handled)
        });
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-20 right-4 w-80 md:w-96 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-gold/20 overflow-hidden z-50 flex flex-col max-h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gold/80 to-gold text-black p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bot className="w-6 h-6" />
                                <span className="font-bold">{locale === 'he' ? "היי, איך אני יכול לעזור?" : "Hey, how can I help?"}</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 shadow-sm border border-gold/10 rounded-bl-none'
                                        }`}>
                                        {m.role === 'assistant' ? renderContent(m.content) : m.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-end">
                                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gold/10 flex gap-1">
                                        <div className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-gold/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                                        <div className="w-2 h-2 bg-gold/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
                            <button
                                onClick={toggleListening}
                                className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                title="Speak (Hebrew)"
                            >
                                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isListening ? (locale === 'he' ? "מקשיב..." : "Listening...") : (locale === 'he' ? "שאל אותי משהו..." : "Ask me anything...")}
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 bg-gradient-to-tr from-gold to-yellow-300 text-black p-4 rounded-full shadow-lg z-50 border-2 border-white/20"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </>
    );
}
