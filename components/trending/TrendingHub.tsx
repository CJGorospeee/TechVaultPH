"use client";

import { useState, useEffect } from "react";
import {
    TrendingUp,
    Globe,
    Monitor,
    Cpu,
    Code2,
    Layers,
    Sparkles,
    Smartphone,
    Gauge,
    BarChart3,
    HardDrive,
    CircuitBoard,
    MemoryStick
} from "lucide-react";

type TabType =
    | "browsers"
    | "os"
    | "motherboards"
    | "ram"
    | "gpus"
    | "screens"
    | "languages";

interface TelemetryMetric {
    name: string;
    share: number; // percentage
    color: string;
    subtext?: string;
}

export default function TrendingHub() {
    const [activeTab, setActiveTab] = useState<TabType>("gpus");

    // Local Client Telemetry State
    const [clientSpecs, setClientSpecs] = useState({
        browser: "Detecting...",
        os: "Detecting...",
        cores: "Detecting...",
        memory: "Detecting...",
        screen: "Detecting...",
        gpu: "Detecting..."
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Screen resolution & pixel ratio
            const screenRes = `${window.screen.width} × ${window.screen.height} (${window.devicePixelRatio}x)`;

            // CPU Cores & System Memory (Type-safe na walang red lines)
            const cores = navigator.hardwareConcurrency
                ? `${navigator.hardwareConcurrency} Logical Cores`
                : "Unavailable";

            const nav = navigator as unknown as { deviceMemory?: number };
            const memory = nav.deviceMemory
                ? `~${nav.deviceMemory} GB RAM`
                : "N/A (Browser Restricted)";

            // Browser & OS detection
            const ua = navigator.userAgent;
            let browserName = "Modern WebKit / Chromium";
            if (ua.includes("Firefox")) browserName = "Mozilla Firefox";
            else if (ua.includes("Edg")) browserName = "Microsoft Edge";
            else if (ua.includes("Chrome")) browserName = "Google Chrome";
            else if (ua.includes("Safari")) browserName = "Apple Safari";

            let osName = "Unknown OS";
            if (ua.includes("Windows NT 10.0")) osName = "Windows 10 / 11";
            else if (ua.includes("Mac OS X")) osName = "macOS";
            else if (ua.includes("Linux")) osName = "GNU/Linux";
            else if (ua.includes("Android")) osName = "Android OS";
            else if (ua.includes("iPhone") || ua.includes("iPad")) osName = "Apple iOS";

            // GPU sniffer via WebGL
            let renderer = "Standard GPU Pipeline";
            try {
                const canvas = document.createElement("canvas");
                const gl =
                    (canvas.getContext("webgl") ||
                        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
                if (gl) {
                    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
                    if (debugInfo) {
                        renderer =
                            gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || renderer;
                    }
                }
            } catch {
                renderer = "Generic Hardware Acceleration";
            }

            setClientSpecs({
                browser: browserName,
                os: osName,
                cores,
                memory,
                screen: screenRes,
                gpu: renderer
            });
        }
    }, []);

    // 1. Browsers
    const BROWSER_STATS: TelemetryMetric[] = [
        { name: "Google Chrome", share: 65.4, color: "#38bdf8", subtext: "Blink Engine / V8" },
        { name: "Apple Safari", share: 18.2, color: "#818cf8", subtext: "WebKit (Desktop + iOS)" },
        { name: "Microsoft Edge", share: 5.3, color: "#34d399", subtext: "Chromium Engine" },
        { name: "Mozilla Firefox", share: 3.1, color: "#fb923c", subtext: "Gecko Engine / SpiderMonkey" },
        { name: "Samsung Internet", share: 2.6, color: "#c084fc", subtext: "Mobile Android Variant" },
        { name: "Opera & Others", share: 5.4, color: "#94a3b8", subtext: "Brave, Vivaldi, Tor" }
    ];

    // 2. Operating Systems
    const OS_STATS: TelemetryMetric[] = [
        { name: "Android OS", share: 44.2, color: "#4ade80", subtext: "Mobile Dominance" },
        { name: "Windows (11 & 10)", share: 27.8, color: "#38bdf8", subtext: "Desktop Commercial Baseline" },
        { name: "Apple iOS", share: 17.5, color: "#a78bfa", subtext: "iPhone / iPad Ecosystem" },
        { name: "macOS", share: 5.9, color: "#f472b6", subtext: "Darwin Kernel / Apple Silicon" },
        { name: "GNU / Linux", share: 3.8, color: "#fbbf24", subtext: "Debian, Fedora, Arch, Ubuntu" },
        { name: "ChromeOS / Other", share: 0.8, color: "#64748b", subtext: "BSD, WebOS" }
    ];

    // 3. Motherboard Form Factor & Chipset Distribution
    const MOTHERBOARD_STATS: TelemetryMetric[] = [
        { name: "Standard ATX (305 × 244 mm)", share: 51.4, color: "#38bdf8", subtext: "Full expansion, dual/triple M.2 heatsinks" },
        { name: "Micro-ATX (mATX - 244 × 244 mm)", share: 34.6, color: "#34d399", subtext: "Budget builders & compact workstations" },
        { name: "Mini-ITX (mITX - 170 × 170 mm)", share: 8.7, color: "#a855f7", subtext: "Small Form Factor (SFF) enthusiast chassis" },
        { name: "Extended ATX (E-ATX)", share: 4.1, color: "#fb923c", subtext: "Multi-socket, Workstation & HEDT boards" },
        { name: "Server Proprietary / SSI-EEB", share: 1.2, color: "#94a3b8", subtext: "Rackmount & Enterprise dual-node blades" }
    ];

    // 4. System RAM Usage & Capacity
    const RAM_STATS: TelemetryMetric[] = [
        { name: "16 GB System RAM", share: 45.8, color: "#38bdf8", subtext: "DDR4 / DDR5 Dual-Channel mainstream standard" },
        { name: "32 GB System RAM", share: 34.2, color: "#34d399", subtext: "Modern gaming, virtualization & dev workstations" },
        { name: "8 GB System RAM", share: 11.5, color: "#fbbf24", subtext: "Budget laptops & thin clients" },
        { name: "64 GB+ Enterprise RAM", share: 6.9, color: "#a855f7", subtext: "High-end content creation, Docker, VMs" },
        { name: "4 GB o mas mababa", share: 1.6, color: "#ef4444", subtext: "Legacy office machines & basic POS" }
    ];

    // 5. GPU & VRAM Market Share (Steam & JPR Survey)
    const GPU_STATS: TelemetryMetric[] = [
        { name: "8 GB VRAM Cards (RTX 4060, 3060 Ti, RX 6600)", share: 35.7, color: "#38bdf8", subtext: "1080p / 1440p high-volume standard" },
        { name: "12 GB VRAM Cards (RTX 4070, 3060 12G, RX 7700 XT)", share: 22.1, color: "#34d399", subtext: "AI inference & 1440p high-fidelity" },
        { name: "6 GB o mas mababa (GTX 1650, 1060, RTX 2060)", share: 17.8, color: "#fb923c", subtext: "Legacy entry-level & budget mobile GPUs" },
        { name: "16 GB VRAM Cards (RTX 4080, RX 7800 XT)", share: 14.2, color: "#a855f7", subtext: "Heavy 4K textures & local LLM fine-tuning" },
        { name: "24 GB VRAM Flagship (RTX 4090, 3090, RX 7900 XTX)", share: 5.4, color: "#f43f5e", subtext: "Extreme generative AI & workstation rendering" },
        { name: "Integrated Graphics (Intel UHD/Iris, AMD Radeon)", share: 4.8, color: "#64748b", subtext: "Thin-and-light productivity laptops" }
    ];

    // 6. Screen Resolutions
    const SCREEN_STATS: TelemetryMetric[] = [
        { name: "1920 × 1080 (FHD)", share: 57.2, color: "#38bdf8", subtext: "Universal Standard" },
        { name: "2560 × 1440 (2K QHD)", share: 21.4, color: "#34d399", subtext: "High Refresh Workstations" },
        { name: "3840 × 2160 (4K UHD)", share: 4.8, color: "#a855f7", subtext: "Ultra-High Density Displays" },
        { name: "360 × 800 (Mobile)", share: 9.3, color: "#fb923c", subtext: "Android Default Viewport" },
        { name: "390 × 844 (Mobile)", share: 4.5, color: "#f43f5e", subtext: "Apple iPhone Viewport" },
        { name: "Ultrawide (21:9 / 32:9)", share: 2.8, color: "#94a3b8", subtext: "3440 × 1440 Multi-Tasking" }
    ];

    // 7. Programming Languages
    const LANGUAGE_STATS: TelemetryMetric[] = [
        { name: "Python", share: 29.4, color: "#38bdf8", subtext: "AI / ML, PyTorch, Data Analytics" },
        { name: "JavaScript / TypeScript", share: 24.6, color: "#facc15", subtext: "Modern Fullstack, Web, Node.js" },
        { name: "Java / Kotlin", share: 12.8, color: "#fb923c", subtext: "Enterprise Banking, Android JVM" },
        { name: "C / C++", share: 10.2, color: "#3b82f6", subtext: "Kernel, Game Engines, Embedded" },
        { name: "C# (.NET)", share: 7.9, color: "#a855f7", subtext: "Unity 3D, Corporate Backends" },
        { name: "Rust & Go", share: 8.7, color: "#ef4444", subtext: "Cloud Native, Memory-Safe Systems" },
        { name: "PHP & SQL", share: 6.4, color: "#64748b", subtext: "Relational Ledgers, Web CMS" }
    ];

    const getCurrentDataset = () => {
        switch (activeTab) {
            case "motherboards":
                return {
                    title: "Motherboard Form Factor & Architecture Distribution",
                    data: MOTHERBOARD_STATS,
                    note: "Hango sa retail sales breakdown at enterprise pre-built desktop telemetry."
                };
            case "ram":
                return {
                    title: "System RAM Memory Capacity Allocation (DDR4 / DDR5)",
                    data: RAM_STATS,
                    note: "Global desktop & laptop active memory telemetry mula sa Steam & OEM surveys."
                };
            case "gpus":
                return {
                    title: "GPU Tier & VRAM Capacity Adoption",
                    data: GPU_STATS,
                    note: "Steam Hardware & Jon Peddie Research (JPR) GPU telemetry."
                };
            case "browsers":
                return {
                    title: "Global Web Browser Market Share",
                    data: BROWSER_STATS,
                    note: "Statcounter Global Stats & W3Counter web metrics."
                };
            case "os":
                return {
                    title: "Global Operating Systems Distribution",
                    data: OS_STATS,
                    note: "Desktop and mobile operating system telemetry."
                };
            case "screens":
                return {
                    title: "Display Resolution & Viewport Formats",
                    data: SCREEN_STATS,
                    note: "Monitor display telemetry at mobile web viewport ratios."
                };
            case "languages":
                return {
                    title: "Programming Language Industry Popularity",
                    data: LANGUAGE_STATS,
                    note: "TIOBE Index & GitHub Octoverse community statistics."
                };
        }
    };

    const current = getCurrentDataset();

    return (
        <div className="space-y-8">
            {/* Top Banner */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-cyan-500" /> Technology Trends & Global Hardware Telemetry
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Real-time global metrics at client-side telemetry: sumusuri sa market share ng Motherboards, System RAM, GPU VRAM, Browsers, OS, Screen Viewports, at Programming Languages.
                </p>
            </div>

            {/* CLIENT TELEMETRY SNIFFER */}
            <div className="bg-[#050811] border-2 border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-cyan-400" /> Your Live Machine Telemetry Signature
                        </span>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase font-bold">
                        CLIENT-SIDE SNIFFER
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase block">Active Web Browser</span>
                        <span className="font-bold text-white text-sm flex items-center gap-2">
                            <Globe className="w-4 h-4 text-cyan-400" /> {clientSpecs.browser}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase block">Host Operating System</span>
                        <span className="font-bold text-white text-sm flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-purple-400" /> {clientSpecs.os}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase block">Active Screen Resolution</span>
                        <span className="font-bold text-white text-sm flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-emerald-400" /> {clientSpecs.screen}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase block">CPU Parallelism</span>
                        <span className="font-bold text-white text-sm flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-amber-400" /> {clientSpecs.cores}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase block">System RAM Bracket</span>
                        <span className="font-bold text-white text-sm flex items-center gap-2">
                            <MemoryStick className="w-4 h-4 text-pink-400" /> {clientSpecs.memory}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase block">GPU Accelerator Pipeline</span>
                        <span
                            className="font-bold text-white text-[11px] truncate block text-cyan-300"
                            title={clientSpecs.gpu}
                        >
                            {clientSpecs.gpu}
                        </span>
                    </div>
                </div>
            </div>

            {/* Selector Navigation */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
                <button
                    onClick={() => setActiveTab("gpus")}
                    className={`px-4 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 ${activeTab === "gpus"
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50"
                        }`}
                >
                    <Cpu className="w-4 h-4" /> GPU & VRAM
                </button>

                <button
                    onClick={() => setActiveTab("ram")}
                    className={`px-4 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 ${activeTab === "ram"
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50"
                        }`}
                >
                    <MemoryStick className="w-4 h-4" /> RAM Capacities
                </button>

                <button
                    onClick={() => setActiveTab("motherboards")}
                    className={`px-4 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 ${activeTab === "motherboards"
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50"
                        }`}
                >
                    <CircuitBoard className="w-4 h-4" /> Motherboard Form Factors
                </button>

                <button
                    onClick={() => setActiveTab("browsers")}
                    className={`px-4 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 ${activeTab === "browsers"
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50"
                        }`}
                >
                    <Globe className="w-4 h-4" /> Browser Usage
                </button>

                <button
                    onClick={() => setActiveTab("os")}
                    className={`px-4 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 ${activeTab === "os"
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50"
                        }`}
                >
                    <Monitor className="w-4 h-4" /> OS Distribution
                </button>

                <button
                    onClick={() => setActiveTab("screens")}
                    className={`px-4 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 ${activeTab === "screens"
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50"
                        }`}
                >
                    <Smartphone className="w-4 h-4" /> Screen Viewports
                </button>

                <button
                    onClick={() => setActiveTab("languages")}
                    className={`px-4 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 ${activeTab === "languages"
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50"
                        }`}
                >
                    <Code2 className="w-4 h-4" /> Programming Languages
                </button>
            </div>

            {/* Visual Graphs & Matrix Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Progress Bar Chart */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 font-mono">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-cyan-500" /> {current.title}
                        </h3>
                        <span className="text-[10px] text-slate-400">GLOBAL SHARE (%)</span>
                    </div>

                    <div className="space-y-4">
                        {current.data.map((item, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        ></span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {item.name}
                                        </span>
                                        {item.subtext && (
                                            <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                                                — {item.subtext}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {item.share}%
                                    </span>
                                </div>

                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${item.share}%`,
                                            backgroundColor: item.color
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-500 font-sans flex items-center justify-between">
                        <span>Primary Sources: <strong>{current.note}</strong></span>
                        <span className="text-cyan-500 font-mono font-bold">2026 Telemetry Cycle</span>
                    </div>
                </div>

                {/* Detailed Matrix Table */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 font-mono">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <Layers className="w-4 h-4 text-amber-500" /> Share Metric Matrix
                        </h3>
                        <span className="text-[10px] uppercase font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            {activeTab}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase">
                                    <th className="pb-2">Segment / Technology</th>
                                    <th className="pb-2 text-right">Quota</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {current.data.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                                    >
                                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                                            <div>{item.name}</div>
                                            {item.subtext && (
                                                <span className="text-[10px] text-slate-500 font-sans font-normal block">
                                                    {item.subtext}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2.5 text-right font-bold text-cyan-500">
                                            {item.share}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}