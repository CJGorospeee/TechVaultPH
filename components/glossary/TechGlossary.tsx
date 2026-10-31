"use client";

import { useState } from "react";
import { BookMarked, Search, Table, BookOpen, Layers } from "lucide-react";

interface GlossaryTerm {
    term: string;
    acronym?: string;
    category:
    | "Programming Languages"
    | "Databases"
    | "Enterprise & Server"
    | "Operating Systems"
    | "Hardware"
    | "Networking"
    | "Tools & Diagnostics"
    | "Malware & Threats";
    definition: string;
    fieldNote: string;
    imageUrl: string;
}

interface IndustryTerminology {
    term: string;
    acronym?: string;
    domain: "DevOps & Cloud" | "Software Eng" | "IT Operations & Sec" | "Product & Agile";
    meaning: string;
    industryApplication: string;
}

const INDUSTRY_TERMINOLOGIES: IndustryTerminology[] = [
    {
        term: "Continuous Integration / Continuous Deployment",
        acronym: "CI/CD",
        domain: "DevOps & Cloud",
        meaning: "Automated pipeline para sa building, testing, at pag-deploy ng bagong code papuntang production nang walang manual intervention.",
        industryApplication: "Ginagamit ng software teams gamit ang GitHub Actions o GitLab CI para ma-deploy ang web updates nang ilang beses kada araw nang walang downtime."
    },
    {
        term: "Service Level Agreement",
        acronym: "SLA / SLO / SLI",
        domain: "IT Operations & Sec",
        meaning: "Pormal na kontrata sa pagitan ng service provider at kliyente na nagtatakda ng guaranteed uptime (hal. 99.9% o 'Three Nines').",
        industryApplication: "Kritikal sa cloud contracts; kapag bumagsak ang server nang lampas sa pinagkasunduang limit, may financial refund o service credits sa kliyente."
    },
    {
        term: "Application Programming Interface",
        acronym: "API (REST / GraphQL)",
        domain: "Software Eng",
        meaning: "Set ng rules, protocols, at endpoints na nagbibigay-daan sa magkaibang software applications na makipag-usap at magpalitan ng datos.",
        industryApplication: "Pangunahing ginagamit sa integration ng third-party payment gateways (PayMongo, Maya, Stripe) sa web at mobile applications."
    },
    {
        term: "Common Vulnerabilities and Exposures",
        acronym: "CVE (CVSS Score)",
        domain: "IT Operations & Sec",
        meaning: "Standardized reference identifier para sa mga publicly known cybersecurity vulnerabilities at hardware flaws.",
        industryApplication: "Binabantayan ng security operations centers (SOC) upang malaman kung aling software packages o operating system kernels ang kailangang i-patch agad."
    },
    {
        term: "Technical Debt",
        acronym: "Tech Debt",
        domain: "Software Eng",
        meaning: "Ang implikasyon o gastos ng pagpili ng mabilis ngunit substandard na solusyon sa coding imbes na gumamit ng malinis at scalable na arkitektura.",
        industryApplication: "Kapag hindi na-refactor ang minadaling code, bumabagal ang pag-develop ng mga susunod na features at mas madalas lumabas ang software bugs."
    },
    {
        term: "Don't Repeat Yourself",
        acronym: "DRY Principle",
        domain: "Software Eng",
        meaning: "Software design principle na nagsasabing ang bawat piraso ng logic ay dapat may single, unambiguous representation sa buong codebase.",
        industryApplication: "Paglikha ng reusable utility functions at components para hindi paulit-ulit na kinokopya ang parehong linya ng code."
    },
    {
        term: "Role-Based Access Control",
        acronym: "RBAC",
        domain: "IT Operations & Sec",
        meaning: "Security paradigm kung saan ang system access rights at permissions ay ibinabatay sa opisyal na gampanin o job role ng empleyado.",
        industryApplication: "Tinitiyak na ang mga regular staff ay walang access sa administrative database credentials o root financial server tables."
    },
    {
        term: "Infrastructure as Code",
        acronym: "IaC (Terraform / Ansible)",
        domain: "DevOps & Cloud",
        meaning: "Pamamahala at pag-provision ng datacenter at cloud infrastructure gamit ang configuration code files imbes na manual console clicks.",
        industryApplication: "Mabilis na pagbuo muli ng 100 cloud virtual machines at network firewalls gamit lang ang iisang command script."
    },
    {
        term: "Mean Time to Recovery",
        acronym: "MTTR",
        domain: "IT Operations & Sec",
        meaning: "Average na oras na kinakailangan ng engineering team upang ayusin at maibalik sa operasyon ang isang bumagsak na system o server.",
        industryApplication: "Pangunahing KPI sa disaster recovery auditing at system reliability engineering (SRE)."
    },
    {
        term: "Minimum Viable Product",
        acronym: "MVP",
        domain: "Product & Agile",
        meaning: "Bersyon ng produkto na may sapat lamang na core features para magamit ng early customers at makakuha ng agarang feedback bago magbuhos ng malaking budget.",
        industryApplication: "Karaniwang ginagamit sa tech startups at school capstone prototypes bago simulan ang full commercial scale."
    }
];

const GLOSSARY_ITEMS: GlossaryTerm[] = [
    // --- ENTERPRISE & SERVER ---
    {
        term: "FIPS Hardware-Encrypted Flash Drive",
        acronym: "Encrypted USB / IronKey",
        category: "Enterprise & Server",
        definition: "Physical portable USB storage na may onboard cryptographic microchip para sa hardware-level AES-256 XTS encryption at auto-wipe capability kapag naabot ang maling password limit.",
        fieldNote: "Academic & Industry Use Case: Ginagamit ng field systems engineers at IT auditors para sa secure offline transfers ng BitLocker recovery keys, offline root CA certs, at air-gapped server patches.",
        imageUrl: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Enterprise 12Gbps SAS Hard Disk Drive",
        acronym: "Nearline SAS (NL-SAS)",
        category: "Enterprise & Server",
        definition: "Dual-port enterprise mechanical drive na gumagamit ng Serial Attached SCSI protocol, may 2.5 million hours MTBF rating, at kayang magpatakbo ng continuous 24/7/365 heavy workload.",
        fieldNote: "Academic & Industry Use Case: Pangunahing drive na inilalagay sa bulk capacity server chassis at storage enclosures (JBOD) para sa long-term cold file storage at multi-petabyte archiving.",
        imageUrl: "https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Linear Tape-Open Magnetic Tape Library",
        acronym: "LTO-9 Tape Automation",
        category: "Enterprise & Server",
        definition: "Automated robotic library na naglo-load ng magnetic tape cartridges; kayang mag-imbak ng hanggang 45TB per cartridge na may lifespan na umaabot ng mahigit 30 taon.",
        fieldNote: "Academic & Industry Use Case: Ang pangunahing pisikal na depensa para sa true immutable offline air-gapped backup laban sa ransomware; ginagamit ng mga bangko, telcos, at government archives.",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Network-Attached Storage Appliance",
        acronym: "Enterprise NAS (NFS/SMB)",
        category: "Enterprise & Server",
        definition: "Dedicated file-level storage server na nakakonekta sa local network, nagbibigay-daan sa maraming users at heterogeneous clients na mag-share ng central files gamit ang SMB, NFS, at AFP protocols.",
        fieldNote: "Academic & Industry Use Case: Sentralisadong file repository sa media production houses, school department shares, at VM backup staging targets.",
        imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Fibre Channel Storage Area Network",
        acronym: "SAN (All-Flash Array / NVMe-oF)",
        category: "Enterprise & Server",
        definition: "High-speed, dedicated sub-network ng storage controllers at disk shelves na nagbibigay ng raw block-level access sa servers gamit ang 32G Fibre Channel o RoCE.",
        fieldNote: "Academic & Industry Use Case: Mission-critical database clusters (Oracle, Microsoft SQL) at Tier-1 virtualization clusters (VMware ESXi / Proxmox HA) para sa zero-latency VM storage migrations.",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "OpenZFS Storage Pool & File System",
        acronym: "ZFS (RAID-Z / Copy-on-Write)",
        category: "Enterprise & Server",
        definition: "Advanced 128-bit combined file system at logical volume manager na nagtatampok ng Copy-on-Write, automatic self-healing laban sa silent data corruption, at instant snapshots.",
        fieldNote: "Academic & Industry Use Case: Ang software-defined storage backbone ng TrueNAS, Proxmox VE, at enterprise FreeBSD servers para mapanatili ang cryptographic data integrity.",
        imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Ceph Distributed Storage Cluster",
        acronym: "Ceph (RADOS / SDS)",
        category: "Enterprise & Server",
        definition: "Massively scalable, software-defined storage platform na nagko-converge ng block (RBD), object (RGW), at file (CephFS) storage sa iisang distributed cluster na walang single point of failure.",
        fieldNote: "Academic & Industry Use Case: Ginagamit sa OpenStack private clouds at malalaking datacenter clusters para sa petabyte-scale high-availability storage pools.",
        imageUrl: "https://images.unsplash.com/photo-1520869562399-e772f142f422?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Enterprise S3-Compatible Object Store",
        acronym: "MinIO / Cloud Object Storage",
        category: "Enterprise & Server",
        definition: "High-performance distributed object storage system na sumusunod sa Amazon S3 API standard, idinisenyo para sa unstructured data tulad ng photos, videos, system logs, at AI training datasets.",
        fieldNote: "Academic & Industry Use Case: Ginagamit sa modern cloud-native architectures, Kubernetes clusters, at data lakes bilang on-premise private alternative sa AWS S3.",
        imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    },

    // --- DATABASES ---
    {
        term: "PostgreSQL Relational Engine",
        acronym: "Postgres (ORDBMS / ACID)",
        category: "Databases",
        definition: "Isang open-source object-relational database management system na sumusunod sa mahigpit na ACID compliance, advanced indexing, at complex analytical queries.",
        fieldNote: "Academic & Industry Use Case: Standard sa transactional data integrity (fintech, accounting, e-commerce) at underlying PostgreSQL engine ng modern cloud platforms tulad ng Supabase.",
        imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "MySQL Relational Database",
        acronym: "MySQL / MariaDB (RDBMS)",
        category: "Databases",
        definition: "Isang popular na multi-threaded, relational database system na gumagamit ng structured tables, foreign keys, at InnoDB engine para sa safe transactions.",
        fieldNote: "Academic & Industry Use Case: Ang default na database sa LAMP/WAMP stacks at karaniwang ginagamit sa university capstone projects, information systems, at web portals.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Redis In-Memory Data Store",
        acronym: "Redis (NoSQL / Key-Value Cache)",
        category: "Databases",
        definition: "Isang in-memory key-value data store na nagbibigay ng sub-millisecond retrieval speeds para sa session storage, rate limiting, at distributed messaging queues.",
        fieldNote: "Academic & Industry Use Case: Ginagamit sa enterprise systems para i-cache ang frequent SQL query results nang hindi kinakailangang mag-disk read sa pangunahing database.",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "MongoDB Document Database",
        acronym: "MongoDB (NoSQL / BSON)",
        category: "Databases",
        definition: "Isang distributed, document-oriented NoSQL database na nag-iimbak ng data sa flexible, JSON-like BSON format nang walang fixed table schemas.",
        fieldNote: "Academic & Industry Use Case: Ginagamit sa MERN/MEAN stack developments, content logging, at mga aplikasyon na may mabilisang nagbabagong data structure.",
        imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
    },

    // --- PROGRAMMING LANGUAGES ---
    {
        term: "Python",
        acronym: "Python 3 (Interpreted / OOP)",
        category: "Programming Languages",
        definition: "Isang high-level, dynamically-typed interpreted language na kilala sa madaling syntax, modular standard library, at support sa functional at object-oriented paradigms.",
        fieldNote: "Academic & Industry Use Case: Pangunahing wika sa Machine Learning (PyTorch, TensorFlow), Network Automation (Netmiko), Data Science, at Cybersecurity penetration testing scripts.",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "TypeScript / JavaScript",
        acronym: "TS / JS (V8 Runtime)",
        category: "Programming Languages",
        definition: "Ang TypeScript ay isang strongly-typed superset ng JavaScript na nagdaragdag ng static type-checking bago mag-compile sa standard ECMA script.",
        fieldNote: "Academic & Industry Use Case: Standard sa modern Full-Stack Web Development gamit ang frameworks tulad ng Next.js, React, Node.js, at serverless backend APIs.",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Java",
        acronym: "Java (JVM / Platform-Independent)",
        category: "Programming Languages",
        definition: "Class-based, object-oriented compiled language na tumatakbo sa loob ng Java Virtual Machine (JVM) na may automatic memory management at garbage collection.",
        fieldNote: "Academic & Industry Use Case: Pangunahing foundation sa CS/IT curricula para sa Object-Oriented Programming (OOP), Enterprise Core Banking Systems, at legacy Android application architecture.",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "PHP: Hypertext Preprocessor",
        acronym: "PHP (Server-Side Scripting)",
        category: "Programming Languages",
        definition: "Isang server-side scripting language na partikular na idinisenyo para sa dynamic web application generation at direct database communication.",
        fieldNote: "Academic & Industry Use Case: Ginagamit sa enterprise content management systems (WordPress, Moodle LMS) at modern web frameworks tulad ng Laravel para sa mabilisang CRUD RESTful APIs.",
        imageUrl: "https://images.unsplash.com/photo-1599507593499-a3f7f7d9a2cc?auto=format&fit=crop&w=800&q=80",
    },

    // --- OPERATING SYSTEMS ---
    {
        term: "Linux Kernel & Distributions",
        acronym: "Linux (Debian / RHEL)",
        category: "Operating Systems",
        definition: "Isang open-source, monolithic, Unix-like operating system kernel na namamahala sa hardware resources, process isolation, at network stacks.",
        fieldNote: "Academic & Industry Use Case: Nagpapatakbo sa mahigit 90% ng cloud servers, web hosting infrastructures, Docker containers, at enterprise computing nodes.",
        imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Windows Server & AD DS",
        acronym: "WinServer / Active Directory",
        category: "Operating Systems",
        definition: "Enterprise platform mula sa Microsoft para sa sentralisadong identity governance, domain-joined authentication, at Group Policy Objects (GPO).",
        fieldNote: "Academic & Industry Use Case: Pangunahing directory standard ng corporate offices at university computer labs para sa centralized account management at security policies.",
        imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Proxmox Virtual Environment",
        acronym: "Proxmox VE (Type-1 KVM)",
        category: "Operating Systems",
        definition: "Bare-metal open-source hypervisor na pinagsasama ang Kernel-based Virtual Machine (KVM) at lightweight Linux Containers (LXC).",
        fieldNote: "Academic & Industry Use Case: Standard platform sa IT school server labs at homelabs para sa virtualization at containerization nang walang licensing cost.",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    },

    // --- HARDWARE ---
    {
        term: "Dual In-line Memory Module",
        acronym: "DIMM (DDR5)",
        category: "Hardware",
        definition: "High-density printed circuit board na may synchronous dynamic RAM chips at dedicated on-board Power Management IC (PMIC).",
        fieldNote: "Laging i-populate sa A2 at B2 slots para sa pinakamalinis na trace signaling sa standard dual-channel daisy chain topology.",
        imageUrl: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Voltage Regulator Module",
        acronym: "VRM / DrMOS",
        category: "Hardware",
        definition: "Buck converter circuit na nagpapababa ng 12V supply mula sa PSU patungong sub-1.4V VCore para sa modern multicore processors.",
        fieldNote: "Bantayan ang MOSFET temperatures kapag nagpapatakbo ng heavy continuous compute; thermal throttling kapag lumampas sa 95°C.",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    },

    // --- NETWORKING ---
    {
        term: "Small Form-Factor Pluggable 28",
        acronym: "SFP28 (25GbE)",
        category: "Networking",
        definition: "Hot-swappable transceiver form factor na may support para sa 25 Gbps data rates gamit ang LC multi-mode fiber o twinaxial DAC.",
        fieldNote: "Pinapalitan ang legacy 10G SFP+ sa enterprise access layers nang hindi binabago ang physical 1U switch footprint.",
        imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Power Over Ethernet Type 4",
        acronym: "PoE++ (802.3bt)",
        category: "Networking",
        definition: "Standard na nagbibigay ng hanggang 90W DC power gamit ang lahat ng 4 copper pairs para sa high-draw devices tulad ng PTZ security cameras.",
        fieldNote: "Gumamit lamang ng pure bare copper conductors; iwasan ang Copper-Clad Aluminum (CCA) dahil sa labis na resistive heating.",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    },

    // --- TOOLS & DIAGNOSTICS ---
    {
        term: "Wireshark Network Packet Analyzer",
        acronym: "PCAP Sniffer",
        category: "Tools & Diagnostics",
        definition: "Open-source packet capture utility na nagde-decode ng live traffic frames sa data link, network, at transport layers.",
        fieldNote: "Ginagamit sa networking classes para ituro ang TCP 3-way handshake at mag-diagnose ng network congestion o dropped packets.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
    {
        term: "Nmap Network Exploration Tool",
        acronym: "Network Mapper",
        category: "Tools & Diagnostics",
        definition: "Command-line security scanner para sa network discovery, port auditing, OS fingerprinting, at banner grabbing.",
        fieldNote: "Standard tool sa cybersecurity pentesting courses para sa reconnaissance at paghahanap ng bukas na network services.",
        imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80",
    },

    // --- MALWARE & THREATS ---
    {
        term: "LockBit Enterprise Ransomware",
        acronym: "RaaS Cryptolocker",
        category: "Malware & Threats",
        definition: "Malicious payload na gumagamit ng AES at RSA cryptography para i-encrypt ang critical system files, database records, at live virtualization volumes.",
        fieldNote: "Pinupuntirya ang volume shadow copies via `vssadmin delete shadows`. Depensahan gamit ang immutable 3-2-1 air-gapped backups.",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    }
];

export default function TechGlossary() {
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [termSearch, setTermSearch] = useState("");

    const categories = [
        "All",
        "Enterprise & Server",
        "Databases",
        "Programming Languages",
        "Operating Systems",
        "Hardware",
        "Networking",
        "Tools & Diagnostics",
        "Malware & Threats"
    ];

    const filteredItems = GLOSSARY_ITEMS.filter((item) => {
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        const matchesSearch =
            item.term.toLowerCase().includes(query.toLowerCase()) ||
            (item.acronym && item.acronym.toLowerCase().includes(query.toLowerCase())) ||
            item.definition.toLowerCase().includes(query.toLowerCase()) ||
            item.fieldNote.toLowerCase().includes(query.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const filteredTerminologies = INDUSTRY_TERMINOLOGIES.filter((t) => {
        const q = termSearch.toLowerCase();
        return (
            t.term.toLowerCase().includes(q) ||
            (t.acronym && t.acronym.toLowerCase().includes(q)) ||
            t.domain.toLowerCase().includes(q) ||
            t.meaning.toLowerCase().includes(q) ||
            t.industryApplication.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-10">
            {/* SECTION 1: VISUAL GLOSSARY CARDS */}
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                            <BookMarked className="w-6 h-6 text-cyan-500" /> Visual IT Glossary & Nomenclature
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Standard technical reference catalog para sa IT, CS, at IS students na may kasamang photographic diagrams.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search components, storage, OS..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none focus:border-cyan-500 shadow-sm"
                        />
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg border transition ${selectedCategory === cat
                                    ? "bg-cyan-600 text-white font-bold border-cyan-600 shadow-sm"
                                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-cyan-500/50 hover:shadow-md transition group flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.term}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                    <span
                                        className={`absolute top-2.5 right-2.5 text-[9px] font-mono px-2 py-0.5 rounded-md backdrop-blur-md uppercase border ${item.category === "Enterprise & Server"
                                                ? "bg-purple-950/80 text-purple-400 border-purple-500/40"
                                                : item.category === "Databases"
                                                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                                                    : item.category === "Programming Languages"
                                                        ? "bg-blue-950/80 text-blue-400 border-blue-500/40"
                                                        : item.category === "Operating Systems"
                                                            ? "bg-indigo-950/80 text-indigo-400 border-indigo-500/40"
                                                            : item.category === "Malware & Threats"
                                                                ? "bg-red-950/80 text-red-400 border-red-500/40"
                                                                : "bg-black/75 text-cyan-400 border-cyan-500/30"
                                            }`}
                                    >
                                        {item.category}
                                    </span>
                                </div>

                                <div className="p-4 space-y-2">
                                    {item.acronym && (
                                        <span className="text-[11px] font-mono font-bold text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 inline-block">
                                            {item.acronym}
                                        </span>
                                    )}
                                    <h3 className="font-mono font-bold text-sm text-slate-900 dark:text-white leading-snug">
                                        {item.term}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                                        {item.definition}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                <span className="text-amber-500 font-bold block mb-1">
                                    Student & Industry Reference:
                                </span>
                                <p className="font-sans leading-relaxed text-slate-700 dark:text-slate-300">
                                    {item.fieldNote}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-8 font-mono text-xs text-slate-500">
                        Walang nahanap na component para sa "{query}".
                    </div>
                )}
            </div>

            {/* SECTION 2: INDUSTRY TERMINOLOGIES & JARGON TABLE (COMPACT CHEAT SHEET) */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h3 className="font-mono font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <Table className="w-5 h-5 text-amber-500" /> Tech Industry Jargon & Operational Terminologies Matrix
                        </h3>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">
                            Quick lookup reference para sa mga business at engineering terms na madalas gamitin sa corporate IT, software teams, at SLA contracts.
                        </p>
                    </div>

                    {/* Quick Matrix Filter */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search jargon, acronym (e.g. SLA)..."
                            value={termSearch}
                            onChange={(e) => setTermSearch(e.target.value)}
                            className="w-full pl-8 pr-2.5 py-1.5 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                {/* Responsive Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50">
                                <th className="py-2.5 px-3">Term / Acronym</th>
                                <th className="py-2.5 px-3">Domain</th>
                                <th className="py-2.5 px-4">Standard Definition</th>
                                <th className="py-2.5 px-4">Real-World Industry Application</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                            {filteredTerminologies.map((t, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                                >
                                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white align-top whitespace-nowrap">
                                        <div>{t.term}</div>
                                        {t.acronym && (
                                            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 inline-block mt-0.5">
                                                {t.acronym}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 align-top whitespace-nowrap">
                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${t.domain === "DevOps & Cloud"
                                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                : t.domain === "Software Eng"
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : t.domain === "IT Operations & Sec"
                                                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            }`}>
                                            {t.domain}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 align-top leading-relaxed max-w-xs">
                                        {t.meaning}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 align-top leading-relaxed max-w-sm font-mono text-[11px] bg-slate-50/50 dark:bg-slate-950/30 rounded">
                                        {t.industryApplication}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTerminologies.length === 0 && (
                        <div className="text-center py-6 text-xs font-mono text-slate-500">
                            Walang nahanap na industry jargon para sa "{termSearch}".
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}