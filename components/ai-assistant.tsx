"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, X, Mic, MicOff, Bot, User, Phone, VolumeX, Volume2, AlertCircle, MessageCircle, Navigation } from 'lucide-react';
import { properties } from '@/lib/mock-data';
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
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(false);
    const [usedMic, setUsedMic] = useState(false);
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
                setUsedMic(true);
            };
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, [locale]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopSpeaking = () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (overrideText?: string | React.MouseEvent | React.KeyboardEvent) => {
        const textToSend = typeof overrideText === 'string' ? overrideText : input;

        if (!textToSend.trim() || !userId) return;

        const wasMic = usedMic;
        if (typeof overrideText !== 'string') setInput("");
        setUsedMic(false);
        // Optimistic UI
        const tempMsg: Message = { role: "user", content: textToSend };
        setMessages(prev => [...prev, tempMsg]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: textToSend, locale, userId, context: {} })
            });
            const data = await res.json();

            // Voice-to-Voice TTS if enabled
            if (data.reply && ttsEnabled) {
                window.speechSynthesis.cancel();
                // Strip all tags for reading
                const textToSpeak = data.reply.replace(/\[[A-Z_]+(:[^\]]+)?\]/g, '').replace(/\*/g, '').replace(/\[.*?\]\(.*?\)/g, '');
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = locale === 'he' ? 'he-IL' : 'en-US';

                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);

                window.speechSynthesis.speak(utterance);
            }

            // Server returns updated messages list (including AI reply)
            if (data.messages) {
                fetchMessages();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = (content: string) => {
        // Handle line breaks
        const lines = content.split('\n');

        return lines.map((line, lineIndex) => {
            if (!line.trim()) return <br key={`br-${lineIndex}`} />;

            // Handle links [text](url)
            const parts = line.split(/\[([^\]]+)\]\(([^)]+)\)/g);
            const renderedLine = parts.length === 1 ? line : parts.map((part, i) => {
                if (i % 3 === 0) return part;
                if (i % 3 === 1) {
                    const url = parts[i + 1];
                    return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold mx-1">{part}</a>;
                }
                return null;
            });

            // Handle bold text **text** 
            // We use dangerouslySetInnerHTML for simplicity since React mapping multiple regex is complex
            // A simple regex replace safely replacing ** with <strong> tags
            const htmlString = '<span style="white-space: pre-wrap;">' +
                (Array.isArray(renderedLine)
                    ? renderedLine.map(p => typeof p === 'string' ? p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : '').join('')
                    : (renderedLine as string).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))
                + '</span>';

            // Because links are React elements in the array map above, we need a safer approach.
            // Let's do a pure string replacement and dangerouslySetInnerHTML for everything for simplicity if it supports basic markdown.
            // Actually, since this is user-facing chat from our own AI, it's relatively safe.
            let formattedLine = line
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: bold; margin: 0 4px;">$1</a>');

            return <div key={lineIndex} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
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
                        className="fixed bottom-[100px] md:bottom-24 inset-x-4 md:left-auto md:right-72 w-auto md:w-96 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-gold/20 overflow-hidden z-[9999] flex flex-col max-h-[65vh] md:max-h-[600px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gold/80 to-gold text-black p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/40 shadow-sm bg-black">
                                    <video src="/videos/ai-mascot.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover scale-150" />
                                </div>
                                <span className="font-bold">{locale === 'he' ? "צ'אט אונליין" : "Live Chat"}</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setTtsEnabled(!ttsEnabled)} className={`hover:bg-gray-100 rounded-full p-1.5 shadow-sm transition-all flex items-center justify-center mr-1 ${ttsEnabled ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-400'}`} title={locale === 'he' ? (ttsEnabled ? "כיבוי קול" : "הפעלת קול") : "Toggle Voice"}>
                                    {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                </button>
                                {isSpeaking && (
                                    <button onClick={stopSpeaking} className="hover:bg-red-100 rounded-full p-1.5 bg-red-50 text-red-600 shadow-sm transition-all flex items-center justify-center mr-1" title={locale === 'he' ? "השתק שמע" : "Stop Audio"}>
                                        <VolumeX className="w-5 h-5" />
                                    </button>
                                )}
                                <a href="https://wa.me/972502225536?text=היי,%20אני%20זקוק%20לעזרה." target="_blank" rel="noopener noreferrer" className="hover:bg-green-100 rounded-full p-1.5 bg-white text-green-600 shadow-sm transition-all flex items-center justify-center mr-1" title={locale === 'he' ? "העבר לוואטסאפ" : "Move to WhatsApp"}>
                                    <Phone className="w-4 h-4" />
                                </a>
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-10">
                                    <p>{locale === 'he' ? "שלום! איך אפשר לעזור?" : "Hello! How can I help?"}</p>
                                </div>
                            )}
                            {messages.map((m, i) => {
                                const content = m.content;
                                const isAngry = content.includes('[ANGRY]');
                                const hasContact = content.includes('[CONTACT]');
                                const hasRules = content.includes('[RULES]');

                                const extractAndRemove = (text: string, regex: RegExp) => {
                                    const matches = Array.from(text.matchAll(regex));
                                    const clean = text.replace(new RegExp(regex, 'g'), '');
                                    return { matches, clean };
                                };

                                let cleanText = content.replace(/\[ANGRY\]/g, '')
                                    .replace(/\[CONTACT\]/g, '')
                                    .replace(/\[RULES\]/g, '');

                                const navData = extractAndRemove(cleanText, /\[NAVIGATE:([^,\]]+),([^\]]+)\]/g);
                                cleanText = navData.clean;
                                const sugData = extractAndRemove(cleanText, /\[SUGGESTIONS:([^\]]+)\]/g);
                                cleanText = sugData.clean;
                                const urgData = extractAndRemove(cleanText, /\[URGENT:([^\]]+)\]/g);
                                cleanText = urgData.clean;
                                const waData = extractAndRemove(cleanText, /\[BOOK_WHATSAPP:([^\]]+)\]/g);
                                cleanText = waData.clean;
                                const discData = extractAndRemove(cleanText, /\[DISCOUNT:([^,\]]+),([^\]]+)\]/g);
                                cleanText = discData.clean;
                                const revData = extractAndRemove(cleanText, /\[REVIEW:([^\]]+)\]/g);
                                cleanText = revData.clean;
                                const amenData = extractAndRemove(cleanText, /\[AMENITIES:([^\]]+)\]/g);
                                cleanText = amenData.clean;
                                const carData = extractAndRemove(cleanText, /\[CAROUSEL:([^\]]+)\]/g);
                                cleanText = carData.clean;

                                return (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 shadow-sm border border-gold/10 rounded-bl-none'
                                            }`}>
                                            {renderContent(cleanText)}

                                            {/* URGENT INDICATOR */}
                                            {urgData.matches.map((match, idx) => (
                                                <div key={`urg-${idx}`} className="mt-2 bg-red-100 border border-red-300 text-red-700 p-2 rounded-lg text-xs font-bold flex items-center gap-1 animate-pulse">
                                                    <AlertCircle className="w-4 h-4" /> {match[1]}
                                                </div>
                                            ))}

                                            {/* REVIEWS */}
                                            {revData.matches.map((match, idx) => (
                                                <div key={`rev-${idx}`} className="mt-2 bg-gray-50 p-2 border border-gray-200 rounded-lg">
                                                    <div className="flex text-yellow-500 text-xs">★★★★★</div>
                                                    <p className="text-xs text-gray-600 mt-1">"{locale === 'he' ? 'שהות מדהימה, סופר מומלץ!' : 'Amazing stay, highly recommended!'} - {match[1]}"</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">Google Reviews</p>
                                                </div>
                                            ))}

                                            {/* CAROUSEL CARDS */}
                                            {carData.matches.map((match, idx) => {
                                                const propId = match[1];
                                                const prop = properties.find((p: any) => p.id === propId);
                                                if (!prop) return null;
                                                return (
                                                    <div key={idx} className="mt-3 bg-white rounded-xl shadow-md border border-gray-100 p-2 w-[220px]">
                                                        {prop.images && prop.images[0] && (
                                                            <div className="w-full h-24 overflow-hidden rounded-lg mb-2 relative">
                                                                <img src={prop.images[0]} className="w-full h-full object-cover" alt={prop.title} />
                                                            </div>
                                                        )}
                                                        <h4 className="font-bold text-sm text-black line-clamp-1">{prop.title}</h4>
                                                        <p className="text-xs text-gray-500 mb-2">₪{prop.price}{locale === 'he' ? ' / לילה' : ' / night'}</p>
                                                        <a href={`/property/${prop.id}`} className="block text-center bg-gold text-black rounded-lg py-1.5 text-xs font-bold hover:shadow-lg transition-all" target="_blank">
                                                            {locale === 'he' ? 'צפה בנכס' : 'View Property'}
                                                        </a>
                                                    </div>
                                                );
                                            })}

                                            {/* DISCOUNT */}
                                            {discData.matches.map((match, idx) => (
                                                <div key={`disc-${idx}`} className="mt-2 border-2 border-dashed border-gold bg-amber-50 rounded-lg p-2 text-center">
                                                    <p className="text-xs font-bold text-black">{locale === 'he' ? 'קופון הנחה' : 'Discount Coupon'}: {match[2]}</p>
                                                    <div className="bg-white border border-gray-200 rounded mt-1 p-1 font-mono text-sm tracking-widest text-gold font-bold">{match[1]}</div>
                                                </div>
                                            ))}

                                            {/* AMENITIES */}
                                            {amenData.matches.map((match, idx) => (
                                                <div key={`amen-${idx}`} className="mt-2 flex flex-wrap gap-1">
                                                    {match[1].split(',').map((am, idx2) => (
                                                        <span key={idx2} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-200">{am.trim()}</span>
                                                    ))}
                                                </div>
                                            ))}

                                            {/* RULES */}
                                            {hasRules && (
                                                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden text-xs">
                                                    <div className="bg-gray-200 p-1.5 font-bold text-center">{locale === 'he' ? 'נהלי אירוח' : 'House Rules'}</div>
                                                    <div className="p-2 space-y-1">
                                                        <div className="flex justify-between"><span className="text-gray-500">{locale === 'he' ? 'צ\'ק אין:' : 'Check-in:'}</span> 15:00</div>
                                                        <div className="flex justify-between"><span className="text-gray-500">{locale === 'he' ? 'צ\'ק אאוט:' : 'Check-out:'}</span> 11:00</div>
                                                        <div className="flex justify-between"><span className="text-gray-500">{locale === 'he' ? 'חיות מחמד:' : 'Pets:'}</span> {locale === 'he' ? 'לא' : 'No'}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* NAVIGATION BUTTON */}
                                            {navData.matches.map((match, idx) => (
                                                <a key={`nav-${idx}`} href={match[1]} className="mt-2 block bg-black text-white text-center rounded-lg py-1.5 text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-1">
                                                    {match[2]} <Navigation className="w-3 h-3" />
                                                </a>
                                            ))}

                                            {/* WHATSAPP BOOKING */}
                                            {waData.matches.map((match, idx) => (
                                                <a key={`wa-${idx}`} href={`https://wa.me/972502225536?text=היי,%20אני%20מעוניין%20להזמין%20דרך%20הקישור%20הזה:%20${encodeURIComponent(match[1])}`} target="_blank" rel="noopener noreferrer" className="mt-2 block bg-green-500 text-white text-center rounded-lg py-1.5 text-xs font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-1">
                                                    {locale === 'he' ? 'הזמן בוואטסאפ' : 'Book on WhatsApp'} <MessageCircle className="w-4 h-4" />
                                                </a>
                                            ))}

                                            {/* CONTACT BUTTON */}
                                            {(hasContact || isAngry) && m.role === 'assistant' && (
                                                <a href="tel:0505222536" className="mt-2 flex items-center justify-center gap-2 bg-red-50 text-red-600 p-2.5 rounded-xl text-xs font-bold border border-red-200 hover:bg-red-100 transition-colors">
                                                    📞 {locale === 'he' ? "צור קשר עם ההנהלה: 050-222-5536" : "Call Management: 050-222-5536"}
                                                </a>
                                            )}

                                            {/* SUGGESTION CHIPS */}
                                            {sugData.matches.map((match, idx) => (
                                                <div key={`sug-${idx}`} className="mt-3 flex flex-wrap gap-2">
                                                    {match[1].split('|').map((sug, idx2) => (
                                                        <button key={`btn-${idx2}`} onClick={() => handleSend(sug.trim())}
                                                            className="bg-white border text-left border-gold/50 text-black px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-gold/10 transition-all">
                                                            {sug.trim()}
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
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

            {/* Floating AI Mascot Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="mt-4 relative w-16 h-16 rounded-full flex items-center justify-center transition-all bg-white shadow-2xl border-2 border-gold/50 cursor-pointer overflow-hidden group z-[9999]"
                >
                    <div className="absolute inset-0 bg-black">
                        <video
                            src="/videos/ai-mascot.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-150 transition-transform group-hover:scale-125"
                        />
                    </div>
                    {/* Pulsing indicator */}
                    <div className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
                    </div>
                </motion.button>
            )}

        </div>
    );
}
