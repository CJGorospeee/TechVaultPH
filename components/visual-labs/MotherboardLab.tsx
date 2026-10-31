"use client";

import { useState } from "react";
import { Cpu, Zap, Activity, Info, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

interface BoardComponent {
  id: string;
  name: string;
  subtitle: string;
  pinsVoltage: string;
  role: string;
  diagnostics: string;
  studentChecklist: string[];
}

const BOARD_COMPONENTS: Record<string, BoardComponent> = {
  cpu_socket: {
    id: "cpu_socket",
    name: "LGA 1700 / AM5 Processor Socket",
    subtitle: "Central Processing Unit Land Grid Array",
    pinsVoltage: "Direct VCore (~0.8V - 1.4V) | Multi-Rail",
    role: "Pisikal at electrical interface sa pagitan ng CPU at ng motherboard traces. Dito dumadaan ang primary PCIe lanes, integrated memory controller links, at DMI bus.",
    diagnostics: "Kapag may bent pins sa LGA socket o hindi pantay ang mounting pressure ng CPU cooler, karaniwang nagreresulta ito sa Memory Channel failure (hindi mabasa ang RAM sa B-channel) o PCIe slot downgrade.",
    studentChecklist: [
      "I-inspect ang gold contact pins gamit ang magnifying glass bago mag-drop ng CPU.",
      "Sundin ang triangle alignment notch indicator sa kanto ng socket.",
      "Huwag sobrahan ang paghigpit ng cooler screws upang maiwasan ang socket trace warping."
    ]
  },
  vrm_heatsink: {
    id: "vrm_heatsink",
    name: "Digital VRM & Power Stages (16+1+1 Phases)",
    subtitle: "DrMOS / MOSFETs, Chokes & Solid Polymer Capacitors",
    pinsVoltage: "+12V Input -> +0.8V to 1.35V VCore Output",
    role: "Multi-phase buck converter na nagpapababa at naglilinis ng +12V galing sa PSU patungo sa pinong boltahe na kailangan ng processor transistors.",
    diagnostics: "Kapag lumagpas sa 95°C ang heatsink, mag-uutos ang motherboard ng PROCHOT (Processor Hot) throttle signal, dahilan upang bumagsak ang clock speed sa 800 MHz.",
    studentChecklist: [
      "Tiyaking may sapat na airflow ang chassis sa ibabaw ng VRM fin arrays.",
      "Suriin kung lapat ang thermal pads sa pagitan ng DrMOS packages at aluminum heatsink.",
      "Pakinggan kung may maririnig na high-frequency coil whine mula sa inductors."
    ]
  },
  eps_power: {
    id: "eps_power",
    name: "Dual 8-Pin EPS12V CPU Power Headers",
    subtitle: "Auxiliary High-Current 12V Rails",
    pinsVoltage: "+12V DC (Hanggang 336W kada 8-pin connector)",
    role: "Nagbibigay ng dedicated at continuous DC current direkta papunta sa VRM high-side MOSFETs nang hindi dumadaan sa main 24-pin connector.",
    diagnostics: "Kapag hindi nakasaksak ang EPS cable, mag-iikot ang fans pero walang display, at mananatiling nakailaw ang CPU Debug LED.",
    studentChecklist: [
      "Huwag ipagkamali ang 8-pin PCIe cable sa 8-pin CPU/EPS cable (magkaiba ang pinout keying).",
      "Siguraduhing nag-click ang retention latch sa socket header."
    ]
  },
  dimm_slots: {
    id: "dimm_slots",
    name: "4x DDR5 DIMM Memory Channels (A1, A2, B1, B2)",
    subtitle: "288-Pin Dual-Channel Memory Topology",
    pinsVoltage: "1.1V - 1.4V VDD / VDDQ (Dedicated On-DIMM PMIC)",
    role: "Naghahatid ng direct 64-bit (o dual 32-bit subchannels sa DDR5) high-frequency data traces papunta sa integrated memory controller ng CPU.",
    diagnostics: "Sa standard Daisy-Chain topology, kailangang unahing lagyan ang A2 at B2 slots para sa signal integrity; kung sa A1/B1 inilagay, maaaring mag-fail ang XMP/EXPO memory training (POST code 55 o 4C).",
    studentChecklist: [
      "I-populate muna ang Slot 2 at 4 (A2 at B2) kapag dual-stick kit ang gamit.",
      "I-verify ang asymmetrical center key notch bago idiin ang module.",
      "Siguraduhing nag-lock ang retention latches sa magkabilang dulo."
    ]
  },
  atx_power: {
    id: "atx_power",
    name: "24-Pin ATX Main Power Connector",
    subtitle: "Systemboard Primary Power Distribution Block",
    pinsVoltage: "+3.3V, +5V, +12V, -12V, +5VSB (Standby), PS_ON",
    role: "Pangunahing pinanggagalingan ng boltahe para sa chipset, PCIe slot auxiliary power (hanggang 75W), onboard audio, USB controllers, at standby circuitry.",
    diagnostics: "Maaaring subukan ang power supply gamit ang paperclip test sa pamamagitan ng pag-short ng Pin 16 (PS_ON, karaniwang green wire) sa alinmang Pin Ground (black wire).",
    studentChecklist: [
      "Suriin ang +5VSB (Pin 9) gamit ang multimeter kung patay ang buong board.",
      "Siguraduhing fully seated at walang agwat ang latch sa receptacle."
    ]
  },
  pcie_x16: {
    id: "pcie_x16",
    name: "PCIe 5.0 x16 Reinforced SafeSlot",
    subtitle: "High-Bandwidth Expansion Slot (Direct CPU Lanes)",
    pinsVoltage: "+3.3V at +12V Rails (Hanggang 75W Direct Slot Power)",
    role: "Pangunahing slot para sa dedicated Discrete Graphics Processing Unit (GPU) o high-speed capture cards na may direct connection sa CPU.",
    diagnostics: "Kapag marumi o may alikabok ang slot, maaaring mag-downgrade ang operating speed mula x16 pababa sa x8 o x4 mode (makikita gamit ang GPU-Z).",
    studentChecklist: [
      "Huwag kalimutang idiin ang slot Q-Release latch bago bunutin ang mabigat na GPU.",
      "Siguraduhing nakalapat ang metal shield bracket sa rear case I/O opening."
    ]
  },
  m2_slots: {
    id: "m2_slots",
    name: "M.2 NVMe PCIe 4.0 / 5.0 M-Key Slots",
    subtitle: "High-Speed SSD Storage Socket na may Aluminum Heatsink",
    pinsVoltage: "+3.3V DC Dedicated Rail",
    role: "Direct PCIe 4-lane connection para sa M.2 2280 solid-state drives, nag-aalis ng pangangailangan sa SATA data at power cables.",
    diagnostics: "Kapag nakalimutang tanggalin ang blue protective plastic film sa ilalim ng thermal pad, mag-o-overheat ang SSD controller at babagsak ang read/write speeds sa 50 MB/s.",
    studentChecklist: [
      "Tanggalin ang protective film sa ibabaw at ilalim ng thermal pads.",
      "I-lock ang drive gamit ang tool-free M.2 Q-Latch o screw standoff nang hindi binabaluktot ang PCB."
    ]
  },
  chipset_pch: {
    id: "chipset_pch",
    name: "Platform Controller Hub (PCH / Chipset)",
    subtitle: "System Peripheral Hub & Bus Multiplexer",
    pinsVoltage: "Sub-1.05V Core PCH Rail",
    role: "Namamahala sa secondary PCIe lanes, SATA controllers, onboard Intel/Realtek 2.5GbE LAN, Wi-Fi modules, USB ports, at high-definition audio codecs.",
    diagnostics: "Kung biglang nawala ang lahat ng USB 3.0 ports at SATA drives nang sabay-sabay, suriin ang thermal status ng PCH heatsink.",
    studentChecklist: [
      "Huwag harangan ang airflow sa paligid ng chipset enclosure.",
      "I-update ang Intel ME (Management Engine) o AMD Chipset Drivers sa OS level."
    ]
  },
  sata_ports: {
    id: "sata_ports",
    name: "SATA 6Gbps (Serial ATA Revision 3.0)",
    subtitle: "Storage Controller Ports para sa 2.5\" SSDs at 3.5\" HDDs",
    pinsVoltage: "Differential Signal Signaling (0.5V peak-to-peak)",
    role: "Legacy storage connectivity para sa bulk mechanical hard drives at optical disk drives gamit ang AHCI command protocol.",
    diagnostics: "Sa ilang motherboards, kapag may nakasaksak na M.2 SATA SSD sa M2_2 slot, awtomatikong madi-disable ang SATA Port 1 at Port 2 dulot ng lane sharing.",
    studentChecklist: [
      "Gumamit ng locking latch SATA data cables para hindi lumuwag sa vibration.",
      "I-verify sa BIOS kung naka-set sa AHCI mode imbes na legacy IDE."
    ]
  },
  fpanel_header: {
    id: "fpanel_header",
    name: "Front Panel Control Header (JFP1 / FPANEL)",
    subtitle: "Power Switch, Reset Switch, Power LED, at HDD Activity LED",
    pinsVoltage: "+3.3V (LEDs) | 3.3V Pull-Up Sense (Switches)",
    role: "Pinagkakabitan ng front power buttons, switches, at status indicators ng computer case.",
    diagnostics: "Kapag ayaw mag-power on ng system gamit ang case button, subukang i-short sandali ang Pin 6 at Pin 8 (PWR_BTN at GND) gamit ang flathead screwdriver para ma-test kung sirang switch ang dahilan.",
    studentChecklist: [
      "Tandaan: Ang switches (Power/Reset) ay walang polarity (+/- kahit baligtad), ngunit ang LEDs (Power LED, HDD LED) ay may mahigpit na positive (+) at negative (-) orientation.",
      "Tingnan ang pinout diagram na nakaimprenta sa mismong PCB silkscreen."
    ]
  },
  clear_cmos: {
    id: "clear_cmos",
    name: "Clear CMOS (JBAT1 Jumper / Button)",
    subtitle: "Real-Time Clock & BIOS NVRAM Reset Switch",
    pinsVoltage: "3.0V Coin Cell Battery Circuit (CR2032)",
    role: "Nire-reset ang volatile CMOS memory pabalik sa factory default settings, inaalis ang unstable memory profiles, maling overclock voltages, at nakalimutang BIOS passwords.",
    diagnostics: "Kung paulit-ulit na nawawala ang oras ng computer tuwing bubuksan ang AVR, palitan ang CR2032 lithium coin battery (dapat ay lampas 3.0V ang sukat sa multimeter).",
    studentChecklist: [
      "I-unplug ang power cord mula sa outlet bago i-short ang JBAT1 pins ng 10 segundo.",
      "Pindutin ang power button habang unplugged para ma-discharge ang natitirang kuryente sa capacitors."
    ]
  },
  debug_led: {
    id: "debug_led",
    name: "7-Segment Q-Code / Diagnostic LEDs",
    subtitle: "Hardware Power-On Self-Test (POST) Indicator",
    pinsVoltage: "Low-voltage Logic Level Signal",
    role: "Real-time visual telemetry na nagpapakita kung saang yugto ng hardware initialization huminto o nag-hang ang system (CPU -> DRAM -> VGA -> BOOT).",
    diagnostics: "LED na huminto sa DRAM: may isyu sa memory sticks o training; LED na huminto sa VGA: walang monitor signal o maluwag ang PCIe GPU power cable.",
    studentChecklist: [
      "Tingnan ang dalawang digit na Q-Code sa display at i-cross reference sa TechVault POST lookup tool.",
      "Hayaang matapos ang memory training (maaaring umabot ng 1-2 minuto sa unang boot ng DDR5)."
    ]
  }
};

export default function MotherboardLab() {
  const [selectedId, setSelectedId] = useState<string>("cpu_socket");
  const selected = BOARD_COMPONENTS[selectedId];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-cyan-500" /> Interactive Motherboard Architecture Lab
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Full ATX form factor schematic explorer: i-click ang bawat pisikal na parte ng motherboard upang masuri ang pins, boltahe, trace topology, at field diagnostic runbooks.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Motherboard PCB Interactive Canvas (7 cols) */}
        <div className="xl:col-span-7 bg-[#050811] border-2 border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono">
            <span className="flex items-center gap-2 text-white font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              PCB LAYER: ATX 8-LAYER HIGH-TG FABRIC
            </span>
            <span className="text-slate-400 text-[11px]">Click an outlined component to inspect</span>
          </div>

          {/* SVG Vector Motherboard PCB */}
          <div className="py-4 flex items-center justify-center">
            <svg
              viewBox="0 0 600 620"
              className="w-full max-w-[550px] h-auto drop-shadow-xl select-none"
            >
              {/* PCB Baseboard */}
              <rect x="10" y="10" width="580" height="600" rx="16" fill="#090f1d" stroke="#1e293b" strokeWidth="4" />
              
              {/* Motherboard Mounting Screw Holes */}
              {[[25, 25], [300, 25], [575, 25], [25, 310], [575, 310], [25, 595], [300, 595], [575, 595]].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="6" fill="#030712" stroke="#64748b" strokeWidth="1.5" />
                  <circle cx={cx} cy={cy} r="3" fill="#cbd5e1" />
                </g>
              ))}

              {/* Rear I/O Shield Block */}
              <rect x="12" y="30" width="45" height="180" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="34" y="125" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace" transform="rotate(-90 34,125)" textAnchor="middle">
                REAR I/O SHIELD PORTS
              </text>

              {/* COMPONENT: DUAL EPS 8-PIN (Top Left) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("eps_power")}
              >
                <rect
                  x="70"
                  y="22"
                  width="65"
                  height="26"
                  rx="3"
                  fill={selectedId === "eps_power" ? "#0284c7" : "#1e293b"}
                  stroke={selectedId === "eps_power" ? "#38bdf8" : "#475569"}
                  strokeWidth="2"
                />
                <text x="102" y="38" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  EPS 8+8P
                </text>
              </g>

              {/* COMPONENT: VRM HEATSINKS */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("vrm_heatsink")}
              >
                {/* Top VRM */}
                <rect
                  x="145"
                  y="22"
                  width="170"
                  height="34"
                  rx="4"
                  fill={selectedId === "vrm_heatsink" ? "#0284c7" : "#0f172a"}
                  stroke={selectedId === "vrm_heatsink" ? "#38bdf8" : "#334155"}
                  strokeWidth="2"
                />
                {/* Left VRM */}
                <rect
                  x="70"
                  y="60"
                  width="45"
                  height="145"
                  rx="4"
                  fill={selectedId === "vrm_heatsink" ? "#0284c7" : "#0f172a"}
                  stroke={selectedId === "vrm_heatsink" ? "#38bdf8" : "#334155"}
                  strokeWidth="2"
                />
                <text x="230" y="43" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  DIGITAL VRM HEATSINK (16-PHASE)
                </text>
              </g>

              {/* COMPONENT: CPU SOCKET */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("cpu_socket")}
              >
                <rect
                  x="145"
                  y="70"
                  width="155"
                  height="145"
                  rx="8"
                  fill={selectedId === "cpu_socket" ? "#0369a1" : "#131d31"}
                  stroke={selectedId === "cpu_socket" ? "#38bdf8" : "#0284c7"}
                  strokeWidth={selectedId === "cpu_socket" ? "3" : "2"}
                />
                <rect x="165" y="90" width="115" height="105" rx="4" fill="#080d1a" stroke="#1e293b" />
                <circle cx="150" cy="75" r="3" fill="#f59e0b" /> {/* Pin 1 triangle indicator */}
                <text x="222" y="140" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  LGA SOCKET
                </text>
                <text x="222" y="155" fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  CPU VCORE AREA
                </text>
              </g>

              {/* COMPONENT: DDR5 DIMM SLOTS (A1, A2, B1, B2) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("dimm_slots")}
              >
                <rect
                  x="335"
                  y="55"
                  width="110"
                  height="175"
                  rx="6"
                  fill={selectedId === "dimm_slots" ? "#0c4a6e" : "#091120"}
                  stroke={selectedId === "dimm_slots" ? "#38bdf8" : "#334155"}
                  strokeWidth="2"
                />
                {/* 4 Memory Slots */}
                {[345, 370, 395, 420].map((x, i) => (
                  <g key={i}>
                    <rect x={x} y="65" width="12" height="155" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                    <line x1={x} y1="140" x2={x + 12} y2="140" stroke="#f59e0b" strokeWidth="2" /> {/* Key notch */}
                  </g>
                ))}
                <text x="390" y="45" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  DDR5 RAM SLOTS
                </text>
                <text x="351" y="235" fill="#94a3b8" fontSize="7" fontFamily="monospace">A1</text>
                <text x="376" y="235" fill="#38bdf8" fontSize="7" fontWeight="bold" fontFamily="monospace">A2*</text>
                <text x="401" y="235" fill="#94a3b8" fontSize="7" fontFamily="monospace">B1</text>
                <text x="426" y="235" fill="#38bdf8" fontSize="7" fontWeight="bold" fontFamily="monospace">B2*</text>
              </g>

              {/* COMPONENT: 24-PIN ATX MAIN CONNECTOR */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("atx_power")}
              >
                <rect
                  x="545"
                  y="120"
                  width="35"
                  height="110"
                  rx="4"
                  fill={selectedId === "atx_power" ? "#0284c7" : "#1e293b"}
                  stroke={selectedId === "atx_power" ? "#38bdf8" : "#475569"}
                  strokeWidth="2"
                />
                <text x="562" y="178" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" transform="rotate(90 562,178)" textAnchor="middle">
                  24-PIN ATX
                </text>
              </g>

              {/* COMPONENT: DEBUG 7-SEGMENT / Q-CODE LED */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("debug_led")}
              >
                <rect
                  x="535"
                  y="30"
                  width="45"
                  height="30"
                  rx="3"
                  fill="#000000"
                  stroke={selectedId === "debug_led" ? "#38bdf8" : "#ef4444"}
                  strokeWidth="2"
                />
                <text x="557" y="50" fill="#ef4444" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace" className="animate-pulse">
                  00
                </text>
              </g>

              {/* COMPONENT: PRIMARY M.2 NVME SLOT (Under Heatsink) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("m2_slots")}
              >
                <rect
                  x="145"
                  y="235"
                  width="180"
                  height="36"
                  rx="4"
                  fill={selectedId === "m2_slots" ? "#0284c7" : "#1e293b"}
                  stroke={selectedId === "m2_slots" ? "#38bdf8" : "#475569"}
                  strokeWidth="2"
                />
                <text x="235" y="257" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  M.2_1 PCIe 5.0 SHIELD (NVMe)
                </text>
              </g>

              {/* COMPONENT: PRIMARY PCIE 5.0 X16 SLOT */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("pcie_x16")}
              >
                <rect
                  x="50"
                  y="290"
                  width="380"
                  height="26"
                  rx="4"
                  fill={selectedId === "pcie_x16" ? "#0284c7" : "#0f172a"}
                  stroke={selectedId === "pcie_x16" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth="2.5"
                />
                <rect x="55" y="295" width="40" height="16" fill="#1e293b" />
                <rect x="105" y="295" width="315" height="16" fill="#1e293b" />
                <text x="245" y="307" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  PCIe 5.0 x16 REINFORCED SAFESLOT (DISCRETE GPU)
                </text>
              </g>

              {/* SECONDARY M.2 SLOT 2 */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("m2_slots")}
              >
                <rect
                  x="145"
                  y="335"
                  width="180"
                  height="32"
                  rx="4"
                  fill={selectedId === "m2_slots" ? "#0284c7" : "#1e293b"}
                  stroke={selectedId === "m2_slots" ? "#38bdf8" : "#334155"}
                  strokeWidth="1.5"
                />
                <text x="235" y="355" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  M.2_2 PCIe 4.0 SLOT
                </text>
              </g>

              {/* SECONDARY PCIE EXPANSION SLOT */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("pcie_x16")}
              >
                <rect
                  x="50"
                  y="385"
                  width="380"
                  height="22"
                  rx="4"
                  fill="#091120"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <text x="240" y="400" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  PCIe 4.0 x4 EXPANSION SLOT
                </text>
              </g>

              {/* COMPONENT: CHIPSET PCH HEATSINK */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("chipset_pch")}
              >
                <rect
                  x="380"
                  y="350"
                  width="135"
                  height="125"
                  rx="8"
                  fill={selectedId === "chipset_pch" ? "#0284c7" : "#0f172a"}
                  stroke={selectedId === "chipset_pch" ? "#38bdf8" : "#334155"}
                  strokeWidth="2.5"
                />
                <text x="447" y="410" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  CHIPSET PCH
                </text>
                <text x="447" y="425" fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  PLATFORM CONTROLLER
                </text>
              </g>

              {/* COMPONENT: SATA 6GBPS PORTS */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("sata_ports")}
              >
                <rect
                  x="545"
                  y="370"
                  width="38"
                  height="85"
                  rx="4"
                  fill={selectedId === "sata_ports" ? "#0284c7" : "#1e293b"}
                  stroke={selectedId === "sata_ports" ? "#38bdf8" : "#475569"}
                  strokeWidth="2"
                />
                <text x="564" y="415" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" transform="rotate(90 564,415)" textAnchor="middle">
                  4x SATA 6G
                </text>
              </g>

              {/* COMPONENT: CLEAR CMOS (JBAT1) & BATTERY */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("clear_cmos")}
              >
                <circle
                  cx="120"
                  cy="465"
                  r="24"
                  fill={selectedId === "clear_cmos" ? "#0284c7" : "#334155"}
                  stroke={selectedId === "clear_cmos" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth="2"
                />
                <text x="120" y="468" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  CR2032
                </text>
                <rect x="155" y="455" width="16" height="20" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="163" y="490" fill="#f59e0b" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  JBAT1
                </text>
              </g>

              {/* COMPONENT: FPANEL (Bottom Right Corner) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedId("fpanel_header")}
              >
                <rect
                  x="485"
                  y="565"
                  width="85"
                  height="26"
                  rx="3"
                  fill={selectedId === "fpanel_header" ? "#0284c7" : "#1e293b"}
                  stroke={selectedId === "fpanel_header" ? "#38bdf8" : "#f59e0b"}
                  strokeWidth="2"
                />
                <text x="527" y="581" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  JFP1 / FPANEL
                </text>
              </g>
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-400 bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2">
            <span>Active Trace Selected: <strong className="text-cyan-400">{selected.name}</strong></span>
            <span className="text-emerald-400 font-bold">Standard ATX Form Factor (305 × 244 mm)</span>
          </div>
        </div>

        {/* Diagnostic Runbook & Technical Breakdown (5 cols) */}
        <div className="xl:col-span-5 bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 font-mono">
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 uppercase tracking-wider">
              COMPONENT BENCH TELEMETRY
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 leading-tight">
              {selected.name}
            </h3>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-0.5 font-bold">
              {selected.subtitle}
            </p>
          </div>

          {/* Quick Electrical Specification */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Voltage & Trace Rating:
            </span>
            <span className="text-xs font-bold text-amber-500 dark:text-amber-400 block">
              {selected.pinsVoltage}
            </span>
          </div>

          {/* Functional Role */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-500" /> Functional Role & Interconnects:
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              {selected.role}
            </p>
          </div>

          {/* Field Diagnostics & Failure Modes */}
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1.5 text-xs font-sans">
            <span className="font-mono font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" /> Field Triage & Failure Symptoms:
            </span>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {selected.diagnostics}
            </p>
          </div>

          {/* Student Lab Checklist */}
          <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Student Verification Protocol:
            </span>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-sans space-y-1.5">
              {selected.studentChecklist.map((item, idx) => (
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
  );
}