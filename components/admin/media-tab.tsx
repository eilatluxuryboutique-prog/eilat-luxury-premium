'use client';

import { Upload, Film, Image as ImageIcon, Trash2, Copy, RefreshCw, Cloud } from 'lucide-react';
import { useEffect, useState } from 'react';

declare global {
    interface Window {
        cloudinary: any;
    }
}

interface CloudinaryResource {
    _id: string; // Mongo ID
    publicId: string;
    url: string;
    format: string;
    resourceType: string;
    createdAt: string;
}

export default function MediaTab() {
    const [mediaItems, setMediaItems] = useState<CloudinaryResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMedia = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/media');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch media');
            setMediaItems(data);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleSignedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            // 1. Get Signature from Backend
            const timestamp = Math.round((new Date()).getTime() / 1000);
            const paramsToSign = {
                timestamp: timestamp,
                // eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260', // Optional transformations
                folder: 'eilat_premium'
            };

            const signRes = await fetch('/api/sign-cloudinary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paramsToSign })
            });

            const signData = await signRes.json();
            if (!signData.signature) throw new Error('Failed to get signature');

            // 2. Upload to Cloudinary directly
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '594182461165845');
            // Fallback hardcoded key from chat if env var issue, but best practice is env. 
            // Actually we should expose KEY via env.
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signData.signature);
            formData.append('folder', 'eilat_premium');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drr2qzpzk';

            // Determine resource type (image or video)
            const resourceType = file.type.startsWith('video') ? 'video' : 'image';

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    setProgress((event.loaded / event.total) * 100);
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    console.log('Cloudinary success:', result);

                    // 3. Save to MongoDB via our API
                    const saveRes = await fetch('/api/media', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            publicId: result.public_id,
                            url: result.secure_url,
                            format: result.format,
                            resourceType: result.resource_type
                        })
                    });

                    if (saveRes.ok) {
                        const savedMedia = await saveRes.json();
                        setMediaItems(prev => [savedMedia.media, ...prev]);
                        alert('Upload Successful!');
                    } else {
                        console.error('Failed to save to DB');
                        alert('Upload to cloud success, but failed to save to database.');
                    }
                } else {
                    setError('Cloud upload failed');
                    console.error('Cloud error:', xhr.responseText);
                }
                setUploading(false);
            };

            xhr.onerror = () => {
                setError('Network error during upload');
                setUploading(false);
            };

            xhr.send(formData);

        } catch (err: any) {
            console.error('Upload flow error:', err);
            setError(err.message);
            setUploading(false);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        alert('URL copied!');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This only deletes the database record.')) return;
        try {
            await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
            setMediaItems(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const formatSize = (bytes: number) => {
        // Size not stored in DB currently, can add later if crucial
        return 'Cloud Asset';
    };

    const handleSetHero = async (url: string) => {
        if (!confirm('Set this video as the main background?')) return;
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hero: { videoUrl: url } })
            });

            if (res.ok) {
                alert('Hero video updated! Refresh the home page to see it.');
            } else {
                throw new Error('Failed to update hero');
            }
        } catch (err: any) {
            console.error('Failed to set hero:', err);
            alert('Error updating hero video');
        }
    };

    return (
        <div className="space-y-8">
            <div className="relative group">
                <input
                    type="file"
                    onChange={handleSignedUpload}
                    accept="video/*,image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                />
                <div className={`bg-zinc-50 border-2 border-dashed ${uploading ? 'border-blue-500 bg-blue-50' : 'border-zinc-200'} rounded-2xl p-12 text-center transition-all hover:border-blue-500/50 shadow-inner`}>
                    {uploading ? (
                        <div className="max-w-md mx-auto">
                            <h3 className="text-xl font-bold text-zinc-900 mb-4">Uploading to Cloud... {Math.round(progress)}%</h3>
                            <div className="w-full bg-zinc-200 rounded-full h-2.5">
                                <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-blue-600">
                                <Cloud size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Upload to Cloud</h3>
                            <p className="text-zinc-500">Drag & drop or click to upload securely.</p>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mediaItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-xl overflow-hidden border border-zinc-100 group relative shadow-sm">
                        <div className="aspect-video bg-black relative">
                            {item.resourceType === 'video' ? (
                                <video src={item.url} className="w-full h-full object-cover" muted onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                            ) : (
                                <img src={item.url} alt={item.publicId} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="p-4 bg-white">
                            <p className="text-zinc-900 text-xs font-bold truncate mb-2">{item.publicId}</p>
                            <div className="flex gap-2 flex-wrap">
                                <button onClick={() => copyToClipboard(item.url)} className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 py-1.5 rounded text-xs flex items-center justify-center gap-2"><Copy size={12} /> Copy</button>
                                {item.resourceType === 'video' && (
                                    <button onClick={() => handleSetHero(item.url)} className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-1.5 rounded text-xs flex items-center justify-center gap-2"><Film size={12} /> Set Hero</button>
                                )}
                                <button onClick={() => handleDelete(item._id)} className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-xs"><Trash2 size={12} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
