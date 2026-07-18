import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Link2,
  Unlink,
} from "lucide-react";

import ProfileCard from "./ProfileCard";
import SecurityCard from "./SecurityCard";
import LogoutCard from "./LogoutCard";

const BASE_URL = import.meta.env.VITE_API_URL;

const Setting = () => {
  const [fbConnected, setFbConnected] = useState(false);
  const [fbName, setFbName] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [fbPages, setFbPages] = useState([]);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      if (!token) {
        setLoadingStatus(false);
        return;
      }

      const res = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setFbConnected(res.data.user.facebookConnected || false);
        setFbName(res.data.user.facebookName || "");
        setFbPages(res.data.user.facebookPages || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const params = new URLSearchParams(window.location.search);

    if (params.get("facebook") === "connected") {
      fetchProfile();
      window.history.replaceState({}, "", "/settings");
    }

    if (params.get("facebook") === "failed") {
      alert("Facebook connection failed");
      window.history.replaceState({}, "", "/settings");
    }
  }, []);

  const handleFacebookConnect = () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    window.location.href = `${BASE_URL}/auth/facebook?token=${token}`;
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);

      const res = await fetch(
        `${BASE_URL}/auth/facebook/disconnect`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setFbConnected(false);
        setFbName("");
        setFbPages([]);
        alert("Facebook disconnected successfully");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">

          <ProfileCard />

          <SecurityCard />

        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
          <LogoutCard />
          
          {/* Facebook Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Facebook Integration
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Connect your Facebook account to sync leads.
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${fbConnected
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                  }`}
              >
                {fbConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="mt-6 bg-slate-50/50 rounded-lg border border-slate-100 p-5">
              {loadingStatus ? (
                <div className="text-center text-slate-500">
                  Checking connection...
                </div>
              ) : fbConnected ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle2
                        className="text-green-600"
                        size={24}
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Connected Successfully
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5">
                        Connected as{" "}
                        <span className="font-semibold">
                          {fbName}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="mt-5 w-full bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Unlink size={16} />
                    {disconnecting
                      ? "Disconnecting..."
                      : "Disconnect Facebook"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFacebookConnect}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Link2 size={16} />
                  Connect Facebook
                </button>
              )}
            </div>
            
            {fbConnected && fbPages.length > 0 && (
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-5 mt-6">
                <h4 className="font-bold text-slate-900 text-sm mb-3">Connected Pages</h4>
                <div className="flex flex-col gap-3">
                  {fbPages.map((page) => (
                    <div
                      key={page.pageId}
                      className="flex flex-col"
                    >
                      <p className="text-sm font-semibold text-slate-700">{page.pageName}</p>
                      <p className="text-xs text-slate-500">{page.pageId}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Setting;