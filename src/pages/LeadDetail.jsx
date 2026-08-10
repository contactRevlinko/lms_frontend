import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import { ArrowLeft, Phone, Mail, User, Info, Building2, Calendar as CalendarIcon, Clock, Briefcase, Plus, X, Edit, Trash2, MessageCircle, MapPin, MoreHorizontal } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import CustomCalendar from "../componenets/CustomCalender";
import CustomTimePicker from "../componenets/CustomTimePicker";
import CustomDropDown from "../componenets/CustomDropDown";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";

const BASE_URL = import.meta.env.VITE_API_URL;

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allLeads, loading: leadsLoading } = useSelector((state) => state.lead);
  const lead = allLeads?.find((l) => l._id === id);

  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFollowup, setShowAddFollowup] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'activity'
  
  const [form, setForm] = useState({
    followUpDate: "",
    followUpTime: "",
    followUpType: "Call",
    notes: "",
    nextFollowupDate: "",
  });

  const openAddFollowupPopup = () => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0].slice(0, 5);

    setForm({
      followUpDate: formattedDate,
      followUpTime: formattedTime,
      followUpType: "Call",
      notes: "",
      nextFollowupDate: "",
    });
    setEditingId(null);
    setShowAddFollowup(true);
  };

  const handleEditFollowup = (f) => {
    setForm({
      followUpDate: f.followUpDate ? new Date(f.followUpDate).toISOString().split("T")[0] : "",
      followUpTime: f.followUpTime || "",
      followUpType: f.followUpType || "Call",
      notes: f.notes || "",
      nextFollowupDate: f.nextFollowupDate ? new Date(f.nextFollowupDate).toISOString().split("T")[0] : "",
    });
    setEditingId(f._id);
    setShowAddFollowup(true);
  };

  const handleDeleteFollowup = async (followupId) => {
    if (!window.confirm("Are you sure you want to delete this follow-up?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/followups/delete/${followupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Follow-up deleted successfully");
      fetchFollowups();
    } catch (error) {
      toast.error("Failed to delete follow-up");
      console.error(error);
    }
  };

  const fetchFollowups = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/followups/lead/${id}`);
      if (res.data.success) {
        const sorted = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFollowups(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!allLeads || allLeads.length === 0) {
      dispatch(fetchAllLead());
    }
    fetchFollowups();
  }, [id, dispatch, allLeads]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddFollowup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        await axios.put(
          `${BASE_URL}/followups/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Follow-up updated successfully");
      } else {
        await axios.post(
          `${BASE_URL}/followups/create-followups`,
          { ...form, leadId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Follow-up added successfully");
      }
      setShowAddFollowup(false);
      setEditingId(null);
      fetchFollowups();
      dispatch(fetchAllLead());
    } catch (error) {
      toast.error("Failed to add follow-up");
      console.error(error);
    }
  };

  if (leadsLoading) {
    return <div className="p-8 h-screen w-full bg-slate-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;
  }

  if (!lead) {
    return <div className="p-8 h-screen w-full bg-slate-50 flex items-center justify-center"><p className="text-gray-500 font-bold">Lead not found. Please go back.</p></div>;
  }

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

  return (
    <div className="md:p-4 lg:p-0 md:mt-6 h-screen md:h-[calc(100vh-80px)] overflow-hidden w-full bg-slate-50 lg:bg-transparent flex flex-col">
      
      {/* Top Nav */}
      <div className="mb-4 lg:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 pt-4 lg:px-0 lg:pt-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 leading-tight">Lead Profile</h1>
            <p className="text-[13px] text-slate-500 font-medium">#{lead.leadNo || "N/A"}</p>
          </div>
        </div>
        
        <button onClick={openAddFollowupPopup} className="hidden lg:flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold items-center gap-2 transition shadow-sm">
          <Plus size={16} /> Log Interaction
        </button>
      </div>

      {/* Mobile Tabs */}
      <div className="flex lg:hidden bg-white mx-4 rounded-xl p-1 shadow-sm border border-slate-200 mb-4 shrink-0">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'activity' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Activity
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 overflow-hidden flex-1 px-3 md:px-4 lg:px-0 pb-4">
        
        {/* LEFT COLUMN: Profile & Details */}
        <div className={`w-full lg:w-[400px] flex-col gap-4 lg:gap-5 overflow-y-auto shrink-0 pb-20 lg:pb-0 ${activeTab === 'profile' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-violet-600 z-0"></div>
            
            <div className="relative z-10 w-20 h-20 bg-white p-1 rounded-2xl shadow-md mt-6 mb-3">
              <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <User size={32} />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 capitalize relative z-10">{lead.name}</h2>
            <span className={`mt-2 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border relative z-10 ${getStatusColor(lead.status)}`}>
              {lead.status || "New"}
            </span>

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-3 mt-6 w-full relative z-10">
              <a href={`tel:${lead.phone}`} className="flex-1 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold transition">
                <Phone size={15} /> Call
              </a>
              <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noreferrer" className="flex-1 h-10 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold transition">
                <MessageCircle size={15} /> Text
              </a>
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center transition shrink-0">
                  <Mail size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5">
            <h3 className="text-[12px] md:text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info size={16} className="text-indigo-500" /> Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Phone size={14} className="text-slate-400" /></div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone</p>
                  <p className="text-[14px] font-semibold text-slate-700 mt-0.5">{lead.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Mail size={14} className="text-slate-400" /></div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</p>
                  <p className="text-[14px] font-semibold text-slate-700 mt-0.5 truncate">{lead.email || "-"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Building2 size={14} className="text-slate-400" /></div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Source</p>
                  <p className="text-[14px] font-semibold text-slate-700 mt-0.5 capitalize">{lead.source || "Direct"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Briefcase size={14} className="text-slate-400" /></div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned To</p>
                  <p className="text-[14px] font-semibold text-slate-700 mt-0.5">{lead.assignedTo?.name || "Unassigned"}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0"><CalendarIcon size={14} className="text-orange-500" /></div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Follow-Up</p>
                  <p className="text-[14px] font-bold text-slate-700 mt-0.5">{lead.followUpDate ? formatDateDDMMYYYY(lead.followUpDate) : "Not Set"}</p>
                </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Follow-ups Timeline */}
        <div className={`w-full flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex-col h-full overflow-hidden ${activeTab === 'activity' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="px-4 py-3 md:px-6 md:py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <h2 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-indigo-600 md:w-5 md:h-5" />
              Activity History
            </h2>
            {/* Mobile Add Button */}
            <button onClick={openAddFollowupPopup} className="lg:hidden bg-indigo-600 hover:bg-indigo-700 text-white w-7 h-7 rounded-lg flex items-center justify-center shadow-sm">
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/30">
            {loading ? (
              <div className="flex justify-center items-center h-full"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>
            ) : followups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4"><MessageCircle size={32} className="text-indigo-300" /></div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No History Yet</h3>
                <p className="text-slate-500 text-[14px]">Log your first interaction with this lead by clicking the Add button.</p>
                <button onClick={openAddFollowupPopup} className="mt-6 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:bg-indigo-700"><Plus size={16} /> Log Interaction</button>
              </div>
            ) : (
              <div className="relative pl-5 ml-3 md:pl-6 border-l-2 border-indigo-100 md:ml-4 space-y-6 md:space-y-8">
                {followups.map((f, i) => (
                  <div key={f._id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[27px] md:-left-[35px] top-1.5 w-4 h-4 md:w-5 md:h-5 bg-white border-[3px] md:border-4 border-indigo-500 rounded-full shadow-sm z-10"></div>
                    
                    <div className="bg-white p-3.5 md:p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase tracking-wider">
                              {f.followUpType}
                            </span>
                            <span className="text-[12px] font-bold text-slate-500">
                              {formatDateDDMMYYYY(f.followUpDate)} {f.followUpTime && `• ${f.followUpTime}`}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditFollowup(f)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-indigo-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteFollowup(f._id)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-[14px] text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                        {f.notes}
                      </div>
                      
                      {f.nextFollowupDate && (
                        <div className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-orange-600 bg-orange-50 w-max px-3 py-1.5 rounded-lg border border-orange-100">
                          <CalendarIcon size={14} />
                          Next step: {formatDateDDMMYYYY(f.nextFollowupDate)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddFollowup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-6 md:p-8 pb-5 flex justify-between items-center border-b border-slate-50 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Clock size={20} className="text-indigo-600" />
                {editingId ? "Edit Interaction" : "Log Interaction"}
              </h2>
              <button onClick={() => setShowAddFollowup(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto">
              <form id="followup-form" onSubmit={handleAddFollowup} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Date</label>
                    <CustomCalendar
                      name="followUpDate"
                      value={form.followUpDate}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Time</label>
                    <CustomTimePicker
                      name="followUpTime"
                      value={form.followUpTime}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Interaction Type</label>
                  <CustomDropDown
                    value={form.followUpType}
                    onChange={(val) => setForm((prev) => ({ ...prev, followUpType: val }))}
                    options={["Call", "Email", "Meeting", "WhatsApp", "Site Visit"]}
                    className="w-full h-11 border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl text-sm font-semibold text-slate-700 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Notes / Description</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    placeholder="What was discussed?"
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block flex items-center gap-1.5">
                    <CalendarIcon size={12} className="text-orange-500" />
                    Next Scheduled Action (Optional)
                  </label>
                  <CustomCalendar
                    name="nextFollowupDate"
                    value={form.nextFollowupDate}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all"
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 md:p-8 pt-0 shrink-0">
              <button
                type="submit"
                form="followup-form"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                {editingId ? "Update Interaction" : "Save Interaction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;
