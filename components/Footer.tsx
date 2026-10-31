"use client";

import { Lock } from "lucide-react";

export default function Footer({ onOpenAdmin }: { onOpenAdmin: () => void }) {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 mt-12 text-xs font-mono text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>TechVault Hub PH // Enterprise Systems Diagnostic Lab</span>
                </div>

                <div className="flex items-center gap-4">
                    <span>Pindutin ang <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px]">Ctrl+Shift+E</kbd> para sa editor</span>
                    <button
                        onClick={onOpenAdmin}
                        title="Secret Editor Override"
                        className="p-1 hover:text-cyan-500 transition"
                    >
                        <Lock className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}