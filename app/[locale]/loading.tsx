export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <span className="text-[#FF385C]">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1.5l10 10v11h-20v-11l10-10zm0 3.328l-8 8v8.672h16v-8.672l-8-8z"/>
                    </svg>
                </span>
                <span className="text-[28px] font-bold text-[#FF385C] tracking-tight">
                    Eilat Luxury
                </span>
            </div>
        </div>
    );
}
