'use client';

import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Fetch global styling
        const fetchTheme = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();

                if (data.theme?.primaryColor) {
                    document.documentElement.style.setProperty('--primary', data.theme.primaryColor);
                }
            } catch (err) {
                console.error('Failed to load theme:', err);
            }
        };

        fetchTheme();
    }, []);

    return <>{children}</>;
}
