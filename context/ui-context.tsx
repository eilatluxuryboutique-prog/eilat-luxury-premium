'use client';

import React, { createContext, useContext, useState } from 'react';

type UIContextType = {
    isAiChatOpen: boolean;
    setAiChatOpen: (open: boolean) => void;
    isAccessibilityOpen: boolean;
    setAccessibilityOpen: (open: boolean) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isAiChatOpen, setAiChatOpen] = useState(false);
    const [isAccessibilityOpen, setAccessibilityOpen] = useState(false);

    return (
        <UIContext.Provider value={{
            isAiChatOpen,
            setAiChatOpen,
            isAccessibilityOpen,
            setAccessibilityOpen
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
