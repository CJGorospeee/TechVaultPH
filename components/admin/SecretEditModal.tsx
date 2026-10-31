"use client";

import { useState, useEffect } from "react";
import { Lock, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Trash2, ListPlus, FolderKanban } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SecretEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface EntryItem {
    id: string;
    title: string;
    category: string;
    created_at: string;
}

export default function SecretEditModal({ isOpen, onClose, onSuccess }: SecretEditModalProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passkey, setPasskey] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [adminTab, setAdminTab] = useState<"create" | "manage">("create");

    // Form Fields
    const [category, setCategory] = useState("hardware");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Manage State
    const [entries, setEntries] = useState<EntryItem[]>([]);
    const [fetchingList, setFetchingList] = useState(false);

    useEffect(() => {
        if (isAuthenticated && adminTab === "manage") {
            loadEntries();
        }
    }, [isAuthenticated, adminTab]);

    if (!isOpen) return null;

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (passkey === "admin123") {
            setIsAuthenticated(true);
            setErrorMsg("");
        } else {
            setErrorMsg("Maling passkey. Subukan muli.");
        }
    };

    const loadEntries = async () => {
        setFetchingList(true);
        const { data, error } = await supabase
            .from("kb_entries")
            .select("id, title, category, created_at")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setEntries(data);
        }
        setFetchingList(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Sigurado ka bang nais mong burahin ang entry na ito?")) return;

        const { error } = await supabase.from("kb_entries").delete().eq("id", id);
        if (!error) {
            setEntries((prev) => prev.filter((item) => item.id !== id));
            if (onSuccess) onSuccess();
        } else {
            alert("Hindi nabura ang entry: " + error.message);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !desc.trim()) {
            setErrorMsg("Kailangan may Title at Technical Guide bago i-save.");
            return;
        }

        setIsLoading(true);
        setErrorMsg("");

        try {
            const { error } = await supabase.from("kb_entries").insert([
                {
                    category,
                    title,
                    content: desc,
                    image_url: imageUrl || null,
                },
            ]);

            if (error) throw error;

            alert("Matagumpay na na-save sa Supabase!");
            setTitle("");
            setDesc("");
            setImageUrl("");
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error sa pag-save.";
            setErrorMsg(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-[#0c1322] border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h3 className="font-mono text-sm uppercase tracking-wider font-bold">
                            TechVault Hub PH // Terminal Control Panel
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white font-mono text-xs px-2 py-1">
                        [ESC / CLOSE]
                    </button>
                </div>

                {/* Auth Gate */}
                {!isAuthenticated ? (
                    <form onSubmit={handleAuth} className="py-8 space-y-4 text-center max-w-xs mx-auto w-full">
                        <Lock className="w-8 h-8 mx-auto text-cyan-500" />
                        <h4 className="font-bold text-base font-mono">Administrative Passkey</h4>
                        <input
                            type="password"
                            placeholder="Default: admin123"
                            value={passkey}
                            onChange={(e) => setPasskey(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-sm text-center outline-none focus:border-cyan-500"
                        />
                        {errorMsg && (
                            <p className="text-xs text-red-500 font-mono flex items-center justify-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition"
                        >
                            AUTHENTICATE
                        </button>
                    </form>
                ) : (
                    <div className="py-4 space-y-4 overflow-y-auto flex-1 font-mono">
                        {/* Admin Subtabs */}
                        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
                            <button
                                onClick={() => setAdminTab("create")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${adminTab === "create" ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                <ListPlus className="w-3.5 h-3.5" /> New Entry
                            </button>
                            <button
                                onClick={() => setAdminTab("manage")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${adminTab === "manage" ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                <FolderKanban className="w-3.5 h-3.5" /> Manage Live Entries
                            </button>
                        </div>

                        {adminTab === "create" ? (
                            <div className="space-y-4">
                                {errorMsg && (
                                    <p className="text-xs text-red-500 font-mono flex items-center gap-1 bg-red-500/10 p-2 rounded border border-red-500/20">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                                    </p>
                                )}

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-1">
                                        <label className="block text-xs text-slate-500 mb-1">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs outline-none focus:border-cyan-500"
                                        >
                                            <option value="hardware">Hardware</option>
                                            <option value="servers">Servers & DC</option>
                                            <option value="network">Network</option>
                                            <option value="security">Security</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Title</label>
                                        <input
                                            type="text"
                                            placeholder="Hal. DDR5 Sub-timings Guide"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Technical Content</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Isulat ang breakdown, troubleshooting, o diagnostic procedures..."
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        className="w-full p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs outline-none resize-none focus:border-cyan-500 font-sans"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Diagram / Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://images.unsplash.com/..."
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs outline-none focus:border-cyan-500"
                                    />

                                    <div className="mt-2 h-20 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt="Preview" className="max-h-full object-contain" />
                                        ) : (
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <ImageIcon className="w-3.5 h-3.5" /> Image Live Preview
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end gap-2">
                                    <button onClick={onClose} className="px-4 py-2 rounded text-xs text-slate-500 hover:text-white">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                        <span>Save to Cloud</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {fetchingList ? (
                                    <p className="text-xs text-slate-400 py-4 text-center">Loading entries...</p>
                                ) : entries.length === 0 ? (
                                    <p className="text-xs text-slate-500 py-6 text-center">Walang entries na makita.</p>
                                ) : (
                                    entries.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                                        >
                                            <div className="truncate pr-2">
                                                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 mr-2">
                                                    {item.category}
                                                </span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 rounded text-red-400 hover:bg-red-500/10 hover:text-red-500 transition shrink-0"
                                                title="Delete entry"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}