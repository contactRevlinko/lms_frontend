import React, { useEffect, useMemo, useState } from "react";
import { Bell, Trash2, Users, Info, Calendar, Calendar1, ChevronsUpDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import CustomPopupDelete from "./CustomPopupDelete";
import {
  useGetFollowupQuery,
  useDeleteFollowupsMutation,
} from "../redux/followupApi";

import { fetchAllLead } from "../redux/allLeadSlice";
import toast from "react-hot-toast";
import CustomCalendar from "./CustomCalender";
import CustomDropDown from "./CustomDropDown";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";
const BASE_URL = import.meta.env.VITE_API_URL;
const FollowupsList = () => {
  const dispatch = useDispatch();

  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [notePopup, setNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { allLeads } = useSelector((state) => state.lead);
  const { data, refetch } = useGetFollowupQuery();
  const [deleteFollowups] = useDeleteFollowupsMutation();

  const followups = data?.data || [];
  const todayDate = new Date().toISOString().split("T")[0];
  const [sortOrder, setSortOrder] = useState("asc");


  const filteredFollowups = useMemo(() => {
    return followups.filter((follow) => {
      if (!follow.followUpDate) return false;

      const followDate = new Date(follow.followUpDate);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        if (followDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (followDate > end) return false;
      }

      return true;
    });
  }, [followups, startDate, endDate]);

  useEffect(() => {
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
      setDeletePopup(false);
      setSelectedId(null);

      await deleteFollowups(id).unwrap();

      await refetch();
      toast.success("Followup deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const formatTime = (time) => {
    if (!time) return "No Time";

    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
        fetchStatusCount();
      } else {
        toast.error(result.message || "Status update failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refetch();
  }, [allLeads, refetch]);
  console.log("follow up", data)

  const sortedFollowups = [...filteredFollowups].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.followupNo - b.followupNo;
    }

    return b.followupNo - a.followupNo;
  });

  return (
    <div className="w-full overflow-y-visible">
      <div className="mb-10">
        <h1 className="md:text-5xl text-3xl font-medium text-slate-900">
          Follow-Up Schedule
        </h1>

        <p className="md:py-3 text-sm md:text-xl py-2 text-gray-600">
          View upcoming and completed follow-up activities.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-end">
        <div className="w-full md:w-auto">
          <label className="block text-sm text-gray-500 mb-1">
            Start Date
          </label>

          <div className="relative">
            <CustomCalendar
              value={startDate}
              onChange={setStartDate}
              placeholder="Start Date"
              maxDate={new Date().toISOString().split("T")[0]}
            />

            <Calendar1
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 pointer-events-none"
            />
          </div>
        </div>


        <div className="w-full md:w-auto">
          <label className="block text-sm text-gray-500 mb-1">
            End Date
          </label>

          <div className="relative">
            <CustomCalendar
              value={endDate}
              onChange={setEndDate}
              placeholder="End Date"
              minDate={startDate}
              maxDate={new Date().toISOString().split("T")[0]}
            />

            <Calendar1
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 pointer-events-none"
            />
          </div>
        </div>
        

        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-200"
        >
          Clear
        </button>
      </div>

      {/* mobile */}
      {filteredFollowups.length === 0 ? (
        <div className="lg:hidden sm:block col-span-full bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700">
            No reminder Found
          </h3>
          <p className="text-gray-500 mt-2">
            No followups found in selected date range.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20 lg:hidden">
          {filteredFollowups.map((follow) => (
            <div
              key={follow._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_12px_35px_rgba(15,23,42,0.10)] p-4"
            >
              <div className="mb-4">
                <h1 className="text-lg font-bold text-gray-900 capitalize">
                  {follow.leadId?.name || "No Name"}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Follow Up Details
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Team Member</p>
                  <p className="text-gray-800 font-medium truncate">
                    {getTeamMemberName(follow)}
                  </p>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Type</p>
                  <p className="text-gray-800 font-medium truncate">
                    {follow.followUpType}
                  </p>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Date</p>
                  <p className="text-gray-800 font-medium">
                    {follow.followUpDate
                      ? formatDateDDMMYYYY(follow.followUpDate)
                      : "No Date"}
                  </p>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Time</p>
                  <p className="text-gray-800 font-medium">
                    {formatTime(follow.followUpTime)}
                  </p>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Next Follow Up</p>
                  <p className="text-gray-800 font-medium">
                    {follow.nextFollowupDate
                      ? formatDateDDMMYYYY(follow.nextFollowupDate)
                      : "No Date"}
                  </p>
                </div>
               
                <div className=" flex w-full justify-between ">
                 <div className="mt-4">

                    <CustomDropDown

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
                    />
                  </div>
          

                {follow.notes && (
                  <button
                    onClick={() => {
                      setSelectedNote(follow.notes);
                      setNotePopup(true);
                    }}
                    className="mt-4 w-1/2 flex justify-center items-center gap-2 h-10 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200"
                  >
                    <Info size={17} />
                    View Note
                  </button>
                )} 
               </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedId(follow._id);
                    setDeletePopup(true);
                  }}
                  className="h-10 w-full rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 active:scale-[0.98] transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* laptop */}
      <div className="lg:block hidden bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-50/60 border-b border-slate-200/80">
            <tr className="text-left">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex items-center gap-2"
                >
                  SR NO
                  <ChevronsUpDown size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">NAME</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">TEAM MEMBER</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FOLLOW UP TYPE</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FOLLOWUP DATE</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FOLLOW UP TIME</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                NEXT FOLLOW UP DATE
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">STATUS</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">NOTE</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">ACTION</th>
            </tr>
          </thead>

          {filteredFollowups.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan="10" className="text-center py-16 text-gray-500">
                  <Bell className="mx-auto mb-3 w-12 h-12 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No reminder Found
                  </h3>
                  <p className="mt-2">
                    No followups found in selected date range.
                  </p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {sortedFollowups.map((followUp, i) => (
                <tr
                  key={followUp._id}
                  className="border-b border-slate-100 text-left hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium" >{followUp.followupNo}</td>
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
                    {followUp.notes ? (
                      <button
                        onClick={() => {
                          setSelectedNote(followUp.notes);
                          setNotePopup(true);
                        }}
                        className="text-indigo-600 bg-indigo-50 border border-indigo-200 p-2 rounded-lg hover:bg-indigo-100"
                      >
                        <Info size={18} />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    <button
                      onClick={() => {
                        setSelectedId(followUp._id);
                        setDeletePopup(true);
                      }}
                      className="text-red-600 bg-red-50 flex w-full text-sm justify-center items-center px-4 py-1 gap-3 border border-red-200 hover:ring-2 hover:ring-offset-2 hover:ring-red-300 rounded-lg"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {deletePopup && (
        <CustomPopupDelete
          onClose={() => setDeletePopup(false)}
          onDelete={() => handleDelete(selectedId)}
        />
      )}

      {notePopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Followup Note
            </h2>

            <p className="text-gray-600 text-sm leading-6 whitespace-pre-wrap">
              {selectedNote}
            </p>

            <button
              onClick={() => {
                setNotePopup(false);
                setSelectedNote("");
              }}
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowupsList;