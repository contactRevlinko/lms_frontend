import { STATUS_COLORS } from "../pages/Dashboard"

const CustomFunnelTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const { name, count } = payload[0].payload;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl px-4 py-3 min-w-[140px]">
            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{
                        backgroundColor: STATUS_COLORS[name] || "#CBD5E1",
                    }}
                />
                <p className="font-semibold text-slate-800">{name}</p>
            </div>

            <div className="border-t border-slate-100 pt-2">
                <p className="text-sm text-slate-500">
                    Total Leads:
                    <span className="ml-2 font-bold text-slate-900">
                        {count}
                    </span>
                </p>
            </div>
        </div>
    );
};
export default CustomFunnelTooltip;