'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service like Sentry here
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center font-inter">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
                    <p className="text-neutral-400 mb-8 max-w-md">
                        An unexpected error has occurred. Our team has been notified.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
