"use client";

import { useState } from "react";
import { Network, Database, Shield, Hash, Search } from "lucide-react";

const WELL_KNOWN_PORTS = [
    { port: 20, proto: "TCP", service: "FTP Data", desc: "File Transfer Protocol (Data channel)" },
    { port: 21, proto: "TCP", service: "FTP Control", desc: "File Transfer Protocol (Command channel)" },
    { port: 22, proto: "TCP", service: "SSH / SFTP", desc: "Secure Shell encrypted CLI at SFTP transfer" },
    { port: 23, proto: "TCP", service: "Telnet", desc: "Unencrypted legacy remote terminal emulation" },
    { port: 25, proto: "TCP", service: "SMTP", desc: "Simple Mail Transfer Protocol mail relay" },
    { port: 53, proto: "TCP/UDP", service: "DNS", desc: "Domain Name System resolution" },
    { port: 67, proto: "UDP", service: "DHCP Server", desc: "Dynamic Host Configuration Protocol server broadcast" },
    { port: 68, proto: "UDP", service: "DHCP Client", desc: "DHCP client unicast listener" },
    { port: 80, proto: "TCP", service: "HTTP", desc: "Hypertext Transfer Protocol unencrypted web" },
    { port: 443, proto: "TCP", service: "HTTPS", desc: "Secure Web TLS/SSL encrypted HTTP" },
    { port: 445, proto: "TCP", service: "SMB", desc: "Server Message Block Windows shares (EternalBlue target)" },
    { port: 3389, proto: "TCP/UDP", service: "RDP", desc: "Microsoft Remote Desktop Protocol" },
    { port: 8080, proto: "TCP", service: "HTTP-Proxy", desc: "Common alternative web server / caching proxy" },
];

export default function ToolsSuite() {
    // 1. Subnet Calculator State
    const [ip, setIp] = useState("192.168.10.45");
    const [cidr, setCidr] = useState(24);

    // 2. RAID Calculator State
    const [raidLevel, setRaidLevel] = useState("5");
    const [driveCount, setDriveCount] = useState(4);
    const [driveSize, setDriveSize] = useState(8);

    // 3. Hasher State
    const [hashInput, setHashInput] = useState("TechVault2026!");
    const [hashOutput, setHashOutput] = useState("");

    // 4. Port Search State
    const [portQuery, setPortQuery] = useState("");

    // --- Bitwise Subnet Math ---
    const calculateSubnet = () => {
        const parts = ip.split(".").map(Number);
        if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
            return { net: "Invalid IP", bcast: "Invalid", mask: "Invalid", hosts: 0 };
        }
        const ipNum = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
        const mask = cidr === 0 ? 0 : ~0 << (32 - cidr);
        const netNum = ipNum & mask;
        const bcastNum = netNum | ~mask;

        const numToIp = (num: number) =>
            [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(".");

        const hosts = Math.max(0, Math.pow(2, 32 - cidr) - 2);
        return {
            net: numToIp(netNum),
            bcast: numToIp(bcastNum),
            mask: numToIp(mask),
            hosts: hosts.toLocaleString(),
        };
    };

    const subnetResult = calculateSubnet();

    // --- RAID Storage Math ---
    const calculateRaid = () => {
        let usable = 0;
        let parity = 0;
        let tolerance = "0 Drives";

        if (raidLevel === "0") {
            usable = driveCount * driveSize;
            parity = 0;
            tolerance = "0 Drives (None)";
        } else if (raidLevel === "1") {
            usable = (driveCount / 2) * driveSize;
            parity = (driveCount / 2) * driveSize;
            tolerance = "1 Drive";
        } else if (raidLevel === "5") {
            usable = Math.max(0, driveCount - 1) * driveSize;
            parity = 1 * driveSize;
            tolerance = "1 Drive";
        } else if (raidLevel === "6") {
            usable = Math.max(0, driveCount - 2) * driveSize;
            parity = 2 * driveSize;
            tolerance = "2 Drives";
        } else if (raidLevel === "10") {
            usable = (driveCount / 2) * driveSize;
            parity = (driveCount / 2) * driveSize;
            tolerance = "1 Drive per Pair";
        }

        return { usable: usable.toFixed(1), parity: parity.toFixed(1), tolerance };
    };

    const raidResult = calculateRaid();

    // --- WebCrypto SHA-256 Digest ---
    const computeHash = async (text: string) => {
        setHashInput(text);
        if (!text) {
            setHashOutput("");
            return;
        }
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        setHashOutput(hex);
    };

    // Filter Ports
    const filteredPorts = WELL_KNOWN_PORTS.filter(
        (p) =>
            p.port.toString().includes(portQuery) ||
            p.service.toLowerCase().includes(portQuery.toLowerCase()) ||
            p.desc.toLowerCase().includes(portQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    SysAdmin & Engineering Utility Suite
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Client-side offline tools: Subnetting, RAID calculators, WebCrypto hash generators, at port lookup.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. IPv4 CIDR / Subnet Calculator */}
                <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-mono font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-white">
                            <Network className="w-4 h-4 text-cyan-500" /> IPv4 CIDR & Subnet Calculator
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-bold">
                            RFC 1878
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-mono text-slate-500 mb-1">IP Address</label>
                            <input
                                type="text"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                                className="w-full text-xs font-mono p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-slate-500 mb-1">Prefix Length</label>
                            <select
                                value={cidr}
                                onChange={(e) => setCidr(Number(e.target.value))}
                                className="w-full text-xs font-mono p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none focus:border-cyan-500"
                            >
                                <option value={24}>/24 (255.255.255.0 - 254 Hosts)</option>
                                <option value={25}>/25 (255.255.255.128 - 126 Hosts)</option>
                                <option value={26}>/26 (255.255.255.192 - 62 Hosts)</option>
                                <option value={27}>/27 (255.255.255.224 - 30 Hosts)</option>
                                <option value={28}>/28 (255.255.255.240 - 14 Hosts)</option>
                                <option value={29}>/29 (255.255.255.248 - 6 Hosts)</option>
                                <option value={30}>/30 (255.255.255.252 - 2 Hosts Point-to-Point)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                        <div>
                            <span className="text-[10px] text-slate-500 block">NETWORK ID</span>
                            <span className="font-bold text-cyan-500">{subnetResult.net}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block">BROADCAST</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{subnetResult.bcast}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block">USABLE HOSTS</span>
                            <span className="font-bold text-emerald-500">{subnetResult.hosts}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block">SUBNET MASK</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{subnetResult.mask}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Enterprise RAID Capacity Calculator */}
                <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-mono font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-white">
                            <Database className="w-4 h-4 text-amber-500" /> Enterprise RAID Capacity Calculator
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                            REALTIME
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-mono text-slate-500 mb-1">RAID Type</label>
                            <select
                                value={raidLevel}
                                onChange={(e) => setRaidLevel(e.target.value)}
                                className="w-full text-xs font-mono p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                            >
                                <option value="0">RAID 0</option>
                                <option value="1">RAID 1</option>
                                <option value="5">RAID 5</option>
                                <option value="6">RAID 6</option>
                                <option value="10">RAID 10</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-slate-500 mb-1">Disks</label>
                            <input
                                type="number"
                                min={2}
                                max={24}
                                value={driveCount}
                                onChange={(e) => setDriveCount(Number(e.target.value))}
                                className="w-full text-xs font-mono p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-slate-500 mb-1">Size (TB)</label>
                            <input
                                type="number"
                                min={1}
                                max={64}
                                value={driveSize}
                                onChange={(e) => setDriveSize(Number(e.target.value))}
                                className="w-full text-xs font-mono p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-center">
                        <div>
                            <span className="text-[10px] text-slate-500 block">USABLE SPACE</span>
                            <span className="text-lg font-bold text-emerald-500">{raidResult.usable} TB</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block">PARITY OVERHEAD</span>
                            <span className="text-lg font-bold text-amber-500">{raidResult.parity} TB</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block">FAULT TOLERANCE</span>
                            <span className="text-lg font-bold text-cyan-500">{raidResult.tolerance}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Cryptographic SHA-256 Hasher */}
                <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-mono font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-white">
                            <Shield className="w-4 h-4 text-purple-500" /> WebCrypto SHA-256 Digest Hasher
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold">
                            ACCELERATED
                        </span>
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Input Text / Secret Key</label>
                        <input
                            type="text"
                            value={hashInput}
                            onChange={(e) => computeHash(e.target.value)}
                            className="w-full text-xs font-mono p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none focus:border-purple-500"
                        />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono">
                        <span className="text-[10px] text-slate-500 block">SHA-256 HASH:</span>
                        <span className="text-xs text-purple-500 font-bold break-all select-all">
                            {hashOutput || "Subukan mag-type sa input box..."}
                        </span>
                    </div>
                </div>

                {/* 4. IANA Port Directory */}
                <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-mono font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-white">
                            <Hash className="w-4 h-4 text-blue-500" /> IANA Port & Protocol Directory
                        </h3>
                        <div className="relative w-44">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search port / service..."
                                value={portQuery}
                                onChange={(e) => setPortQuery(e.target.value)}
                                className="w-full pl-8 pr-2 py-1 text-xs font-mono rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                            />
                        </div>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1 font-mono text-xs pr-1">
                        {filteredPorts.map((p) => (
                            <div
                                key={p.port}
                                className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-bold">
                                        {p.port}
                                    </span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">{p.service}</span>
                                    <span className="text-[10px] text-slate-400">({p.proto})</span>
                                </div>
                                <span className="text-[10px] text-slate-500 hidden sm:inline">{p.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}