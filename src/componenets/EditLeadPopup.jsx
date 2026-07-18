import React, { useState, useEffect } from "react";
import { User, Phone, Mail, X } from "lucide-react";
import CustomDropDown from "./CustomDropDown";
import axios from "axios";
import { fetchAllLead } from "../redux/allLeadSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CustomCalendar from "./CustomCalender";
import { validateEmail } from "../utils/validation";

const BASE_URL = import.meta.env.VITE_API_URL;

const EditLeadPopup = ({ lead, setEditLeadModal }) => {
  const loginType = localStorage.getItem("loginType");
  const isTeamLogin = loginType === "team";

  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);
  const [sources, setSources] = useState([]);

  const [form, setForm] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    email: lead.email || "",
    status: lead.status || "New",
    source: lead.source || "Whatsapp",
    assignedTo: lead.assignedTo?._id || lead.assignedTo || "",
    followUpDate: lead.followUpDate ? lead.followUpDate.split("T")[0] : "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (form.email && form.email.trim() !== "" && !validateEmail(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const token = localStorage.getItem("token");

      await axios.put(`${BASE_URL}/leads/${lead._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Lead updated successfully");
      dispatch(fetchAllLead());
      setEditLeadModal(false);
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message));
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/source/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSources(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSources();
  }, []);

  return (
    <div className="lg:w-1/2 w-[90%] m-auto max-h-[90vh] overflow-y-auto pb-8">
      <div className="lg:p-8 md:p-8 p-6 bg-white rounded-2xl shadow-xl relative">
        <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
              Edit Lead
            </h1>
            <p className="text-sm font-medium text-slate-500">Update details for this prospect</p>
          </div>

          <button
            onClick={() => setEditLeadModal(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="lg:flex gap-5 lg:w-full justify-between mt-2">
          <div className="w-full">
            <p className="text-sm font-medium text-slate-700 mb-1.5">Full Name</p>
            <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <User size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                placeholder="Enter full name"
              />
            </div>
          </div>

          <div className="w-full mt-4 lg:mt-0">
            <p className="text-sm font-medium text-slate-700 mb-1.5">Phone</p>
            <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <Phone size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) {
                    setForm({ ...form, phone: val });
                  }
                }}
                maxLength="10"
                className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                placeholder="Mobile number"
              />
            </div>
          </div>
        </div>

        <div className="lg:flex gap-5 lg:w-full justify-between mt-4">
          <div className="w-full">
            <p className="text-sm font-medium text-slate-700 mb-1.5">Email</p>
            <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <Mail size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="w-full mt-4 lg:mt-0">
            <p className="text-sm font-medium text-slate-700 mb-1.5">Follow Up Date</p>
            <div className="w-full relative">
              <CustomCalendar
                value={form.followUpDate}
                onChange={(date) => setForm({ ...form, followUpDate: date })}
                placeholder="Select follow-up date"
              />
            </div>
          </div>
        </div>

        <div className="lg:flex gap-5 lg:w-full justify-between mt-4">
          <div className="w-full">
            <p className="text-sm font-medium text-slate-700 mb-1.5">Status</p>
            <CustomDropDown
              options={[
                "New", "Contacted", "Hot", "Warm", "Cold", "Interested", "Closed Won", "Closed Lost"
              ]}
              value={form.status}
              onChange={(val) => setForm({ ...form, status: val })}
            />
          </div>

          <div className="w-full mt-4 lg:mt-0">
            <p className="text-sm font-medium text-slate-700 mb-1.5">Source</p>
            <CustomDropDown
              options={
                sources && sources.length > 0
                  ? sources.map((s) => s.name)
                  : ["Whatsapp", "Instagram", "Referral", "Website", "Facebook", "Call", "Email", "Telegram", "Friend", "Other"]
              }
              value={form.source}
              onChange={(val) => setForm({ ...form, source: val })}
            />
          </div>
        </div>

        {!isTeamLogin && (
          <div className="lg:flex gap-5 lg:w-full justify-between mt-4">
            <div className="w-full">
              <p className="text-sm font-medium text-slate-700 mb-1.5">Assign To</p>
              <CustomDropDown
                options={
                  teamList?.length > 0
                    ? [{ label: "Unassigned", value: "" }, ...teamList.map((m) => ({ label: m.name, value: m._id }))]
                    : [{ label: "No team members", value: "" }]
                }
                value={form.assignedTo}
                onChange={(val) => setForm({ ...form, assignedTo: val })}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Update Lead
        </button>
      </div>
    </div>
  );
};

export default EditLeadPopup;
