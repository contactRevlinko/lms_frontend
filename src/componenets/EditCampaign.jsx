import { useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { X, Pencil } from "lucide-react";
import CustomDropDown from "./CustomDropDown";
import CustomCalendar from "./CustomCalender";

const BASE_URL = import.meta.env.VITE_API_URL;

const PLATFORM_OPTIONS = ["Meta", "Google", "Both", "Other"];
const STATUS_OPTIONS = ["Active", "Paused", "Completed"];

const EditCampaign = ({ campaignData, onClose, getCampaign }) => {
    const [formData, setFormData] = useState({
        name: campaignData.name || "",
        platform: campaignData.platform || "Meta",
        objective: campaignData.objective || "",
        totalBudget: campaignData.totalBudget || "",
        status: campaignData.status || "Active",
        startDate: campaignData.startDate
            ? campaignData.startDate.substring(0, 10)
            : "",
        endDate: campaignData.endDate
            ? campaignData.endDate.substring(0, 10)
            : "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // CustomDropDown gives raw value directly, not an event
    const handleDropdownChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${BASE_URL}/campaign/update/${campaignData._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                getCampaign();
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl relative max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-slate-100 p-6 md:p-8 pb-4 flex items-start justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Edit Campaign
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Update the details below to edit your campaign.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form
                    id="edit-campaign-form"
                    onSubmit={handleSubmit}
                    className="p-6 md:p-8 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-y-auto"
                >
                    <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                            Campaign Name
                        </label>
                        <div className="border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 rounded-lg overflow-hidden flex items-center transition-all">
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Summer Sale 2026"
                                className="w-full py-2.5 px-3.5 text-sm bg-transparent outline-none text-slate-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                            Platform
                        </label>
                        <div>
                            <CustomDropDown
                                value={formData.platform}
                                options={PLATFORM_OPTIONS}
                                onChange={(val) => handleDropdownChange("platform", val)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                            Status
                        </label>
                        <div>
                            <CustomDropDown
                                value={formData.status}
                                options={STATUS_OPTIONS}
                                onChange={(val) => handleDropdownChange("status", val)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                            Start Date
                        </label>
                        <div>
                            <CustomCalendar
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                maxDate={formData.endDate || undefined}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                            End Date
                        </label>
                        <div>
                            <CustomCalendar
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                minDate={formData.startDate || undefined}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                            Objective
                        </label>
                        <div className="border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 rounded-lg overflow-hidden flex items-center transition-all">
                            <input
                                name="objective"
                                value={formData.objective}
                                onChange={handleChange}
                                placeholder="e.g. Lead Generation"
                                className="w-full py-2.5 px-3.5 text-sm bg-transparent outline-none text-slate-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                            Budget
                        </label>
                        <div className="border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 rounded-lg overflow-hidden flex items-center transition-all">
                            <input
                                type="number"
                                name="totalBudget"
                                value={formData.totalBudget}
                                onChange={handleChange}
                                placeholder="e.g. 50000"
                                className="w-full py-2.5 px-3.5 text-sm bg-transparent outline-none text-slate-700"
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 md:p-8 pt-2 flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Update Campaign"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditCampaign;