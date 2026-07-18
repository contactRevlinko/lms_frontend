import { Calendar } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";

const CustomCalendar = ({
  value,
  onChange,
  name,
  className = "",
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date()
  );

  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);
  const selectedDate = value ? new Date(value) : null;

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const firstDay = new Date(year, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

  const formatDate = (date) => date.toLocaleDateString("en-CA");

  const isSameDate = (d1, d2) => {
    if (!d1 || !d2) return false;

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isDisabled = (date) => {
    const current = new Date(formatDate(date));

    if (minDate && current < new Date(minDate)) return true;
    if (maxDate && current > new Date(maxDate)) return true;

    return false;
  };

  const handleOpenCalendar = () => {
    if (disabled) return;

    if (calendarRef.current && !open) {
      const rect = calendarRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const calendarHeight = 360;
      const calendarWidth = 290;

      const openUpward = spaceBelow < calendarHeight;
      const openRightToLeft = rect.left + calendarWidth > window.innerWidth;
      
      setDropdownStyle({
        position: 'fixed',
        left: openRightToLeft ? Math.max(10, window.innerWidth - calendarWidth - 10) : rect.left,
        top: openUpward ? rect.top - calendarHeight - 4 : rect.bottom + 4,
        zIndex: 99999
      });
    }

    setOpen((prev) => !prev);
  };

  const handleSelectDate = (dayOrDate) => {
    let date;
    if (dayOrDate instanceof Date) {
      date = dayOrDate;
    } else {
      date = new Date(year, currentDate.getMonth(), dayOrDate);
    }
    const formattedDate = formatDate(date);

    if (isDisabled(date)) return;

    if (name) {
      onChange({
        target: {
          name: name,
          value: formattedDate,
        },
      });
    } else {
      onChange(formattedDate);
    }

    setOpen(false);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  useEffect(() => {
    if (value) {
      setCurrentDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        calendarRef.current?.contains(e.target) || 
        dropdownRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleScroll = (e) => {
        if (dropdownRef.current?.contains(e.target)) return;
        setOpen(false);
    };

    setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
    }, 50);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  return (
    <div ref={calendarRef} className="relative w-full ">
      <div className="relative">
        <input
          readOnly
          disabled={disabled}
          value={value ? formatDateDDMMYYYY(value) : ""}
          onClick={handleOpenCalendar}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-4 pr-10 py-2 text-[13px] font-normal outline-none focus:border-indigo-500 cursor-pointer
    ${value ? "bg-indigo-50/50 border-gray-300" : "bg-slate-50 border-slate-200/80"}
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${className}
  `}
        />

        <Calendar
          size={14}
          onClick={handleOpenCalendar}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
        />
      </div>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="absolute z-[99999] w-[290px] rounded-2xl bg-white p-3 shadow-2xl border border-gray-200"
          style={dropdownStyle}
        >
          <div className="absolute inset-0 bg-white rounded-2xl -z-10" />

          <div className="flex items-center justify-between bg-indigo-600 rounded-xl px-3 py-2 mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30"
            >
              ‹
            </button>

            <p className="font-semibold text-white text-sm">
              {monthName} {year}
            </p>

            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2 bg-white">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm bg-white">
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = new Date(year, currentDate.getMonth(), day);
              const active = isSameDate(date, selectedDate);
              const disabledDate = isDisabled(date);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabledDate}
                  onClick={() => handleSelectDate(day)}
                  className={`
                    h-9 w-9 mx-auto rounded-lg transition
                    ${active ? "bg-indigo-600 text-white" : "text-gray-700"}
                    ${!active && !disabledDate
                      ? "hover:bg-indigo-100 hover:text-indigo-700"
                      : ""
                    }
                    ${disabledDate
                      ? "text-gray-300 cursor-not-allowed"
                      : ""
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setCurrentDate(today);
                handleSelectDate(today);
              }}
              className="w-full py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Today
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomCalendar;