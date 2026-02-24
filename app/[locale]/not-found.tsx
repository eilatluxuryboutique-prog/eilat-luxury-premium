'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-6">
                <FileQuestion className="w-12 h-12 text-gold animate-bounce" />
            </div>
            <h1 className="text-4xl font-bold mb-4 font-inter text-foreground">
                404 - Page Not Found
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                We couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
            <Link
                href="/"
                className="bg-primary text-black font-bold py-3 px-8 rounded-full hover:brightness-110 transition-all font-inter"
            >
                Return Home
            </Link>
        </div>
    );
}
