

import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const Layout = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleSideBar = () => setShowSideBar((p) => !p);

  // Reset scroll to top on every route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Fix: force body to never scroll (AllLeads was setting body overflow to auto)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("token");
      const loginType = localStorage.getItem("loginType");

      if (!token || loginType === "team") return;

      const res = await fetch(`${BASE_URL}/auth/check-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    };

    checkStatus();
  }, [navigate]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50">

      {showSideBar && (
        <div
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setShowSideBar(false)}
        />
      )}

      <SideBar
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
        handleSideBar={handleSideBar}
      />

      <div className="flex flex-col flex-1 h-screen overflow-hidden lg:ml-72">
        <Topbar handleSideBar={handleSideBar} />

        <main ref={mainRef} className="flex-1 overflow-y-auto pt-24 px-5 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;