'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
    isEditMode: boolean;
    toggleEditMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [isEditMode, setIsEditMode] = useState(false);

    const toggleEditMode = () => {
        setIsEditMode(prev => !prev);
    };

    return (
        <AdminContext.Provider value={{ isEditMode, toggleEditMode }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
