import React, { useMemo, useState, useEffect } from "react";
import { Calendar, CheckCircle, XCircle, TrendingUp, Download, PieChart as PieChartIcon, BarChart2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CustomCalendar from "./CustomCalender";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#4F46E5', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

const Analytics = () => {
  const { allLeads } = useSelector((state) => state.lead);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllLead());
  }, [dispatch]);

  // Filter leads by date range
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      if (startDate && leadDate < new Date(startDate)) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (leadDate > end) return false;
      }
      return true;
    });
  }, [allLeads, startDate, endDate]);

  const totalLeads = filteredLeads.length;

  // 1. Core Metrics
  const wonCount = filteredLeads.filter((lead) => lead.status === "Won" || lead.status === "Closed Won").length;
  const lostCount = filteredLeads.filter((lead) => lead.status === "Lost" || lead.status === "Closed Lost").length;
  const conversionRate = totalLeads > 0 ? ((wonCount / totalLeads) * 100).toFixed(1) : 0;

  // 2. Sales Funnel Data
  const funnelData = useMemo(() => {
    const counts = { "New": 0, "In Followup": 0, "Interested": 0, "Won": wonCount, "Lost": lostCount };
    filteredLeads.forEach(lead => {
      if (lead.status === "New") counts["New"]++;
      else if (lead.status === "In Followup" || lead.status === "Contacted" || lead.status === "Hot" || lead.status === "Warm") counts["In Followup"]++;
      else if (lead.status === "Interested") counts["Interested"]++;
    });
    return [
      { name: "New", value: counts["New"] },
      { name: "In Followup", value: counts["In Followup"] },
      { name: "Interested", value: counts["Interested"] },
      { name: "Won", value: counts["Won"] }
    ];
  }, [filteredLeads, wonCount, lostCount]);

  // 3. Source Distribution Data
  const sourceData = useMemo(() => {
    const counts = {};
    filteredLeads.forEach(lead => {
      const src = lead.source || "Other";
      counts[src] = (counts[src] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredLeads]);

  // 4. Time Series Data (Leads over time)
  const timeData = useMemo(() => {
    const counts = {};
    filteredLeads.forEach(lead => {
      const date = new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count })).sort((a,b) => new Date(a.date) - new Date(b.date));
  }, [filteredLeads]);

  // 5. Team Performance Data
  const teamData = useMemo(() => {
    const counts = {};
    filteredLeads.forEach(lead => {
      if (lead.assignedTo) {
        const name = lead.assignedTo.name || "Unknown";
        counts[name] = (counts[name] || 0) + 1;
      } else {
        counts["Unassigned"] = (counts["Unassigned"] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, leads]) => ({ name, leads }));
  }, [filteredLeads]);


  // PDF Export Logic
  const downloadPDF = () => {
    if (filteredLeads.length === 0) {
      alert("No lead data available for selected date range");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("LMS", 105, 18, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Lead Management System Analytics Report", 105, 27, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Date Range: ${startDate || "All"} to ${endDate || "All"} `, 105, 35, { align: "center" });

    // Summary Cards in PDF
    doc.roundedRect(14, 48, 43, 24, 3, 3);
    doc.text("Total Leads", 18, 56);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(String(totalLeads), 18, 66);

    doc.roundedRect(62, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Won Leads", 66, 56);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(String(wonCount), 66, 66);

    doc.roundedRect(110, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Conversion %", 114, 56);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${conversionRate}%`, 114, 66);

    doc.roundedRect(158, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Lost Leads", 162, 56);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(String(lostCount), 162, 66);

    autoTable(doc, {
      startY: 86,
      head: [["Sr No", "Lead Name", "Email", "Phone", "Status", "Assigned To", "Source"]],
      body: filteredLeads.map((lead, index) => [
        index + 1,
        lead.name || "-",
        lead.email || "-",
        lead.phone || "-",
        lead.status || "-",
        lead.assignedTo?.name || lead.assignedTo || "-",
        lead.source || "-",
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" }
    });

    window.open(doc.output("bloburl"));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Enterprise Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Deep insights into your sales pipeline, sources, and team performance.
          </p>
        </div>
        <button
          onClick={downloadPDF}
          disabled={filteredLeads.length === 0}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 lg:p-5 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-end gap-5">
        <div className="w-full sm:w-[200px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Start Date</label>
          <CustomCalendar
            value={startDate}
            maxDate={endDate || today}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && date > endDate) setEndDate("");
            }}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">End Date</label>
          <CustomCalendar
            value={endDate}
            minDate={startDate}
            maxDate={today}
            disabled={!startDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <button
          onClick={() => { setStartDate(""); setEndDate(""); }}
          className="h-10 px-6 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition sm:ml-2 whitespace-nowrap"
        >
          Clear Filter
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative p-5 border-l-4 border-l-blue-500">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <Calendar size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL LEADS</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">{totalLeads}</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative p-5 border-l-4 border-l-green-500">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
            <CheckCircle size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CLOSED WON</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">{wonCount}</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative p-5 border-l-4 border-l-red-500">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
            <XCircle size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CLOSED LOST</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">{lostCount}</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative p-5 border-l-4 border-l-indigo-500">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
            <TrendingUp size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CONVERSION RATE</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h2 className="text-3xl font-bold text-slate-800">{conversionRate}</h2>
            <span className="text-slate-500 font-bold">%</span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        {/* Sales Funnel */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart2 size={18} className="text-indigo-600" />
            Sales Pipeline Funnel
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={32}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChartIcon size={18} className="text-indigo-600" />
            Lead Sources
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads Over Time */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600" />
            Leads Generated Over Time
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Performance */}
        {teamData.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm lg:col-span-2 mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              Team Performance
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;