import { LockKeyhole } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../utils/validation";

const BASE_URL = import.meta.env.VITE_API_URL;

const SecurityCard = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const changePassword = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      toast.error(
        "Password must contain 8+ characters, uppercase, lowercase, number and special character"
      );
      return;
    }
    try {
      if (form.newPassword !== form.confirmPassword) {
        return alert("Password do not match");
      }

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 lg:p-8">
      <div className="flex items-start gap-4 md:gap-5">
        <div className="min-w-12 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
          <LockKeyhole className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            Change Password
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
            UPDATE YOUR ACCOUNT PASSWORD
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 md:gap-8 mt-8 md:mt-10">
        <div className="w-full">
          <h1 className="font-medium mb-1 text-gray-600 text-sm">
            Current Password
          </h1>
          <input
            value={form.currentPassword}
            onChange={handleChange}
            name="currentPassword"
            className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"
            type="password"
            placeholder="Enter Current Password"
          />
        </div>

        <div className="w-full">
          <h1 className="font-medium mb-1 text-gray-600 text-sm">
            New Password
          </h1>
          <input
            value={form.newPassword}
            onChange={handleChange}
            name="newPassword"
            className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"
            type="password"
            placeholder="Enter New Password"
          />
        </div>

        <div className="w-full">
          <h1 className="font-medium mb-1 text-gray-600 text-sm">
            Confirm Password
          </h1>
          <input
            value={form.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"
            type="password"
            placeholder="Enter Confirm Password"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={changePassword}
          className="bg-orange-500 hover:bg-orange-600 inline-flex justify-center items-center gap-2 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 mt-7 md:mt-8"
        >
          <LockKeyhole className="w-5 h-5" />
          Update Password
        </button>
      </div>
    </div>
  );
};

export default SecurityCard;