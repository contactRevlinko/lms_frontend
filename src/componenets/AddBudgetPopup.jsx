import { useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { X, IndianRupee, Wallet } from "lucide-react";
import CustomCalendar from "./CustomCalender";

const BASE_URL = import.meta.env.VITE_API_URL;

const AddBudgetPopup = ({ campaignId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        amount: "",
        date: "",
        note: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.date) {
            toast.error("Please fill amount and date.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${BASE_URL}/budget/add-budget/${campaignId}`,
                {
                    method: "POST",
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
                onSuccess();
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
        <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl">
                <div className="px-6 py-5 border-b flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Wallet size={16} />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Budget</h1>
                            <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">
                                Enter the amount to add to your budget.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <div className={`mt-1.5 flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors duration-200 ${formData.amount ? "bg-indigo-50/40" : "bg-white"}`}>
                            <IndianRupee size={14} className="text-gray-400 mr-2" />
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full py-2.5 outline-none text-sm bg-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <div className="mt-1.5">
                            <CustomCalendar
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Note (optional)
                        </label>
                        <input
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="e.g. Top-up for week 2"
                            className={`mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${formData.note ? "bg-indigo-50/40" : "bg-white"}`}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                      
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
                        >
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddBudgetPopup;