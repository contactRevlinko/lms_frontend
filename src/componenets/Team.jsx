import React, { useEffect, useState } from "react";
import AddTeam from "./AddTeam";
import CustomPopupDelete from "./CustomPopupDelete";
import { fetchTeamList, removeteamMember } from "../redux/teamSlice";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Users, KeyRound, X, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const Team = () => {

  const loginType = localStorage.getItem("loginType");

  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);

  const [openAddTeam, setOpenAddTeam] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const [passwordPopup, setPasswordPopup] = useState(false);
  const [passwordMemberId, setPasswordMemberId] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
  });

  useEffect(() => {
    dispatch(fetchTeamList());
  }, [dispatch]);

  const openChangePassword = (id) => {
    setPasswordMemberId(id);
    setPasswordPopup(true);
    setPasswordForm({
      newPassword: "",
    });
  };

  const handleChangePassword = async () => {
    if (!passwordForm.newPassword) {
      toast.error("New password is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/team/change-password/${passwordMemberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordForm),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.message || "Password change failed");
        return;
      }

      toast.success("Password changed successfully");
      setPasswordPopup(false);
      setPasswordMemberId("");
      setPasswordForm({
        newPassword: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/team/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        dispatch(removeteamMember(id));
        setDeletePopup(false);
        setSelectedId("");
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
            Team Member List
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Manage your team members and their roles
          </p>
        </div>

        <button
          onClick={() => setOpenAddTeam(true)}
          className="bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-2.5 rounded-xl font-medium transition"
        >
          + Team Member
        </button>
      </div>

      {/* Mobile */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 lg:hidden p-5">
        {teamList?.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-10 text-center shadow-sm">
            <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700">
              No Team Members Found
            </h3>
            <p className="text-gray-500 mt-2">
              Add your first team member to get started.
            </p>
          </div>
        ) : (
          teamList?.map((teamMem) => (
            <div
              key={teamMem._id}
              className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between">
                <h1 className="text-lg font-bold text-gray-900 capitalize">
                  {teamMem.name}
                </h1>

                <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                  {teamMem.role}
                </span>
              </div>

              <div className="space-y-3 text-sm mt-3">
                <div className="grid grid-cols-[110px_1fr] items-center">
                  <p className="text-gray-500">Work phone</p>
                  <p className="text-gray-700 font-medium">{teamMem.phone1}</p>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-center">
                  <p className="text-gray-500">Alternate phone</p>
                  <p className="text-gray-700 font-medium">
                    {teamMem.phone2 || "-"}
                  </p>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-center mb-3">
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-700 font-medium">{teamMem.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <button
                  onClick={() => openChangePassword(teamMem._id)}
                  className="w-full py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 active:scale-[0.98] transition flex justify-center items-center gap-2"
                >
                  <KeyRound size={15} />
                  Password
                </button>

                <button
                  onClick={() => {
                    setSelectedId(teamMem._id);
                    setDeletePopup(true);
                  }}
                  className="w-full py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 active:scale-[0.98] transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop */}
      {/* Desktop */}
      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm mt-8">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr className="text-left">
              {[
                "SR NO.",
                "NAME",
                "WORK PHONE",
                "ALTERNATE PHONE",
                "EMAIL",
                "ROLE",
                "CHANGE PASSWORD",
                "DELETE",
              ].map((head) => (
                <th
                  key={head}
                  className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {teamList?.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-16 text-slate-500">
                  <Users className="mx-auto mb-3 w-12 h-12 text-slate-400" />
                  <h3 className="text-xl font-semibold text-slate-700">
                    No Team Members Found
                  </h3>
                  <p className="mt-2 text-slate-500">
                    Add your first team member to get started.
                  </p>
                </td>
              </tr>
            ) : (
              teamList?.map((teamMem, i) => (
                <tr
                  key={teamMem._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-slate-700 font-medium">{i + 1}</td>
                  <td className="px-5 py-4 text-slate-700 font-medium">{teamMem.name}</td>
                  <td className="px-5 py-4 text-slate-600">{teamMem.phone1}</td>
                  <td className="px-5 py-4 text-slate-600">{teamMem.phone2 || "-"}</td>
                  <td className="px-5 py-4 text-slate-600">{teamMem.email}</td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                      {teamMem.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => openChangePassword(teamMem._id)}
                      className="text-indigo-600 bg-indigo-50 flex px-4 text-xs font-semibold justify-center items-center py-2 gap-2 border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <KeyRound size={14} />
                     Change Password
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => {
                        setSelectedId(teamMem._id);
                        setDeletePopup(true);
                      }}
                      className="w-9 h-9 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center shrink-0 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {passwordPopup && (
        <div className="fixed z-[9999] inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 p-6 relative">
            <button
              onClick={() => setPasswordPopup(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 w-9 h-9 rounded-lg flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-3">
                <KeyRound className="text-indigo-700" size={24} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Change Password
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Update password for this team member.
              </p>
            </div>

            {/* Current Password removed because Admin can reset it directly */}

            <div className="mb-5 relative">
              <p className="text-sm font-medium text-gray-600 mb-2">
                New Password
              </p>

              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-xl p-3 pr-11 text-sm outline-none focus:border-indigo-500"
              />

              {showNewPassword ? (
                <Eye
                  size={20}
                  onClick={() => setShowNewPassword(false)}
                  className="absolute right-3 top-[43px] text-gray-500 cursor-pointer"
                />
              ) : (
                <EyeOff
                  size={20}
                  onClick={() => setShowNewPassword(true)}
                  className="absolute right-3 top-[43px] text-gray-500 cursor-pointer"
                />
              )}
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium active:scale-[0.98] transition"
            >
              Change Password
            </button>
          </div>
        </div>
      )}

      {deletePopup && (
        <CustomPopupDelete
          onClose={() => setDeletePopup(false)}
          onDelete={() => handleDelete(selectedId)}
        />
      )}

      {openAddTeam && (
        <div className="fixed z-[9999] inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <AddTeam setOpenAddTeam={setOpenAddTeam} />
        </div>
      )}
    </div>
  );
};

export default Team;