import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, TrendingUp, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { validateEmail, validatePassword } from "../utils/validation";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const gradient = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Password must contain 8+ characters, uppercase, lowercase, number and special character");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("loginType", result.user.loginType || "admin");
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.removeItem("teamMember");
        navigate("/dashboard", { replace: true });
      } else {
        if (result.paymentRequired) {
          toast.error("Please complete payment first");
          navigate("/pricing", {
            replace: true,
            state: { userId: result.user._id, name: result.user.name, email: result.user.email, phone: result.user.phone },
          });
          return;
        }
        toast.error(result.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)" }}
      >
        {/* Background decorative circles */}
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
        </div>

        {/* Center content */}
        <div className="z-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Manage your leads<br />smarter & faster
          </h2>
          <p className="text-indigo-200 text-base mb-8 leading-relaxed">
            Access your dashboard, track customer interactions,<br />and grow your business with confidence.
          </p>
          <div className="flex flex-col gap-3">
            {["Real-time lead tracking", "Team collaboration tools", "Advanced analytics & reports"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-indigo-300 shrink-0" />
                <span className="text-indigo-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="text-indigo-300 text-xs z-10">© 2026 LeadScale Systems Inc. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col" style={{ background: "#f8fafc" }}>

        {/* Mobile gradient header */}
        <div
          className="lg:hidden flex flex-col items-center justify-center pt-12 pb-8 px-6 relative overflow-hidden"
          style={{ background: gradient }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 border border-white/20">
            <TrendingUp className="text-white" size={22} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">LMS</span>
          </div>
          <p className="text-indigo-200 text-xs mt-2">Sign in to access your dashboard</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span className="text-indigo-200">Don't have an account?</span>
            <button onClick={() => navigate("/register")} className="text-white font-semibold underline underline-offset-2">
              Create Account
            </button>
          </div>
        </div>

        {/* Desktop top nav */}
        <div className="hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={20} />
            <span className="text-indigo-600 font-bold text-xl">LMS</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
                <p className="text-sm text-gray-500">Sign in to continue to your dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${email ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                    <Mail size={16} className="text-gray-400 shrink-0" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="username@company.com"
                      name="user_name_45"
                      autoComplete="off"
                      autoCorrect="off"
                      className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${password ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                    <Lock size={16} className="text-gray-400 shrink-0" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 shrink-0">
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  <div className="text-right mt-1.5">
                    <Link to="/forgot-password" className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: loading ? "#818cf8" : gradient }}
                >
                  {loading ? "Signing in..." : (<><span>Sign In</span><ArrowRight size={16} /></>)}
                </button>
                <div className="text-center mt-2">
                  <Link to="/team-login" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                    Are you a Team Member? Login here
                  </Link>
                </div>
              </form>
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

export default Login;
