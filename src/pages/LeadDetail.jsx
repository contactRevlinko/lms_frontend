import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import { ArrowLeft, Phone, Mail, User, Info, Building2, Calendar as CalendarIcon, Clock, Briefcase, Plus, X, Edit, Trash2 } from "lucide-react";
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
    // eslint-disable-next-line
  }, [id]);

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
      setForm({
        followUpDate: "",
        followUpTime: "",
        followUpType: "Call",
        notes: "",
        nextFollowupDate: "",
      });
      fetchFollowups();
      dispatch(fetchAllLead());
    } catch (error) {
      toast.error("Failed to add follow-up");
      console.error(error);
    }
  };

  if (leadsLoading) {
    return (
      <div className="p-8 h-screen w-full bg-slate-50 flex items-center justify-center">
        <p className="text-gray-500">Loading lead details...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 h-screen overflow-y-auto w-full bg-slate-50 flex items-center justify-center">
        <p className="text-gray-500">Lead not found. Please go back.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 h-screen overflow-y-auto w-full bg-slate-50">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lead Details</h1>
          <p className="text-sm text-slate-500 font-medium">#{lead.leadNo || "N/A"}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                {lead.name}
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold
                ${lead.status === "New" ? "bg-blue-100 text-blue-700" :
                lead.status === "Hot" ? "bg-red-100 text-red-700" :
                lead.status === "Warm" ? "bg-orange-100 text-orange-700" :
                lead.status === "Cold" ? "bg-cyan-100 text-cyan-700" :
                lead.status === "Closed Won" ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-700"}`}
              >
                {lead.status}
              </span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Phone size={16} className="text-slate-400" />
                  {lead.phone}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Mail size={16} className="text-slate-400" />
                  {lead.email || "N/A"}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Source</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Building2 size={16} className="text-slate-400" />
                  <span className="capitalize">{lead.source || "N/A"}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned To</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Briefcase size={16} className="text-slate-400" />
                  {lead.assignedTo?.name || "Unassigned"}
                </div>
              </div>
              
              <div className="md:col-span-2 mt-2 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Next Follow-up Date</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CalendarIcon size={16} className="text-indigo-500" />
                  {lead.followUpDate ? formatDateDDMMYYYY(lead.followUpDate) : "Not Set"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Clock size={20} className="text-indigo-600" />
                Follow-ups
              </h2>
              {!showAddFollowup && (
                <button
                  onClick={openAddFollowupPopup}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus size={16} /> Add 
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 relative">

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                </div>
              ) : followups.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock size={24} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No follow-ups yet.</p>
                  <p className="text-sm text-slate-400 mt-1">Add one to keep track of interactions.</p>
                </div>
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] md:before:left-[19px] before:w-[2px] before:bg-slate-200">
                  {followups.map((f, i) => (
                    <div key={f._id} className="relative pl-8 md:pl-12">
                      <div className="absolute left-0 top-2 w-6 h-6 md:w-10 md:h-10 bg-white border-2 border-indigo-100 rounded-full flex items-center justify-center z-10 text-indigo-500 shadow-sm">
                        <Info className="w-3 h-3 md:w-5 md:h-5" />
                      </div>
                      <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded uppercase tracking-wide">
                              {f.followUpType}
                            </span>
                            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                              {formatDateDDMMYYYY(f.followUpDate)}
                              {f.followUpTime && ` at ${f.followUpTime}`}
                            </span>
                          </div>
                          {f.priority && (
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full whitespace-nowrap
                              ${f.priority === 'High' ? 'bg-red-100 text-red-600' :
                                f.priority === 'Medium' ? 'bg-orange-100 text-orange-600' :
                                'bg-blue-100 text-blue-600'}`}>
                              {f.priority}
                            </span>
                          )}
                          <div className="flex items-center gap-1 ml-auto md:ml-2">
                            <button onClick={() => handleEditFollowup(f)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteFollowup(f._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{f.notes}</p>
                        
                        {f.nextFollowupDate && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                            <CalendarIcon size={14} className="text-slate-400" />
                            Next follow-up on {formatDateDDMMYYYY(f.nextFollowupDate)}
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
      </div>

      {showAddFollowup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 pb-4 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-bold text-slate-800">{editingId ? "Edit Follow-up" : "New Follow-up"}</h2>
              <button onClick={() => setShowAddFollowup(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 md:px-8 pb-2 overflow-y-auto">
              <form id="followup-form" onSubmit={handleAddFollowup} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Date</label>
                    <CustomCalendar
                      name="followUpDate"
                      value={form.followUpDate}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Time</label>
                    <CustomTimePicker
                      name="followUpTime"
                      value={form.followUpTime}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Type</label>
                  <CustomDropDown
                    value={form.followUpType}
                    onChange={(val) => setForm((prev) => ({ ...prev, followUpType: val }))}
                    options={["Call", "Email", "Meeting", "WhatsApp", "Site Visit"]}
                    className="w-full h-11 border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg text-sm text-slate-700 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Notes / Description</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3.5 py-3 text-sm text-slate-700 transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Next Follow-up Date</label>
                  <CustomCalendar
                    name="nextFollowupDate"
                    value={form.nextFollowupDate}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 transition-all"
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 md:p-8 pt-4 shrink-0">
              <button
                type="submit"
                form="followup-form"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center"
              >
                {editingId ? "Update Follow-up" : "Save Follow-up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;
