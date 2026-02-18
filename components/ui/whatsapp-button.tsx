"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
    const phoneNumber = "972505222536"; // Your number
    const message = encodeURIComponent("היי, אשמח לשמוע פרטים על חופשה באילת luxury!");

    return (
        <motion.a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="fixed bottom-36 left-6 z-[60] group" // Raised to avoid overlap with Accessibility button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
            <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-xl shadow-green-500/20 flex items-center gap-2 border-2 border-white/10 hover:border-white/30 transition-colors">
                <MessageCircle size={28} fill="white" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-bold pr-1">
                    דבר איתנו
                </span>
            </div>
        </motion.a>
    );
}
