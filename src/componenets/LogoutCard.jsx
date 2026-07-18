import { LogOut, ShieldCheck } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

const LogoutCard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="min-w-12 w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-800">
            Logout
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
            SECURELY SIGN OUT FROM YOUR ACCOUNT
          </p>
        </div>
      </div>

      {/* Center Icon */}
      <div className="flex justify-center my-8 md:my-10">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
          <LogOut className="w-10 h-10 text-red-500 ml-1" />
        </div>
      </div>

      {/* Text and Button */}
      <div className="flex flex-col items-center text-center">
        <p className="text-slate-500 text-sm mb-6 max-w-[250px]">
          Click the button below to end your current session.
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2.5 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout Account
        </button>
      </div>
    </div>
  );
};

export default LogoutCard;