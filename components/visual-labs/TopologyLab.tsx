"use client";

import { useState } from "react";
import {
    Network,
    CheckCircle2,
    XCircle,
    Building2,
    HardDrive,
    Laptop,
    Server,
    Router,
    Shield,
    Wifi,
    Printer,
    Layers,
    Cpu
} from "lucide-react";

type TopologyType = "star" | "mesh" | "ring" | "bus" | "tree";

interface DeviceItem {
    name: string;
    type: string;
    role: string;
}

interface CompanyExample {
    company: string;
    sector: string;
    useCase: string;
}

interface TopologyDetails {
    title: string;
    architecture: string;
    redundancy: "High" | "Full" | "Medium" | "Zero";
    cablingCost: "High" | "Extreme" | "Medium" | "Low";
    scalability: string;
    pros: string[];
    cons: string[];
    devices: DeviceItem[];
    companies: CompanyExample[];
}

const TOPOLOGY_DATA: Record<TopologyType, TopologyDetails> = {
    star: {
        title: "Star Topology",
        architecture:
            "Lahat ng endpoint devices (workstations, servers, APs) ay nakakabit sa iisang sentral na Core o Distribution Switch sa pamamagitan ng dedicated point-to-point cables.",
        redundancy: "Medium",
        cablingCost: "Medium",
        scalability: "Napakadali; magsalpak lamang ng bagong patch cable sa bakanteng port ng switch.",
        pros: [
            "Fault Isolation: Kapag naputol o nag-short ang kable ng isang PC, hindi maaapektuhan ang iba pang devices.",
            "Mabilis at madaling mag-troubleshoot gamit ang port link LEDs sa switch.",
            "Pwedeng paghaluin ang iba't ibang speed at media (1GbE Cat6, 10GbE SFP+ Fiber)."
        ],
        cons: [
            "Single Point of Failure (SPOF): Kapag nasira ang gitnang switch o nawalan ito ng kuryente, patay ang buong network segment.",
            "Mas magastos sa haba ng kable dahil bawat device ay may sariling linya pabalik sa rack."
        ],
        devices: [
            {
                name: "Enterprise Managed Core Switch",
                type: "Layer 2/3 Switch (e.g., Cisco Catalyst 9300)",
                role: "Nagsisilbing central bridge na nagko-cross-connect at nagfa-forward ng Ethernet frames base sa MAC address table nang may full line-rate switching."
            },
            {
                name: "Enterprise Edge Gateway & Firewall",
                type: "Next-Gen Firewall (e.g., Fortinet FortiGate)",
                role: "Proteksyon sa labas ng network, nagpapatupad ng NAT, DHCP, VPN termination, at deep packet inspection para sa lahat ng star endpoints."
            },
            {
                name: "Application / Database Rack Server",
                type: "2U Compute Server (e.g., Dell PowerEdge R760)",
                role: "Central storage at business app processing (Active Directory, internal ERP, file sharing) na may 10G uplink sa switch."
            },
            {
                name: "Corporate Workstation PCs",
                type: "Client Endpoints",
                role: "Mga desktop ng empleyado para sa pang-araw-araw na trabaho na nakakonekta via 1Gbps RJ45 Ethernet."
            },
            {
                name: "Wi-Fi 6 Enterprise Access Point (AP)",
                type: "Wireless Infrastructure (PoE+)",
                role: "Tumatanggap ng PoE power mula sa central switch at nagbibigay ng high-density wireless LAN coverage para sa laptops at smartphones."
            }
        ],
        companies: [
            {
                company: "Accenture & Teleperformance (BPO / Call Centers)",
                sector: "IT-BPM & Enterprise Workplaces",
                useCase:
                    "Standard floor wiring kung saan daan-daang agent workstations ang nakakabit sa centralized wiring closets (IDF racks) para sa mabilis na pag-isolate ng sirang cubicle lines."
            },
            {
                company: "BDO, BPI & Metrobank (Bank Branches)",
                sector: "Financial Institutions",
                useCase:
                    "Bawat teller terminal, passbook printer, ATM, at manager PC ay nakakabit sa branch core switch sa loob ng secured data cabinet."
            },
            {
                company: "SM Prime / Robinsons Retail HQ",
                sector: "Corporate Headquarters & Retail POS",
                useCase:
                    "Pagpapatakbo ng internal network ng Point-of-Sale (POS) terminals na nakakabit pabalik sa branch store server."
            }
        ]
    },
    mesh: {
        title: "Full / Partial Mesh Topology",
        architecture:
            "Bawat critical node (routers/servers) ay may direktang point-to-point link sa halos lahat ng iba pang node, nagbibigay ng walang kapantay na alternate routing paths.",
        redundancy: "Full",
        cablingCost: "Extreme",
        scalability: "Mahirap para sa physical cables [Formula: n(n-1)/2 links], ngunit napakalakas para sa software-defined data center fabrics.",
        pros: [
            "Maximum Fault Tolerance: Kahit maputol ang 2 o 3 fiber cables, awtomatikong lilihis ang data sa alternate path nang zero downtime.",
            "Zero channel congestion dahil sa multiple parallel dynamic data links (OSPF / BGP / ECMP routing).",
            "Napakalaking throughput at bandwidth capacity."
        ],
        cons: [
            "Pinakamagastos sa SFP/QSFP optical transceivers, fiber optic patches, at high-port routers.",
            "Nangangailangan ng kumplikadong routing protocols at link aggregation configuration."
        ],
        devices: [
            {
                name: "Spine & Leaf High-Density Switches",
                type: "Data Center Switch (e.g., Arista 7060X / Cisco Nexus 9000)",
                role: "Nagbibigay ng non-blocking wire-speed forwarding kung saan bawat leaf switch ay nakakabit sa bawat spine switch (Clos network)."
            },
            {
                name: "Enterprise Core BGP Routers",
                type: "WAN Edge Routers (e.g., Juniper MX Series)",
                role: "Namamahala sa dynamic multi-path routing protocol updates at multi-homed ISP connections."
            },
            {
                name: "Enterprise SAN Storage Nodes",
                type: "NVMe-over-Fabrics Storage Arrays",
                role: "High-availability redundant storage clusters na kayang ma-access ng servers kahit mawalan ng kalahati ng network paths."
            }
        ],
        companies: [
            {
                company: "Google Cloud & AWS (Amazon Web Services)",
                sector: "Hyper-Scale Cloud Infrastructure",
                useCase:
                    "Ang kanilang global backbone at data center fabrics (Jupiter/Andromeda) ay gumagamit ng massive Spine-and-Leaf mesh upang matiyak na walang single point of failure sa million-server scale."
            },
            {
                company: "Cloudflare & Fastly (Edge & CDN Networks)",
                sector: "Global Content Delivery & Cybersecurity",
                useCase:
                    "Mesh-connected edge data centers na may Anycast BGP routing para i-reroute agad ang internet traffic kapag nagkaroon ng undersea cable fracture o fiber cut."
            },
            {
                company: "PLDT, Globe Telecom & DITO Telecommunity",
                sector: "Telecommunications & ISP Core Backbones",
                useCase:
                    "Inter-island optical submarine cable mesh para panatilihing konektado ang Luzon, Visayas, at Mindanao kahit magkaroon ng fiber damage dulot ng lindol o barko."
            }
        ]
    },
    ring: {
        title: "Dual Ring Topology",
        architecture:
            "Bawat device ay may eksaktong dalawang kapitbahay na bumubuo ng saradong pabilog na data path. Sa enterprise, gumagamit ito ng dual counter-rotating fiber rings para sa instant 50ms auto-failover (SONET/SDH/ERP).",
        redundancy: "Medium",
        cablingCost: "Medium",
        scalability: "Katamtaman; kailangang mag-ingat sa pagdagdag ng node upang hindi maantala ang buong ring loop.",
        pros: [
            "Deterministikong latency at throughput—walang packet collision dahil sa sequential token/packet circulating mechanism.",
            "Dual-ring self-healing: Kapag naputol ang fiber sa isang dako, awtomatikong mag-u-turn ang signal sa counter-ring sa loob lamang ng 50 milliseconds."
        ],
        cons: [
            "Single ring without failover is vulnerable: Isang sirang node lang ay hihinto ang buong loop.",
            "Bawat intermediate node ay dapat mag-process ng pass-through data bago makarating sa target."
        ],
        devices: [
            {
                name: "Optical Transport Unit (OTN / DWDM Transponder)",
                type: "Metro Core Optical Switch (e.g., Ciena 6500)",
                role: "Nagpapatakbo ng multi-wavelength fiber light signals sa paligid ng city ring na may hardware-level automatic protection switching (APS)."
            },
            {
                name: "Hardened Industrial DIN-Rail Switch",
                type: "Substation Switch (e.g., Moxa / Siemens Ruggedcom)",
                role: "Tumatakbo sa matinding init at vibration sa mga tren at pabrika, sumusuporta sa Turbo Ring at MRP redundancy protocols."
            },
            {
                name: "SCADA / RTU Industrial Controllers",
                type: "Programmable Logic Controllers (PLC)",
                role: "Nangongolekta ng sensor telemetry mula sa power generators at railway tracks."
            }
        ],
        companies: [
            {
                company: "MRT-3, LRT-1/2, & PNR (Railway Systems)",
                sector: "Transportation & Urban Transit",
                useCase:
                    "Ang signaling system, emergency track communication, at CCTV cameras sa mga istasyon ay nakakabit sa optical fiber ring вдоль ng riles para sa tuloy-tuloy na biyahe."
            },
            {
                company: "Meralco & NGCP (National Grid Corporation of the Philippines)",
                sector: "Electric Power Transmission & SCADA",
                useCase:
                    "Substation automation telemetry gamit ang IEC 61850 standard over fiber optic rings upang ma-isolate ang high-voltage power trips nang sub-second."
            },
            {
                company: "Siemens & ABB Manufacturing Plants",
                sector: "Industrial Automation & Robotics",
                useCase:
                    "PROFINET industrial ring networks sa factory floors para sa coordinated high-speed robotic assembly."
            }
        ]
    },
    bus: {
        title: "Linear Bus Topology",
        architecture:
            "Lahat ng nodes ay nakakabit sa iisang shared transmission medium (backbone cable) na may 50-ohm terminators sa bawat dulo para mag-absorb ng electrical reflections.",
        redundancy: "Zero",
        cablingCost: "Low",
        scalability: "Mababa; ang pagdagdag ng mga node ay nagdudulot ng signal attenuation at collision rate spikes.",
        pros: [
            "Pinakamababang gastos sa physical wiring; hindi kailangan ng active hubs o switches.",
            "Madaling gamitin sa embedded systems, electronics, at automotive wiring harness."
        ],
        cons: [
            "Zero Redundancy: Kapag naputol o nag-loose ang terminator sa gitnang kable, split at ungrounded ang buong system.",
            "Mataas ang data collisions sa high-traffic scenarios (CSMA/CD protocol required)."
        ],
        devices: [
            {
                name: "Central Shielded Twisted/Coaxial Bus Trunk",
                type: "Transmission Medium (120Ω Differential Line)",
                role: "Ang nag-iisang shared communication channel kung saan nakikinig at nagpapadala ng signals ang lahat ng nodes."
            },
            {
                name: "Active Bus Terminators (End Resistors)",
                type: "Impedance Matching Resistors (120 Ohm / 50 Ohm)",
                role: "Sinasipsip ang electric signals sa magkabilang dulo ng linya upang maiwasan ang reflection waves na sumisira sa packet integrity."
            },
            {
                name: "Electronic Control Units (ECU) / Microcontrollers",
                type: "Embedded CAN / RS-485 Nodes",
                role: "Nagpapadala ng real-time sensor data (engine temp, braking sensors, cockpit switches) sa bus line."
            }
        ],
        companies: [
            {
                company: "Tesla, Toyota, & Ford (Automotive Manufacturing)",
                sector: "Connected Vehicles & Autonomous Systems",
                useCase:
                    "CAN Bus (Controller Area Network) na nag-uugnay sa ABS brakes, steering sensors, infotainment, at battery management systems sa iisang two-wire harness."
            },
            {
                company: "Boeing & Airbus (Commercial Aircraft Avionics)",
                sector: "Aerospace Defense & Aviation",
                useCase:
                    "ARINC 429 at MIL-STD-1553 military bus architecture para sa maaasahang flight control and navigation telemetry sa cockpit."
            },
            {
                company: "Elevator & Building Automation (Otis, Schindler)",
                sector: "Building Management Systems (BMS)",
                useCase:
                    "RS-485 serial bus na nagkokonekta ng floor call buttons at door safety sensors pataas at pababa ng elevator shaft."
            }
        ]
    },
    tree: {
        title: "Tree / Hierarchical Topology",
        architecture:
            "Isang multi-layered architecture na binubuo ng Core Layer (backbone), Distribution Layer (routing/policy), at Access Layer (workgroup switches), na lumilikha ng hierarchical branching structure.",
        redundancy: "High",
        cablingCost: "High",
        scalability: "Napakataas; pwedeng magdagdag ng bagong gusali o bagong floor department nang hindi binabago ang umiiral na core.",
        pros: [
            "Layered Segregation: Hiwalay ang routing policies, security VLANs, at bandwidth QoS kada departamento.",
            "Madaling i-maintain ng magkakahiwalay na IT engineering teams sa malalaking organisasyon."
        ],
        cons: [
            "Root Dependency: Kapag bumagsak ang pinaka-Core tier nang walang redundant core pairing, mapuputol ang cross-department comms.",
            "Nangangailangan ng malaking budget para sa multi-tiered enterprise switching hardware."
        ],
        devices: [
            {
                name: "Core Layer Multi-Gigabit Switches",
                type: "Chassis-Based Core Switches (e.g., Cisco Nexus 9500)",
                role: "Nagsisilbing pinakamabilis na backbone na naglilipat ng traffic sa pagitan ng iba't ibang gusali nang zero latency."
            },
            {
                name: "Distribution Layer Layer-3 Switches",
                type: "Aggregation Switches (e.g., Cisco Catalyst 9500)",
                role: "Nangangasiwa sa Inter-VLAN routing, Access Control Lists (ACLs), QoS policies, at firewall segmentation."
            },
            {
                name: "Access Layer PoE Edge Switches",
                type: "24/48-Port Edge Switches",
                role: "Direktang nagbibigay ng koneksyon at kuryente (PoE) sa PCs, VoIP phones, security cameras, at Wi-Fi APs sa bawat palapag."
            }
        ],
        companies: [
            {
                company: "University of the Philippines (UP) & DLSU Campuses",
                sector: "Higher Education & Multi-Building Campuses",
                useCase:
                    "Ang central IT data center ay may Core backbone na naka-link via single-mode fiber sa bawat College Building (Distribution), bago ibaba sa bawat classroom/lab (Access switches)."
            },
            {
                company: "St. Luke's Medical Center & The Medical City",
                sector: "Healthcare Systems & Hospital Networks",
                useCase:
                    "Hierarchical tree segmentation upang i-isolate ang critical ICU telemetry at MRI imaging network mula sa pampublikong guest Wi-Fi at administrative billing systems."
            },
            {
                company: "Ayala Land & Megaworld Corporate Towers",
                sector: "Commercial Real Estate & Multi-Tenant Buildings",
                useCase:
                    "Building riser backbone kung saan ang main telecommunications room (MDF) sa basement ay nagdi-distribute ng fiber sa bawat 5 floors (IDFs)."
            }
        ]
    }
};

export default function TopologyLab() {
    const [activeTopology, setActiveTopology] = useState<TopologyType>("star");
    const data = TOPOLOGY_DATA[activeTopology];

    return (
        <div className="space-y-6">
            {/* Top Banner */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                    <Network className="w-6 h-6 text-cyan-500" /> Enterprise Network Topology Visualizer
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Interactive schematic comparison ng physical at logical network topologies: bawat device ay may detalyadong icon, engineering roles, at mga totoong kumpanyang gumagamit sa industriya.
                </p>
            </div>

            {/* Selector Tabs */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
                {(["star", "mesh", "ring", "bus", "tree"] as TopologyType[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTopology(t)}
                        className={`px-4 py-2 rounded-xl border uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${activeTopology === t
                                ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50"
                            }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        {t} Architecture
                    </button>
                ))}
            </div>

            {/* Main Grid: SVG Canvas + Telemetry Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* SVG Interactive Canvas with REAL DEVICES (7 Cols) */}
                <div className="lg:col-span-7 bg-[#050811] border-2 border-slate-800 rounded-3xl p-6 flex flex-col justify-between min-h-[460px] relative overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 z-10 border-b border-slate-800/80 pb-3">
                        <span className="flex items-center gap-2 font-bold text-white">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                            PHYSICAL DEVICE SCHEMATIC TRACE
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-cyan-400 font-bold uppercase tracking-wide">
                            {activeTopology} layout
                        </span>
                    </div>

                    {/* Dynamic SVG Visualizer Rendering ACTUAL DEVICES */}
                    <div className="flex-1 flex items-center justify-center py-4 select-none">
                        <svg viewBox="0 0 540 340" className="w-full h-80 drop-shadow-xl">
                            <defs>
                                <linearGradient id="switchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#0284c7" />
                                    <stop offset="100%" stopColor="#0369a1" />
                                </linearGradient>
                                <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#0f766e" />
                                    <stop offset="100%" stopColor="#115e59" />
                                </linearGradient>
                                <linearGradient id="firewallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#b91c1c" />
                                    <stop offset="100%" stopColor="#991b1b" />
                                </linearGradient>
                            </defs>

                            {/* ---------------- STAR TOPOLOGY ---------------- */}
                            {activeTopology === "star" && (
                                <g>
                                    {/* Central Links with connection dots */}
                                    <line x1="270" y1="165" x2="110" y2="70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5" className="animate-pulse" />
                                    <line x1="270" y1="165" x2="430" y2="70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5" className="animate-pulse" />
                                    <line x1="270" y1="165" x2="90" y2="245" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5" className="animate-pulse" />
                                    <line x1="270" y1="165" x2="450" y2="245" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5" className="animate-pulse" />
                                    <line x1="270" y1="165" x2="270" y2="280" stroke="#10b981" strokeWidth="2.5" />
                                    <line x1="270" y1="165" x2="270" y2="45" stroke="#ef4444" strokeWidth="2.5" />

                                    {/* Top Firewall / Edge Gateway */}
                                    <rect x="235" y="20" width="70" height="30" rx="6" fill="url(#firewallGrad)" stroke="#f87171" strokeWidth="1.5" />
                                    <text x="270" y="38" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">NGFW ROUTER</text>

                                    {/* Central Enterprise Core Switch */}
                                    <rect x="215" y="145" width="110" height="42" rx="8" fill="url(#switchGrad)" stroke="#38bdf8" strokeWidth="2" />
                                    <circle cx="230" cy="158" r="2.5" fill="#4ade80" />
                                    <circle cx="238" cy="158" r="2.5" fill="#4ade80" />
                                    <circle cx="246" cy="158" r="2.5" fill="#38bdf8" />
                                    <circle cx="254" cy="158" r="2.5" fill="#38bdf8" />
                                    <text x="270" y="172" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">CORE SWITCH</text>
                                    <text x="270" y="181" fill="#bae6fd" fontSize="7" textAnchor="middle" fontFamily="monospace">48-Port PoE+ L3</text>

                                    {/* Top Left: Workstation PC */}
                                    <rect x="75" y="50" width="70" height="44" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                                    <rect x="85" y="57" width="50" height="24" rx="3" fill="#0f172a" />
                                    <line x1="110" y1="81" x2="110" y2="87" stroke="#64748b" strokeWidth="2" />
                                    <line x1="100" y1="87" x2="120" y2="87" stroke="#64748b" strokeWidth="2" />
                                    <text x="110" y="73" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PC 01</text>
                                    <text x="110" y="103" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Workstation</text>

                                    {/* Top Right: Wi-Fi 6 Access Point */}
                                    <circle cx="430" cy="70" r="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                                    <circle cx="430" cy="70" r="16" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 2" />
                                    <circle cx="430" cy="70" r="4" fill="#38bdf8" />
                                    <text x="430" y="104" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">AP (Wi-Fi 6)</text>

                                    {/* Bottom Left: Network Laser Printer */}
                                    <rect x="55" y="225" width="70" height="40" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                                    <rect x="68" y="215" width="44" height="12" rx="2" fill="#334155" />
                                    <rect x="68" y="240" width="44" height="6" fill="#0f172a" />
                                    <text x="90" y="258" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">MFP PRINTER</text>
                                    <text x="90" y="275" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Office Print / Scan</text>

                                    {/* Bottom Right: Workstation Laptop */}
                                    <rect x="415" y="225" width="70" height="42" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                                    <rect x="425" y="231" width="50" height="22" rx="2" fill="#0f172a" />
                                    <text x="450" y="245" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">LAPTOP</text>
                                    <text x="450" y="278" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">BPO Endpoint</text>

                                    {/* Bottom Center: Enterprise Rack Server */}
                                    <rect x="225" y="260" width="90" height="40" rx="5" fill="url(#serverGrad)" stroke="#2dd4bf" strokeWidth="1.5" />
                                    <circle cx="235" cy="272" r="2.5" fill="#4ade80" />
                                    <circle cx="243" cy="272" r="2.5" fill="#4ade80" />
                                    <line x1="255" y1="272" x2="305" y2="272" stroke="#042f2e" strokeWidth="3" />
                                    <line x1="255" y1="284" x2="305" y2="284" stroke="#042f2e" strokeWidth="3" />
                                    <text x="270" y="293" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PROD DB SERVER</text>
                                    <text x="270" y="312" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">2U Virtual Host</text>
                                </g>
                            )}

                            {/* ---------------- MESH TOPOLOGY ---------------- */}
                            {activeTopology === "mesh" && (
                                <g>
                                    {/* Full Interconnect Highway Mesh */}
                                    <polygon points="270,55 450,135 385,270 155,270 90,135" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.4" />
                                    <line x1="270" y1="55" x2="385" y2="270" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 2" />
                                    <line x1="270" y1="55" x2="155" y2="270" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 2" />
                                    <line x1="450" y1="135" x2="155" y2="270" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 2" />
                                    <line x1="450" y1="135" x2="90" y2="135" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 2" />
                                    <line x1="385" y1="270" x2="90" y2="135" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 2" />

                                    {/* 5 High-Value Enterprise Datacenter Nodes */}
                                    {/* Node 1: Spine Switch A (Top) */}
                                    <rect x="225" y="30" width="90" height="44" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                                    <text x="270" y="50" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SPINE SW 01</text>
                                    <text x="270" y="62" fill="#bae6fd" fontSize="7" textAnchor="middle" fontFamily="monospace">100GbE QSFP28</text>

                                    {/* Node 2: Spine Switch B (Right) */}
                                    <rect x="405" y="115" width="90" height="44" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                                    <text x="450" y="135" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SPINE SW 02</text>
                                    <text x="450" y="147" fill="#bae6fd" fontSize="7" textAnchor="middle" fontFamily="monospace">Core Interlink</text>

                                    {/* Node 3: SAN Storage Node (Bottom Right) */}
                                    <rect x="340" y="250" width="90" height="44" rx="6" fill="url(#serverGrad)" stroke="#2dd4bf" strokeWidth="2" />
                                    <text x="385" y="270" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SAN STORAGE</text>
                                    <text x="385" y="282" fill="#99f6e4" fontSize="7" textAnchor="middle" fontFamily="monospace">NVMe Cluster</text>

                                    {/* Node 4: Compute Node C (Bottom Left) */}
                                    <rect x="110" y="250" width="90" height="44" rx="6" fill="url(#serverGrad)" stroke="#2dd4bf" strokeWidth="2" />
                                    <text x="155" y="270" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">COMPUTE HOST</text>
                                    <text x="155" y="282" fill="#99f6e4" fontSize="7" textAnchor="middle" fontFamily="monospace">K8s Worker</text>

                                    {/* Node 5: Edge Gateway (Left) */}
                                    <rect x="45" y="115" width="90" height="44" rx="6" fill="url(#firewallGrad)" stroke="#f87171" strokeWidth="2" />
                                    <text x="90" y="135" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BGP GATEWAY</text>
                                    <text x="90" y="147" fill="#fecaca" fontSize="7" textAnchor="middle" fontFamily="monospace">Multi-Cloud WAN</text>
                                </g>
                            )}

                            {/* ---------------- RING TOPOLOGY ---------------- */}
                            {activeTopology === "ring" && (
                                <g>
                                    {/* Outer & Inner Dual Counter-Rotating Rings */}
                                    <circle cx="270" cy="165" r="115" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 4" className="animate-spin origin-center" />
                                    <circle cx="270" cy="165" r="105" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />

                                    {/* 4 Optical Ring Units */}
                                    {/* Top: Metro OTN Node */}
                                    <rect x="225" y="25" width="90" height="44" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
                                    <text x="270" y="45" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">METRO OTN</text>
                                    <text x="270" y="57" fill="#bae6fd" fontSize="7" textAnchor="middle" fontFamily="monospace">DWDM Mux/Demux</text>

                                    {/* Right: Substation Switch */}
                                    <rect x="375" y="145" width="95" height="44" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                                    <text x="422" y="165" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">RUGGED SWITCH</text>
                                    <text x="422" y="177" fill="#fde68a" fontSize="7" textAnchor="middle" fontFamily="monospace">Substation Hub</text>

                                    {/* Bottom: Industrial SCADA PLC */}
                                    <rect x="225" y="260" width="90" height="44" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                                    <text x="270" y="280" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SCADA / PLC</text>
                                    <text x="270" y="292" fill="#a7f3d0" fontSize="7" textAnchor="middle" fontFamily="monospace">Railway Automation</text>

                                    {/* Left: Edge Central Station */}
                                    <rect x="70" y="145" width="95" height="44" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                                    <text x="117" y="165" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">CONTROL ROOM</text>
                                    <text x="117" y="177" fill="#bae6fd" fontSize="7" textAnchor="middle" fontFamily="monospace">CCTV & Signaling</text>
                                </g>
                            )}

                            {/* ---------------- BUS TOPOLOGY ---------------- */}
                            {activeTopology === "bus" && (
                                <g>
                                    {/* Main Heavy Trunk Line (120 Ohm) */}
                                    <line x1="50" y1="170" x2="490" y2="170" stroke="#f59e0b" strokeWidth="6" />

                                    {/* Terminators on both ends */}
                                    <rect x="36" y="150" width="16" height="40" rx="3" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" />
                                    <text x="44" y="174" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">120Ω</text>

                                    <rect x="488" y="150" width="16" height="40" rx="3" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" />
                                    <text x="496" y="174" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">120Ω</text>

                                    {/* Tap Connectors & Drop Lines */}
                                    {/* Drop 1: ECU Engine Node */}
                                    <line x1="120" y1="170" x2="120" y2="95" stroke="#94a3b8" strokeWidth="2" />
                                    <circle cx="120" cy="170" r="4" fill="#f59e0b" />
                                    <rect x="75" y="55" width="90" height="40" rx="5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                                    <text x="120" y="75" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ENGINE ECU</text>
                                    <text x="120" y="87" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">CAN Bus Node 1</text>

                                    {/* Drop 2: ABS Braking Sensor */}
                                    <line x1="220" y1="170" x2="220" y2="245" stroke="#94a3b8" strokeWidth="2" />
                                    <circle cx="220" cy="170" r="4" fill="#f59e0b" />
                                    <rect x="175" y="245" width="90" height="40" rx="5" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
                                    <text x="220" y="265" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BRAKE SENSOR</text>
                                    <text x="220" y="277" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">ABS Controller</text>

                                    {/* Drop 3: Cockpit Telemetry Display */}
                                    <line x1="320" y1="170" x2="320" y2="95" stroke="#94a3b8" strokeWidth="2" />
                                    <circle cx="320" cy="170" r="4" fill="#f59e0b" />
                                    <rect x="275" y="55" width="90" height="40" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                                    <text x="320" y="75" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">DASHBOARD</text>
                                    <text x="320" y="87" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Avionics Cluster</text>

                                    {/* Drop 4: Diagnostic Scan Tool (OBD-II) */}
                                    <line x1="420" y1="170" x2="420" y2="245" stroke="#94a3b8" strokeWidth="2" />
                                    <circle cx="420" cy="170" r="4" fill="#f59e0b" />
                                    <rect x="375" y="245" width="90" height="40" rx="5" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                                    <text x="420" y="265" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">OBD-II SCANNER</text>
                                    <text x="420" y="277" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">CAN Port Reader</text>
                                </g>
                            )}

                            {/* ---------------- TREE TOPOLOGY ---------------- */}
                            {activeTopology === "tree" && (
                                <g>
                                    {/* Trunks from Core to Distribution */}
                                    <line x1="270" y1="65" x2="160" y2="145" stroke="#38bdf8" strokeWidth="2.5" />
                                    <line x1="270" y1="65" x2="380" y2="145" stroke="#38bdf8" strokeWidth="2.5" />

                                    {/* Trunks from Dist to Access Edges */}
                                    <line x1="160" y1="165" x2="95" y2="245" stroke="#64748b" strokeWidth="1.5" />
                                    <line x1="160" y1="165" x2="190" y2="245" stroke="#64748b" strokeWidth="1.5" />
                                    <line x1="380" y1="165" x2="330" y2="245" stroke="#64748b" strokeWidth="1.5" />
                                    <line x1="380" y1="165" x2="445" y2="245" stroke="#64748b" strokeWidth="1.5" />

                                    {/* TOP: Core Chassis Switch */}
                                    <rect x="215" y="25" width="110" height="42" rx="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                                    <text x="270" y="44" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">CAMPUS CORE SW</text>
                                    <text x="270" y="56" fill="#bae6fd" fontSize="7" textAnchor="middle" fontFamily="monospace">40G Fiber Backbone</text>

                                    {/* TIER 2: Distribution Switch A (Building A) */}
                                    <rect x="110" y="130" width="100" height="38" rx="6" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
                                    <text x="160" y="148" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BLDG A DIST SW</text>
                                    <text x="160" y="159" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Layer 3 Routing</text>

                                    {/* TIER 2: Distribution Switch B (Building B) */}
                                    <rect x="330" y="130" width="100" height="38" rx="6" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
                                    <text x="380" y="148" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BLDG B DIST SW</text>
                                    <text x="380" y="159" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Layer 3 Routing</text>

                                    {/* TIER 3: Access Switches & Endpoints */}
                                    {/* Access Switch 1 */}
                                    <rect x="55" y="245" width="80" height="34" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                                    <text x="95" y="261" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ACCESS SW 1</text>
                                    <text x="95" y="271" fill="#94a3b8" fontSize="6" textAnchor="middle" fontFamily="monospace">Computer Lab PCs</text>

                                    {/* Access Switch 2 */}
                                    <rect x="150" y="245" width="80" height="34" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                                    <text x="190" y="261" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ACCESS SW 2</text>
                                    <text x="190" y="271" fill="#94a3b8" fontSize="6" textAnchor="middle" fontFamily="monospace">Admin Offices</text>

                                    {/* Access Switch 3 */}
                                    <rect x="290" y="245" width="80" height="34" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                                    <text x="330" y="261" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ACCESS SW 3</text>
                                    <text x="330" y="271" fill="#94a3b8" fontSize="6" textAnchor="middle" fontFamily="monospace">Engineering Wing</text>

                                    {/* Access Switch 4 */}
                                    <rect x="405" y="245" width="80" height="34" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                                    <text x="445" y="261" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ACCESS SW 4</text>
                                    <text x="445" y="271" fill="#94a3b8" fontSize="6" textAnchor="middle" fontFamily="monospace">Medical Ward</text>
                                </g>
                            )}
                        </svg>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2">
                        <span>Redundancy Level: <strong className="text-white">{data.redundancy}</strong></span>
                        <span>Infrastructure Cost Index: <strong className="text-amber-400">{data.cablingCost}</strong></span>
                        <span>Scalability: <strong className="text-cyan-400">{data.scalability}</strong></span>
                    </div>
                </div>

                {/* Telemetry & Architecture Specification (5 Cols) */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 font-mono">
                    <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 uppercase tracking-wider">
                            Architecture Analysis
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                            {data.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-sans mt-2 leading-relaxed">
                            {data.architecture}
                        </p>
                    </div>

                    {/* Pros & Cons */}
                    <div className="space-y-3 pt-2">
                        <div>
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 mb-1.5">
                                <CheckCircle2 className="w-4 h-4" /> Architectural Advantages:
                            </span>
                            <ul className="text-xs text-slate-600 dark:text-slate-300 font-sans space-y-1.5">
                                {data.pros.map((p, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-emerald-500 font-mono font-bold">•</span>
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-red-500 flex items-center gap-1.5 mb-1.5">
                                <XCircle className="w-4 h-4" /> Trade-offs & Engineering Limitations:
                            </span>
                            <ul className="text-xs text-slate-600 dark:text-slate-300 font-sans space-y-1.5">
                                {data.cons.map((c, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-red-500 font-mono font-bold">•</span>
                                        <span>{c}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* SECTION 1: HARDWARE DEVICES & THEIR FUNCTIONS IN TOPOLOGY */}
            {/* ========================================================= */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <Server className="w-5 h-5 text-cyan-500" />
                    <h3 className="font-mono font-bold text-base text-slate-900 dark:text-white">
                        Mga Kagamitang Hardware & Kanilang Tungkulin sa {data.title}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
                    {data.devices.map((device, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-2 hover:border-cyan-500/40 transition"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        {device.name}
                                    </span>
                                    <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 uppercase font-bold shrink-0">
                                        Device Node
                                    </span>
                                </div>
                                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-sans font-medium block mt-0.5">
                                    {device.type}
                                </span>
                                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans mt-2 leading-relaxed">
                                    {device.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========================================================= */}
            {/* SECTION 2: REAL-WORLD COMPANIES & ENTERPRISE ADOPTION     */}
            {/* ========================================================= */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <Building2 className="w-5 h-5 text-amber-500" />
                    <h3 className="font-mono font-bold text-base text-slate-900 dark:text-white">
                        Mga Kilalang Kumpanya at Industriya na Gumagamit Nito
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                    {data.companies.map((c, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 hover:border-amber-500/40 transition"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-500 dark:text-amber-400">
                                    {c.company}
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-bold">
                                {c.sector}
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                                {c.useCase}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}