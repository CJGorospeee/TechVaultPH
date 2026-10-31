"use client";

import { useState } from "react";
import { HardDrive } from "lucide-react";

interface RaidConfig {
    title: string;
    badge: string;
    desc: string;
    minDisks: string;
    tolerance: string;
    capacity: string;
    penalty: string;
    disks: string[][];
    types: string[][];
}

const RAID_DATA: Record<string, RaidConfig> = {
    raid0: {
        title: "RAID 0 (Block Striping)",
        badge: "Walang Redundancy // Max Speed",
        desc: "Hinahati ang data sa mga drives nang walang parity. Kapag bumigay ang kahit isang drive, sira ang buong array.",
        minDisks: "2 Drives",
        tolerance: "0 Disks (Catastrophic)",
        capacity: "N × Size (100%)",
        penalty: "Wala (Pinakamabilis)",
        disks: [
            ["Stripe A1", "Stripe A5"],
            ["Stripe A2", "Stripe A6"],
            ["Stripe A3", "Stripe A7"],
            ["Stripe A4", "Stripe A8"],
        ],
        types: [
            ["data", "data"],
            ["data", "data"],
            ["data", "data"],
            ["data", "data"],
        ],
    },
    raid1: {
        title: "RAID 1 (Disk Mirroring)",
        badge: "1:1 Full Mirror",
        desc: "Eksaktong kopya ng primary drive ang mirror drive. Ligtas sa 1 drive failure pero 50% lang ang usable capacity.",
        minDisks: "2 Drives",
        tolerance: "1 Disk Loss",
        capacity: "50% of Total Size",
        penalty: "Minimal write delay",
        disks: [
            ["Block A", "Block B"],
            ["Block A (Mirror)", "Block B (Mirror)"],
        ],
        types: [
            ["data", "data"],
            ["mirror", "mirror"],
        ],
    },
    raid5: {
        title: "RAID 5 (Striping + Distributed Parity)",
        badge: "Standard Fault Tolerance",
        desc: "Naka-distribute ang XOR parity blocks sa lahat ng member drives. Kayang mabuhay kahit may 1 sirang drive.",
        minDisks: "3 Drives",
        tolerance: "1 Disk Loss",
        capacity: "(N - 1) × Size",
        penalty: "4x Read-Modify-Write",
        disks: [
            ["Block A1", "Block B1", "Parity (C)"],
            ["Block A2", "Parity (B)", "Block C1"],
            ["Parity (A)", "Block B2", "Block C2"],
        ],
        types: [
            ["data", "data", "parity"],
            ["data", "parity", "data"],
            ["parity", "data", "data"],
        ],
    },
};

export default function RaidLab() {
    const [level, setLevel] = useState<string>("raid5");
    const data = RAID_DATA[level];

    return (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
                            <HardDrive className="w-5 h-5" />
                        </span>
                        <h2 className="text-lg font-bold font-mono">Enterprise RAID Array Visualizer</h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Pumili ng configuration para makita ang striping at distributed parity blocks.
                    </p>
                </div>

                {/* Tab Controls */}
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                    {(["raid0", "raid1", "raid5"] as const).map((rKey) => (
                        <button
                            key={rKey}
                            onClick={() => setLevel(rKey)}
                            className={`px-3 py-1.5 rounded-lg border transition ${level === rKey
                                    ? "border-amber-500 bg-amber-500/10 text-amber-500 font-bold"
                                    : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                }`}
                        >
                            {rKey.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
                {/* Disks Simulation Grid */}
                <div className="lg:col-span-8 bg-slate-50 dark:bg-[#0b101b] p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className={`grid grid-cols-${data.disks.length} gap-4`}>
                        {data.disks.map((blocks, dIdx) => (
                            <div
                                key={dIdx}
                                className="flex flex-col bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3"
                            >
                                <div className="text-center font-mono text-[11px] font-bold pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1">
                                    <HardDrive className="w-3.5 h-3.5 text-amber-500" /> DISK {dIdx + 1}
                                </div>
                                <div className="space-y-2">
                                    {blocks.map((blockName, bIdx) => {
                                        const type = data.types[dIdx][bIdx];
                                        let color = "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
                                        if (type === "parity") color = "bg-amber-500/20 text-amber-400 border-amber-500/40";
                                        if (type === "mirror") color = "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";

                                        return (
                                            <div
                                                key={bIdx}
                                                className={`p-2 rounded text-center text-[10px] font-mono font-bold border ${color}`}
                                            >
                                                {blockName}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Specs Column */}
                <div className="lg:col-span-4 space-y-4 font-mono">
                    <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] text-amber-500 uppercase font-semibold">
                            {data.badge}
                        </span>
                        <h3 className="text-lg font-bold mt-1 text-slate-900 dark:text-white">
                            {data.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                            {data.desc}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-500 text-[10px] block">MIN DISKS</span>
                            <span className="font-bold text-slate-900 dark:text-white">{data.minDisks}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-500 text-[10px] block">TOLERANCE</span>
                            <span className="font-bold text-emerald-500">{data.tolerance}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}