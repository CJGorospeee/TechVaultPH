"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotherboardLab from "@/components/visual-labs/MotherboardLab";
import RaidLab from "@/components/visual-labs/RaidLab";
import TopologyLab from "@/components/visual-labs/TopologyLab";
import ToolsSuite from "@/components/tools/ToolsSuite";
import ServerRackModule from "@/components/servers/ServerRackModule";
import HardwareDiagnostics from "@/components/hardware/HardwareDiagnostics";
import TechGlossary from "@/components/glossary/TechGlossary";
import DevHub from "@/components/dev/DevHub";
import TrendingHub from "@/components/trending/TrendingHub";
import SecretEditModal from "@/components/admin/SecretEditModal";
import { useSecretModal } from "@/hooks/useSecretModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState("trending");
  const [refreshKey, setRefreshKey] = useState(0);
  const { isOpen, setIsOpen } = useSecretModal();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* TAB 1: TECH TRENDS & CLIENT TELEMETRY */}
        {activeTab === "trending" && <TrendingHub />}

        {/* TAB 2: NETWORK TOPOLOGY LAB (WITH REAL DEVICES & ENTERPRISE ADOPTION) */}
        {activeTab === "topologies" && <TopologyLab />}

        {/* TAB 3: VISUAL HARDWARE LABS (MOTHERBOARD & RAID) */}
        {activeTab === "visuals" && (
          <>
            <MotherboardLab />
            <RaidLab />
          </>
        )}

        {/* TAB 4: IT TOOLS & RFC CALCULATORS */}
        {activeTab === "tools" && <ToolsSuite />}

        {/* TAB 5: SERVERS & DATACENTER RACK */}
        {activeTab === "servers" && <ServerRackModule />}

        {/* TAB 6: HARDWARE POST & BEEP CODE MATRIX */}
        {activeTab === "hardware" && <HardwareDiagnostics key={refreshKey} />}

        {/* TAB 7: VISUAL GLOSSARY & INDUSTRY JARGON */}
        {activeTab === "glossary" && <TechGlossary />}

        {/* TAB 8: DEVELOPER HUB & RADAR */}
        {activeTab === "dev" && <DevHub />}
      </main>

      <Footer onOpenAdmin={() => setIsOpen(true)} />

      {/* Secret In-Place Admin Modal (Ctrl+Shift+E) */}
      <SecretEditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}