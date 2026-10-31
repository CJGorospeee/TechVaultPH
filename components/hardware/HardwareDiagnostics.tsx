"use client";

import { useState, useEffect } from "react";
import { Cpu, Search, AlertCircle, Wrench, Zap, CheckCircle2, BookOpen, Clock, Volume2, Radio } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PostCode {
    hex: string;
    category: "CPU" | "RAM" | "Storage/VGA" | "Boot";
    description: string;
    remedy: string;
}

interface BeepCode {
    pattern: string;
    soundSequence: string; // e.g. "● ● ●" or "● ▬ ▬"
    biosType: "AMI BIOS" | "Award / Phoenix" | "Dell / HP";
    meaning: string;
    remedy: string;
}

interface KbEntry {
    id: string;
    title: string;
    content: string;
    category: string;
    image_url: string | null;
    created_at: string;
}

interface WirePin {
    pin: number;
    label: string;
    fullName: string;
    isStriped: boolean;
    stripeColor: string;
    textColor: string;
}

const POST_CODES: PostCode[] = [
    { hex: "00", category: "CPU", description: "Not used / CPU initial load failure", remedy: "Suriin ang 8-pin EPS 12V power connector o tignan kung may bent socket pins." },
    { hex: "15", category: "RAM", description: "Pre-memory North-Bridge initialization", remedy: "Tiyaking nakalapat ang memory sa tamang slots (A2 at B2)." },
    { hex: "4C", category: "RAM", description: "Memory training failure (XMP/EXPO unstable)", remedy: "I-clear ang CMOS (JBAT1 jumper / tanggalin ang coin cell battery) para ma-reset sa default JEDEC speed." },
    { hex: "55", category: "RAM", description: "Memory not installed / unreadable", remedy: "Tanggalin at linisin ang gold contacts ng RAM gamit ang pencil eraser; i-test ang bawat stick nang paisa-isa." },
    { hex: "A2", category: "Storage/VGA", description: "IDE/SATA/NVMe Detect Loop", remedy: "I-unplug ang non-boot secondary drives; i-reseat ang M.2 NVMe SSD." },
    { hex: "99", category: "Storage/VGA", description: "Super IO / PCIe peripheral initialization", remedy: "Tanggalin ang lahat ng external USB peripherals maliban sa keyboard; i-reseat ang GPU sa x16 slot." },
    { hex: "dE", category: "Boot", description: "Operating system boot failure", remedy: "I-verify ang UEFI Boot Order sa BIOS at suriin ang partition integrity gamit ang bootable rescue media." },
    { hex: "FF", category: "CPU", description: "Faulty motherboard or corrupted BIOS firmware", remedy: "Gumamit ng USB BIOS Flashback button sa likod ng I/O panel para mag-reflash ng fresh firmware." },
];

const BEEP_CODES: BeepCode[] = [
    {
        pattern: "1 Short Beep",
        soundSequence: "●",
        biosType: "AMI BIOS",
        meaning: "Normal POST Success / System Healthy",
        remedy: "Walang sira. Maayos na naipasa ng hardware ang self-test at handa nang mag-boot sa OS."
    },
    {
        pattern: "1 Long, 2 Short",
        soundSequence: "▬  ● ●",
        biosType: "Award / Phoenix",
        meaning: "Video / GPU Adapter Error",
        remedy: "Hindi ma-detect ang graphics card. I-reseat ang GPU sa primary PCIe slot at suriin ang 12VHPWR / PCIe 8-pin power cables."
    },
    {
        pattern: "1 Long, 3 Short",
        soundSequence: "▬  ● ● ●",
        biosType: "AMI BIOS",
        meaning: "Conventional / Extended Memory Failure",
        remedy: "Suriin ang RAM sticks. I-reseat sa A2/B2 slots o subukang i-boot gamit ang isang stick muna."
    },
    {
        pattern: "Continuous Long Beeps",
        soundSequence: "▬ ▬ ▬ ▬ ...",
        biosType: "Award / Phoenix",
        meaning: "Memory Modules Not Detected",
        remedy: "Walang RAM na nakakabit o marumi ang DIMM slot contacts. Linisin gamit ang contact cleaner o isopropyl alcohol."
    },
    {
        pattern: "Continuous High-Low Siren",
        soundSequence: "●~●~●~●~",
        biosType: "Award / Phoenix",
        meaning: "CPU Overheating / Thermal Runaway",
        remedy: "Masyadong mataas ang temperatura ng CPU. Suriin kung umiikot ang AIO pump/fan at tiyaking may thermal paste."
    },
    {
        pattern: "5 Short Beeps",
        soundSequence: "● ● ● ● ●",
        biosType: "AMI BIOS",
        meaning: "Process Error (CPU Failure)",
        remedy: "Hindi tumutugon ang processor. Suriin kung may bent pins sa CPU socket o maluwag ang cooler mounting pressure."
    }
];

export default function HardwareDiagnostics() {
    const [searchCode, setSearchCode] = useState("");
    const [wireStandard, setWireStandard] = useState<"T568B" | "T568A">("T568B");
    const [biosFilter, setBiosFilter] = useState<string>("All");
    const [liveEntries, setLiveEntries] = useState<KbEntry[]>([]);
    const [loadingEntries, setLoadingEntries] = useState(true);

    const fetchLiveEntries = async () => {
        try {
            setLoadingEntries(true);
            const { data, error } = await supabase
                .from("kb_entries")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setLiveEntries(data || []);
        } catch (err) {
            console.error("Error fetching kb entries:", err);
        } finally {
            setLoadingEntries(false);
        }
    };

    useEffect(() => {
        fetchLiveEntries();
    }, []);

    const filteredCodes = POST_CODES.filter(
        (c) =>
            c.hex.toLowerCase().includes(searchCode.toLowerCase()) ||
            c.category.toLowerCase().includes(searchCode.toLowerCase()) ||
            c.description.toLowerCase().includes(searchCode.toLowerCase())
    );

    const filteredBeeps = BEEP_CODES.filter(
        (b) => biosFilter === "All" || b.biosType === biosFilter
    );

    // T568B Standard
    const t568bColors: WirePin[] = [
        { pin: 1, label: "W/O", fullName: "White / Orange", isStriped: true, stripeColor: "#ea580c", textColor: "text-orange-950 dark:text-orange-900" },
        { pin: 2, label: "O", fullName: "Solid Orange", isStriped: false, stripeColor: "#ea580c", textColor: "text-white" },
        { pin: 3, label: "W/G", fullName: "White / Green", isStriped: true, stripeColor: "#16a34a", textColor: "text-emerald-950 dark:text-emerald-900" },
        { pin: 4, label: "BL", fullName: "Solid Blue", isStriped: false, stripeColor: "#2563eb", textColor: "text-white" },
        { pin: 5, label: "W/BL", fullName: "White / Blue", isStriped: true, stripeColor: "#2563eb", textColor: "text-blue-950 dark:text-blue-900" },
        { pin: 6, label: "G", fullName: "Solid Green", isStriped: false, stripeColor: "#16a34a", textColor: "text-white" },
        { pin: 7, label: "W/BR", fullName: "White / Brown", isStriped: true, stripeColor: "#854d0e", textColor: "text-amber-950 dark:text-amber-900" },
        { pin: 8, label: "BR", fullName: "Solid Brown", isStriped: false, stripeColor: "#854d0e", textColor: "text-white" },
    ];

    // T568A Standard
    const t568aColors: WirePin[] = [
        { pin: 1, label: "W/G", fullName: "White / Green", isStriped: true, stripeColor: "#16a34a", textColor: "text-emerald-950 dark:text-emerald-900" },
        { pin: 2, label: "G", fullName: "Solid Green", isStriped: false, stripeColor: "#16a34a", textColor: "text-white" },
        { pin: 3, label: "W/O", fullName: "White / Orange", isStriped: true, stripeColor: "#ea580c", textColor: "text-orange-950 dark:text-orange-900" },
        { pin: 4, label: "BL", fullName: "Solid Blue", isStriped: false, stripeColor: "#2563eb", textColor: "text-white" },
        { pin: 5, label: "W/BL", fullName: "White / Blue", isStriped: true, stripeColor: "#2563eb", textColor: "text-blue-950 dark:text-blue-900" },
        { pin: 6, label: "O", fullName: "Solid Orange", isStriped: false, stripeColor: "#ea580c", textColor: "text-white" },
        { pin: 7, label: "W/BR", fullName: "White / Brown", isStriped: true, stripeColor: "#854d0e", textColor: "text-amber-950 dark:text-amber-900" },
        { pin: 8, label: "BR", fullName: "Solid Brown", isStriped: false, stripeColor: "#854d0e", textColor: "text-white" },
    ];

    const currentPins = wireStandard === "T568B" ? t568bColors : t568aColors;

    return (
        <div className="space-y-8 font-sans">
            {/* Top Banner */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-cyan-500" /> Hardware Diagnostics & Field Engineering Matrix
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    BIOS 7-Segment POST Code reference, Motherboard Beep Code Triage, at RJ45 crimping pinout visualizer.
                </p>
            </div>

            {/* Grid: POST Code (Left 7) & RJ45 Pinouts (Right 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* POST Code Inspector */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-cyan-500" /> Motherboard Q-Code / POST Hex Lookup
                            </h3>
                            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                                Two-digit debug display errors mula sa ASUS, MSI, ASRock, at Gigabyte.
                            </p>
                        </div>

                        <div className="relative w-full sm:w-48">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search hex code..."
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                className="w-full pl-8 pr-2 py-1.5 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                        {filteredCodes.map((item) => (
                            <div
                                key={item.hex}
                                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col gap-1.5 hover:border-cyan-500/50 transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-bold border border-red-500/30 text-sm">
                                            {item.hex}
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {item.description}
                                        </span>
                                    </div>
                                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-sans flex items-start gap-1.5 mt-1 bg-white dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <Wrench className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                                    <span><strong>Fix:</strong> {item.remedy}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RJ45 Pinout Guide */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 font-mono">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" /> RJ45 Cable Termination Matrix
                        </h3>

                        <div className="flex gap-1 text-[11px]">
                            {(["T568B", "T568A"] as const).map((std) => (
                                <button
                                    key={std}
                                    onClick={() => setWireStandard(std)}
                                    className={`px-2.5 py-1 rounded font-bold transition ${wireStandard === std
                                            ? "bg-amber-500 text-white shadow-sm"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-white"
                                        }`}
                                >
                                    {std}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 font-sans">
                        Pinout order para sa RJ45 Modular Jack / Plug (Clip / Tab facing down, pins facing up).
                    </p>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                        <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
                            {currentPins.map((wire) => {
                                const backgroundStyle = wire.isStriped
                                    ? {
                                        backgroundImage: `repeating-linear-gradient(
                        135deg,
                        #f8fafc 0px,
                        #f8fafc 5px,
                        ${wire.stripeColor} 5px,
                        ${wire.stripeColor} 11px
                      )`,
                                    }
                                    : {
                                        backgroundColor: wire.stripeColor,
                                    };

                                return (
                                    <div
                                        key={wire.pin}
                                        className="flex flex-col items-center gap-2 group cursor-pointer"
                                        title={`Pin ${wire.pin}: ${wire.fullName}`}
                                    >
                                        <div
                                            style={backgroundStyle}
                                            className="w-full h-28 rounded-md border border-slate-700 shadow-md flex flex-col justify-between items-center py-1 transition-transform group-hover:scale-105"
                                        >
                                            <span className="text-[10px] font-bold px-1 rounded bg-black/60 text-white font-mono leading-none">
                                                {wire.pin}
                                            </span>
                                            <div className="w-2.5 h-1 rounded-sm bg-amber-400"></div>
                                        </div>

                                        <span className="text-[10px] font-bold font-mono text-cyan-400 group-hover:text-amber-400 transition-colors">
                                            {wire.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 font-sans space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                            <CheckCircle2 className="w-4 h-4" /> Standard Rule:
                        </div>
                        <p className="text-[11px] leading-relaxed">
                            <strong>T568B</strong> ang karaniwang gamit sa commercial structured cabling sa Pilipinas.
                            Straight-through: parehong dulo ay T568B. Crossover: isang dulo ay T568A at ang kabila ay T568B.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- BAGONG SECTION: MOTHERBOARD BEEP CODE DIAGNOSTIC MATRIX --- */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Volume2 className="w-5 h-5 text-amber-500" /> Chassis Speaker / POST Beep Code Triage Matrix
                        </h3>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">
                            Audio diagnostics mula sa internal motherboard piezo buzzer kapag walang video output o display signal.
                        </p>
                    </div>

                    {/* BIOS Filter Selector */}
                    <div className="flex items-center gap-1.5 text-xs">
                        {["All", "AMI BIOS", "Award / Phoenix"].map((b) => (
                            <button
                                key={b}
                                onClick={() => setBiosFilter(b)}
                                className={`px-3 py-1 rounded-lg border transition ${biosFilter === b
                                        ? "bg-amber-500 text-white font-bold border-amber-500 shadow-sm"
                                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-white"
                                    }`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBeeps.map((beep, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3 hover:border-amber-500/50 transition flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold">
                                        {beep.biosType}
                                    </span>
                                    <span className="text-cyan-400 font-mono tracking-widest text-sm bg-black/40 px-2 py-0.5 rounded">
                                        {beep.soundSequence}
                                    </span>
                                </div>

                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {beep.pattern}
                                </h4>

                                <p className="text-xs text-red-500 dark:text-red-400 font-sans font-medium">
                                    {beep.meaning}
                                </p>
                            </div>

                            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-sans flex items-start gap-1.5 bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                                <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span><strong>Remedy:</strong> {beep.remedy}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Supabase Knowledge Base Stream */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-cyan-500" />
                        <h3 className="font-mono font-bold text-base text-slate-900 dark:text-white">
                            TechVault Live Knowledge Base Stream
                        </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        SUPABASE LIVE
                    </span>
                </div>

                {loadingEntries ? (
                    <p className="text-xs font-mono text-slate-400 py-4 text-center">
                        Kinukuha ang pinakabagong entries mula sa database...
                    </p>
                ) : liveEntries.length === 0 ? (
                    <div className="text-center py-8 font-mono text-xs text-slate-500 space-y-2">
                        <p>Wala pang naka-save na live entries sa database.</p>
                        <p className="text-cyan-500">Pindutin ang Ctrl + Shift + E para magdagdag ng unang guide!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {liveEntries.map((item) => (
                            <div
                                key={item.id}
                                className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-mono">
                                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-bold uppercase">
                                            {item.category}
                                        </span>
                                        <span className="text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h4 className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                                        {item.title}
                                    </h4>

                                    {item.image_url && (
                                        <div className="h-32 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-sans line-clamp-4 leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}