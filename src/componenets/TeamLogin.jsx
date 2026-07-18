import React, { useState } from "react";
import { Eye, EyeOff, TrendingUp, Mail, Lock, ArrowRight, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const TeamLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Email and password required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/team/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result.message || "Login failed");
        return;
      }
      localStorage.setItem("token", result.token);
      localStorage.setItem("loginType", "team");
      localStorage.setItem("teamMember", JSON.stringify(result.data));
      localStorage.removeItem("user");
      toast.success("Team login successful");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const gradient = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)";

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: gradient }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-white" size={22} />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">LMS</span>
          <span className="text-xs text-indigo-200 bg-white/10 px-2 py-0.5 rounded-full border border-white/20 ml-1">
            Team Portal
          </span>
        </div>

        {/* Content */}
        <div className="z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
            <Users className="text-indigo-200" size={30} />
          </div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Welcome to your<br />Team Portal
          </h2>
          <p className="text-indigo-200 text-base mb-8 leading-relaxed">
            Access your assigned leads, track follow-ups,<br />and collaborate with your team effortlessly.
          </p>
          <div className="flex flex-col gap-3">
            {["View and manage assigned leads", "Track follow-up schedules", "Real-time team collaboration"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-indigo-300 shrink-0" />
                <span className="text-indigo-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-xs z-10">© 2026 LeadScale Systems Inc. All rights reserved.</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col" style={{ background: "#f8fafc" }}>

        {/* Mobile gradient header */}
        <div
          className="lg:hidden flex flex-col items-center justify-center pt-12 pb-8 px-6 relative overflow-hidden"
          style={{ background: gradient }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 border border-white/20">
            <Users className="text-white" size={22} />
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-white" size={18} />
            <span className="text-white font-bold text-lg">LMS</span>
            <span className="text-xs text-indigo-200 bg-white/15 px-2 py-0.5 rounded-full border border-white/20">Team Portal</span>
          </div>
          <p className="text-indigo-200 text-xs mt-2">Sign in to access your assigned leads</p>
        </div>

        {/* Desktop top nav */}
        <div className="hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
          <div className="ml-auto text-sm text-gray-500">
            Admin login?{" "}
            <button onClick={() => navigate("/login")} className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Go to Login
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

              {/* Desktop icon badge */}
              <div className="hidden lg:flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #eef2ff, #ede9fe)" }}>
                  <Users className="text-indigo-600" size={26} />
                </div>
              </div>

              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Team Login</h1>
                <p className="text-sm text-gray-500">Sign in with your team credentials</p>
              </div>

              <div className="flex flex-col gap-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${form.email ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                    <Mail size={16} className="text-gray-400 shrink-0" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${form.password ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                    <Lock size={16} className="text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                      className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 shrink-0">
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                  style={{ background: loading ? "#818cf8" : gradient }}
                >
                  {loading ? "Signing in..." : (<><span>Sign In</span><ArrowRight size={16} /></>)}
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              © 2026 LeadScale Systems Inc. &nbsp;·&nbsp;
              <span className="hover:text-indigo-500 cursor-pointer">Privacy</span> &nbsp;·&nbsp;
              <span className="hover:text-indigo-500 cursor-pointer">Terms</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLogin;