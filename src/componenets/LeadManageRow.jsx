import React, { useEffect, useRef, useState } from "react";
import {
  ChartNoAxesGantt,
  Download,
  ListFilter,
  Upload,
  Calendar,
  Flag,
  ArrowUpDown,
  X,
} from "lucide-react";
import CustomDropDown from "./CustomDropDown";
import CustomCalendar from "./CustomCalender";

const LeadManageRow = ({
  filter,
  setFilter,
  selectDate,
  setSelectDate,
  handleExportExcel,
  setSortOrder,

  priorityFilter,
  setPriorityFilter,
  sourceFilter,
  setSourceFilter,
  uniqueSources,
  clearFilters,
  hasFilters,
}) => {
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-white border border-slate-100 rounded-xl py-4 px-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 flex-1">
          <div className="flex items-center gap-2 text-slate-400 md:mr-2 w-full md:w-auto">
            <ListFilter size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">FILTERS</span>
          </div>

          <div className="w-[140px]">
            <CustomDropDown
              options={[
                "All",
                "New",
                "In Followup",
                "Interested",
                "Cold",
                "Lost",
                "Won",
              ]}
              value={filter}
              onChange={setFilter}
              className="rounded-lg h-8"
            />
          </div>

          <div className="w-[120px]">
            <CustomDropDown
              options={["All", "High", "Medium", "Low"]}
              value={priorityFilter}
              onChange={setPriorityFilter}
              className="rounded-lg h-8"
            />
          </div>

          <div className="w-[120px]">
            <CustomDropDown
              options={uniqueSources}
              value={sourceFilter}
              onChange={setSourceFilter}
              className="rounded-lg h-8"
            />
          </div>

          <div className="w-[130px]">
            <CustomCalendar
              value={selectDate}
              onChange={(date) => setSelectDate(date)}
              placeholder="Select Date"
              className="rounded-lg h-8"
            />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="
                h-8 px-3 rounded-lg
                flex items-center justify-center gap-1.5
                text-[13px] font-medium text-red-500 bg-red-50
                border border-red-100
                hover:bg-red-100 hover:text-red-600 transition-all duration-200
              "
            >
              <X size={14} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setOpenSort((prev) => !prev)}
              className="
                h-8 px-4 rounded-lg
                flex items-center justify-center gap-1.5
                text-[13px] font-medium text-slate-500 bg-slate-50
                border border-slate-200
                hover:bg-slate-50 transition-all duration-200
              "
            >
              <ArrowUpDown size={14} className="text-slate-500" />
              <span>Sort</span>
            </button>

            {openSort && (
              <div
                className="
                  absolute left-0 right-0 md:left-auto md:right-0 top-13 z-30
                  md:w-36 bg-white
                  border border-indigo-100
                  rounded-2xl shadow-xl
                  p-2
                "
              >
                <button
                  onClick={() => {
                    setSortOrder("asc");
                    setOpenSort(false);
                  }}
                  className="
                    w-full text-left px-4 py-2
                    text-sm rounded-xl
                    hover:bg-indigo-50
                  "
                >
                  A -{'>'} Z
                </button>

                <button
                  onClick={() => {
                    setSortOrder("desc");
                    setOpenSort(false);
                  }}
                  className="
                    w-full text-left px-4 py-2
                    text-sm rounded-xl
                    hover:bg-indigo-50
                  "
                >
                  Z -{'>'} A
                </button>
              </div>
            )}
          </div>

          {/* Export */}
          <button
            onClick={handleExportExcel}
            className="
              h-8 px-4 rounded-lg
              flex items-center justify-center gap-1.5
              text-[13px] font-medium text-slate-500 bg-slate-50
              border border-slate-200
              hover:bg-slate-50 transition-all duration-200
            "
          >
            <Download size={14} className="text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadManageRow;