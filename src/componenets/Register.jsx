import React, { useState } from "react";
import { useNavigate } from "react-router";
import CustomDropDown from "./CustomDropDown";
import { Eye, EyeOff, TrendingUp, User, Phone, Mail, Lock, ArrowRight, CheckCircle, MoveRight } from "lucide-react";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../utils/validation";

const BASE_URL = import.meta.env.VITE_API_URL;

const businessTypes = [
  "Wholesaler", "Retailer", "Distributor", "Manufacturer", "Supplier", "Trader",
  "Importer", "Exporter", "Dealer", "Service Provider", "Agency", "Franchise",
  "Consultant", "Freelancer", "Startup", "other",
];

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const gradient = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)";
  const [isCustomBusiness, setIsCustomBusiness] = useState(false);
  const [customBusiness, setCustomBusiness] = useState("");
  const [localCustomBusinessTypes, setLocalCustomBusinessTypes] = useState([]);


  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) { toast.error("Please enter a valid email address"); return; }
    if (!validatePassword(password)) { toast.error("Password must contain 8+ characters, uppercase, lowercase, number and special character"); return; }
    if (!agree) { toast.error("Please agree to Terms of Service and Privacy Policy"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name, phone, email, businessType, password }),
      });
      const result = await res.json();
      if (result.success) {
        if (result.data.paymentVerified) navigate("/login");
        else navigate("/pricing", { state: { userId: result.data._id, name: result.data.name, email: result.data.email, phone: result.data.phone } });
      } else {
        toast.error(result.message || "Registration failed");
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
      {/* Left Branding Panel */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-white" size={22} />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">LMS</span>
        </div>

        <div className="z-10">
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Start managing your<br />leads today
          </h2>
          <p className="text-indigo-200 text-sm mb-8 leading-relaxed">
            Join thousands of businesses streamlining<br />their workflow and boosting productivity.
          </p>
          <div className="flex flex-col gap-3">
            {["Free to get started", "No credit card required", "Cancel anytime"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-indigo-300 shrink-0" />
                <span className="text-indigo-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-xs z-10">© 2026 LeadScale Systems Inc. All rights reserved.</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: "#f8fafc" }}>

        {/* Mobile gradient header */}
        <div
          className="lg:hidden flex flex-col items-center justify-center pt-8 pb-6 px-6 relative overflow-hidden"
          style={{ background: gradient }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2.5 border border-white/20">
            <TrendingUp className="text-white" size={20} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">LMS</span>
          </div>
          <p className="text-indigo-200 text-xs mt-1">Create your free account</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="text-indigo-200">Already have an account?</span>
            <button onClick={() => navigate("/login")} className="text-white font-semibold underline underline-offset-2">
              Log In
            </button>
          </div>
        </div>

        {/* Desktop top nav */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={20} />
            <span className="text-indigo-600 font-bold text-xl">LMS</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Log In
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-4 py-5">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
                <p className="text-sm text-gray-500">Fill in the details below to get started</p>
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${name ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                    <User size={15} className="text-gray-400 shrink-0" />
                    <input value={name} onChange={(e) => setName(e.target.value)}
                      type="text" placeholder="Enter your full name"
                      name="user_name_239" autoComplete="off" autoCorrect="off"
                      className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${phone ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                    <Phone size={15} className="text-gray-400 shrink-0" />
                    <input value={phone}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length > 10) { toast.error("Only 10 digits allowed"); return; }
                        setPhone(v);
                      }}
                      type="text" placeholder="10-digit mobile number"
                      name="field_839202" autoComplete="new-password" autoCorrect="off"
                      className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${email ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                    <Mail size={15} className="text-gray-400 shrink-0" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)}
                      type="email" placeholder="username@company.com"
                      name="user_email_@233" autoComplete="new-password" autoCorrect="off"
                      className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${password ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                    <Lock size={15} className="text-gray-400 shrink-0" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 chars, upper, lower, number, symbol"
                      className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 shrink-0">
                      {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>

                {/* Business Type — same pattern as Role in AddTeam */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Type</label>
                  <CustomDropDown value={businessType} options={businessTypes} onChange={setBusinessType} />
                  {isCustomBusiness && (
                    <div className="mt-2 flex gap-2 items-center">
                      <input
                        type="text"
                        value={customBusiness}
                        onChange={(e) => setCustomBusiness(e.target.value)}
                        placeholder="Enter business type"
                        className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = customBusiness.trim();
                          if (!trimmed) return;
                          if (!localCustomBusinessTypes.includes(trimmed)) {
                            setLocalCustomBusinessTypes((prev) => [...prev, trimmed]);
                          }
                          setBusinessType(trimmed);
                          setIsCustomBusiness(false);
                          setCustomBusiness("");
                        }}
                        className="px-3 py-2 rounded-xl text-white text-sm font-medium"
                        style={{ background: gradient }}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Agree */}
                <div className="flex items-start gap-2">
                  <button type="button" onClick={() => setAgree(!agree)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-all ${agree ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"}`}
                  >
                    {agree && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </button>
                  <p className="text-sm text-gray-500 leading-snug">
                    I agree to the{" "}
                    <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Terms of Service</span>{" "}and{" "}
                    <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>
                  </p>
                </div>


                {/* Submit */}
                <button
                  type="submit"
                  disabled={!agree || loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-white text-sm mt-1.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: agree && !loading ? gradient : "#9ca3af" }}
                >
                  {loading ? "Creating account..." : (<><span>Create your account</span><ArrowRight size={16} /></>)}
                </button>


              </form>
            </div>

            <p className="text-center text-xs text-gray-400 mt-2">
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

export default Register;
