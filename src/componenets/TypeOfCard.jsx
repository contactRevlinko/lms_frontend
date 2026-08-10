import React from "react";
import { TrendingUp } from "lucide-react";




const TypeOfCard = ({ name, leads, icon: Icon, color }) => {
  return (
    <div className="flex items-center gap-3 w-full px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color.bg}`}>
        <Icon size={14} className={color.text} />
      </div>

      <div>
        <h2 className="text-[22px] font-bold text-slate-900 leading-none">
          {leads}
        </h2>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
          {name}
        </p>
      </div>
    </div>
  );
};

export default TypeOfCard;