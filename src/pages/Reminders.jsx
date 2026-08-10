import React, { useEffect, useState } from "react";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomPopupDelete from "../componenets/CustomPopupDelete";
import { Bell, Info, Trash2, Users, X, FileText, Eye, Phone, Mail, Calendar as CalIcon, PhoneCall, LayoutGrid, List, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import CustomDropDown from "../componenets/CustomDropDown";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const Reminders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allLeads } = useSelector((state) => state.lead);

  const [data, setData] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [notePopup, setNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  
  const [viewMode, setViewMode] = useState("table"); 

  const fetchTodaysFo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/followups/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTodaysFo();
    dispatch(fetchAllLead());
  }, [dispatch]);

  const getTeamMemberName = (follow) => {
    const followLeadId = follow.leadId?._id || follow.leadId;
    const matchedLead = allLeads.find((lead) => String(lead._id) === String(followLeadId));
    if (!matchedLead?.assignedTo) return "Unassigned";
    if (typeof matchedLead.assignedTo === "string") return matchedLead.assignedTo;
    return matchedLead.assignedTo.name || "Unassigned";
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      setShowFollowUps(false);
      const res = await fetch(`${BASE_URL}/followups/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setData((prev) => prev.filter((item) => item._id !== id));
        setDeletePopup(false);
        setSelectedId(null);
        toast.success("Reminder deleted");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (time) => {
    if (!time) return "No Time";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (res.ok) {
        dispatch(fetchAllLead());
        fetchTodaysFo();
      } else {
        toast.error(result.message || "Status update failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-700 border-blue-200";
      case "In Followup": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Interested": return "bg-green-100 text-green-700 border-green-200";
      case "Cold": return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "Lost": return "bg-red-100 text-red-700 border-red-200";
      case "Won": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Sort chronologically by default
  const sortedData = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="w-full mt-6 md:p-4 lg:p-0 md:rounded-2xl overflow-y-visible">
      
      {/* HEADER & TOGGLE */}
      <div className="mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Today's Reminders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay organized with upcoming tasks and follow-up reminders.
          </p>
        </div>

        <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 flex items-center gap-2 rounded-md text-[13px] font-semibold transition ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List size={16} /> Table
          </button>
          <button 
            onClick={() => setViewMode("card")}
            className={`px-3 py-1.5 flex items-center gap-2 rounded-md text-[13px] font-semibold transition ${viewMode === 'card' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid size={16} /> Cards
          </button>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm flex flex-col items-center">
          <Bell className="mb-4 w-16 h-16 text-indigo-300 bg-indigo-50 p-4 rounded-full" />
          <h3 className="text-2xl font-bold text-slate-800">All Caught Up!</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            You don't have any reminders scheduled for today.
          </p>
        </div>
      ) : (
        <>
          {/* -------------------- TABLE VIEW (Desktop Only) -------------------- */}
          <div className={`hidden ${viewMode === 'table' ? 'md:block' : 'hidden'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4 w-12 text-center">#</th>
                    <th className="px-5 py-4">Lead Info</th>
                    <th className="px-5 py-4">Task Type</th>
                    <th className="px-5 py-4">Assigned To</th>
                    <th className="px-5 py-4">Current Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedData.map((follow, i) => (
                    <tr key={follow._id} className="hover:bg-indigo-50/30 transition-colors group">
                      
                      <td className="px-5 py-3 text-xs font-semibold text-slate-400 text-center">
                        {i + 1}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/leads/${follow.leadId?._id || follow.leadId}`)}>
                          <span className="font-bold text-[14px] text-slate-900 capitalize group-hover:text-indigo-600 transition-colors">{follow.leadId?.name || "Unknown"}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
                              <CalIcon size={12} className="text-indigo-400" /> {formatDateDDMMYYYY(follow.followUpDate)}
                            </span>
                            <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
                              <Clock size={12} className="text-indigo-400" /> {formatTime(follow.followUpTime)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                           {follow.followUpType || "Task"}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-sm font-medium text-slate-600">
                        {getTeamMemberName(follow)}
                      </td>

                      <td className="px-5 py-3">
                        <div className="w-[140px]">
                          <CustomDropDown
                            value={follow.leadId?.status || "New"}
                            onChange={(selectedStatus) => handleStatusChange(follow.leadId?._id, selectedStatus)}
                            options={["New", "In Followup", "Interested", "Cold", "Lost", "Won"]}
                          />
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {follow.notes && (
                            <button
                              onClick={() => { setSelectedNote(follow.notes); setNotePopup(true); }}
                              title="View Note"
                              className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-500 hover:bg-indigo-50 transition shadow-sm"
                            >
                              <Info size={14} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => { setSelectedId(follow._id); setDeletePopup(true); }}
                            title="Delete Task"
                            className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-200 transition shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>

                          <button
                            onClick={() => navigate(`/leads/${follow.leadId?._id || follow.leadId}`)}
                            className="h-8 px-3 rounded-lg text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm ml-1"
                          >
                            <Eye size={14} /> View History
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* -------------------- CARD VIEW (Mobile Always OR Desktop if Toggled) -------------------- */}
          <div className={`${viewMode === 'card' ? 'block' : 'block md:hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
              {sortedData.map((follow) => (
                <div
                  key={follow._id}
                  onClick={(e) => {
                    if (['button', 'svg', 'path', 'input', 'select', 'li', 'ul'].includes(e.target.tagName.toLowerCase()) || e.target.closest('button') || e.target.closest('.dropdown-container')) return;
                    navigate(`/leads/${follow.leadId?._id || follow.leadId}`);
                  }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col overflow-hidden group"
                >
                  <div className="p-5 pb-3 border-b border-slate-50 relative">
                    <div className="absolute top-0 right-0 p-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(follow.leadId?.status)}`}>
                        {follow.leadId?.status || "New"}
                      </span>
                    </div>
                    
                    <h1 className="text-lg font-bold text-slate-900 capitalize pr-20 truncate">
                      {follow.leadId?.name || "Unknown"}
                    </h1>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {follow.followUpType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 shrink-0"><CalIcon size={14} /></div>
                      <div>
                        <p className="text-xs text-slate-400 font-semibold">Scheduled Date</p>
                        <p className="text-slate-700 font-bold">{follow.followUpDate ? formatDateDDMMYYYY(follow.followUpDate) : "None"} • {formatTime(follow.followUpTime)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Users size={14} /></div>
                      <div className="w-full">
                         <p className="text-xs text-slate-400 font-semibold mb-1">Assigned To</p>
                         <p className="text-slate-700 font-bold">{getTeamMemberName(follow)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm dropdown-container">
                      <div className="w-full pt-2 border-t border-slate-100">
                        <CustomDropDown
                          value={follow.leadId?.status || "New"}
                          onChange={(selectedStatus) => handleStatusChange(follow.leadId?._id, selectedStatus)}
                          options={["New", "In Followup", "Interested", "Cold", "Lost", "Won"]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/leads/${follow.leadId?._id || follow.leadId}`)}
                      className="flex-1 h-10 rounded-xl text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Eye size={16} /> History
                    </button>
                    
                    {follow.notes && (
                      <button
                        onClick={() => { setSelectedNote(follow.notes); setNotePopup(true); }}
                        className="h-10 px-4 rounded-xl text-[13px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Info size={16} /> Note
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {deletePopup && <CustomPopupDelete onClose={() => setDeletePopup(false)} onDelete={() => handleDelete(selectedId)} />}

      {/* Modern Note Popup */}
      {notePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center px-4 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="bg-slate-50/80 border-b border-slate-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-700 font-bold">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  <FileText size={20} className="text-indigo-500" />
                </div>
                <h2 className="text-lg">Followup Note</h2>
              </div>
              <button
                onClick={() => { setNotePopup(false); setSelectedNote(""); }}
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 h-10 w-10 flex items-center justify-center rounded-full transition-colors border border-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 bg-white min-h-[150px]">
              <p className="text-slate-700 text-[15px] font-medium leading-relaxed whitespace-pre-wrap">
                {selectedNote}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reminders;