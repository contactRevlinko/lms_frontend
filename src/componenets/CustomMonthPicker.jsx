import { Calendar } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const CustomMonthPicker = ({
  value,
  onChange,
  name,
  className = "",
  placeholder = "Select month",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  
  const getInitialYear = () => value ? parseInt(value.split("-")[0], 10) : new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(getInitialYear());

  const calendarRef = useRef(null);
  
  const displayValue = value ? (() => {
    const [y, m] = value.split("-");
    return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
  })() : "";

  const handleOpenCalendar = () => {
    if (disabled) return;
    if (calendarRef.current) {
      const rect = calendarRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 250);
    }
    setOpen((prev) => !prev);
  };

  const handleSelectMonth = (monthIndex) => {
    const y = currentYear;
    const m = String(monthIndex + 1).padStart(2, "0");
    const formatted = `${y}-${m}`;

    if (name) {
      onChange({ target: { name, value: formatted } });
    } else {
      onChange(formatted);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (value) {
      setCurrentYear(parseInt(value.split("-")[0], 10));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={calendarRef} className="relative w-full min-w-[140px]">
      <div className="relative">
        <input
          readOnly
          disabled={disabled}
          value={displayValue}
          onClick={handleOpenCalendar}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-3 pr-10 py-1.5 text-sm outline-none focus:border-indigo-500 cursor-pointer h-[38px]
    ${value ? "bg-indigo-50/50 border-indigo-200 text-indigo-700" : "bg-white border-gray-300 text-gray-700"}
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${className}
  `}
        />
        <Calendar
          size={16}
          onClick={handleOpenCalendar}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${value ? "text-indigo-600" : "text-gray-400"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        />
      </div>

      {open && (
        <div
          className={`
    absolute z-[99999] w-[240px] rounded-2xl bg-white p-3
    shadow-2xl border border-gray-200 left-0
    ${openUpward ? "bottom-11" : "top-11"}
  `}
        >
          <div className="flex items-center justify-between bg-indigo-600 rounded-xl px-3 py-2 mb-3">
            <button
              type="button"
              onClick={() => setCurrentYear(y => y - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"
            >
              ‹
            </button>
            <p className="font-semibold text-white text-sm">
              {currentYear}
            </p>
            <button
              type="button"
              onClick={() => setCurrentYear(y => y + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((m, index) => {
              const isSelected = value === `${currentYear}-${String(index + 1).padStart(2, "0")}`;
              return (
                <button
                  key={m}
                  onClick={() => handleSelectMonth(index)}
                  className={`py-2 text-sm rounded-lg font-medium transition-colors ${
                    isSelected 
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMonthPicker;
