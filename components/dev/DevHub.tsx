"use client";

import { useState, useEffect } from "react";
import {
    Code2,
    Newspaper,
    AlertTriangle,
    Radio,
    ExternalLink,
    Flame,
    Search,
    CheckCircle2,
    XCircle,
    HelpCircle,
    RefreshCw,
    BellRing,
    Bug,
    Terminal,
    ShieldCheck,
} from "lucide-react";

// --- TYPES ---
interface HNStory {
    id: number;
    title: string;
    url?: string;
    by: string;
    score: number;
    time: number;
    descendants?: number;
}

interface HttpCode {
    code: number;
    phrase: string;
    category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
    description: string;
    triage: string;
}

interface CommonBug {
    errorName: string;
    stack: "Frontend (React/Next)" | "Backend / API" | "Database & Auth" | "DevOps & Network";
    symptom: string;
    rootCause: string;
    solution: string;
}

// --- STATIC DATA: HTTP STATUS CODES ---
const HTTP_STATUS_CODES: HttpCode[] = [
    { code: 200, phrase: "OK", category: "2xx", description: "Standard successful HTTP request.", triage: "Data payload was delivered properly." },
    { code: 201, phrase: "Created", category: "2xx", description: "Request succeeded and led to the creation of a new resource (e.g. POST to database).", triage: "Verify newly generated resource ID in response body." },
    { code: 301, phrase: "Moved Permanently", category: "3xx", description: "Target resource has been assigned a new permanent URI.", triage: "Update internal routing; search engines will transfer SEO ranking to the new location." },
    { code: 304, phrase: "Not Modified", category: "3xx", description: "Cached version of the resource is still valid.", triage: "Ensures bandwidth savings; client uses local cache based on ETag / If-None-Match." },
    { code: 400, phrase: "Bad Request", category: "4xx", description: "Server cannot process request due to client error (malformed JSON, invalid schema).", triage: "Inspect payload schema against Zod/Joi or API validation definitions." },
    { code: 401, phrase: "Unauthorized", category: "4xx", description: "Authentication is required and has failed or has not been provided.", triage: "Suriin kung valid pa ang Bearer Token o session cookie sa Authorization header." },
    { code: 403, phrase: "Forbidden", category: "4xx", description: "Server understood the request, but refuses to authorize it (insufficient RBAC permissions).", triage: "User is authenticated, pero kulang ang admin permissions sa Role-Based Access Control." },
    { code: 404, phrase: "Not Found", category: "4xx", description: "Server cannot find the requested resource or route.", triage: "I-verify ang endpoint path URL at REST param IDs." },
    { code: 429, phrase: "Too Many Requests", category: "4xx", description: "User has sent too many requests in a given amount of time (Rate Limited).", triage: "Implement exponential backoff retry at tingnan ang Retry-After response header." },
    { code: 500, phrase: "Internal Server Error", category: "5xx", description: "Generic server-side error: uncaught exception sa backend code.", triage: "Suriin ang server terminal logs o error monitoring tools (Sentry/CloudWatch)." },
    { code: 502, phrase: "Bad Gateway", category: "5xx", description: "Edge proxy / reverse proxy (Nginx, Cloudflare) received an invalid response from upstream origin server.", triage: "I-check kung buhay ang Node.js/Python background service process (pm2, Docker container)." },
    { code: 503, phrase: "Service Unavailable", category: "5xx", description: "Server is temporarily unable to handle request due to overload or maintenance.", triage: "Health checks failing; check CPU/Memory utilization sa hosting cluster." },
    { code: 504, phrase: "Gateway Timeout", category: "5xx", description: "Upstream server failed to send a response in time to the reverse proxy.", triage: "Optimize heavy SQL queries o dagdagan ang proxy timeout (proxy_read_timeout sa Nginx)." },
];

// --- STATIC DATA: COMMON BUGS & DEVELOPER ISSUES ---
const COMMON_BUGS: CommonBug[] = [
    {
        errorName: "Cross-Origin Resource Sharing (CORS) Blocked",
        stack: "Backend / API",
        symptom: "No 'Access-Control-Allow-Origin' header is present on the requested resource sa browser console.",
        rootCause: "Nagpasa ang browser ng Preflight OPTIONS request mula sa ibang origin (e.g. localhost:3000 to api.domain.com) at walang tamang headers na ibinalik ang backend.",
        solution: "I-enable ang CORS middleware sa server (Express: cors(), Next.js API: NextResponse with Access-Control-Allow-Origin: '*')."
    },
    {
        errorName: "Text Content Did Not Match (Hydration Mismatch)",
        stack: "Frontend (React/Next)",
        symptom: "Hydration failed because the server-rendered HTML didn't match the client-rendered HTML.",
        rootCause: "Paggamit ng window/localStorage, Math.random(), o Date rendering bago mag-mount ang component sa browser.",
        solution: "I-wrap ang dynamic client data sa loob ng useEffect hook o gumamit ng `suppressHydrationWarning`."
    },
    {
        errorName: "Unhandled Runtime TypeError: Cannot read properties of undefined",
        stack: "Frontend (React/Next)",
        symptom: "Bumagsak ang UI dahil sa pagbasa ng `.map()` o nested object property habang naglo-load pa ang async data.",
        rootCause: "Naunang mag-render ang return JSX bago matapos ang fetch request habang `undefined` pa ang state.",
        solution: "Gumamit ng Optional Chaining (`data?.items?.map(...)`) at maglagay ng default initial state tulad ng `useState([])`."
    },
    {
        errorName: "PostgreSQL Connection Pool Exhaustion (remaining connection slots reserved)",
        stack: "Database & Auth",
        symptom: "Bumagal o nag-crash ang API endpoints; may error na 'sorry, too many clients already'.",
        rootCause: "Naiwang bukas ang direct database client connection sa bawat serverless invocation nang walang pooling.",
        solution: "Gumamit ng Transaction Connection Pooler (tulad ng Supabase PgBouncer / Supavisor sa Port 6543) imbes na direct session connection."
    },
    {
        errorName: "JWT Signature Verification Failed / Token Expired",
        stack: "Database & Auth",
        symptom: "Lahat ng API calls ay biglang nagiging 401 Unauthorized matapos ang ilang minuto.",
        rootCause: "Nag-expire ang short-lived access token ng user at hindi na-execute ang silent refresh token rotation.",
        solution: "Ipatupad ang automatic refresh token interceptor (e.g. Axios interceptor o Supabase onAuthStateChange listener)."
    },
    {
        errorName: "Docker OOMKilled (Out of Memory - Exit Code 137)",
        stack: "DevOps & Network",
        symptom: "Biglang namamatay ang container habang nagbi-build o kapag may sabay-sabay na web requests.",
        rootCause: "Lumampas ang container heap memory consumption sa itinakdang limit sa docker-compose file.",
        solution: "Dagdagan ang memory allocation (`mem_limit`), i-enable ang Node.js garbage collection tuning (`--max-old-space-size=4096`), o ayusin ang memory leaks."
    }
];

// --- STATIC DATA: INDUSTRY TRENDS & ANNOUNCEMENTS ---
const INDUSTRY_TRENDS = [
    {
        tag: "AI & RUNTIME",
        title: "Small Language Models (SLMs) on Edge Devices",
        description: "Paglaganap ng lightweight on-device local models (Llama 3.2 1B/3B, Gemma 2) para sa privacy-first applications nang hindi dumedepende sa paid cloud APIs.",
        badge: "Trending"
    },
    {
        tag: "WEB ARCHITECTURE",
        title: "Server Actions & Zero-Bundle Frameworks",
        description: "Paglipat ng computation mula client bundle patungong serverless edge; pag-stream ng UI components sa halip na mag-load ng mabibigat na single-page client bundles.",
        badge: "Ecosystem"
    },
    {
        tag: "DATABASE & STORAGE",
        title: "Native Vector Storage Engines",
        description: "PostgreSQL pgvector at Hybrid Search (BM25 + Semantic Embeddings) bilang pamantayang standard para sa enterprise Retrieval-Augmented Generation (RAG).",
        badge: "Enterprise"
    },
    {
        tag: "CYBERSECURITY",
        title: "Post-Quantum Cryptography & Zero-Trust Mandate",
        description: "Pagsisimula ng transisyon sa NIST-approved post-quantum algorithms (ML-KEM / Kyber) sa TLS handshakes at identity providers.",
        badge: "Critical"
    }
];

export default function DevHub() {
    const [subTab, setSubTab] = useState<"news" | "status" | "bugs" | "trends">("news");
    const [stories, setStories] = useState<HNStory[]>([]);
    const [loadingNews, setLoadingNews] = useState(false);
    const [searchStatus, setSearchStatus] = useState("");
    const [bugFilter, setBugFilter] = useState<string>("All");

    // Fetch Hacker News Top Stories (Real-Time Live Data)
    const fetchTopStories = async () => {
        setLoadingNews(true);
        try {
            // 1. Kumuha ng top 12 IDs mula sa official public HN Firebase API
            const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
            const ids: number[] = await res.json();
            const topIds = ids.slice(0, 10);

            // 2. Kumuha ng details ng bawat story nang sabay-sabay
            const storyPromises = topIds.map(async (id) => {
                const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                return itemRes.json();
            });

            const loadedStories: HNStory[] = await Promise.all(storyPromises);
            setStories(loadedStories.filter(Boolean));
        } catch (err) {
            console.error("Failed to load Hacker News feed:", err);
        } finally {
            setLoadingNews(false);
        }
    };

    useEffect(() => {
        fetchTopStories();
    }, []);

    const filteredStatusCodes = HTTP_STATUS_CODES.filter(
        (s) =>
            s.code.toString().includes(searchStatus) ||
            s.phrase.toLowerCase().includes(searchStatus.toLowerCase()) ||
            s.description.toLowerCase().includes(searchStatus.toLowerCase()) ||
            s.category.includes(searchStatus)
    );

    const filteredBugs = COMMON_BUGS.filter(
        (b) => bugFilter === "All" || b.stack === bugFilter
    );

    return (
        <div className="space-y-8 font-sans">
            {/* Top Banner */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                        <Code2 className="w-6 h-6 text-cyan-500" /> Developer Hub & Engineering Radar
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Real-time tech headlines, HTTP status codes dictionary, runtime bug runbooks, at industry engineering trends.
                    </p>
                </div>

                {/* Sub-navigation Controls */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setSubTab("news")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${subTab === "news" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-white"
                            }`}
                    >
                        <Newspaper className="w-3.5 h-3.5" /> Live Tech News
                    </button>
                    <button
                        onClick={() => setSubTab("status")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${subTab === "status" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-white"
                            }`}
                    >
                        <Terminal className="w-3.5 h-3.5" /> HTTP Status Codes
                    </button>
                    <button
                        onClick={() => setSubTab("bugs")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${subTab === "bugs" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-white"
                            }`}
                    >
                        <Bug className="w-3.5 h-3.5" /> Bugs & Runtime Fixes
                    </button>
                    <button
                        onClick={() => setSubTab("trends")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${subTab === "trends" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-white"
                            }`}
                    >
                        <Radio className="w-3.5 h-3.5" /> Trends & Radar
                    </button>
                </div>
            </div>

            {/* --- SUBTAB 1: LIVE TECH HEADLINES (HACKER NEWS FEED) --- */}
            {subTab === "news" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <h3 className="font-mono font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                                Global Developer Wire // Hacker News Real-Time Stream
                            </h3>
                        </div>
                        <button
                            onClick={fetchTopStories}
                            disabled={loadingNews}
                            className="px-3 py-1 text-xs font-mono rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition flex items-center gap-1.5"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loadingNews ? "animate-spin" : ""}`} />
                            <span>Refresh Feed</span>
                        </button>
                    </div>

                    {loadingNews ? (
                        <div className="py-16 text-center font-mono text-xs text-slate-400 space-y-2">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-500" />
                            <p>Kumukunekta sa international developer firehose...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stories.map((story) => (
                                <a
                                    key={story.id}
                                    href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-md transition flex flex-col justify-between group"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                                                <Flame className="w-3.5 h-3.5" /> {story.score} points
                                            </span>
                                            <span>By @{story.by}</span>
                                        </div>

                                        <h4 className="font-mono text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors leading-snug">
                                            {story.title}
                                        </h4>
                                    </div>

                                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                        <span>{story.descendants || 0} comments</span>
                                        <span className="flex items-center gap-1 text-cyan-500 font-bold">
                                            Read Source <ExternalLink className="w-3 h-3" />
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- SUBTAB 2: HTTP STATUS CODES DICTIONARY --- */}
            {subTab === "status" && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="font-mono font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                                HTTP / HTTPS Status Codes & Triage Reference
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Standard client/server return codes na madalas ma-encounter sa REST APIs, frontend fetches, at microservices.
                            </p>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search code (e.g. 404, 502)..."
                                value={searchStatus}
                                onChange={(e) => setSearchStatus(e.target.value)}
                                className="w-full pl-8 pr-2.5 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStatusCodes.map((item) => (
                            <div
                                key={item.code}
                                className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 hover:border-cyan-500/50 transition"
                            >
                                <div className="flex items-center justify-between font-mono">
                                    <span
                                        className={`px-2 py-0.5 rounded text-sm font-bold border ${item.category === "2xx"
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                                : item.category === "3xx"
                                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                                    : item.category === "4xx"
                                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                                        : "bg-red-500/10 text-red-500 border-red-500/30"
                                            }`}
                                    >
                                        {item.code}
                                    </span>
                                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                        {item.phrase}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                                    {item.description}
                                </p>

                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                    <span className="text-cyan-500 font-bold block mb-0.5">Field Remediation:</span>
                                    <p className="font-sans leading-relaxed text-slate-700 dark:text-slate-300">{item.triage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- SUBTAB 3: COMMON BUGS & DEVELOPER RUNTIMES --- */}
            {subTab === "bugs" && (
                <div className="space-y-4 font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                                Common Developer Bugs & Runtime Exceptions Triage
                            </h3>
                            <p className="text-xs text-slate-500 font-sans mt-0.5">
                                Mga karaniwang issue sa frontend hydration, backend CORS, connection pools, at Docker container memory.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-xs">
                            {["All", "Frontend (React/Next)", "Backend / API", "Database & Auth", "DevOps & Network"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setBugFilter(f)}
                                    className={`px-2.5 py-1 rounded-lg border transition ${bugFilter === f
                                            ? "bg-cyan-600 text-white font-bold border-cyan-600"
                                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-white"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 font-sans">
                        {filteredBugs.map((bug, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                                    <h4 className="text-sm font-bold text-red-500 dark:text-red-400 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0" /> {bug.errorName}
                                    </h4>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
                                        {bug.stack}
                                    </span>
                                </div>

                                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300">
                                    <span className="text-red-600 dark:text-red-400 font-bold block mb-1">Symptom / Error Console:</span>
                                    <code>{bug.symptom}</code>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                                        <span className="font-mono font-bold text-amber-500 block mb-1">Root Cause Analysis:</span>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{bug.rootCause}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                        <span className="font-mono font-bold text-emerald-500 block mb-1 flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Exact Engineering Fix:
                                        </span>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">{bug.solution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- SUBTAB 4: INDUSTRY TRENDS & ANNOUNCEMENTS --- */}
            {subTab === "trends" && (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-mono font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <BellRing className="w-4 h-4 text-cyan-500" /> Technology Pulse, Standards & Announcements
                        </h3>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">
                            Mahahalagang ecosystem shifts sa software engineering, local edge runtimes, database designs, at quantum security.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {INDUSTRY_TRENDS.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-2 hover:border-cyan-500/50 transition"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-bold border border-cyan-500/30">
                                        {item.tag}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                        {item.badge}
                                    </span>
                                </div>

                                <h4 className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                                    {item.title}
                                </h4>

                                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}