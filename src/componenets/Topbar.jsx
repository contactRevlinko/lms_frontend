import React, { useEffect, useState, useRef } from "react";
import {
  BellDot,
  User,
  Search,
  Info,
  PanelRight,
  Power,
  Phone,
  Briefcase,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router";


const Topbar = ({ handleSideBar }) => {




  const loginType = localStorage.getItem("loginType");

  let loggedUser = {};

  try {
    loggedUser =
      loginType === "team"
        ? JSON.parse(localStorage.getItem("teamMember") || "{}")
        : JSON.parse(localStorage.getItem("user") || "{}");
  } catch (err) {
    loggedUser = {};
  }



  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  const handleLogout = () => {
    const type = localStorage.getItem("loginType");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("teamMember");
    localStorage.removeItem("loginType");

    if (type === "team") {
      navigate("/team-login", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <div className="backdrop-blur-md justify-between lg:justify-end fixed top-0 left-0 right-0 lg:left-72 h-20 lg:px-12 px-4 bg-white/80 border-b border-slate-200/80 shadow-sm z-40 flex items-center gap-3">
      <PanelRight
        onClick={handleSideBar}
        className="lg:hidden cursor-pointer text-gray-700 w-6 h-6"
      />{" "}
      {console.log(loggedUser)}
      <div className="flex gap-5  shrink-0">




        <div className="relative" ref={boxRef} >
          <button 
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors border border-indigo-100"
          >
            <User size={18} />
          </button>
          
          {open && (
            <div className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 transform transition-all origin-top-right">
              {/* Header Profile Section */}
              <div className="bg-slate-50/80 p-6 border-b border-slate-100 flex flex-col items-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-indigo-500/10 to-violet-500/10"></div>
                
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-2xl font-bold shadow-md ring-4 ring-white mb-3">
                  {loggedUser?.name?.charAt(0)?.toUpperCase()}
                </div>
                <h2 className="relative text-base font-bold text-slate-800 capitalize tracking-tight">
                  {loggedUser?.name}
                </h2>
                <p className="relative text-[11px] font-bold text-indigo-500 mt-1 uppercase tracking-wider">
                  {loginType === "team" ? "Team Member" : "Admin"}
                </p>
              </div>

              {/* Details List */}
              <div className="p-2 space-y-1">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                      <Phone size={14} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider">Phone</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-700">
                    {loggedUser?.phone || loggedUser?.phone1 || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                      <Briefcase size={14} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {loginType === "team" ? "Role" : "Business"}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-700 capitalize">
                    {loginType === "team" ? loggedUser?.role : (loggedUser?.businessType || "-")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                      <Mail size={14} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider">Email</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-700 max-w-[130px] truncate" title={loggedUser?.email}>
                    {loggedUser?.email || "-"}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-500 hover:text-white text-[13px] font-bold py-2.5 rounded-xl transition-all duration-300"
                >
                  <Power size={15} />
                  Logout Account
                </button>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};


export default Topbar;