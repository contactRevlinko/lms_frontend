import React, { useState, useEffect } from "react";
import { User, Plus } from "lucide-react";
import CustomDropDown from "./CustomDropDown";
import { useDispatch, useSelector } from "react-redux";
const BASE_URL = import.meta.env.VITE_API_URL;
import { fetchTeamList } from "../redux/teamSlice";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { validateEmail } from "../utils/validation";

const DEFAULT_ROLES = ["Sales Person", "Junior Sales", "Executive"];

const EditTeam = ({ editTeamData, setEditTeamData }) => {
  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);

  const dbRoles = teamList
    ? teamList.map((m) => m.role).filter(Boolean)
    : [];

  const [isCustom, setIsCustom] = useState(false);
  const [customRole, setCustomRole] = useState("");
  const [localCustomRoles, setLocalCustomRoles] = useState([]);
  const [hiddenDbRoles, setHiddenDbRoles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hiddenCustomRoles") || "[]");
    } catch {
      return [];
    }
  });

  const hideDbRole = (role) => {
    const updated = [...hiddenDbRoles, role];
    setHiddenDbRoles(updated);
    localStorage.setItem("hiddenCustomRoles", JSON.stringify(updated));
    if (form.role === role) setForm((f) => ({ ...f, role: "" }));
  };

  const visibleDbRoles = Array.from(
    new Set(dbRoles.filter((r) => !DEFAULT_ROLES.includes(r) && !hiddenDbRoles.includes(r)))
  );

  const [form, setForm] = useState({
    name: "",
    phone1: "",
    phone2: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (editTeamData) {
      setForm({
        name: editTeamData.name || "",
        phone1: editTeamData.phone1 || "",
        phone2: editTeamData.phone2 || "",
        email: editTeamData.email || "",
        role: editTeamData.role || "",
      });
    }
  }, [editTeamData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateTeam = async () => {
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/team/update-team/${editTeamData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result.message || "Failed to update team member");
        return;
      }
      toast.success("Team member updated successfully");
      setEditTeamData(null);
      dispatch(fetchTeamList());
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-3xl shadow-2xl relative p-6 md:p-8">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Edit Team Member
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Update details for {editTeamData?.name}
              </p>
            </div>

            <button
              onClick={() => setEditTeamData(null)}
              className="bg-indigo-100 text-indigo-700 font-medium w-10 h-10 hover:bg-indigo-200 rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="my-5 text-gray-600 w-full">
            <p className="text-sm mb-1.5 font-medium">Member Name</p>
            <div
              className={` ${form.name ? "bg-indigo-50 " : "bg-white "} flex border border-gray-300 gap-2 p-2.5 rounded-xl items-center`}
            >
              <User size={17} className="text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="outline-none w-full text-sm bg-transparent"
                name="name"
                placeholder="Enter full name"
              />
            </div>
          </div>

          <div className="mb-5 text-gray-600 w-full">
            <p className="text-sm mb-1 font-medium">Role</p>
            <CustomDropDown
              value={form.role}
              onChange={(value) => {
                if (value === "Add Custom Role...") {
                  setCustomRole("");
                  setForm({ ...form, role: "" });
                  setIsCustom(true);
                } else {
                  setIsCustom(false);
                  setForm({ ...form, role: value });
                }
              }}
              options={[
                "Add Custom Role...",
                ...DEFAULT_ROLES,
                ...visibleDbRoles.map((r) => ({
                  label: r,
                  value: r,
                  deletable: true,
                  onDelete: () => hideDbRole(r),
                })),
                ...localCustomRoles.map((r) => ({
                  label: r,
                  value: r,
                  deletable: true,
                  onDelete: () => {
                    setLocalCustomRoles((prev) => prev.filter((x) => x !== r));
                    if (form.role === r) setForm((f) => ({ ...f, role: "" }));
                  },
                })),
              ]}
            />

            {isCustom && (
              <div className="mt-3 flex gap-2 items-center">
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const trimmed = customRole.trim();
                      if (!trimmed) return;
                      setLocalCustomRoles((prev) => [...prev, trimmed]);
                      setForm({ ...form, role: trimmed });
                      setCustomRole("");
                      setIsCustom(false);
                    }
                  }}
                  placeholder="Enter custom role name"
                  autoFocus
                  className="outline-none flex-1 text-sm border border-gray-300 p-2.5 h-11 rounded-xl bg-indigo-50/20 focus:border-indigo-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = customRole.trim();
                    if (!trimmed) return;
                    setLocalCustomRoles((prev) => [...prev, trimmed]);
                    setForm({ ...form, role: trimmed });
                    setCustomRole("");
                    setIsCustom(false);
                  }}
                  className="h-11 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1.5 text-sm font-medium transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1 text-gray-600 font-medium">Work phone</p>
              <input
                className={`${form.phone1 ? "bg-indigo-50" : "bg-white"} outline-none w-full text-sm border border-gray-300 p-2.5 h-11 rounded-xl`}
                type="text"
                placeholder="Enter mobile number"
                value={form.phone1}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 10) value = value.slice(0, 10);
                  setForm({ ...form, phone1: value });
                }}
              />
            </div>

            <div>
              <p className="text-sm mb-1 text-gray-600 font-medium">Alternate phone</p>
              <input
                className={`${form.phone2 ? "bg-indigo-50" : "bg-white"} outline-none w-full text-sm border border-gray-300 p-2.5 h-11 rounded-xl`}
                type="text"
                placeholder="Enter mobile number"
                value={form.phone2}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 10) value = value.slice(0, 10);
                  setForm({ ...form, phone2: value });
                }}
              />
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm mb-1 text-gray-600 font-medium">Work Email</p>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="text"
                inputMode="email"
                placeholder="username@gmail.com"
                className={`${form.email ? "bg-indigo-50" : "bg-white"} outline-none w-full text-sm border border-gray-300 p-2.5 h-11 rounded-xl`}
              />
            </div>
          </div>

          <button
            onClick={handleUpdateTeam}
            className="w-full mt-6 py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98] cursor-pointer"
          >
            Update Team Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTeam;
