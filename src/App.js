import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components / Pages
import SubmitComplaint from "./components/SubmitComplaint";
import TrackComplaint from "./components/TrackComplaint";

// existing pages
import Welcome from "./pages/Welcome";
import Services from "./pages/Services";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ViewComplaint from "./pages/ViewComplaint";
import OfficerAssigned from "./pages/OfficerAssigned";
import AddOfficer from "./pages/AddOfficer";
import ResolvedComplaints from "./pages/ResolvedComplaints";

// dashboard pages
import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";

// NEW
//import OfficerAssigned from "./pages/OfficerAssigned";

function App() {
  return (
    <Router>
      <Routes>

        {/* Start Here */}
        <Route path="/" element={<Welcome />} />

        <Route path="/services" element={<Services />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Role Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/citizen" element={<CitizenDashboard />} />

        <Route path="/submit-complaint" element={<SubmitComplaint />} />
        <Route path="/track-complaints" element={<TrackComplaint />} />
        <Route path="/view-complaints" element={<ViewComplaint />} />

        {/* Officer Dashboard */}
        <Route path="/officer" element={<OfficerDashboard />} />

        {/* Officer Complaint Pages */}
        <Route path="/officer/assigned" element={<OfficerAssigned />} />
        <Route path="/add-officer" element={<AddOfficer />} />
        <Route path="/officer/resolved" element={<ResolvedComplaints />} />


      </Routes>
    </Router>
  );
}

export default App;
