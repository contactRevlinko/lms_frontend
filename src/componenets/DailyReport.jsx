import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Edit, Save, Trash2, X, TrendingDown, MessageSquare, Target } from "lucide-react";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";
import CustomCalendar from "./CustomCalender";
import CustomMonthPicker from "./CustomMonthPicker";

// ---- API instance (adjust base URL / token key to match your project) ----
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- Routes based on your dailyReportRoutes.js ----
// NOTE: adjust the prefix ("/api/reports") to wherever you mounted this router
// e.g. app.use("/api/reports", require("./routes/dailyReportRoutes"))
const R = {
  create: (campaignId) => `/daily-report/create/${campaignId}`,
  list: (campaignId) => `/daily-report/get-report/${campaignId}`,
  update: (campaignId, reportId) => `/daily-report/update-report/${campaignId}/${reportId}`,
  remove: (campaignId, reportId) => `/daily-report/delete/${campaignId}/${reportId}`,
};

const emptyForm = {
  date: "",
  amountSpent: "",
  reach: "",
  views: "",
  impressions: "",
  messages: "",
};

function toInputDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10);
}

function fmtDate(d) {
  return formatDateDDMMYYYY(d);
}

function fmtMoney(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}


const  DailyReport = ({ campaignId }) => {
  const loginType = localStorage.getItem("loginType");
  const isTeamLogin = loginType === "team";
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [month, setMonth] = useState(""); // "YYYY-MM"
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (from && to) {
        params.from = from;
        params.to = to;
      } else if (month) {
        params.month = month;
      }

      const res = await api.get(R.  list(campaignId), { params });
      setReports(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load daily reports");
    } finally {
      setLoading(false);
    }
  }, [campaignId, month, from, to]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (report) => {
    setEditingId(report._id);
    setForm({
      date: toInputDate(report.date),
      amountSpent: report.amountSpent ?? "",
      reach: report.reach ?? "",
      views: report.views ?? "",
      impressions: report.impressions ?? "",
      messages: report.messages ?? "",
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date) {
      setFormError("Date is required");
      return;
    }
    if (form.amountSpent === "") {
      setFormError("Amount spent is required");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload = {
        date: form.date,
        amountSpent: Number(form.amountSpent),
        reach: Number(form.reach) || 0,
        views: Number(form.views) || 0,
        impressions: Number(form.impressions) || 0,
        messages: Number(form.messages) || 0,
      };

      if (editingId) {
        await api.put(R.update(campaignId, editingId), payload);
      } else {
        await api.post(R.create(campaignId), payload);
      }

      closeForm();
      fetchReports();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save the report");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Delete this daily report? This can't be undone.")) return;
    setDeletingId(reportId);
    try {
      await api.delete(R.remove(campaignId, reportId));
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete the report");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];

    setMonth("");
    setFrom(today);
    setTo(today);
  };

  const clearFilters = () => {
    setMonth("");
    setFrom("");
    setTo("");
  };

  const totals = reports.reduce(
    (acc, r) => {
      acc.spent += Number(r.amountSpent) || 0;
      acc.messages += Number(r.messages) || 0;
      return acc;
    },
    { spent: 0, messages: 0 }
  );
  const avgCpl = totals.messages > 0 ? totals.spent / totals.messages : 0;

  return (
    <div>
      {/* Filters + Add button */}
      <div className="bg-white p-4 sm:p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-end gap-3 w-full md:w-auto">
          <div className="flex flex-row items-end gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Month</label>
              <CustomMonthPicker
                value={month}
                onChange={(e) => {
                  const newValue = e?.target ? e.target.value : e;
                  setMonth(newValue);
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
          onClick={openAddForm}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all w-full md:w-auto flex items-center justify-center gap-2 mt-2 md:mt-0"
        >
          <span className="text-lg leading-none">+</span> Daily Report
        </button>
      </div>

      {/* Summary strip */}
      {!loading && reports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard 
            label="Total Spent" 
            value={fmtMoney(totals.spent)} 
            icon={TrendingDown}
            theme="rose"
            isFirst={true}
          />
          <SummaryCard 
            label="Total Messages" 
            value={totals.messages.toLocaleString()} 
            icon={MessageSquare}
            theme="indigo"
          />
          <SummaryCard 
            label="Avg. CPL" 
            value={fmtMoney(avgCpl.toFixed(2))} 
            icon={Target}
            theme="orange"
          />
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center text-gray-400 py-16">Loading daily reports…</div>
      ) : error ? (
        <div className="text-center text-red-500 py-16">{error}</div>
      ) : reports.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          No daily reports yet for this range.
          <div className="mt-2">
            <button onClick={openAddForm} className="text-indigo-600 hover:underline text-sm">
              Add the first one
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {reports.map((r) => (
              <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative">
                <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                  <div>
                    <div className="font-semibold text-gray-800">{fmtDate(r.date)}</div>
                    <div className="text-xs text-gray-500 mt-0.5">By {r.enteredBy?.name || "—"}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-indigo-600">{fmtMoney(r.amountSpent)}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Spent</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mb-4">
                  <div>
                    <div className="text-xs text-gray-400">Reach</div>
                    <div className="font-medium text-gray-700">{r.reach ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Views</div>
                    <div className="font-medium text-gray-700">{r.views ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Impressions</div>
                    <div className="font-medium text-gray-700">{r.impressions ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Messages</div>
                    <div className="font-medium text-gray-700">{r.messages ?? 0}</div>
                  </div>
                  <div className="col-span-2 bg-gray-50 p-2 rounded-lg flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">CPL</span>
                    <span className="font-semibold text-gray-800">{fmtMoney(Number(r.cpl || 0).toFixed(2))}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(r)}
                    className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  {!isTeamLogin && (
                    <button
                      onClick={() => handleDelete(r._id)}
                      disabled={deletingId === r._id}
                      className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {deletingId === r._id ? "Deleting…" : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr className="text-left">
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Amount Spent</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Reach</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Views</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Impressions</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Messages</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">CPL</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Entered By</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-slate-700 font-medium">{fmtDate(r.date)}</td>
                    <td className="px-5 py-4 text-slate-700 font-medium">{fmtMoney(r.amountSpent)}</td>
                    <td className="px-5 py-4 text-slate-600">{r.reach?.toLocaleString() ?? 0}</td>
                    <td className="px-5 py-4 text-slate-600">{r.views?.toLocaleString() ?? 0}</td>
                    <td className="px-5 py-4 text-slate-600">{r.impressions?.toLocaleString() ?? 0}</td>
                    <td className="px-5 py-4 text-slate-600">{r.messages?.toLocaleString() ?? 0}</td>
                    <td className="px-5 py-4 text-slate-800 font-bold">{fmtMoney(Number(r.cpl || 0).toFixed(2))}</td>
                    <td className="px-5 py-4 text-slate-500">{r.enteredBy?.name || "—"}</td>
                    <td className="px-5 py-4 flex justify-end gap-2 items-center">
                      <button
                        onClick={() => openEditForm(r)}
                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 flex items-center justify-center shrink-0 transition-colors"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      {!isTeamLogin && (
                        <button
                          onClick={() => handleDelete(r._id)}
                          disabled={deletingId === r._id}
                          className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] px-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? "Edit Daily Report" : "Add Daily Report"}
              </h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                <CustomCalendar
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  disabled={!!editingId}
                  className="!h-[38px] !py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Amount Spent</label>
                  <input
                    type="number"
                    name="amountSpent"
                    value={form.amountSpent}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Messages</label>
                  <input
                    type="number"
                    name="messages"
                    value={form.messages}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Reach</label>
                  <input
                    type="number"
                    name="reach"
                    value={form.reach}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Views</label>
                  <input
                    type="number"
                    name="views"
                    value={form.views}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Impressions</label>
                  <input
                    type="number"
                    name="impressions"
                    value={form.impressions}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {formError && <p className="text-red-500 text-xs">{formError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving…" : editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
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

export default DailyReport;