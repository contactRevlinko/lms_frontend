import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CreateCampaign from "./CreateCampaign";
import CustomPopupDelete from "./CustomPopupDelete";
import toast from "react-hot-toast";
import EditCampaign from "./EditCampaign";
import { Pencil, Trash2 } from "lucide-react/dist/cjs/lucide-react";


const BASE_URL = import.meta.env.VITE_API_URL;

const Campaign = () => {
    const navigate = useNavigate();
    const loginType = localStorage.getItem("loginType");
    const isTeamLogin = loginType === "team";
  
    const [campaign, setCampaign] = useState([]);
   
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);


    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [editCampaignData, setEditCampaignData] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "-";
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };
    const getCampaign = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/campaign`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setCampaign(data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getCampaign();
    }, []);

    // Opens the same CreateCampaign popup but pre-filled for editing
    const editCampaign = (campaignItem) => {
        setEditCampaignData(campaignItem);
    };

    // Just opens the confirm-delete popup, doesn't delete yet
    const deleteCampaign = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/campaign/delete/${deleteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                getCampaign();
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

    // Close create/edit popup and clear edit state together
    const closeCampaignForm = (val) => {
        setShowCreateCampaign(val);
        if (!val) setEditCampaignData(null);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Campaign Management
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Manage and track all your marketing campaigns.
                    </p>
                </div>

                {!isTeamLogin && (
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={async () => {
                                const toastId = toast.loading("Syncing with Meta...");
                                try {
                                    const token = localStorage.getItem("token");
                                    const res = await fetch(`${BASE_URL}/campaign/sync-meta`, {
                                        method: "POST",
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        toast.success(data.message, { id: toastId });
                                        getCampaign(); // Refresh list
                                    } else {
                                        toast.error(data.message || "Failed to sync", { id: toastId });
                                    }
                                } catch (err) {
                                    toast.error("Network error during sync", { id: toastId });
                                }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium flex-1 sm:flex-none shadow-sm transition-colors"
                        >
                            Sync with Meta 🔄
                        </button>
                        <button
                            onClick={() => setShowCreateCampaign(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium flex-1 sm:flex-none shadow-sm transition-colors"
                        >
                            + Campaign
                        </button>
                    </div>
                )}
            </div>

            {editCampaignData && (
                <EditCampaign
                    campaignData={editCampaignData}
                    onClose={() => setEditCampaignData(null)}
                    getCampaign={getCampaign}
                />
            )}


            {showCreateCampaign && (
                <CreateCampaign
                    setShowCreateCampaign={closeCampaignForm}
                    getCampaign={getCampaign}
                    editData={editCampaignData}
                />
            )}

            {deleteId && (
                <CustomPopupDelete
                    onClose={() => setDeleteId(null)}
                    onDelete={confirmDelete}
                    loading={deleting}
                />
            )}

            {campaign.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200 mt-6 shadow-sm">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">📢</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Campaigns Found</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        You haven't created any campaigns yet. Start tracking your marketing efforts by creating your first campaign.
                    </p>
                    {!isTeamLogin && (
                        <button
                            onClick={() => setShowCreateCampaign(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-colors"
                        >
                            + Create Campaign
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    {campaign.map((campaign) => (
                    <div
                        key={campaign._id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                    >
                        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 line-clamp-1">
                                    {campaign.name}
                                </h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">
                                    {campaign.platform}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold shrink-0 ml-2 ${
                                    campaign.status === "Active"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : campaign.status === "Paused"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-slate-100 text-slate-600"
                                }`}
                            >
                                {campaign.status}
                            </span>
                        </div>

                        <div className="p-6 flex-grow">
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Objective</p>
                                    <p className="font-semibold text-slate-700 text-sm truncate">
                                        {campaign.objective || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Budget</p>
                                    <p className="font-bold text-emerald-600 text-sm">
                                        ₹ {campaign.totalBudget?.toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Source</p>
                                    <p className="font-medium text-slate-600 text-sm">
                                        {campaign.source?.name || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Created By</p>
                                    <p className="font-medium text-slate-600 text-sm truncate">
                                        {campaign.createdBy?.name || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Start Date</p>
                                    <p className="font-medium text-slate-600 text-sm">
                                        {formatDate(campaign.startDate)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">End Date</p>
                                    <p className="font-medium text-slate-600 text-sm">
                                        {formatDate(campaign.endDate)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 p-5 bg-slate-50/50 flex flex-wrap justify-between items-center gap-3">
                            <button
                                onClick={() => navigate(`/campaign/${campaign._id}`)}
                                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex-grow sm:flex-grow-0 text-center"
                            >
                                View Details
                            </button>

                            <div className="flex items-center gap-2 flex-grow sm:flex-grow-0 justify-end">
                                {!isTeamLogin && (
                                    <>
                                        <button
                                            onClick={() => editCampaign(campaign)}
                                            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm flex-1 sm:flex-none"
                                        >
                                            <Pencil size={16} />
                                            <span className="hidden sm:inline">Edit</span>
                                        </button>

                                        <button
                                            onClick={() => deleteCampaign(campaign._id)}
                                            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all shadow-sm flex-1 sm:flex-none"
                                        >
                                            <Trash2 size={16} />
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default Campaign;