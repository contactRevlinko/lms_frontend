import React, { useEffect, useState } from "react";
import { X, Compass, Plus } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const SourceManager = () => {
    const [name, setName] = useState("");
    const [sources, setSources] = useState([]);
    const token = localStorage.getItem("token");


    const fetchSources = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${BASE_URL}/source/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                setSources(data.data);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchSources();
    }, []);

  
    const handleAdd = async () => {
        if (!name) return;

        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${BASE_URL}/source/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (data.success) {
                setName("");
                fetchSources();
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${BASE_URL}/source/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                setSources((prev) => prev.filter((s) => s._id !== id));
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
                    Lead Sources
                </h1>
                <p className="text-sm font-medium text-slate-500">
                    Manage and configure the channels through which your leads find you
                </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-4xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    
                    {/* Left Column: Add New Source */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Compass size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Add New Source</h3>
                                    <p className="text-xs text-slate-500">Create a new channel identifier</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Source Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Instagram, Website, Referral"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm h-11 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAdd}
                            className="mt-6 w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm shadow-indigo-100/30 cursor-pointer"
                        >
                            <Plus size={18} />
                            <span>Add Source</span>
                        </button>
                    </div>

                    {/* Right Column: Active Sources List */}
                    <div className="border-t border-slate-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:border-slate-100 md:pl-8 lg:pl-12">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-900">Active Channels</h3>
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    {sources.length}
                                </span>
                            </div>
                        </div>

                        {sources.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/80 p-6">
                                <Compass className="mx-auto mb-3 w-10 h-10 text-slate-400" />
                                <h4 className="text-sm font-bold text-slate-800">No Sources Added Yet</h4>
                                <p className="text-xs text-slate-500 mt-1">Create one on the left to start tracking</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                {sources.map((item) => (
                                    <div
                                        key={item._id}
                                        className="group flex items-center justify-between bg-slate-50/40 hover:bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <span className="text-sm font-medium text-slate-700 capitalize">{item.name}</span>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SourceManager;