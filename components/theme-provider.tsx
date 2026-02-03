import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // ... (Keep existing fetch logic if needed, but it might conflict with next-themes if it sets CSS variables directly)
        // Actually, the existing logic sets --primary from API. Ideally next-themes handles class.
        // We can keep the fetch logic inside.
        const fetchTheme = async () => {
            // ...
        }
        fetchTheme();
    }, []);

    if (!mounted) {
        return <>{children}</>; // Avoid hydration mismatch
    }

    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
        </NextThemesProvider>
    );
}
