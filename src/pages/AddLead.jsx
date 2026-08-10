import React, { useState, useEffect } from "react";
import { User, Phone, Mail, NotebookPen, X } from "lucide-react";
import CustomDropDown from "../componenets/CustomDropDown";
import axios from "axios";
import { fetchAllLead } from "../redux/allLeadSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamList } from "../redux/teamSlice";
import toast from "react-hot-toast";
import CustomCalendar from "../componenets/CustomCalender"
import { validateEmail } from "../utils/validation";

const BASE_URL = import.meta.env.VITE_API_URL;

const AddLead = ({ setAddLeadModal, addLeadModal, fetchStatusCount }) => {

  const loginType = localStorage.getItem("loginType");
  const teamMember = JSON.parse(localStorage.getItem("teamMember"));
  const isTeamLogin = loginType === "team";

  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);
  const [sources, setSources] = useState();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    status: "New",
    source: "Whatsapp",
    assignedTo: isTeamLogin ? teamMember?._id : "",
    notes: "",
    followUpDate: "",
  });

  useEffect(() => {
    dispatch(fetchTeamList());
  }, [dispatch]);

  useEffect(() => {
    if (addLeadModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addLeadModal]);

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

      await axios.post(`${BASE_URL}/leads/create-lead`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Lead added successfully");

      setForm({
        name: "",
        phone: "",
        email: "",
        status: "New",
        source: "Whatsapp",
        assignedTo: isTeamLogin ? teamMember?._id : "",
        notes: "",
        followUpDate: "",
      });

      dispatch(fetchAllLead());

      if (fetchStatusCount) {
        fetchStatusCount();
      }

      setAddLeadModal(false);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSources(res.data.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load sources");
      }
    };

    fetchSources();
    dispatch(fetchTeamList());
  }, [dispatch]);


  return (
    <div className="lg:w-[40%] xl:w-[35%] max-w-2xl w-[90%] m-auto">
      <div className="lg:p-10 md:p-8 p-5 bg-white rounded">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Create New Lead
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Add a high value prospect to your sales pipeline
            </p>
          </div>

          <button
            onClick={() => setAddLeadModal(false)}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="lg:flex gap-5 lg:w-full justify-between mt-2">

          <div className="w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Full Name</label>
            <div
              className="flex items-center border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 gap-3 px-3.5 py-2.5 rounded-lg transition-all"
            >
              <User size={16} className="text-slate-400" />
              <input
                className="outline-none w-full text-sm bg-transparent text-slate-700 placeholder:text-slate-400"
                placeholder="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="w-full mt-4 lg:mt-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Email Address</label>
            <div
              className="flex items-center border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 gap-3 px-3.5 py-2.5 rounded-lg transition-all"
            >
              <Mail size={16} className="text-slate-400" />
              <input
                className="outline-none w-full text-sm bg-transparent text-slate-700 placeholder:text-slate-400"
                type="text"
                name="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

        </div>

        <div className="w-full mt-5 mb-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Mobile Number</label>

          <div
            className="flex items-center border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 gap-3 px-3.5 py-2.5 rounded-lg transition-all"
          >
            <Phone size={16} className="text-slate-400" />

            <input
              className="outline-none w-full text-sm bg-transparent text-slate-700 placeholder:text-slate-400"
              type="text"
              name="phone"
              placeholder="Mobile number"
              value={form.phone}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");


                if (value.startsWith("91") && value.length > 10) {
                  toast.error("Please enter 10 digit number without +91");
                  value = value.substring(2);
                }

                if (value.length > 10) {
                  toast.error("Only 10 digits allowed ");
                }

                setForm((prev) => ({
                  ...prev,
                  phone: value.slice(0, 10),
                }));
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lead Details</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Status</label>
            <CustomDropDown
              value={form.status}
              onChange={(value) => setForm({ ...form, status: value })}
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
          {!isTeamLogin && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Assigned To</label>
              <CustomDropDown
                value={teamList.find((team) => team._id === form.assignedTo)?.name || ""}
                onChange={(id) =>
                  setForm((prev) => ({ ...prev, assignedTo: id }))
                }
                options={teamList.map((teamMem) => ({
                  label: teamMem.name,
                  value: teamMem._id,
                }))}
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Source</label>
            <CustomDropDown
              value={form.source}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, source: value }))
              }
              options={sources?.map((s) => s.name) || []}
            />
          </div>
        </div>




        <div className="mt-8">
          <button
            className="w-full h-12 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
            onClick={handleSubmit}
          >
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLead;