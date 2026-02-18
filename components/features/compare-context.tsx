"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '@/lib/mock-data';

interface CompareContextType {
    selectedIds: string[];
    toggleProperty: (id: string) => void;
    clearComparison: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('compare_list');
        if (saved) setSelectedIds(JSON.parse(saved));
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('compare_list', JSON.stringify(selectedIds));
        if (selectedIds.length > 0) setIsOpen(true);
    }, [selectedIds]);

    const toggleProperty = (id: string) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) return prev.filter(item => item !== id);
            if (prev.length >= 3) {
                alert("ניתן להשוות עד 3 נכסים במקביל.");
                return prev;
            }
            return [...prev, id];
        });
    };

    const clearComparison = () => {
        setSelectedIds([]);
        setIsOpen(false);
    };

    return (
        <CompareContext.Provider value={{ selectedIds, toggleProperty, clearComparison, isOpen, setIsOpen }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
}
