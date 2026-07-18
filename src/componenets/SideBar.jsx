import React from "react";
import { NavLink } from "react-router-dom";
import {
  Megaphone, 
  LayoutDashboard,
  UserRoundSearch,
  Calendar,
  BellRing,
  ChartLine,
  Users,
  Settings,
  X,
  Plus,
} from "lucide-react";


const SideBar = ({ showSideBar, handleSideBar }) => {

  const loginType = localStorage.getItem("loginType");

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
    ${isActive
      ? "bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-100/30"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <div
      className={`
        fixed left-0 top-0 h-screen w-72
        bg-white
        p-5 border-r border-slate-200/80 z-[100]
        transition-transform duration-300
        ${showSideBar ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">LeadPro</h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Enterprise CRM</p>
        </div>

        <button
          onClick={handleSideBar}
          className="lg:hidden bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard size={22} />
          Dashboard
        </NavLink>

        <NavLink to="/leads" className={navClass}>
          <UserRoundSearch size={22} />
          Leads
        </NavLink>


        <NavLink to="/reminders" className={navClass}>
          <BellRing size={22} />
          Reminders
        </NavLink>

        <NavLink to="/analytics" className={navClass}>
          <ChartLine size={22} />
          Analytics
        </NavLink>
        <NavLink to="/campaign" className={navClass}>
          <Megaphone  size={22} />
         Campaign
        </NavLink>

        <NavLink to="/source" className={navClass}>
          <Plus size={22} />
          select source
        </NavLink>

        {loginType !== "team" && 
        <>
         <NavLink to="/team" className={navClass}>
          <Users size={22} />
          Team
        </NavLink>

        <NavLink to="/settings" className={navClass}>
          <Settings size={22} />
          Settings
        </NavLink>
        </>
        }

       
      </div>
    </div>
  );
};




export default SideBar;