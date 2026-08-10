import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import { 
  Users, CheckCircle, TrendingUp, Calendar, PhoneCall, 
  Plus, BarChart2, Activity, ChevronRight, UserPlus
} from "lucide-react";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";

const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allLeads } = useSelector((state) => state.lead);

  const [followups, setFollowups] = useState([]);
  
  // Try to get user info for personalized greeting
  const loginType = localStorage.getItem("loginType");
  const loggedUser = loginType === "team"
    ? JSON.parse(localStorage.getItem("teamMember") || "{}")
    : JSON.parse(localStorage.getItem("user") || "{}");

  const fetchTodaysFo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/followups/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setFollowups(result.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTodaysFo();
    dispatch(fetchAllLead());
  }, [dispatch]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let leadsToday = 0;
    let wonToday = 0;
    let totalActive = 0;

    allLeads.forEach((lead) => {
      const leadDate = new Date(lead.createdAt);
      if (leadDate >= today) {
        leadsToday++;
      }
      
      if (lead.status === "Won" || lead.status === "Closed Won") {
        const updateDate = new Date(lead.updatedAt || lead.createdAt);
        if (updateDate >= today) wonToday++;
      }

      if (!["Won", "Lost", "Closed Won", "Closed Lost", "Cold"].includes(lead.status)) {
        totalActive++;
      }
    });

    return { leadsToday, wonToday, totalActive };
  }, [allLeads]);

  // Recent 5 leads
  const recentLeads = useMemo(() => {
    return [...allLeads]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [allLeads]);

  const formatTime = (time) => {
    if (!time) return "No Time";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  return (
    <div className="w-full">
      
      {/* HEADER SECTION */}
      <div className="mb-5 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Welcome back, {loggedUser?.name ? loggedUser.name.split(' ')[0] : 'Team'}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what needs your attention today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/analytics"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-sm"
          >
            <BarChart2 size={16} className="text-indigo-600" />
            Analytics
          </Link>
          <Link 
            to="/add-lead"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus size={16} />
            Add Lead
          </Link>
        </div>
      </div>

      {/* 4 MINI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-5 md:mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative p-4 md:p-5 border-l-4 border-l-blue-500">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 md:mb-4">
            <UserPlus size={18} className="md:w-5 md:h-5" />
          </div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400">Leads Today</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{metrics.leadsToday}</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative p-4 md:p-5 border-l-4 border-l-orange-500">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2 md:mb-4">
            <PhoneCall size={18} className="md:w-5 md:h-5" />
          </div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400">Follow-Ups</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{followups.length}</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative p-4 md:p-5 border-l-4 border-l-green-500">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-2 md:mb-4">
            <CheckCircle size={18} className="md:w-5 md:h-5" />
          </div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400">Won Today</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{metrics.wonToday}</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative p-4 md:p-5 border-l-4 border-l-indigo-500">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 md:mb-4">
            <Activity size={18} className="md:w-5 md:h-5" />
          </div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400">Pipeline</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{metrics.totalActive}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        
        {/* FOLLOW-UPS DUE TODAY SECTION */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[380px] md:h-[500px]">
          <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PhoneCall size={18} className="text-orange-500" />
              Needs Action Today
            </h3>
            <Link to="/reminders" className="text-sm font-semibold text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {followups.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-slate-300" size={32} />
                </div>
                <p className="font-semibold text-slate-700">All caught up!</p>
                <p className="text-sm text-slate-500 mt-1">No follow-ups scheduled for today.</p>
              </div>
            ) : (
              followups.map((follow, idx) => (
                <div 
                  key={follow._id} 
                  onClick={() => navigate(`/leads/${follow.leadId?._id || follow.leadId}`)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 m-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-100 cursor-pointer transition-colors"
                >
                  <div className="mb-2 sm:mb-0">
                    <h4 className="font-bold text-slate-800 capitalize">
                      {follow.leadId?.name || "Unknown Lead"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span className="font-semibold text-slate-700">{follow.followUpType}</span> 
                      • {formatTime(follow.followUpTime)}
                    </p>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white text-orange-600 border border-orange-200 rounded-lg text-xs font-semibold hover:bg-orange-600 hover:text-white transition-colors">
                    <PhoneCall size={12} />
                    Action
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RECENT LEADS SECTION */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[380px] md:h-[500px]">
          <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-indigo-500" />
              Newest Leads (Speed to Lead)
            </h3>
            <Link to="/leads" className="text-sm font-semibold text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            {recentLeads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Users className="text-slate-300 mb-4" size={32} />
                <p className="font-semibold text-slate-700">No leads yet</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div 
                  key={lead._id}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="flex items-center justify-between p-4 md:p-5 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                      {lead.name ? lead.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 capitalize">{lead.name || "Unknown"}</h4>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${lead.status === 'New' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                          {lead.status}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;