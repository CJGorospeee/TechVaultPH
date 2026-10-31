"use client";

import { useState } from "react";
import { Server, Activity, Power, ShieldAlert, Cpu, Network } from "lucide-react";

interface RackItem {
    uRange: string;
    name: string;
    category: "network" | "compute" | "power" | "storage";
    powerDraw: string;
    temp: string;
    status: "Normal" | "Standby" | "Active";
    desc: string;
    checklist: string[];
}

const RACK_UNITS: Record<string, RackItem> = {
    tor_switch: {
        uRange: "U41 - U42",
        name: "Top-of-Rack (ToR) 100GbE Spine Switch",
        category: "network",
        powerDraw: "350W",
        temp: "42°C",
        status: "Active",
        desc: "Primary aggregation network layer na nagkokonekta sa bawat rack server papuntang core datacenter spine via QSFP28 links.",
        checklist: [
            "I-verify ang LACP bonding sa server uplink pairs.",
            "Suriin ang airflow direction (Front-to-Back vs Back-to-Front hot aisle).",
            "Siguraduhing naka-tag ang tamang VLAN IDs sa switch trunk ports."
        ]
    },
    patch_panel: {
        uRange: "U39 - U40",
        name: "High-Density Cat6A / Fiber Patch Panel",
        category: "network",
        powerDraw: "Passive (0W)",
        temp: "Ambient (24°C)",
        status: "Normal",
        desc: "Structured horizontal cabling distribution point para sa short-run patch cords patungong server network interface cards.",
        checklist: [
            "Panatilihin ang minimum bend radius para maiwasan ang optical attenuation sa fiber.",
            "Sundin ang T568B standard sa lahat ng copper terminations.",
            "Lagyan ng cable management D-rings para hindi humarang sa server exhaust."
        ]
    },
    app_server_1: {
        uRange: "U30 - U31",
        name: "2U Enterprise Dual-Socket Xeon Server",
        category: "compute",
        powerDraw: "650W",
        temp: "54°C",
        status: "Normal",
        desc: "Virtualization hypervisor host (Proxmox/ESXi) na nagpapatakbo ng production workload instances gamit ang dual 32-core CPUs at 512GB ECC DDR5.",
        checklist: [
            "Tiyaking naka-enable ang VT-x / AMD-V at SR-IOV sa UEFI BIOS.",
            "I-configure ang dedicated iDRAC / iLO port sa hiwalay na management subnet.",
            "Siguraduhing gumagana ang fan redundancy matrix bago isalang sa peak hours."
        ]
    },
    san_storage: {
        uRange: "U18 - U21",
        name: "4U High-Density NVMe-oF SAN Array",
        category: "storage",
        powerDraw: "920W",
        temp: "48°C",
        status: "Active",
        desc: "24-bay NVMe all-flash array na nagbibigay ng low-latency shared block storage para sa database clusters via redundant Fibre Channel / RoCE.",
        checklist: [
            "I-monitor ang write endurance (TBW) metrics ng NVMe enterprise drives.",
            "I-validate ang Multipath I/O (MPIO) load balancing policies.",
            "Magsagawa ng regular battery backup unit (BBU) self-test sa storage controllers."
        ]
    },
    managed_pdu: {
        uRange: "U01 - U02",
        name: "Zero-U / Horizontal Switched PDU System",
        category: "power",
        powerDraw: "3.2 kW Total",
        temp: "32°C",
        status: "Normal",
        desc: "A/B redundant power rail distribution na may per-outlet power metering, remote power cycle capability, at thermal sensors.",
        checklist: [
            "Paghiwalayin ang PSU 1 sa Rail A (UPS 1) at PSU 2 sa Rail B (UPS 2 / Generator).",
            "Huwag lumagpas sa 80% maximum continuous rated amperage ng branch circuit.",
            "I-set up ang SNMP trap alerts para sa overload warning thresholds."
        ]
    }
};

export default function ServerRackModule() {
    const [selectedUnit, setSelectedUnit] = useState<string>("app_server_1");
    const unit = RACK_UNITS[selectedUnit];

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                    <Server className="w-6 h-6 text-cyan-500" /> Enterprise Rack Architecture & Diagnostics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Datacenter 42U rack cabinet layout, Out-of-Band Management (OOBM), at A/B power redundancy audit.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Rack Elevation Schematic (Left Column) */}
                <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-5 font-mono shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5 font-bold text-white">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 42U Server Rack // Cabinet 01
                        </span>
                        <span>Cold Aisle Intake</span>
                    </div>

                    {/* Interactive Rack Units Stack */}
                    <div className="space-y-2">
                        {[
                            { id: "tor_switch", label: "U41-U42 : 100GbE ToR Switch", color: "border-blue-500/50 bg-blue-950/40 text-blue-400" },
                            { id: "patch_panel", label: "U39-U40 : Cat6A Fiber Patch Panel", color: "border-slate-700 bg-slate-800/40 text-slate-300" },
                            { id: "app_server_1", label: "U30-U31 : 2U Virtualization Node (Dell R760 / HPE DL380)", color: "border-cyan-500/50 bg-cyan-950/40 text-cyan-300" },
                            { id: "san_storage", label: "U18-U21 : 4U NVMe-oF Storage Shelf", color: "border-amber-500/50 bg-amber-950/40 text-amber-300" },
                            { id: "managed_pdu", label: "U01-U02 : A/B Switched Power Distribution (PDU)", color: "border-emerald-500/50 bg-emerald-950/40 text-emerald-300" },
                        ].map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setSelectedUnit(r.id)}
                                className={`w-full text-left p-3 rounded-lg border text-xs font-bold transition flex items-center justify-between ${r.color} ${selectedUnit === r.id ? "ring-2 ring-cyan-400 brightness-125" : "hover:brightness-110"
                                    }`}
                            >
                                <span>{r.label}</span>
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
                                    Inspect
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                            <Power className="w-3.5 h-3.5 text-amber-400" /> Dual-Fed Grid A + B Active
                        </span>
                        <span className="text-emerald-400 font-bold">24.1°C Rack Ambient</span>
                    </div>
                </div>

                {/* Selected Unit Telemetry & Runbook (Right Column) */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 font-mono">
                        <div className="flex items-center justify-between">
                            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-bold border border-cyan-500/30">
                                {unit.uRange}
                            </span>
                            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                                <Activity className="w-3 h-3" /> Status: {unit.status}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {unit.name}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-sans leading-relaxed">
                                {unit.desc}
                            </p>
                        </div>

                        {/* Live Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <span className="text-[10px] text-slate-500 block">ESTIMATED DRAW</span>
                                <span className="text-base font-bold text-amber-500">{unit.powerDraw}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <span className="text-[10px] text-slate-500 block">THERMAL EXHAUST</span>
                                <span className="text-base font-bold text-cyan-500">{unit.temp}</span>
                            </div>
                        </div>

                        {/* Runbook Checklist */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                                Operational Runbook & Installation Checklist:
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-sans">
                                {unit.checklist.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-cyan-500 font-mono font-bold mt-0.5">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}