import React, { useEffect, useState } from "react";

const TrackComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --------------------------------------------------
  // FETCH COMPLAINTS
  // --------------------------------------------------
  useEffect(() => {
    console.log("TrackComplaint component rendered");

    fetch("http://localhost:8080/api/complaints")
      .then(res => res.json())
      .then(data => {
        console.log("COMPLAINTS RECEIVED:", data);
        setComplaints(data); // ❗ NO FILTER (important)
      })
      .catch(err => console.error(err));
  }, []);

  // --------------------------------------------------
  // STATUS COLOR
  // --------------------------------------------------
  const getColor = (status) => {
    switch (status?.toLowerCase().trim()) {
      case "pending": return "orange";
      case "assigned": return "blue";
      case "resolved": return "green";
      case "reopened": return "red";
      default: return "gray";
    }
  };

  // --------------------------------------------------
  // FILTER BY CATEGORY
  // --------------------------------------------------
  const filteredComplaints =
    selectedCategory === "All"
      ? complaints
      : complaints.filter(c => c.category === selectedCategory);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div style={{ padding: 30, background: "purple", minHeight: "100vh" }}>
      <h1 style={{ color: "white", textAlign: "center" }}>My Complaints</h1>

      {/* CATEGORY FILTER */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "none",
            fontWeight: "bold"
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

      {/* COMPLAINT CARDS */}
      {filteredComplaints.map(c => {

        if (c.resolvedImagePath) {
          c.resolvedImagePath = c.resolvedImagePath.replace(/\\/g, "/");
        }

        return (
          <div
            key={c._id}
            style={{
              background: "white",
              padding: 20,
              margin: "15px auto",
              maxWidth: 800,
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
            }}
          >
            <p><b>Name:</b> {c.name}</p>
            <p><b>Location:</b> {c.location}</p>
            <p><b>Category:</b> {c.category}</p>
            <p><b>Description:</b> {c.description}</p>

            <span style={{
              background: getColor(c.status),
              padding: "8px 16px",
              color: "white",
              borderRadius: 8,
              fontWeight: "bold"
            }}>
              {c.status}
            </span>

            {/* VIEW RESOLVED IMAGE */}
            {c.resolvedImagePath && (
              <button
                style={{
                  marginLeft: 10,
                  padding: "8px 14px",
                  background: "green",
                  color: "white",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer"
                }}
                onClick={() =>
                  window.open(
                    `http://localhost:8080/${c.resolvedImagePath}`,
                    "_blank"
                  )
                }
              >
                View Resolved Image
              </button>
            )}

            {/* ✅ FEEDBACK BUTTON (100% visible) */}
            <button
              style={{
                marginLeft: 10,
                padding: "8px 16px",
                background: "red",
                color: "white",
                borderRadius: 8,
                border: "none",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Feedback
            </button>

          </div>
        );
      })}
    </div>
  );
};

export default TrackComplaint;
