import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";

const CustomDateRangePicker = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const pickerRef = useRef(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = useMemo(() => {
        return Array.from({ length: firstDay + totalDays }, (_, i) =>
            i < firstDay ? null : i - firstDay + 1
        );
    }, [firstDay, totalDays]);

    const formatDate = (date) => {
        if (!date) return "";
        return date.toISOString().split("T")[0];
    };

    const handleDateClick = (day) => {
        const selected = new Date(year, month, day);

        if (!startDate || (startDate && endDate)) {
            setStartDate(formatDate(selected));
            setEndDate("");
            return;
        }

        const start = new Date(startDate);

        if (selected < start) {
            setEndDate(startDate);
            setStartDate(formatDate(selected));
            setShowCalendar(false);
        } else {
            setEndDate(formatDate(selected));
            setShowCalendar(false);
        }
    };

    const isSameDate = (day, date) => {
        if (!day || !date) return false;

        const d = new Date(date);

        return (
            d.getFullYear() === year &&
            d.getMonth() === month &&
            d.getDate() === day
        );
    };

    const isInRange = (day) => {
        if (!startDate || !endDate || !day) return false;

        const current = new Date(year, month, day);
        return current > new Date(startDate) && current < new Date(endDate);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={pickerRef} className="relative w-full max-w-[360px]">
            <div
                onClick={() => setShowCalendar((prev) => !prev)}
                className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer shadow-sm"
            >
                <span className="text-sm font-semibold text-gray-800">
                    {startDate && endDate
                        ? `${formatDateDDMMYYYY(startDate)} ~ ${formatDateDDMMYYYY(endDate)}`
                        : startDate
                            ? formatDateDDMMYYYY(startDate)
                            : "Select Date Range"}
                </span>

                <Calendar size={20} className="text-gray-500" />
            </div>

            {showCalendar && (
                <div className="absolute top-full left-0 mt-3 z-50 w-full">
                    <div className="bg-white rounded-[22px] p-4 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900">
                                {year} Year {month + 1} Month
                            </h2>

                            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentDate(new Date(year, month - 1, 1))
                                    }
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <div className="w-px h-4 bg-gray-300" />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentDate(new Date(year, month + 1, 1))
                                    }
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 text-center text-xs text-gray-400 font-semibold mb-3">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                (day) => (
                                    <div key={day}>{day}</div>
                                )
                            )}
                        </div>

                        <div className="grid grid-cols-7 gap-y-2 text-center">
                            {days.map((day, index) => {
                                const selectedStart = isSameDate(day, startDate);
                                const selectedEnd = isSameDate(day, endDate);
                                const range = isInRange(day);

                                return (
                                    <div
                                        key={index}
                                        className={`h-9 flex items-center justify-center ${range ? "bg-pink-100" : ""
                                            }`}
                                    >
                                        {day && (
                                            <button
                                                type="button"
                                                onClick={() => handleDateClick(day)}
                                                className={`w-9 h-9 rounded-full text-sm font-semibold transition
                          ${selectedStart || selectedEnd
                                                        ? "bg-pink-500 text-white shadow-md"
                                                        : "text-gray-900 hover:bg-pink-100"
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    const today = new Date();
                                    const formatted = formatDate(today);
                                    setStartDate(formatted);
                                    setEndDate(formatted);
                                    setShowCalendar(false);
                                }}
                                className="w-full py-2 text-sm font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors"
                            >
                                Today
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDateRangePicker;