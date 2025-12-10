import React, { useEffect, useState } from "react";

const TrackComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const citizen = JSON.parse(localStorage.getItem("citizen"));
  const citizenEmail = citizen?.email;

  useEffect(() => {
    fetch("http://localhost:8080/api/complaints")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(c => c.email === citizenEmail);
        setComplaints(filtered);
      });
  }, [citizenEmail]);

  const getColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "orange";
      case "assigned": return "blue";
      case "resolved": return "green";
      default: return "gray";
    }
  };

  // 🔥 FIXED FILTER LOGIC (Partial + Case-Insensitive Match)
  const filteredComplaints =
    selectedCategory === "All"
      ? complaints
      : complaints.filter(c =>
        c.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  return (
    <div style={{ padding: 30, background: "purple", minHeight: "100vh" }}>
      <h1 style={{ color: "white", textAlign: "center" }}>My Complaints</h1>

      {/* Dropdown */}
      <div style={{ textAlign: "left", marginBottom: 20 }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          <option value="All">All Categories</option>
          <option value="Water">Water</option>
          <option value="Electricity">Electricity</option>
          <option value="Road">Road</option>
          <option value="Garbage">Garbage</option>
          <option value="Streetlight">Streetlight</option>
        </select>
      </div>

      {filteredComplaints.map(c => (
        <div
          key={c._id}
          style={{
            background: "white",
            padding: 20,
            margin: "15px auto",
            maxWidth: 800,
            borderRadius: 12,
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          }}
        >
          <p><b>Location:</b> {c.location}</p>
          <p><b>Category:</b> {c.category}</p>
          <p><b>Description:</b> {c.description}</p>

          <span
            style={{
              background: getColor(c.status),
              padding: "8px 16px",
              color: "white",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {c.status}
          </span>

          {c.resolvedImagePath && (
            <button
              style={{
                marginLeft: 10,
                padding: "8px 14px",
                background: "green",
                color: "white",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open(`http://localhost:8080/${c.resolvedImagePath}`, "_blank")
              }
            >
              View Resolved Image
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackComplaint;
