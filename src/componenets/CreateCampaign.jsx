import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { X, Megaphone, Target, IndianRupee } from "lucide-react";
import CustomDropDown from "./CustomDropDown";
import CustomCalendar from "./CustomCalender";

const BASE_URL = import.meta.env.VITE_API_URL;

const PLATFORM_OPTIONS = ["Meta", "Google", "Both", "Other"];
const STATUS_OPTIONS = ["Active", "Paused", "Completed"];

const CreateCampaign = ({ setShowCreateCampaign, getCampaign }) => {
    const [sources, setSources] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        platform: "Meta",
        objective: "",
        source: "",
        totalBudget: "",
        startDate: "",
        endDate: "",
        status: "Active",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Dropdown onChange gives raw value directly, not an event
    const handleDropdownChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const getSources = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/source/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setSources(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/campaign/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                getCampaign();
                setShowCreateCampaign(false);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        getSources();
    }, []);

    // CustomDropDown needs the full source object (with name/_id) to display the label,
    // not just the stored _id string.
    const selectedSource = sources.find((s) => s._id === formData.source) || "";

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl relative max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="border-b px-4 py-3 sm:px-8 sm:py-6 flex items-start justify-between shrink-0">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Create Campaign
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Fill the details below to create a new campaign.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowCreateCampaign(false)}
                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 overflow-y-auto"
                >
                    <div >
                        <label className="text-sm font-medium text-gray-700">
                            Campaign Name
                        </label>
                        <div className="mt-1 border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 flex items-center">
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Summer Sale 2026"
                                className={`w-full py-3 outline-none px-3 text-sm ${
                                    formData.name ? "bg-indigo-50/50" : "bg-white"
                                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Platform
                        </label>
                        <div className="mt-1">
                            <CustomDropDown
                                value={formData.platform}
                                options={PLATFORM_OPTIONS}
                                onChange={(val) => handleDropdownChange("platform", val)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Objective
                        </label>
                        <div className="mt-1 border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 relative">
                            <input
                                name="objective"
                                value={formData.objective}
                                onChange={handleChange}
                                placeholder="e.g. Lead Generation"
                                className={`w-full py-3 outline-none px-3 text-sm ${
                                    formData.objective ? "bg-indigo-50/50" : "bg-white"
                                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Source
                        </label>
                        <div className="mt-2">
                            <CustomDropDown
                                value={selectedSource}
                                options={sources}
                                onChange={(val) => handleDropdownChange("source", val)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Budget
                        </label>
                        <div className="mt-2 flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                            <input
                                type="number"
                                name="totalBudget"
                                value={formData.totalBudget}
                                onChange={handleChange}
                                placeholder="0"
                                className={`w-full py-3 outline-none px-3 text-sm ${
                                    formData.totalBudget ? "bg-indigo-50/50" : "bg-white"
                                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <div className="mt-2">
                            <CustomDropDown
                                value={formData.status}
                                options={STATUS_OPTIONS}
                                onChange={(val) => handleDropdownChange("status", val)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <div className="mt-1">
                            <CustomCalendar
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                maxDate={formData.endDate || undefined}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <div className="mt-1">
                            <CustomCalendar
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                minDate={formData.startDate || undefined}
                            />
                        </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 pt-2">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-medium w-full sm:w-auto"
                        >
                            Save Campaign
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CreateCampaign;