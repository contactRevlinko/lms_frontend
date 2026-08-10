import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Wallet, FileText, BarChart3 } from "lucide-react";
import BudgetTab from "./BudgetTab";
import DailyReport from "./DailyReport";
import AnalyticsTab from "./analyticsBudgetTab";

const TABS = [
    { key: "budget", label: "Budget", icon: Wallet },
    { key: "reports", label: "Daily Reports", icon: FileText },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
];

const CampaignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("budget");

    return (
        <div>
            <button
                onClick={() => navigate("/campaign")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6"
            >
                <ArrowLeft size={16} />
                Back to Campaigns
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
                Campaign Detail
            </h1>

            <div className="flex gap-6 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                                isActive
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                            }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === "budget" && <BudgetTab campaignId={id} />}

            {activeTab === "reports" && (
                <DailyReport campaignId={id} />
            )}

            {activeTab === "analytics" && (
                <AnalyticsTab campaignId={id}  />
            )}
        </div>
    );
};

export default CampaignDetail;