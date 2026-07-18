import React, { useMemo, useState, useEffect } from "react";
import { Calendar, Calendar1, CheckCircle, Trophy, Download, BarChart2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CustomCalendar from "./CustomCalender";


const Analytics = () => {
  const { allLeads } = useSelector((state) => state.lead);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllLead());
  }, [dispatch]);
  // all leads of date range
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const leadDate = new Date(lead.createdAt)
      if (startDate && leadDate < new Date(startDate)) {
        return false;
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        if (leadDate > end) {
          return false
        }
      }
      return true;
    })
  }, [allLeads, startDate, endDate]);

  const totalLeads = filteredLeads.length;
  console.log(totalLeads);

  // hightest lead status
  const highestStatus = useMemo(() => {
    const counts = {};

    filteredLeads.forEach((lead) => {
      const status = lead.status || "No Status";
      counts[status] = (counts[status] || 0) + 1;
    });

    const statusArray = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));

    if (statusArray.length === 0) {
      return { name: "No Data", count: 0 };
    }

    return statusArray.reduce((max, item) =>
      item.count > max.count ? item : max
    );
  }, [filteredLeads]);

  // won status
  const wonStatus = useMemo(() => {
    return filteredLeads.filter((lead) => lead.status === "Closed Won").length;
  }, [filteredLeads]);

  //pending , won , lost 
  const wonCount = filteredLeads.filter((lead) =>
    lead.status === "Closed Won"
  ).length;
  const lostCount = filteredLeads.filter((lead) =>
    lead.status === "Closed Lost"
  ).length;
  const pendingCount = filteredLeads.filter((lead) =>
    lead.status !== "Closed Won" &&
    lead.status !== "Closed Lost"
  ).length

  const leadResultStatus = [
    {
      name: "Pending",
      count: pendingCount,
    },
    {
      name: "Won",
      count: wonCount,
    },
    {
      name: "Lost",
      count: lostCount,
    },
  ];
  const highestLeadResult = leadResultStatus.reduce((max, item) =>
    item.count > max.count ? item : max);

  console.log("allLeads", allLeads);
  console.log("filteredLeads", filteredLeads);

  const downloadPDF = () => {
    if (filteredLeads.length === 0) {
      alert("No lead data available for selected date range");
      return;
    }

    const doc = new jsPDF();

    // heading

    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("LMS", 105, 18, { align: "center" });

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Lead Management System Analytics Report", 105, 27, {
      align: "center",
    })


    doc.setFontSize(10)
    doc.text(`Date Range: ${startDate || "All"} to ${endDate || "All"} `, 105, 35, { align: "center" })



    doc.roundedRect(14, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
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
    doc.text(String(wonStatus), 66, 66);

    doc.roundedRect(110, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Highest Status", 114, 56);
    doc.setFontSize(10);
    doc.text(String(highestStatus.name), 114, 62);
    doc.setFontSize(18);
    doc.text(`${highestStatus.count} `, 114, 69);

    doc.roundedRect(158, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Most Result", 162, 56);
    doc.setFontSize(10);
    doc.text(String(highestLeadResult.name), 162, 62);
    doc.setFontSize(18);
    doc.text(`${highestLeadResult.count} `, 162, 69);

    autoTable(doc, {
      startY: 86,
      head: [

        [
          "Sr No", "Lead Name", "Email", "Phone", "Status", "Assigned To", "Source",
        ],
      ]
      ,
      body: filteredLeads.map((lead, index) => [
        index + 1,
        lead.name || "-",
        lead.email || "-",
        lead.phone || "-",
        lead.status || "-",
        lead.assignedTo?.name || lead.assignedTo || "-",
        lead.source || "-",
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 3,

      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      }
    })

    window.open(doc.output("bloburl"));
    // doc.save("analytics.pdf");
  }
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Lead Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and analyze your leads conversion trends and metrics.
          </p>
        </div>
        
        <button
          onClick={downloadPDF}
          disabled={filteredLeads.length === 0}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap shadow-sm"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>


      <div className="bg-white rounded-2xl border border-slate-100 p-4 lg:p-5 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-end gap-5">
        <div className="w-full sm:w-[200px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            Start Date
          </label>
          <CustomCalendar
            value={startDate}
            maxDate={endDate || today}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && date > endDate) {
                setEndDate("");
              }
            }}
          />
        </div>

        <div className="w-full sm:w-[200px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            End Date
          </label>
          <CustomCalendar
            value={endDate}
            minDate={startDate}
            maxDate={today}
            disabled={!startDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>

        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="h-10 px-6 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition sm:ml-2 whitespace-nowrap"
        >
          Clear Filter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative border-l-4 border-l-blue-500 p-5">
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-gray-900 pointer-events-none">
            <Calendar size={120} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 relative z-10">
            <Calendar size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 relative z-10">
            ALL LEADS
          </p>
          <div className="flex items-baseline gap-2 mt-1 relative z-10">
            <h2 className="text-3xl font-bold text-slate-800">
              {totalLeads}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative border-l-4 border-l-orange-500 p-5">
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-gray-900 pointer-events-none">
            <Trophy size={120} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 relative z-10">
            <Trophy size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 relative z-10">
            HIGHEST STATUS
          </p>
          <div className="flex items-baseline gap-2 mt-1 relative z-10">
            <h2 className="text-3xl font-bold text-slate-800">
              {highestStatus.count}
            </h2>
            <span className="text-sm text-slate-500 font-medium">
              {highestStatus.name}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative border-l-4 border-l-green-500 p-5">
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-gray-900 pointer-events-none">
            <CheckCircle size={120} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6 relative z-10">
            <CheckCircle size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 relative z-10">
            CLOSED WON
          </p>
          <div className="flex items-baseline gap-2 mt-1 relative z-10">
            <h2 className="text-3xl font-bold text-slate-800">
              {wonStatus}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative border-l-4 border-l-indigo-500 p-5">
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-gray-900 pointer-events-none">
            <BarChart2 size={120} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 relative z-10">
            <BarChart2 size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 relative z-10">
            MOST RESULT
          </p>
          <div className="flex items-baseline gap-2 mt-1 relative z-10">
            <h2 className="text-3xl font-bold text-slate-800">
              {highestLeadResult.count}
            </h2>
            <span className="text-sm text-slate-500 font-medium">
              {highestLeadResult.name}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;