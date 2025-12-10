import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper to color status
const getStatusColor = (status) => {
    if (!status) return "#666";
    switch (status.toLowerCase()) {
        case "pending": return "gray";
        case "assigned": return "#1a75ff";
        case "resolved": return "green";
        default: return "#444";
    }
};

const ComplaintCard = ({ complaint, officers }) => {
    const [officer, setOfficer] = useState(complaint.assignedOfficer || "");
    const [deadline, setDeadline] = useState(complaint.deadline || "");
    const [priority, setPriority] = useState(complaint.priority || "Normal");
    const [message, setMessage] = useState("");

    const handleAssign = () => {
        if (!officer) {
            setMessage("Please select an officer!");
            return;
        }

        fetch(`http://localhost:8080/api/complaints/update/${complaint.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "Assigned",
                assignedOfficer: officer,
                deadline,
                priority
            })
        })
            .then(res => res.json())
            .then(() => {
                const assignedName = officers.find(o => o.id === officer)?.name || officer;
                setMessage(`Assigned to ${assignedName} successfully!`);
            })
            .catch(() => setMessage("Failed to assign!"));
    };

    // ------------------ TODAY'S DATE BLOCKED FIX ------------------
    const today = new Date().toISOString().split("T")[0];
    // --------------------------------------------------------------

    return (
        <div className="complaint-card" style={{ backgroundColor: "#f3e6ff" }}>
            <div className="complaint-info">
                <p><strong>Name:</strong> {complaint.name}</p>
                <p><strong>Location:</strong> {complaint.location}</p>
                <p><strong>Category:</strong> {complaint.category}</p>
                <p><strong>Description:</strong> {complaint.description}</p>

                <p style={{
                    marginTop: "8px",
                    padding: "8px 14px",
                    display: "inline-block",
                    backgroundColor: getStatusColor(complaint.status),
                    color: "white",
                    borderRadius: "8px",
                    fontWeight: "bold"
                }}>
                    {complaint.status}
                </p>

                {complaint.resolvedImagePath && (
                    <button
                        onClick={() => window.open(`http://localhost:8080/${complaint.resolvedImagePath}`, "_blank")}
                        style={{
                            marginTop: "10px",
                            padding: "8px 12px",
                            background: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        View Resolved Image
                    </button>
                )}
            </div>

            <div className="complaint-actions">

                <select value={officer} onChange={e => setOfficer(e.target.value)}>
                    <option value="">Assign Officer</option>
                    {officers.map(o => (
                        <option key={o.id} value={o.id}>
                            {o.name}
                        </option>
                    ))}
                </select>

                {/* MIN DATE ADDED */}
                <input
                    type="date"
                    min={today}
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                />

                <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                </select>

                <button className="assign-btn" onClick={handleAssign}>Assign</button>
                {message && <p style={{ color: "green" }}>{message}</p>}
            </div>
        </div>
    );
};

const ViewComplaint = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [officers, setOfficers] = useState([]);

    const [filterCategory, setFilterCategory] = useState("All");

    useEffect(() => {
        fetch("http://localhost:8080/api/complaints")
            .then(res => res.json())
            .then(data => setComplaints(data));

        fetch("http://localhost:8080/api/officers/all")
            .then(res => res.json())
            .then(data => setOfficers(data));
    }, []);

    // ------------------ FIXED ROAD FILTER ------------------
    const filteredComplaints =
        filterCategory === "All"
            ? complaints
            : complaints.filter((c) =>
                c.category?.toLowerCase().trim().includes(filterCategory.toLowerCase().trim())
            );
    // --------------------------------------------------------

    return (
        <div className="view-complaints-page">
            <button className="back-btn" onClick={() => navigate("/admin")}>← Back</button>

            <h1>All Complaints</h1>

            <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                    padding: "10px",
                    marginBottom: "20px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                <option value="All">All Categories</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Road">Road</option> {/* FIXED */}
                <option value="Garbage">Garbage</option>
                <option value="Sewage">Sewage</option>
            </select>

            <div className="complaints-wrapper">
                {filteredComplaints.map(c => (
                    <ComplaintCard key={c.id} complaint={c} officers={officers} />
                ))}
            </div>

            <style>{`
        .view-complaints-page {
          min-height: 100vh;
          padding: 30px;
          background-color: #6a0dad;
          color: white;
        }
        .back-btn {
          padding: 10px 20px;
          background-color: white;
          color: #6a0dad;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .complaints-wrapper { display: flex; flex-direction: column; gap: 20px; }
        .complaint-card { 
          display: flex; 
          justify-content: space-between; 
          padding: 20px; 
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          background: white;
          color: black;
        }
        .complaint-actions select, .complaint-actions input {
          padding: 8px; margin-bottom: 10px;
        }
        .assign-btn {
          padding: 8px;
          background-color: #4b0082;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};

export default ViewComplaint;
