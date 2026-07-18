import React from 'react'

const squreCard = ({ name, leads, icon: Icon, color }) => {
        return (
            <div className={`relative overflow-hidden bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 ${name === 'TOTAL LEADS' ? 'border-l-4 border-l-indigo-600' : ''}`}>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{name}</p>
                        <h2 className="mt-1 text-3xl font-bold text-slate-900">{leads}</h2>
                    </div>
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${color.bg}`}
                    >
                        <Icon className={`h-5 w-5 ${color.text}`} />
                    </div>
                </div>
                {/* Background Watermark Icon */}
                <Icon className={`absolute -bottom-4 -right-2 h-24 w-24 opacity-[0.04] ${color.text}`} />
            </div>
        );
    };

export default squreCard