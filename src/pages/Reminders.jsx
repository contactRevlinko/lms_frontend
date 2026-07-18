import React, { useEffect, useState } from "react";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomPopupDelete from "../componenets/CustomPopupDelete";
import { Bell, ChevronsUpDown, Info, Plus, Trash2, Users, X, FileText, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";

import CustomDropDown from "../componenets/CustomDropDown";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";

const BASE_URL = import.meta.env.VITE_API_URL;


import { useNavigate } from "react-router-dom";

const Reminders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allLeads } = useSelector((state) => state.lead);

  const [data, setData] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [notePopup, setNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const fetchTodaysFo = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/followups/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

    const matchedLead = allLeads.find(
      (lead) => String(lead._id) === String(followLeadId)
    );

    if (!matchedLead?.assignedTo) {
      return "No Team Member";
    }

    if (typeof matchedLead.assignedTo === "string") {
      return matchedLead.assignedTo;
    }

    return matchedLead.assignedTo.name || "No Team Member";
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      setShowFollowUps(false);

      const res = await fetch(`${BASE_URL}/followups/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item._id !== id));
        setDeletePopup(false);
        setSelectedId(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openFollowup = (lead) => {
    if (!lead) {
      alert("Lead not found for this followup");
      return;
    }

    setSelectedLead(lead);
    setShowFollowUps(true);
  };

  const formatTime = (time) => {
    if (!time) return "No Time";

    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const dataSortedChronologically = [...data].sort((a, b) => {
    const noA = a.followupNo || 0;
    const noB = b.followupNo || 0;
    if (noA !== noB) return noA - noB;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const getIntrinsicNumber = (item) => {
    return dataSortedChronologically.findIndex((f) => f._id === item._id) + 1;
  };

  const sortedFollowups = [...data].sort((a, b) => {
    if (sortOrder === "asc") {
      return getIntrinsicNumber(a) - getIntrinsicNumber(b);
    }
    return getIntrinsicNumber(b) - getIntrinsicNumber(a);
  });

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


  return (
    <div className="w-full">
      <div className="mb-6 lg:mb-8 px-5 lg:px-0">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
          Today's Reminder
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Stay organized with upcoming tasks and follow-up reminders.
        </p>
      </div>

      {/* mobile */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 lg:hidden p-5">
        {data.length === 0 ? (
          <div className="lg:hidden sm:block col-span-full bg-white rounded-3xl border border-slate-200/80 p-10 text-center shadow-sm">
            <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700">
              No reminder Found
            </h3>
            <p className="text-gray-500 mt-2">
              You don't have any reminders scheduled today.
            </p>
          </div>
        ) : (
          data.map((follow) => (
            <div
              key={follow._id}
              onClick={(e) => {
                if (['button', 'svg', 'path', 'input', 'select'].includes(e.target.tagName.toLowerCase()) || e.target.closest('button') || e.target.closest('.dropdown-container')) {
                  return;
                }
                navigate(`/leads/${follow.leadId?._id || follow.leadId}`);
              }}
              className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="mb-4">
                <h1 className="text-lg font-bold text-gray-900 capitalize">
                  {follow.leadId?.name}
                </h1>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  Lead Details
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Team Member</p>
                  <p className="text-gray-800 font-medium">
                    {getTeamMemberName(follow)}
                  </p>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Type</p>
                  <p className="text-gray-800 font-medium">
                    {follow.followUpType}
                  </p>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Date</p>
                  <p className="text-gray-800 font-medium">
                    {follow.followUpDate
                      ? formatDateDDMMYYYY(follow.followUpDate)
                      : "No Date"}
                  </p>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Time</p>
                  <p className="text-gray-800 font-medium">
                    {formatTime(follow.followUpTime)}
                  </p>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Next Follow Up Date</p>
                  <p className="text-gray-800 font-medium">
                    {follow.nextFollowupDate
                      ? formatDateDDMMYYYY(follow.nextFollowupDate)
                      : "No Date"}
                  </p>
                </div>
              </div>

              <div className="w-full mt-4"> <CustomDropDown
                value={follow.leadId.status}
                onChange={(selectedStatus) =>
                  handleStatusChange(follow.leadId._id, selectedStatus)
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
              /></div>
               <div className="flex gap-3 w-full">
                 {follow.notes && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNote(follow.notes);
                                    setNotePopup(true);
                                  }}
                                  className="mt-4 w-1/2 flex justify-center items-center gap-2 h-10 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                                >
                                  <Info size={16} />
                                  View Note
                                </button>
                              )}
                              
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/leads/${follow.leadId?._id || follow.leadId}`);
                                  }}
                                  className={`mt-4 ${follow.notes ? "w-1/2" : "w-full"} flex justify-center items-center gap-2 h-10 rounded-xl text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition`}
                                >
                                  <Eye size={16} />
                                  View Followups
                                </button>
               </div>

            </div>
          ))
        )}
      </div>

      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-50/60 border-b border-slate-200/80">
            <tr className="text-left text-gray-500 text-sm">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex items-center gap-1"
                >
                  #
                  <ChevronsUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">NAME</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">TEAM MEMBER</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">FOLLOW UP TYPE</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">FOLLOWUP DATE</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">FOLLOW UP TIME</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                NEXT FOLLOW UP DATE
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                NOTES
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                STATUS
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedFollowups.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-16 text-gray-500">
                  <Bell className="mx-auto mb-3 w-12 h-12 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No reminder Found
                  </h3>
                  <p className="mt-2">
                    You don't have any reminders scheduled today.
                  </p>
                </td>
              </tr>
            ) : (
              sortedFollowups.map((followUp, i) => (
                <tr
                  key={followUp._id}
                  onClick={(e) => {
                    if (['button', 'svg', 'path', 'input', 'select'].includes(e.target.tagName.toLowerCase()) || e.target.closest('button') || e.target.closest('.dropdown-container')) {
                      return;
                    }
                    navigate(`/leads/${followUp.leadId?._id || followUp.leadId}`);
                  }}
                  className="border-b border-slate-100 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {getIntrinsicNumber(followUp)}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {followUp.leadId?.name || "No Name"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {getTeamMemberName(followUp)}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{followUp.followUpType}</td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {followUp.followUpDate
                      ? formatDateDDMMYYYY(followUp.followUpDate)
                      : "No Date"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {formatTime(followUp.followUpTime)}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {followUp.nextFollowupDate
                      ? formatDateDDMMYYYY(followUp.nextFollowupDate)
                      : "No Date"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {followUp.notes ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNote(followUp.notes);
                            setNotePopup(true);
                          }}
                          className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 hover:bg-indigo-100 transition shrink-0"
                          title="View Note"
                        >
                          <Info size={15} />
                        </button>
                      ) : (
                        <span className="h-8 w-8 flex items-center justify-center text-slate-300">-</span>
                      )}
                  </td>
                  
                  <td className="px-6 py-3">
                    <CustomDropDown
                      value={followUp.leadId.status}
                      onChange={(selectedStatus) =>
                        handleStatusChange(followUp.leadId._id, selectedStatus)
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
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/leads/${followUp.leadId?._id || followUp.leadId}`);
                        }}
                        className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition shrink-0"
                        title="View Follow Up"
                      >
                        <Eye size={15} />
                      </button>
                  </td>
   
                </tr>
              ))
            )}
          </tbody>
        </table>
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
      {notePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center px-4 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-50/80 border-b border-indigo-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                <FileText size={18} />
                <h2 className="text-lg">Followup Note</h2>
              </div>
              <button
                onClick={() => {
                  setNotePopup(false);
                  setSelectedNote("");
                }}
                className="text-indigo-400 hover:text-indigo-600 bg-white hover:bg-indigo-100 p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 bg-slate-50 min-h-[120px]">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedNote}
              </p>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <button
                onClick={() => {
                  setNotePopup(false);
                  setSelectedNote("");
                }}
                className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Reminders;