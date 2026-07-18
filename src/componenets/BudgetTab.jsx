import { useEffect, useState } from "react";
import { Plus, Wallet, Trash2, StickyNote } from "lucide-react";
import toast from "react-hot-toast";
import AddBudgetPopup from "./AddBudgetPopup";
import CustomPopupDelete from "./CustomPopupDelete";
import { formatDateDDMMYYYY } from "../utils/dateFormatter";

const BASE_URL = import.meta.env.VITE_API_URL;

const BudgetTab = ({ campaignId }) => {
    const [entries, setEntries] = useState([]);
    const [totalAdded, setTotalAdded] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAddBudget, setShowAddBudget] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const getBudgetEntries = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/budget/get-budget/${campaignId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setEntries(data.data);
                setTotalAdded(data.totalAdded);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${BASE_URL}/budget/delete/${campaignId}/${deleteId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                getBudgetEntries();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    useEffect(() => {
        getBudgetEntries();
    }, [campaignId]);

    return (
        <div>
            {/* Running total card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-md rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <Wallet size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="text-indigo-100 text-sm font-medium">Total Budget Added</p>
                        <p className="text-white text-3xl font-bold tracking-tight mt-0.5">
                            ₹ {totalAdded.toLocaleString()}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowAddBudget(true)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all w-full sm:w-auto justify-center shadow-sm"
                >
                    <Plus size={16} />
                    Add Budget
                </button>
            </div>

            {/* List */}
            {loading ? (
                <p className="text-center text-gray-400 py-10 text-sm">Loading...</p>
            ) : entries.length === 0 ? (
                <div className="text-center text-gray-400 py-16 text-sm border rounded-2xl">
                    No budget top-ups added yet.
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-sm overflow-hidden">
                    {entries.map((entry) => (
                        <div
                            key={entry._id}
                            className="flex items-start sm:items-center justify-between p-5 sm:px-6 gap-4 hover:bg-slate-50/50 transition-colors"
                        >
                            <div>
                                <p className="font-bold text-emerald-600 text-lg">
                                    + ₹ {entry.amount.toLocaleString()}
                                </p>
                                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mt-1.5">
                                    {formatDateDDMMYYYY(entry.date)}
                                    {entry.addedBy?.name ? ` · Added by ${entry.addedBy.name}` : ""}
                                </p>
                                {entry.note && (
                                    <p className="text-sm font-medium text-slate-600 mt-2 flex items-center gap-1.5 bg-slate-100 inline-flex px-2 py-1 rounded-md">
                                        <StickyNote size={14} className="text-indigo-500" />
                                        {entry.note}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setDeleteId(entry._id)}
                                className="w-9 h-9 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center shrink-0 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showAddBudget && (
                <AddBudgetPopup
                    campaignId={campaignId}
                    onClose={() => setShowAddBudget(false)}
                    onSuccess={getBudgetEntries}
                />
            )}

            {deleteId && (
                <CustomPopupDelete
                    onClose={() => setDeleteId(null)}
                    onDelete={confirmDelete}
                    loading={deleting}
                />
            )}
        </div>
    );
};

export default BudgetTab;