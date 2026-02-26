'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Check, CheckCheck, RefreshCw } from 'lucide-react';

type Message = {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
};

type Conversation = {
    userId: string;
    lastMessage: Message;
    unreadCount: number;
};

export default function ChatTab() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Fetch Conversations
    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/admin/chat');
            const data = await res.json();
            if (data.conversations) {
                setConversations(data.conversations);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // 2. Fetch Messages for User
    const selectUser = async (uId: string) => {
        setSelectedUser(uId);
        try {
            const res = await fetch(`/api/chat?userId=${uId}`);
            const data = await res.json();
            if (data.messages) {
                setMessages(data.messages);
            }
        } catch (e) { console.error(e); }
    };

    // 3. Send Admin Message
    const handleSend = async () => {
        if (!input.trim() || !selectedUser) return;

        const content = input;
        setInput("");

        // Optimistic
        const tempMsg: Message = {
            _id: Date.now().toString(),
            senderId: 'admin',
            receiverId: selectedUser,
            content,
            read: true,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);

        try {
            await fetch('/api/admin/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUser, content })
            });
            // Refresh
            selectUser(selectedUser);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchConversations();
        pollRef.current = setInterval(fetchConversations, 5000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const timer = setInterval(() => selectUser(selectedUser), 3000);
            return () => clearInterval(timer);
        }
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex h-[600px] text-zinc-900 bg-white rounded-xl overflow-hidden border border-zinc-200 shadow-sm font-sans" dir="ltr">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-zinc-200 flex flex-col bg-zinc-50">
                <div className="p-4 border-b border-zinc-200 font-bold flex justify-between items-center text-zinc-900">
                    <span>Conversations</span>
                    <button onClick={fetchConversations} className="text-xs bg-zinc-200 p-2 rounded-full hover:bg-zinc-300 transition-colors">
                        <RefreshCw size={14} className="text-zinc-600" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {conversations.map(conv => (
                        <div
                            key={conv.userId}
                            onClick={() => selectUser(conv.userId)}
                            className={`p-3 rounded-lg cursor-pointer flex gap-3 items-center transition-colors ${selectedUser === conv.userId ? 'bg-gold/10' : 'hover:bg-zinc-100'}`}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-xs relative">
                                {conv.userId.startsWith('guest_') ? 'G' : conv.userId.substring(0, 2).toUpperCase()}
                                {conv.unreadCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">{conv.unreadCount}</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-bold text-sm truncate w-24">
                                        {conv.userId.startsWith('guest_') ? 'Guest' : conv.userId}
                                    </span>
                                    <span className="text-[10px] text-zinc-400">{new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-xs text-zinc-500 truncate">
                                    {conv.lastMessage.senderId === 'admin' ? 'You: ' : ''}
                                    {conv.lastMessage.content}
                                </p>
                            </div>
                        </div>
                    ))}
                    {conversations.length === 0 && <div className="p-4 text-center text-zinc-400 text-sm italic">No active chats</div>}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-zinc-200 font-bold flex items-center gap-2 bg-zinc-50">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-zinc-900">Chat with {selectedUser.startsWith('guest_') ? 'Guest' : selectedUser}</span>
                            <span className="text-xs text-zinc-400 ml-2">ID: {selectedUser}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${m.senderId === 'admin'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-zinc-100 text-zinc-900 rounded-bl-none border border-zinc-200'
                                        }`}>
                                        <p className="whitespace-pre-wrap break-words text-sm">{m.content}</p>
                                        <div className="flex justify-end items-center gap-1 mt-1 opacity-50 text-[10px]">
                                            <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {m.senderId === 'admin' && (m.read ? <CheckCheck size={12} /> : <Check size={12} />)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1 bg-white border border-zinc-200 rounded-full px-4 py-2 focus:border-gold outline-none transition-colors text-zinc-900 shadow-inner"
                                placeholder="Type a reply..."
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="bg-gold text-black p-2 rounded-full hover:bg-gold-light transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-300 gap-4">
                        <Bot size={48} />
                        <p className="font-bold">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
