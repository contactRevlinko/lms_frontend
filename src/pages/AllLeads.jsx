import React, { useState, useEffect } from "react";
import { ChevronsUpDown, ChevronsUpDownIcon, Info, Plus, Search, Trash2, Users, Pencil, Clock, Check, CalendarPlus, ChevronLeft, ChevronRight, Eye, ClipboardList } from "lucide-react";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";
import { useNavigate } from "react-router-dom";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomDropDown from "../componenets/CustomDropDown";
import CustomPopupDelete from "../componenets/CustomPopupDelete";
import EditLeadPopup from "../componenets/EditLeadPopup";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchAllLead, removeLead } from "../redux/allLeadSlice";
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

  useEffect(() => {
    dispatch(fetchAllLead());
    dispatch(fetchTeamList());
  }, [dispatch]);


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/leads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  const leadsPerPage = 10;

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = sortedLeadData.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(sortedLeadData.length / leadsPerPage);

  return (
    <div className="mt-6 md:p-4 lg:p-0 md:rounded-2xl overflow-y-visible">
      <div className="flex justify-between pb-4">
        <div className="flex items-center w-full max-w-[350px] h-10 bg-white px-3 rounded-xl gap-2 border border-slate-100">
          <Search size={16} className="text-slate-400" />
          <input
            className="outline-none w-full text-[13px] text-slate-700 placeholder-slate-400 bg-transparent"
            placeholder="Search by name, phone, or team..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20 lg:hidden">
        {leadData.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-10 text-center shadow-sm">
            <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700">
              No Leads Found
            </h3>
            <p className="text-gray-500 mt-2">
              Add your first lead to get started.
            </p>
          </div>
        ) : (
          leadData.map((lead) => (
            <div
              key={lead._id}
              onClick={(e) => {
                if (['button', 'svg', 'path', 'input', 'select'].includes(e.target.tagName.toLowerCase()) || e.target.closest('button') || e.target.closest('.dropdown-container')) {
                  return;
                }
                navigate(`/leads/${lead._id}`);
              }}
              className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* Header */}
              <div className="mb-4">
                <h1 className="text-lg font-bold text-gray-900 capitalize">
                  {lead.name}
                </h1>
                <p className="text-xs text-gray-400 mt-1">Lead Details</p>
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Mobile</p>
                  <p className="text-gray-800 font-medium truncate">{lead.phone}</p>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium truncate">{lead.email || "-"}</p>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Source</p>
                  <p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-600 bg-slate-50 font-medium">
                      {lead.source}
                    </span>
                  </p>
                </div>

                {!isTeamLogin && (
                  <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                    <p className="text-gray-500">Assigned To</p>
                    <CustomDropDown
                      value={lead.assignedTo?.name || lead.assignedTo || "Select"}
                      onChange={(selectedAssignedTo) =>
                        handleAssignedToChange(lead._id, selectedAssignedTo)
                      }
                      options={teamList.map((teamMem) => teamMem.name)}
                    />
                  </div>
                )}

                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Status</p>
                  <CustomDropDown
                    value={lead.status}
                    onChange={(selectedStatus) =>
                      handleStatusChange(lead._id, selectedStatus)
                    }
                    options={[
                      "New",
                      "Hot",
                      "Warm",
                      "Cold",
                      "Contacted",
                      "Interested",
                      "Closed Won",
                      "Closed Lost",
                    ]}
                  />
                </div>

                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Next Follow Up</p>
                  <p className="text-[13px] text-slate-500">
                    {lead.followUpDate ? formatDateDDMMYYYY(lead.followUpDate) : "No Date"}
                  </p>
                </div>

              </div>

              {/* Buttons */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedLeadForEdit(lead);
                    setEditLeadModal(true);
                  }}
                  className="
          h-10 rounded-xl text-sm font-semibold
          text-blue-600 bg-blue-50 border border-blue-200
          hover:bg-blue-100 active:scale-[0.98]
          transition
        "
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedId(lead._id);
                    setDeletePopup(true);
                  }}
                  className="
          h-10 rounded-xl text-sm font-semibold
          text-red-600 bg-red-50 border border-red-200
          hover:bg-red-100 active:scale-[0.98]
          transition
        "
                >
                  Delete
                </button>

                <button
                  onClick={() => openFollowup(lead)}
                  className="
          h-10 rounded-xl text-sm font-semibold
          text-indigo-700 bg-indigo-50 border border-indigo-200
          hover:bg-indigo-100 active:scale-[0.98]
          transition whitespace-nowrap
        "
                >
                  + FollowUps
                </button>
              </div>
            </div>
          ))
        )}


      </div>

      {/* Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-white border-b border-slate-100">
            <tr className="text-left">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                <button
                  onClick={() => setSortOrderIndex(sortOrderIndex === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-1"
                >
                  #
                  <ChevronsUpDownIcon size={14} />
                </button>
              </th>

              {[
                "NAME",
                "PHONE",
                "EMAIL",
                "STATUS",
                ...(!isTeamLogin ? ["ASSIGNED TO"] : []),
                "SOURCE",
                "NEXT FOLLOW UP",
                "",
                "",
                "",
              ].map((head, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentLeads.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-16 text-gray-500">
                  <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No Leads Found
                  </h3>
                  <p className="mt-2">Add your first lead to get started.</p>
                </td>
              </tr>
            ) : (
              currentLeads.map((lead, i) => (
                <tr
                  key={lead._id}
                  className="border-b border-slate-100 text-left hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {lead.leadNo || indexOfFirstLead + i + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{lead.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{lead.email || "-"}</td>

                  <td className="px-6 py-3">
                    <div className="w-[130px]">
                      <CustomDropDown
                        value={lead.status}
                        onChange={(selectedStatus) =>
                          handleStatusChange(lead._id, selectedStatus)
                        }
                        options={[
                          "New",
                          "Hot",
                          "Warm",
                          "Cold",
                          "Contacted",
                          "Interested",
                          "Closed Won",
                          "Closed Lost",
                        ]}
                      />
                    </div>
                  </td>

                  {!isTeamLogin && (
                    <td className="px-6 py-3">
                      <div className="w-[130px]">
                        <CustomDropDown
                          value={lead.assignedTo?.name || "Select"}
                          onChange={(selectedId) =>
                            handleAssignedToChange(lead._id, selectedId)
                          }
                          options={teamList.map((teamMem) => ({
                            label: teamMem.name,
                            value: teamMem._id
                          }))}
                        />
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-600 bg-slate-50 font-medium">
                      {lead.source}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-[13px] text-slate-500">
                    {lead.followUpDate
                      ? formatDateDDMMYYYY(lead.followUpDate)
                      : "No Date"}
                  </td>


                  <td className="px-3 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedLeadForEdit(lead);
                          setEditLeadModal(true);
                        }}
                        title="Edit Lead"
                        className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/leads/${lead._id}`)}
                        title="View Details"
                        className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>

                  <td className="px-2 py-3">
                    <button
                      onClick={() => {
                        setSelectedId(lead._id);
                        setDeletePopup(true);
                      }}
                      className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>

                  <td className="px-6 py-3">
                    <button
                      onClick={() => openFollowup(lead)}
                      className="h-7 px-3 rounded-md text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200/50 hover:bg-indigo-100 transition flex items-center gap-1 whitespace-nowrap"
                    >
                      <ClipboardList size={13} />
                      Follow Up
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {sortedLeadData.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
            <div className="text-[12px] font-semibold text-slate-400">
              Showing {indexOfFirstLead + 1}-{Math.min(indexOfLastLead, sortedLeadData.length)} of {sortedLeadData.length} leads
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, index) => {
                // Show a limited number of pages to avoid overcrowding
                if (
                  totalPages > 5 &&
                  index !== 0 &&
                  index !== totalPages - 1 &&
                  Math.abs(currentPage - 1 - index) > 1
                ) {
                  if (Math.abs(currentPage - 1 - index) === 2) {
                    return <span key={index} className="px-1 text-slate-400">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-7 h-7 rounded-md text-[13px] font-semibold flex items-center justify-center transition-colors ${
                      currentPage === index + 1
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {deletePopup && (
        <CustomPopupDelete
          onClose={() => setDeletePopup(false)}
          onDelete={() => handleDelete(selectedId)}
        />
      )}

      {showFollowUps && selectedLead && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <AddFollowUps
            lead={selectedLead}
            setShowFollowUps={setShowFollowUps}
          />
        </div>
      )}

      {editLeadModal && selectedLeadForEdit && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <EditLeadPopup
            lead={selectedLeadForEdit}
            setEditLeadModal={setEditLeadModal}
          />
        </div>
      )}


    </div>
  );
};

export default AllLeads;  