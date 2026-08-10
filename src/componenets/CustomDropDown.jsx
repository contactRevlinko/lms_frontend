

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

const CustomDropDown = ({ value, options, onChange, className = "rounded-lg h-8" }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const getLabel = (item) => {
        if (typeof item === "object" && item !== null) return item.label || item.name || "";
        return item;
    };

    const getValue = (item) => {
        if (typeof item === "object" && item !== null) return item.value || item._id || "";
        return item;
    };
    const selectedOption = options.find((opt) => getValue(opt) === value);
    const displayValue = selectedOption ? getLabel(selectedOption) : (typeof value === "object" && value !== null ? getLabel(value) : value);

    const openDropdown = () => {
        if (showOptions) {
            setShowOptions(false);
            return;
        }

        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = Math.min(options.length * 40 + 16, 220);
        const dropdownWidth = Math.max(rect.width, 160);
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < dropdownHeight;

        let leftPosition = rect.left;
        if (rect.left + dropdownWidth > window.innerWidth) {
            leftPosition = Math.max(8, rect.right - dropdownWidth);
        }

        setDropdownStyle({
            position: "fixed",
            left: leftPosition,
            width: dropdownWidth,
            zIndex: 99999,
            ...(openUpward
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
        });

        setShowOptions(true);
    };

    useEffect(() => {
        if (!showOptions) return;

        const handleClickOutside = (e) => {
            if (
                buttonRef.current?.contains(e.target) ||
                dropdownRef.current?.contains(e.target)
            ) return;
            setShowOptions(false);
        };

        const handleScroll = (e) => {
            if (dropdownRef.current?.contains(e.target)) return;
            setShowOptions(false);
        };

        setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("scroll", handleScroll, true);
        }, 50);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, [showOptions]);

    return (
        <div className="relative w-full">
            <button
                ref={buttonRef}
                type="button"
                onClick={openDropdown}
                className={`w-full border border-slate-200/80 px-4 pr-8 text-left text-[13px] font-normal relative cursor-pointer bg-slate-50 hover:bg-slate-100 focus:outline-none focus:border-indigo-500 transition-colors text-slate-700 ${className}`}
            >
                <span className="block truncate pr-2">{displayValue || "Select"}</span>
                <ChevronDown
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
            </button>

            {showOptions &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={dropdownStyle}
                        className="
              bg-white
              border border-indigo-100
              rounded-2xl
              shadow-xl
              py-2
              overflow-y-auto
              max-h-[220px]
            "
                    >
                        {options.map((item, i) => {
                            const isDeletable = typeof item === "object" && item?.deletable;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center justify-between px-4 py-2 hover:bg-indigo-50 text-sm group"
                                >
                                    <span
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            onChange(getValue(item));
                                            setShowOptions(false);
                                        }}
                                        className="flex-1 cursor-pointer"
                                    >
                                        {getLabel(item)}
                                    </span>
                                    {isDeletable && (
                                        <button
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                item.onDelete?.();
                                            }}
                                            className="ml-2 w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors text-base leading-none cursor-pointer"
                                            title="Remove role"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default CustomDropDown;