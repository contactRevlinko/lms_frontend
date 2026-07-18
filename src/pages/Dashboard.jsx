import {
  ChartNoAxesCombined,
  ChartPie,
  FunnelIcon,
  HeartHandshake,
  SunMedium,
  Users,
  Plus,
  Link2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import SqureCard from "../componenets/SqureCard";
import AddLead from "../pages/AddLead"
import {
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import CustomFunnelTooltip from "../componenets/CustonToolTip";

const fixedColors = {
  Instagram: "#E1306C",
  Whatsapp: "#25D366",
  Referral: "#F59E0B",
};

const colorMap = {};

const getColorFromString = (str = "") => {
  if (fixedColors[str]) return fixedColors[str];
  if (colorMap[str]) return colorMap[str];

  const goldenAngle = 137.508;

  const keys = Object.keys(colorMap);
  const index = keys.length;

  const hue = (index * goldenAngle) % 360;

  const color = `hsl(${hue}, 70%, 50%)`;

  colorMap[str] = color;

  return color;
};
export const STATUS_COLORS = {
  New: "#6366F1",         
  Hot: "#EF4444",         
  Warm: "#F59E0B",        
  Cold: "#06B6D4",         
  Contacted: "#8B5CF6",    
  Interested: "#EC4899",   
  "Closed Won": "#10B981", 
  "Closed Lost": "#6B7280", 
  "No Status": "#CBD5E1",
};

const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [souceData, setSourceData] = useState([]);

  const [warm, setWarm] = useState(0);
  const [inteStatus, setInteStatus] = useState(0);
  const [wonStatus, setWonStatus] = useState(0);

  const fetchStatusCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/leads/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        const formattedData = result.byStatus.map((s) => ({
          name: s._id || "No Status",
          count: s.count,
        }));

        setTotal(result.total);
        setData(formattedData);

        const warmLead =
          formattedData.find((item) => item.name === "Warm")?.count || 0;

        const interestedLead =
          formattedData.find((item) => item.name === "Interested")?.count || 0;

        const wonLead =
          formattedData.find((item) => item.name === "Closed Won")?.count || 0;

        setWarm(warmLead);
        setInteStatus(interestedLead);
        setWonStatus(wonLead);
      }
    } catch (err) {
      console.log("Dashboard API error:", err);
    }
  };

  const fetchSource = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/leads/source`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        const formattedDataSource = result.source.map((s) => ({
          name: s._id || "No Source",
          count: s.count,
        }));

        setSourceData(formattedDataSource);
      }
    } catch (err) {
      console.log("Source API error:", err);
    }
  };

  useEffect(() => {
    fetchStatusCount();
    fetchSource();
  }, []);

  const conversionRate =
    total > 0 ? ((wonStatus / total) * 100).toFixed(1) : 0;

  const cardData = [
    {
      name: "TOTAL LEADS",
      leads: total,
      icon: Users,
      color: { bg: "bg-indigo-100", text: "text-indigo-600" },
    },
    {
      name: "WARM",
      leads: warm,
      icon: SunMedium,
      color: { bg: "bg-orange-100", text: "text-orange-600" },
    },
    {
      name: "INTERESTED",
      leads: inteStatus,
      icon: HeartHandshake,
      color: { bg: "bg-pink-100", text: "text-pink-600" },
    },
    {
      name: "CONVERSION RATE",
      leads: `${conversionRate}%`,
      icon: ChartNoAxesCombined,
      color: { bg: "bg-amber-100", text: "text-amber-600" },
    },
  ];

  return (
     <div className="w-full">
    
      <div className="mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0f172a]">Analytics Overview</h1>
        <p className="text-[14px] text-slate-500 mt-1 font-medium">
          Track lead performance, sources, and conversion trends in real time
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((card) => (
          <SqureCard
            key={card.name}
            name={card.name}
            leads={card.leads}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <FunnelIcon className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Lead Status Breakdown
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">
                Funnel view of current lead stages
              </p>
            </div>
          </div>

          <div className="h-[460px] w-full px-2 sm:px-10 pb-4 mt-2">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip content={<CustomFunnelTooltip />} />
                  <Funnel dataKey="count" data={data} isAnimationActive>
                    <LabelList
                      position="center"
                      fill="#ffffff"
                      stroke="none"
                      dataKey="name"
                      fontSize={12}
                    />
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={STATUS_COLORS[entry.name] || "#CBD5E1"}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-36 h-36 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                  <FunnelIcon className="w-20 h-20 text-indigo-300" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  No lead data yet
                </h2>

                <p className="text-slate-500 max-w-sm mb-6">
                  Once you start getting leads, you’ll see the funnel breakdown of all
                  stages here.
                </p>

                {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
                  <Plus size={20} />
                  Add Your First Lead
                </button>
           */}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50">
              <ChartPie className="h-5 w-5 text-pink-600" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Lead Source Breakdown
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">
                Distribution of leads by source
              </p>
            </div>
          </div>

          <div className="h-[320px] sm:h-[420px] md:h-[460px] w-full overflow-hidden mt-2">
            {souceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                  <Pie
                    data={souceData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    fontSize={12}
                  >
                    {souceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColorFromString(entry.name)}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                    ))}
               
                  </Pie>

                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              // your empty state
              <div className="h-full flex flex-col items-center justify-center text-center">
                No source data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;