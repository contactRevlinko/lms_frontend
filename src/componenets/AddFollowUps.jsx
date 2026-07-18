import React, { useEffect, useState } from "react";
import { Phone, Mail, UsersRound, MessageSquareText } from "lucide-react";
import toast from "react-hot-toast";
import CustomCalendar from "./CustomCalender";
import CustomTimePicker from "./CustomTimePicker";
import { X } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

const AddFollowUps = ({ lead, setShowFollowUps }) => {
  const [selectedtype, setSelectedType] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [form, setForm] = useState({
    leadId: "",
    followUpDate: today,
    followUpTime: currentTime,
    followUpType: "",
    notes: "",
    nextFollowupDate: "",
  });



  const handleChange = (e) => {
    console.log(e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const setFollowUpType = (type) => {
    setSelectedType(type);
    setForm({
      ...form,
      followUpType: type,
    });
    console.log(type);
  };

  const handleSubmit = async () => {
    if (!form.followUpType || !form.followUpDate || !form.followUpTime) {
      alert("please fill all required fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const finalData = { ...form, leadId: lead._id };
      const res = await fetch(`${BASE_URL}/followups/create-followups`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setShowFollowUps(false);
        toast.success("followedup added successfully");
      }

      setForm({
        leadId: lead.id || "",
        followUpDate: today,
        followUpTime: currentTime,
        followUpType: "Call",
        notes: "",
        nextFollowupDate: today,
      });

      setSelectedType("");
    } catch (err) {
      console.log(err);
      toast.error("Error in  adding follow up");
    }
  };

  return (
    <div className="lg:w-[35%] w-[95%] md:m-auto bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden">
      <div className="flex justify-between items-start p-6 md:p-8 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Schedule Follow Up
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Lead : <span className="font-semibold text-indigo-600">{lead?.name}</span>
          </p>
        </div>
        <button
          onClick={() => setShowFollowUps(false)}
          className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="px-6 md:px-8 pb-2">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
            Follow-up type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <button
              onClick={() => setFollowUpType("Call")}
              className={`flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 transition-all ${selectedtype === "Call" ? "text-indigo-700 bg-indigo-50 border-indigo-500 shadow-sm" : "text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
            >
              <Phone size={20} />
              <p className="text-xs font-semibold">Phone</p>
            </button>
            <button
              onClick={() => setFollowUpType("Email")}
              className={`flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 transition-all ${selectedtype === "Email" ? "text-indigo-700 bg-indigo-50 border-indigo-500 shadow-sm" : "text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
            >
              <Mail size={20} />
              <p className="text-xs font-semibold">Email</p>
            </button>
            <button
              onClick={() => setFollowUpType("Meeting")}
              className={`flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 transition-all ${selectedtype === "Meeting" ? "text-indigo-700 bg-indigo-50 border-indigo-500 shadow-sm" : "text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
            >
              <UsersRound size={20} />
              <p className="text-xs font-semibold">Meeting</p>
            </button>
            <button
              onClick={() => setFollowUpType("WhatsApp")}
              className={`flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 transition-all ${selectedtype === "WhatsApp" ? "text-indigo-700 bg-indigo-50 border-indigo-500 shadow-sm" : "text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
            >
              <MessageSquareText size={20} />
              <p className="text-xs font-semibold">WhatsApp</p>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Date</label>
            <CustomCalendar
              value={form.followUpDate}
              onChange={handleChange}
              name="followUpDate"
              placeholder="Select date"
              className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-lg focus:bg-white focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div className="w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Time</label>
            <CustomTimePicker
              value={form.followUpTime}
              onChange={handleChange}
              name="followUpTime"
              className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-lg focus:bg-white focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
        </div>
        <div className="w-full mt-4">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
            Next FollowUp Date 
          </label>
          <CustomCalendar
            value={form.nextFollowupDate}
            onChange={handleChange}
            name="nextFollowupDate"
            placeholder="Select date"
            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-lg focus:bg-white focus:border-indigo-500 outline-none transition-colors"
          />
        </div>
        <div className="mt-4">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Remarks</label>
          <textarea
            name="notes"
            value={form.notes}
            rows={2}
            style={{
              minHeight: "44px",
              maxHeight: "192px",
            }}
            onChange={(e) => {
              handleChange(e);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 192)}px`;
            }}
            placeholder="Add important followup remarks..."
            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-3 rounded-lg focus:bg-white focus:border-indigo-500 outline-none transition-colors resize-none"
          />
        </div>
      </div>
      <div className="p-6 md:p-8 pt-4">
        <button
          onClick={handleSubmit}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default AddFollowUps;
