'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from './admin-context';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
    initialText: string;
    className?: string;
    multiline?: boolean;
}

export default function EditableText({ initialText, className = '', multiline = false, contentKey }: EditableTextProps & { contentKey?: string }) {
    const { isEditMode } = useAdmin();
    const [text, setText] = useState(initialText);
    const [isHovered, setIsHovered] = useState(false);

    // Load override from content API
    useEffect(() => {
        if (!contentKey) return;
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                // Simple key traversal (e.g. "hero.title")
                const keys = contentKey.split('.');
                let value = data;
                for (const key of keys) {
                    value = value?.[key];
                }
                if (value && typeof value === 'string') {
                    setText(value);
                }
            });
    }, [contentKey]);

    const handleSave = async () => {
        if (!contentKey) return;

        // Construct deep object from dot notation
        const keys = contentKey.split('.');
        const payload: any = {};
        let current = payload;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = text;

        try {
            await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.error('Failed to save text:', err);
        }
    };

    if (!isEditMode) {
        return <span className={className}>{text}</span>;
    }

    return (
        <div
            className="relative inline-block group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute -top-3 -right-3 z-10 bg-blue-600 text-white p-1 rounded-full shadow-lg pointer-events-none">
                <Pencil size={10} />
            </div>

            {multiline ? (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleSave}
                    className={`bg-blue-600/30 border border-blue-500 rounded px-2 py-1 outline-none text-white min-w-[200px] ${className}`}
                    rows={3}
                />
            ) : (
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleSave}
                    className={`bg-blue-600/30 border border-blue-500 rounded px-2 py-0.5 outline-none text-white min-w-[100px] ${className}`}
                />
            )}
        </div>
    );
}
