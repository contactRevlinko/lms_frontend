import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Bell,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Search,
  Clock,
  DollarSign,
  Zap,
  Smartphone,
  Star,
  Menu,
  X,
  Send,
  Table,
  LayoutGrid,
  PhoneCall,
  Share2,
  PieChart,
  UserCheck,
  Check,
  ChevronRight,
  Award,
  User,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("leads"); // 'leads' | 'profile' | 'reminders' | 'analytics'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    contactEmail: "support@lmssoftware.com",
    contactPhone: "+91 98765 43210",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchSettings = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL || "/api";
        const res = await fetch(`${BASE_URL}/super-admin/website-settings`);
        const data = await res.json();
        if (data.success && data.data) {
          setContactInfo({
            contactEmail: data.data.contactEmail || "support@lmssoftware.com",
            contactPhone: data.data.contactPhone || "+91 98765 43210",
          });
        }
      } catch (err) {
        console.error("Failed to load website contact settings", err);
      }
    };
    fetchSettings();
  }, []);

  // Demo form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    businessName: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setSubmitting(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${BASE_URL}/super-admin/demo-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Thank you! Your demo request has been submitted successfully.");
        setFormData({
          name: "",
          phone: "",
          email: "",
          businessName: "",
          message: "",
        });
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <TrendingUp className="text-white" size={22} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900">LMS</span>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider -mt-0.5">
                Leads Management System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection("dashboard")}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("solutions")}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Why LMS
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Book Demo
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-lg">
            <div className="flex flex-col gap-3 text-base font-semibold text-slate-700">
              <button
                onClick={() => scrollToSection("dashboard")}
                className="text-left py-2 hover:text-indigo-600"
              >
                Dashboard
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left py-2 hover:text-indigo-600"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("solutions")}
                className="text-left py-2 hover:text-indigo-600"
              >
                Why LMS
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left py-2 hover:text-indigo-600"
              >
                Book a Demo
              </button>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                {isLoggedIn ? (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full text-center py-3 rounded-xl font-bold bg-indigo-600 text-white"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full text-center py-2.5 rounded-xl font-semibold border border-slate-200 text-slate-700"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="w-full text-center py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-md"
                    >
                      Start Free Trial
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section className="pt-14 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles size={14} className="text-indigo-600" />
          <span>Simple · Fast · Reliable Leads Software</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
          Manage, Track and Close Leads{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Faster Than Ever
          </span>
        </h1>

        {/* Subheadline - Clear and straightforward */}
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          The all-in-one CRM built for growing sales teams. Capture incoming leads, schedule follow-up
          reminders, contact clients on WhatsApp in one click, and never lose a deal again.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2"
          >
            <span>Start Free Trial</span>
            <ArrowRight size={17} />
          </Link>
          <button
            onClick={() => scrollToSection("contact")}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar size={17} className="text-indigo-600" />
            <span>Book a Demo</span>
          </button>
        </div>

        {/* Quick Trust Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>10,000+ Leads Managed Daily</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Quick 2-Minute Setup</span>
          </div>
        </div>

        {/* ── LIVE DASHBOARD PREVIEW (COMMAND CENTER) ── */}
        <div id="dashboard" className="mt-12 relative max-w-5xl mx-auto text-left">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7">
            {/* Mockup Header */}
            <div className="flex flex-wrap items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Welcome back!</span>
                 
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">Here's what needs your attention today.</p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-indigo-600" />
                  <span>Analytics</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span>+ Add Lead</span>
                </span>
              </div>
            </div>

            {/* 4 Metric Cards (Matching App CRM) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Users size={17} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Leads Today</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">48</p>
              </div>

              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <PhoneCall size={17} />
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Scheduled</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Follow-Ups</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">12</p>
              </div>

              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Award size={17} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Closed</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Won Today</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">7</p>
              </div>

              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <TrendingUp size={17} />
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Total</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pipeline</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">142</p>
              </div>
            </div>

            {/* Bottom 2 Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <PhoneCall size={15} className="text-amber-500" />
                    Needs Action Today
                  </span>
                  <span className="text-indigo-600 hover:underline cursor-pointer">View all</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Rahul Sharma · TechCorp</p>
                      <p className="text-[11px] text-slate-500">Scheduled demo call at 3:30 PM</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">In Followup</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Priya Patel · SolarGrid</p>
                      <p className="text-[11px] text-slate-500">Send updated pricing quote</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Interested</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Zap size={15} className="text-indigo-600" />
                    Newest Leads (Speed to Lead)
                  </span>
                  <span className="text-indigo-600 hover:underline cursor-pointer">View all</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Amit Verma</p>
                      <p className="text-[11px] text-slate-500">Facebook Ads · 2 mins ago</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">Hot Lead</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Neha Sengupta</p>
                      <p className="text-[11px] text-slate-500">Google Search · 8 mins ago</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">New</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES (Clean & Clear, No Fluff) ── */}
      <section id="features" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything Your Sales Team Needs to Win
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Simple tools designed to solve real daily sales bottlenecks without confusing settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 font-bold">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">All Leads Management</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Global search across names, phone numbers, and emails. Toggle between clean Table View and visual Card View with 6 standard status stages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-bold">
                <MessageSquare size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">1-Click WhatsApp & Calling</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No manual dialing. Connect with fresh leads directly from the app via WhatsApp or instant phone call while interest is hot.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold">
                <Bell size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">Daily Follow-up Reminders</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Never forget a client callback. Today's follow-up list alerts reps on time with inline 1-click status update and rescheduling.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 font-bold">
                <Share2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">Lead Source Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Track where each prospect comes from — Facebook Ads, Google Ads, website inquiry forms, or referrals — to invest where you get results.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 font-bold">
                <UserCheck size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">Team Roles & Routing</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Separate Admin control from sales reps. Assign leads to specific team members and maintain secure role-based privacy.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 font-bold">
                <PieChart size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">CPL & Deal ROI Analytics</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Know your exact Cost-Per-Lead (CPL) and return on closed deals with automatic daily performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE APP TOUR (Tabbed & Clean) ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            See How Simple It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Click through the tabs below to preview the core workflow inside LMS.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "leads", label: "All Leads Table", icon: Table },
            { id: "reminders", label: "Today's Reminders", icon: Bell },
            { id: "analytics", label: "ROI Analytics", icon: BarChart3 },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <IconComponent size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-7 min-h-[300px]">
          {activeTab === "leads" && (
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs text-slate-500 font-medium">
                <span>Showing recent registered leads</span>
                <span className="font-bold text-indigo-600 hidden md:inline">Table View Active</span>
                <span className="font-bold text-indigo-600 md:hidden">Card View Active</span>
              </div>

              {/* ── DESKTOP: Original Table View (Shown on screens >= 768px) ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Lead Name</th>
                      <th className="py-2.5 px-3">Contact</th>
                      <th className="py-2.5 px-3">Source</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-900">Vikram Singhania</td>
                      <td className="py-3 px-3">+91 98765 43210</td>
                      <td className="py-3 px-3 text-indigo-600 font-semibold">Facebook Ads</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Interested
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toast.success("Calling Vikram Singhania...")}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
                            title="Call Lead"
                          >
                            <Phone size={13} />
                          </button>
                          <button
                            onClick={() => toast.success("WhatsApp chat opened with Vikram...")}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors cursor-pointer"
                            title="WhatsApp Chat"
                          >
                            <MessageSquare size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-900">Ananya Deshmukh</td>
                      <td className="py-3 px-3">+91 99887 76655</td>
                      <td className="py-3 px-3 text-purple-600 font-semibold">Google Search</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          In Followup
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toast.success("Calling Ananya Deshmukh...")}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
                            title="Call Lead"
                          >
                            <Phone size={13} />
                          </button>
                          <button
                            onClick={() => toast.success("WhatsApp chat opened with Ananya...")}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors cursor-pointer"
                            title="WhatsApp Chat"
                          >
                            <MessageSquare size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-900">Rajesh Malhotra</td>
                      <td className="py-3 px-3">+91 91234 56789</td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">Direct Referral</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          New
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toast.success("Calling Rajesh Malhotra...")}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
                            title="Call Lead"
                          >
                            <Phone size={13} />
                          </button>
                          <button
                            onClick={() => toast.success("WhatsApp chat opened with Rajesh...")}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors cursor-pointer"
                            title="WhatsApp Chat"
                          >
                            <MessageSquare size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ── MOBILE: Card View (Shown on screens < 768px to avoid table overflow) ── */}
              <div className="md:hidden space-y-3">
                {[
                  {
                    id: 1,
                    name: "Vikram Singhania",
                    initials: "VS",
                    avatarBg: "bg-indigo-600",
                    company: "Zenith Retailers",
                    phone: "+91 98765 43210",
                    source: "Facebook Ads",
                    sourceColor: "bg-blue-50 text-blue-700 border-blue-200/60",
                    status: "Interested",
                    statusColor: "bg-emerald-100 text-emerald-800",
                    time: "10m ago",
                  },
                  {
                    id: 2,
                    name: "Ananya Deshmukh",
                    initials: "AD",
                    avatarBg: "bg-purple-600",
                    company: "Deshmukh Agro",
                    phone: "+91 99887 76655",
                    source: "Google Search",
                    sourceColor: "bg-purple-50 text-purple-700 border-purple-200/60",
                    status: "In Followup",
                    statusColor: "bg-amber-100 text-amber-800",
                    time: "25m ago",
                  },
                  {
                    id: 3,
                    name: "Rajesh Malhotra",
                    initials: "RM",
                    avatarBg: "bg-emerald-600",
                    company: "Apex Tech Labs",
                    phone: "+91 91234 56789",
                    source: "Direct Referral",
                    sourceColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
                    status: "New",
                    statusColor: "bg-indigo-100 text-indigo-800",
                    time: "1h ago",
                  },
                ].map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Top: Avatar, Name & Status */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg ${lead.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {lead.initials}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{lead.name}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{lead.company}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${lead.statusColor}`}>
                          {lead.status}
                        </span>
                      </div>

                      {/* Contact details */}
                      <div className="space-y-1.5 mb-2.5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium text-[11px]">
                          <Phone size={11} className="text-slate-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${lead.sourceColor}`}>
                            {lead.source}
                          </span>
                          <span className="text-[10px] text-slate-400">{lead.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-500">{lead.phone}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toast.success(`Calling ${lead.name}...`)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          title="Call"
                        >
                          <Phone size={12} />
                          <span>Call</span>
                        </button>
                        <button
                          onClick={() => toast.success(`WhatsApp chat with ${lead.name}...`)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          title="WhatsApp"
                        >
                          <MessageSquare size={12} />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reminders" && (
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-800">Today's Active Follow-Up Queue</span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                  3 Due Today
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                      <Clock size={15} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Rahul Sharma · TechCorp India</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Scheduled callback to finalize customized quote</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                        Due Today at 3:30 PM
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast.success("Dialing Rahul Sharma...")}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Phone size={12} /> Call
                    </button>
                    <button
                      onClick={() => toast.success("Marked follow-up as completed")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs cursor-pointer"
                    >
                      Done ✓
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                      <MessageSquare size={15} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Priya Patel · SolarGrid Energy</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Send feature comparison PDF via WhatsApp</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                        Due Today at 4:15 PM
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast.success("Opening WhatsApp chat...")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare size={12} /> WhatsApp
                    </button>
                    <button
                      onClick={() => toast.success("Marked follow-up as completed")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs cursor-pointer"
                    >
                      Done ✓
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                      <Calendar size={15} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Siddharth Oberoi · Apex Hardware</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Contract renewal and payment link discussion</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded">
                        Due Today at 5:00 PM
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast.success("Dialing Siddharth Oberoi...")}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Phone size={12} /> Call
                    </button>
                    <button
                      onClick={() => toast.success("Marked follow-up as completed")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs cursor-pointer"
                    >
                      Done ✓
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-4 text-left">
              {/* Top 3 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Average Cost-Per-Lead (CPL)</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">₹142.50</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">↓ 18% lower than industry avg</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Return on Ad Spend (ROI)</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">480%</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">₹4.80 earned per ₹1 spent</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Lead-to-Win Conversion</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">24.6%</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">Top rep conversion rate</p>
                </div>
              </div>

              {/* Channel Performance Breakdown Strip */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                <div className="flex items-center justify-between mb-2.5 text-xs font-bold text-slate-800">
                  <span>Channel Conversion Breakdown</span>
                  <span className="text-indigo-600 text-[11px]">This Month</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Facebook Ads</span>
                      <span className="text-indigo-600">324 Leads</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">CPL: ₹125 · Win Rate: 28%</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Google Search</span>
                      <span className="text-purple-600">210 Leads</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">CPL: ₹168 · Win Rate: 32%</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Direct Referrals</span>
                      <span className="text-emerald-600">98 Leads</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">CPL: ₹0 · Win Rate: 44%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE LMS (SEAMLESS LIGHT SAAS SECTION) ── */}
      <section id="solutions" className="py-20 bg-slate-50/70 text-slate-800 relative overflow-hidden border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200/60">
            <Sparkles size={13} className="text-indigo-600" />
            <span>Built for High Performance</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Why Growing Sales Teams Choose LMS
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12">
            Engineered to eliminate lost callbacks, manual dialing bottlenecks, and messy spreadsheets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all group shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-indigo-100/80 transition-all">
                <Smartphone size={22} />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Mobile First</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect on WhatsApp, log calls, and update deal stages from anywhere on iOS, Android, or tablet.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all group shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-amber-100/80 transition-all">
                <Zap size={22} />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Instant Lead Alerts</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive sub-second notifications the moment a prospect fills your Facebook or Google ad form.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all group shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-emerald-100/80 transition-all">
                <Shield size={22} />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Role Permissions</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enterprise data confidentiality. Sales reps only see their own assigned leads; admins control everything.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-md transition-all group shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-purple-100/80 transition-all">
                <TrendingUp size={22} />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Fast Performance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant search across 50,000+ leads in milliseconds with lightning-fast filters and zero page lag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA & BOOK A DEMO (ELEVATED MODERN SAAS SHOWCASE) ── */}
      <section id="contact" className="py-24 bg-[#f8fafc] text-slate-800 relative overflow-hidden border-t border-slate-200/80">
        {/* Subtle Decorative Background Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-24 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 shadow-xs text-xs font-bold text-indigo-700">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                <span>Ready to Scale Your Sales Pipeline?</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tight leading-[1.18]">
                Turn Every Lead Into a{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
                  Paying Customer
                </span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg">
                Stop losing deals to slow follow-ups. Start your 14-day free trial or request a quick 10-minute walkthrough tailored to your sales process.
              </p>

              {/* Enhanced Benefit Cards */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/90 border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Check size={16} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Zero Setup Hassle</h5>
                    <p className="text-[11px] text-slate-500">Go live in under 2 minutes with no technical configuration needed.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/90 border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Check size={16} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Free Data & Lead Migration</h5>
                    <p className="text-[11px] text-slate-500">Seamlessly import your existing Excel or CSV lead databases.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/90 border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Check size={16} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Direct WhatsApp & Call Support</h5>
                    <p className="text-[11px] text-slate-500">Dedicated manager for instant answers whenever your team needs assistance.</p>
                  </div>
                </div>
              </div>

              {/* Call to Actions & Trust Guarantee */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-wrap items-center gap-3.5">
                  <Link
                    to="/register"
                    className="px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Start 14-Day Free Trial</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3.5 rounded-xl font-semibold bg-white hover:bg-slate-50 text-slate-800 text-sm border border-slate-300 shadow-xs transition-all"
                  >
                    Sign In to CRM
                  </Link>
                </div>
                <p className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 font-medium pt-1">
                  <span><strong className="text-emerald-600">✓</strong> No credit card required</span>
                  <span><strong className="text-emerald-600">✓</strong> Instant setup</span>
                  <span><strong className="text-emerald-600">✓</strong> Cancel anytime</span>
                </p>
              </div>
            </div>

            {/* Right Column: High-End Demo Card with Glowing Backdrop */}
            <div className="lg:col-span-6 relative">
              {/* Soft ambient glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-purple-500/10 rounded-3xl blur-xl opacity-80" />

              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200/90">
                <div className="flex items-start justify-between mb-5 pb-4 border-b border-slate-100">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-[10px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-200/60 mb-1.5">
                      <Sparkles size={11} className="text-indigo-600" />
                      <span>Free Walkthrough</span>
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Book a Quick Demo</h3>
                    <p className="text-xs text-slate-500 mt-0.5">We'll show you how LMS boosts your sales in 10 minutes.</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                    <Calendar size={18} />
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-slate-800 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-slate-800 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="vikram@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-slate-800 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Acme Enterprises"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-slate-800 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Requirements (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Tell us what you're looking for..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-slate-800 resize-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 group"
                  >
                    {submitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <span>Submit Demo Request</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <Shield size={12} className="text-emerald-500" />
                    <span>100% Privacy Guaranteed. Zero spam policy.</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODERN ENTERPRISE SAAS FOOTER (LIGHT THEME) ── */}
      <footer className="bg-white text-slate-600 border-t border-slate-200/90 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/80">
            {/* Column 1 & 2: Brand & Description (Span 2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
                  <TrendingUp className="text-white" size={22} />
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tight text-slate-900">LMS</span>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider -mt-0.5">
                    Leads Management Software
                  </p>
                </div>
              </Link>

              <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
                The smart CRM engineered for modern sales teams. Automate follow-ups, connect on WhatsApp in 1 click, track lead sources, and boost conversion rates.
              </p>

              {/* Direct Contact Badges (Dynamic from Super Admin, no timing) */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700 font-medium">
                  <Mail size={14} className="text-indigo-600 shrink-0" />
                  <a href={`mailto:${contactInfo.contactEmail}`} className="hover:text-indigo-600 transition-colors">
                    {contactInfo.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700 font-medium">
                  <Phone size={14} className="text-indigo-600 shrink-0" />
                  <a href={`tel:${contactInfo.contactPhone.replace(/\s+/g, '')}`} className="hover:text-indigo-600 transition-colors">
                    {contactInfo.contactPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Features */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Core Features</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li>
                  <button onClick={() => scrollToSection("dashboard")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Command Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("features")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    All Leads Pipeline
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("features")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    1-Click WhatsApp & Call
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("features")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Daily Follow-up Reminders
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("features")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Lead Source Tracking
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("features")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    CPL & ROI Analytics
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Portals & Navigation */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Portals & Access</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li>
                  <Link to="/login" className="hover:text-indigo-600 transition-colors">
                    Admin Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/team-login" className="hover:text-indigo-600 transition-colors">
                    Sales Team Portal
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-indigo-600 transition-colors">
                    Start Free Trial (14 Days)
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contact")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Book Personalized Demo
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("solutions")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Why Choose LMS
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Trust & Guarantee */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Trust & Security</h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Shield size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                  <span>Role-based access & strict data encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles size={15} className="text-purple-600 shrink-0 mt-0.5" />
                  <span>Lead import & migration assistance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} LMS — Leads Management Software. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-5">
              <span className="hover:text-slate-900 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-900 transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-900 transition-colors cursor-pointer">Security Overview</span>
              <span className="hover:text-slate-900 transition-colors cursor-pointer">Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
