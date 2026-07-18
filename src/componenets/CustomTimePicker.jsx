import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { createPortal } from "react-dom";

const CustomTimePicker = ({ value, onChange, name, className = "", placeholder = "Select time" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  
  // Parse incoming 24h format "HH:MM" to 12h format
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: "12", minute: "00", ampm: "PM" };
    const [h, m] = timeStr.split(":");
    const hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    let hour12 = hourNum % 12;
    if (hour12 === 0) hour12 = 12;
    return {
      hour: hour12.toString().padStart(2, "0"),
      minute: m || "00",
      ampm,
    };
  };

  const [time, setTime] = useState(parseTime(value));
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTime(parseTime(value));
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        containerRef.current?.contains(e.target) || 
        dropdownRef.current?.contains(e.target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleScroll = (e) => {
        if (dropdownRef.current?.contains(e.target)) return;
        setIsOpen(false);
    };

    setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
    }, 50);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const handleOpenDropdown = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 224; // h-56 = 14rem = 224px
      
      const openUpward = spaceBelow < dropdownHeight;
      
      setDropdownStyle({
        position: 'fixed',
        left: rect.left,
        top: openUpward ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
        zIndex: 99999,
        width: "12rem" // w-48
      });
    }
    setIsOpen(!isOpen);
  };

  const handleTimeChange = (type, val) => {
    const newTime = { ...time, [type]: val };
    setTime(newTime);
    
    // Convert back to 24h for the onChange event
    let h24 = parseInt(newTime.hour, 10);
    if (newTime.ampm === "PM" && h24 !== 12) h24 += 12;
    if (newTime.ampm === "AM" && h24 === 12) h24 = 0;
    const value24 = `${h24.toString().padStart(2, "0")}:${newTime.minute}`;
    
    if (onChange) {
      if (name) {
        onChange({ target: { name, value: value24 } });
      } else {
        onChange(value24);
      }
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const ampms = ["AM", "PM"];

  const displayValue = value ? `${time.hour}:${time.minute} ${time.ampm}` : "";

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={`flex items-center justify-between cursor-pointer ${className}`}
        onClick={handleOpenDropdown}
      >
        <span className={displayValue ? "text-gray-800" : "text-gray-400"}>
          {displayValue || placeholder}
        </span>
        <Clock size={16} className="text-gray-500" />
      </div>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-[99999] overflow-hidden flex h-56"
          style={dropdownStyle}
        >
          <div className="flex-1 overflow-y-auto border-r border-gray-100 custom-scrollbar">
            {hours.map((h) => (
              <div
                key={h}
                onClick={() => handleTimeChange("hour", h)}
                className={`py-2 text-center text-sm cursor-pointer hover:bg-gray-50 ${time.hour === h ? "bg-blue-600 text-white font-medium hover:bg-blue-600" : "text-gray-700"}`}
              >
                {h}
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto border-r border-gray-100 custom-scrollbar">
            {minutes.map((m) => (
              <div
                key={m}
                onClick={() => handleTimeChange("minute", m)}
                className={`py-2 text-center text-sm cursor-pointer hover:bg-gray-50 ${time.minute === m ? "bg-blue-600 text-white font-medium hover:bg-blue-600" : "text-gray-700"}`}
              >
                {m}
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {ampms.map((a) => (
              <div
                key={a}
                onClick={() => handleTimeChange("ampm", a)}
                className={`py-2 text-center text-sm cursor-pointer hover:bg-gray-50 ${time.ampm === a ? "bg-blue-600 text-white font-medium hover:bg-blue-600" : "text-gray-700"}`}
              >
                {a}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}} />
    </div>
  );
};

export default CustomTimePicker;
