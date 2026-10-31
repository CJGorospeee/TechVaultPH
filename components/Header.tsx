"use client";

import { useTheme } from "next-themes";
import { Server, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({
    activeTab,
    setActiveTab,
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#080c14]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Brand */}
                <div
                    className="flex items-center gap-2.5 cursor-pointer shrink-0"
                    onClick={() => setActiveTab("visuals")}
                >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                        <Server className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="font-mono font-bold text-base tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                            TECH<span className="text-cyan-500">VAULT</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30">
                                HUB PH
                            </span>
                        </span>
                    </div>
                </div>

                {/* Navigation Tabs - Kasama na ang Dev Hub */}
                <nav className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto py-1">
                    {[
                        { id: "visuals", label: "Visual Labs" },
                        { id: "topologies", label: "🌐 Topologies" },
                        { id: "tools", label: "🧰 IT Tools" },
                        { id: "servers", label: "Servers & DC" },
                        { id: "hardware", label: "Hardware" },
                        { id: "glossary", label: "📖 Glossary" },
                        { id: "dev", label: "💻 Dev Hub" },
                        { id: "trending", label: "📈 Trending" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition text-xs ${activeTab === tab.id
                                    ? "bg-cyan-600 text-white font-bold shadow-sm"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Theme Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-4 h-4 text-amber-400" />
                            ) : (
                                <Moon className="w-4 h-4 text-slate-700" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}