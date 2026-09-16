import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddLead from "./pages/AddLead";
import Reminders from "./pages/Reminders";
import LandingPage from "./pages/LandingPage";

import Layout from "./componenets/Layout";
import Analytics from "./componenets/Analytics";
import Team from "./componenets/Team";
import Setting from "./componenets/Setting";
import LeadMangement from "./componenets/LeadMangement";
import FollowupsList from "./componenets/FollowupsList";
import AddFollowUps from "./componenets/AddFollowUps";

import Register from "./componenets/Register";
import Login from "./componenets/Login";
import TeamLogin from "./componenets/TeamLogin";
import ForgotPassword from "./componenets/ForgotPassword";

import { Toaster } from "react-hot-toast";
import Pricing from "./componenets/Pricing";
import Source from "./componenets/Source";
import Campaign from "./componenets/Campaign";
import CreateCampaign from "./componenets/CreateCampaign";
import CampaignDetail from "./componenets/CampaignDetail";
import LeadDetail from "./pages/LeadDetail";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminOnlyRoute = ({ children }) => {
  const loginType = localStorage.getItem("loginType");

  if (loginType === "team") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 99999,
          },
        }}
        containerStyle={{
          zIndex: 99999,
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/team-login" element={<TeamLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadMangement />} />
          <Route path="leads/:id" element={<LeadDetail />} />
          <Route path="followups" element={<FollowupsList />} />
          <Route path="add" element={<AddLead />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="source" element={<Source />} />
          {/* <Route path="campaign" element={<Campaign/>}  />
          <Route
            path="/campaign/create"
            element={<CreateCampaign />}
          /> */}
          <Route
            path="team"
            element={
              <AdminOnlyRoute>
                <Team />
              </AdminOnlyRoute>
            }
          />
          
          {/* <Route path="/campaign/:id" element={<CampaignDetail />} /> */}



          <Route
            path="settings"
            element={
              <AdminOnlyRoute>
                <Setting />
              </AdminOnlyRoute>
            }
          />
  
          <Route path="addfollowups" element={<AddFollowUps />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;