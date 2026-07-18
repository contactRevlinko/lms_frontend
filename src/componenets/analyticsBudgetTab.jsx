import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Wallet, TrendingDown, PiggyBank, Target, Eye, Zap, MessageSquare, BarChart2 } from "lucide-react";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";
import CustomMonthPicker from "./CustomMonthPicker";
import CustomCalendar from "./CustomCalender";

// npm install recharts   (if not already installed)

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({
    baseURL: `${API_BASE}/analytics`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

function fmtMoney(n) {
    return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function fmtDateShort(d) {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export default function AnalyticsTabBudget({ campaignId, campaignName = "" }) {
    const [month, setMonth] = useState(""); // "" = all time
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);

    const buildParams = useCallback(() => {
        const params = {};
        if (from && to) {
            params.from = from;
            params.to = to;
        } else if (month) {
            params.month = month;
        }
        return params;
    }, [month, from, to]);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`/summary/${campaignId}`, {
                params: buildParams(),
            });
            setSummary(res.data?.data || null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    }, [campaignId, buildParams]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const clearFilters = () => {
        setMonth("");
        setFrom("");
        setTo("");
    };

    const handleToday = () => {
        const today = new Date().toISOString().split("T")[0];

        setMonth("");
        setFrom(today);
        setTo(today);
    };

    const handleDownloadPdf = async () => {
        setDownloading(true);
        try {
            const res = await api.get(`/pdf/${campaignId}`, {
                params: buildParams(),
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `${(campaignName || "campaign").replace(/\s+/g, "_")}_report.pdf`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert("Could not download the PDF report");
        } finally {
            setDownloading(false);
        }
    };

    const chartData =
        summary?.dayWise?.map((d) => ({
            date: fmtDateShort(d.date),
            "Amount Spent": d.amountSpent,
            Messages: d.messages,
        })) || [];

    return (
        <div>
            {/* Filters + Download */}
            <div className="bg-white p-4 sm:p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="flex flex-wrap items-end gap-3 w-full md:w-auto">
                    <div className="flex flex-row items-end gap-3">
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Month</label>
                            <CustomMonthPicker
                                value={month}
                                onChange={(e) => {
                                    setMonth(e.target.value || e);
                                    setFrom("");
                                    setTo("");
                                }}
                                className="!h-10 !py-2 !rounded-lg"
                            />
                        </div>
                        <button
                            onClick={handleToday}
                            className="bg-white border border-slate-200 text-slate-600 px-4 h-10 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors md:hidden shadow-sm"
                        >
                            Today
                        </button>
                    </div>

                    <div className="flex flex-row items-end gap-3 w-full sm:w-auto">
                        <div className="flex flex-col flex-1 sm:flex-none">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">From</label>
                            <CustomCalendar
                                value={from}
                                onChange={(val) => {
                                    const newValue = val?.target ? val.target.value : val;
                                    setFrom(newValue);
                                    setMonth("");
                                }}
                                className="!h-10 !py-2 !rounded-lg w-full"
                            />
                        </div>
                        <div className="flex flex-col flex-1 sm:flex-none">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">To</label>
                            <CustomCalendar
                                value={to}
                                onChange={(val) => {
                                    const newValue = val?.target ? val.target.value : val;
                                    setTo(newValue);
                                    setMonth("");
                                }}
                                className="!h-10 !py-2 !rounded-lg w-full"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleToday}
                        className="bg-white border border-slate-200 text-slate-600 px-4 h-10 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors hidden md:block shadow-sm"
                    >
                        Today
                    </button>

                    {(month || (from && to)) && (
                        <button
                            onClick={clearFilters}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline pb-2.5"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                <button
                    onClick={handleDownloadPdf}
                    disabled={downloading || loading || !summary}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50 w-full md:w-auto mt-2 md:mt-0 flex items-center justify-center gap-2"
                >
                    {downloading ? "Preparing PDF…" : "Download PDF"}
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-16">Loading analytics…</div>
            ) : error ? (
                <div className="text-center text-red-500 py-16">{error}</div>
            ) : !summary ? (
                <div className="text-center text-gray-400 py-16">No data available.</div>
            ) : (
                <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <SummaryCard
                            label="Total Budget"
                            value={fmtMoney(summary.totalBudget)}
                            icon={Wallet}
                            theme="indigo"
                            isFirst={true}
                        />
                        <SummaryCard
                            label="Total Spent"
                            value={fmtMoney(summary.totalSpent)}
                            icon={TrendingDown}
                            theme="rose"
                        />
                        <SummaryCard
                            label="Remaining"
                            value={fmtMoney(summary.remaining)}
                            icon={PiggyBank}
                            theme="emerald"
                            negative={summary.remaining < 0}
                        />
                        <SummaryCard
                            label="Avg. CPL"
                            value={fmtMoney(summary.cpl.toFixed(2))}
                            icon={Target}
                            theme="orange"
                        />
                        <SummaryCard
                            label="Views"
                            value={summary.views.toLocaleString("en-IN")}
                            icon={Eye}
                            theme="sky"
                        />
                        <SummaryCard
                            label="Impressions"
                            value={summary.impressions.toLocaleString("en-IN")}
                            icon={Zap}
                            theme="violet"
                        />
                        <SummaryCard
                            label="Messages"
                            value={summary.messages.toLocaleString("en-IN")}
                            icon={MessageSquare}
                            theme="pink"
                        />
                        <SummaryCard
                            label="CPM"
                            value={fmtMoney(summary.cpm.toFixed(2))}
                            icon={BarChart2}
                            theme="amber"
                        />
                    </div>

                    {/* Chart */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-6">
                            Spend &amp; Messages over time
                        </h4>

                        {chartData.length === 0 ? (
                            <div className="text-center text-gray-400 py-12 text-sm">
                                No daily reports in this period yet.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <ComposedChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="Amount Spent"
                                        fill="#4338CA"
                                        radius={[4, 4, 0, 0]}
                                        barSize={18}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="Messages"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function SummaryCard({ label, value, negative, icon: Icon, theme, isFirst }) {
    const themeColors = {
        indigo: "text-indigo-600 bg-indigo-50",
        rose: "text-rose-600 bg-rose-50",
        emerald: "text-emerald-600 bg-emerald-50",
        orange: "text-orange-600 bg-orange-50",
        sky: "text-sky-600 bg-sky-50",
        violet: "text-violet-600 bg-violet-50",
        pink: "text-pink-600 bg-pink-50",
        amber: "text-amber-600 bg-amber-50",
        slate: "text-slate-600 bg-slate-100",
    };

    const colorClass = themeColors[theme] || themeColors.indigo;

    return (
        <div className={`relative bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex justify-between items-center overflow-hidden ${isFirst ? 'border-l-[4px] border-l-indigo-600' : ''}`}>
            {/* Watermark Icon */}
            {Icon && (
                <Icon
                    className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] transform -rotate-12 ${colorClass.split(" ")[0]}`}
                />
            )}
            
            <div className="flex flex-col justify-center relative z-10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</div>
                <div className={`text-2xl font-bold ${negative ? "text-red-600" : "text-slate-800"}`}>
                    {value}
                </div>
            </div>

            {Icon && (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10 ${colorClass}`}>
                    <Icon size={20} />
                </div>
            )}
        </div>
    );
}