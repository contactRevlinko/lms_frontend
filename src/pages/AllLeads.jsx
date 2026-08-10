import React, { useState, useEffect } from "react";
import { Search, Trash2, Users, Pencil, Clock, Check, CalendarPlus, ChevronLeft, ChevronRight, Eye, ClipboardList, MapPin, Mail, Phone, Calendar as CalIcon, LayoutGrid, List } from "lucide-react";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";
import { useNavigate } from "react-router-dom";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomDropDown from "../componenets/CustomDropDown";
import CustomPopupDelete from "../componenets/CustomPopupDelete";
import EditLeadPopup from "../componenets/EditLeadPopup";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import { fetchTeamList } from "../redux/teamSlice";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const AllLeads = ({ fetchStatusCount, setSearch, filtered = [], sortOrderIndex, setSortOrderIndex, setSortOrder }) => {

  const loginType = localStorage.getItem("loginType");
  const isTeamLogin = loginType === "team";

  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);
  const { allLeads } = useSelector((state) => state.lead);

  const navigate = useNavigate();

  const [showFollowUps, setShowFollowUps] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const [editLeadModal, setEditLeadModal] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null);

  // We will keep a toggle just in case the user wants to see cards on mobile
  const [viewMode, setViewMode] = useState("table"); 

  useEffect(() => {
    dispatch(fetchAllLead());
    dispatch(fetchTeamList());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        await dispatch(fetchAllLead());
        if(fetchStatusCount) fetchStatusCount();
        setDeletePopup(false);
        setSelectedId(null);
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openFollowup = (lead) => {
    setSelectedLead(lead);
    setShowFollowUps(true);
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
        fetchStatusCount();
      } else {
        toast.error(result.message || "Status update failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssignedToChange = async (id, newAssignedTo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/leads/${id}/assign-lead`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignedTo: newAssignedTo }),
      });
      if (res.ok) {
        dispatch(fetchAllLead());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const leadData = filtered || [];
  const sortedLeadData = leadData;

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 12;

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = sortedLeadData.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(sortedLeadData.length / leadsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-700";
      case "In Followup": return "bg-orange-100 text-orange-700";
      case "Interested": return "bg-green-100 text-green-700";
      case "Cold": return "bg-cyan-100 text-cyan-700";
      case "Lost": return "bg-red-100 text-red-700";
      case "Won": return "bg-emerald-100 text-emerald-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="mt-6 md:p-4 lg:p-0 md:rounded-2xl overflow-y-visible">
      
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 gap-4">
        
        {/* PREMIUM SEARCH BAR */}
        <div className="flex items-center w-full max-w-lg h-11 bg-white px-4 rounded-xl gap-3 shadow-sm border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 ring-indigo-500/20 transition-all">
          <Search size={16} className="text-slate-400" />
          <input
            className="outline-none w-full text-[13px] text-slate-700 placeholder-slate-400 bg-transparent font-medium"
            placeholder="Search leads by name, phone, or email..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* VIEW TOGGLE (Hidden on mobile) */}
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

      {currentLeads.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm flex flex-col items-center">
          <Users className="mb-4 w-16 h-16 text-indigo-300 bg-indigo-50 p-4 rounded-full" />
          <h3 className="text-2xl font-bold text-slate-800">No Leads Found</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            We couldn't find any leads matching your criteria. Try adjusting your filters or search term.
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
                    <th className="px-5 py-4">Status</th>
                    {!isTeamLogin && <th className="px-5 py-4">Assigned To</th>}
                    <th className="px-5 py-4">Next Follow-Up</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentLeads.map((lead, i) => (
                    <tr key={lead._id} className="hover:bg-indigo-50/30 transition-colors group">
                      
                      {/* 1. Index */}
                      <td className="px-5 py-3 text-xs font-semibold text-slate-400 text-center">
                        {lead.leadNo || indexOfFirstLead + i + 1}
                      </td>

                      {/* 2. Combined Lead Info */}
                      <td className="px-5 py-3">
                        <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/leads/${lead._id}`)}>
                          <span className="font-bold text-[14px] text-slate-900 capitalize group-hover:text-indigo-600 transition-colors">{lead.name}</span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
                              <Phone size={10} className="text-slate-400" /> {lead.phone}
                            </span>
                            {lead.email && (
                              <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
                                <Mail size={10} className="text-slate-400" /> {lead.email}
                              </span>
                            )}
                          </div>
                          {lead.source && (
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{lead.source}</span>
                          )}
                        </div>
                      </td>

                      {/* 3. Status */}
                      <td className="px-5 py-3">
                        <div className="w-[140px]">
                          <CustomDropDown
                            value={lead.status}
                            onChange={(selectedStatus) => handleStatusChange(lead._id, selectedStatus)}
                            options={["New", "In Followup", "Interested", "Cold", "Lost", "Won"]}
                          />
                        </div>
                      </td>

                      {/* 4. Assigned To */}
                      {!isTeamLogin && (
                        <td className="px-5 py-3">
                          <div className="w-[140px]">
                            <CustomDropDown
                              value={lead.assignedTo?.name || "Assign..."}
                              onChange={(selectedId) => handleAssignedToChange(lead._id, selectedId)}
                              options={teamList.map((teamMem) => ({
                                label: teamMem.name,
                                value: teamMem._id
                              }))}
                            />
                          </div>
                        </td>
                      )}

                      {/* 5. Next Follow Up */}
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${lead.followUpDate ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'text-slate-400'}`}>
                          <CalIcon size={12} />
                          {lead.followUpDate ? formatDateDDMMYYYY(lead.followUpDate) : "No Date"}
                        </span>
                      </td>

                      {/* 6. Tight Action Buttons */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedLeadForEdit(lead);
                              setEditLeadModal(true);
                            }}
                            title="Edit"
                            className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition shadow-sm"
                          >
                            <Pencil size={14} />
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedId(lead._id);
                              setDeletePopup(true);
                            }}
                            title="Delete"
                            className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-200 transition shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* Pinned Primary Action */}
                          <button
                            onClick={() => openFollowup(lead)}
                            className="h-8 px-3 rounded-lg text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm ml-1"
                          >
                            <CalendarPlus size={14} />
                            Follow Up
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-5">
              {currentLeads.map((lead) => (
                <div
                  key={lead._id}
                  onClick={(e) => {
                    if (['button', 'svg', 'path', 'input', 'select', 'li', 'ul'].includes(e.target.tagName.toLowerCase()) || e.target.closest('button') || e.target.closest('.dropdown-container')) return;
                    navigate(`/leads/${lead._id}`);
                  }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col overflow-hidden group"
                >
                  <div className="p-5 pb-3 border-b border-slate-50 relative">
                    <div className="absolute top-0 right-0 p-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <h1 className="text-lg font-bold text-slate-900 capitalize pr-20 truncate">{lead.name}</h1>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-2">
                      <CalIcon size={14} className="text-indigo-400" />
                      Next Follow-up: 
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${lead.followUpDate ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                        {lead.followUpDate ? formatDateDDMMYYYY(lead.followUpDate) : "None"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Phone size={14} /></div>
                      <p className="text-slate-700 font-medium truncate">{lead.phone}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Mail size={14} /></div>
                      <p className="text-slate-700 font-medium truncate">{lead.email || "-"}</p>
                    </div>
                    
                    {!isTeamLogin && (
                      <div className="flex items-center gap-3 text-sm dropdown-container">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Users size={14} /></div>
                        <div className="w-full">
                          <CustomDropDown
                            value={lead.assignedTo?.name || lead.assignedTo || "Assign To..."}
                            onChange={(selectedAssignedTo) => handleAssignedToChange(lead._id, selectedAssignedTo)}
                            options={teamList.map((teamMem) => ({ label: teamMem.name, value: teamMem._id }))}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-sm dropdown-container">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Check size={14} /></div>
                      <div className="w-full">
                        <CustomDropDown
                          value={lead.status}
                          onChange={(selectedStatus) => handleStatusChange(lead._id, selectedStatus)}
                          options={["New", "In Followup", "Interested", "Cold", "Lost", "Won"]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => openFollowup(lead)}
                      className="flex-1 h-10 rounded-xl text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CalendarPlus size={16} /> Follow Up
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedLeadForEdit(lead); setEditLeadModal(true); }} className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition shadow-sm"><Pencil size={15} /></button>
                      <button onClick={() => { setSelectedId(lead._id); setDeletePopup(true); }} className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition shadow-sm"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm mt-4 mb-10">
            <div className="text-sm font-semibold text-slate-500">
              Showing {indexOfFirstLead + 1}-{Math.min(indexOfLastLead, sortedLeadData.length)} of {sortedLeadData.length} leads
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, index) => {
                if (totalPages > 5 && index !== 0 && index !== totalPages - 1 && Math.abs(currentPage - 1 - index) > 1) {
                  if (Math.abs(currentPage - 1 - index) === 2) return <span key={index} className="px-1 text-slate-400 font-bold">...</span>;
                  return null;
                }
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                      currentPage === index + 1
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}

      {deletePopup && <CustomPopupDelete onClose={() => setDeletePopup(false)} onDelete={() => handleDelete(selectedId)} />}
      {showFollowUps && selectedLead && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"><AddFollowUps lead={selectedLead} setShowFollowUps={setShowFollowUps} /></div>}
      {editLeadModal && selectedLeadForEdit && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"><EditLeadPopup lead={selectedLeadForEdit} setEditLeadModal={setEditLeadModal} /></div>}
    </div>
  );
};

export default AllLeads;