import React, { useEffect, useState } from "react";

const TrackComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [feedbackMap, setFeedbackMap] = useState({}); // ⭐ NEW
  const [noteMap, setNoteMap] = useState({});        // ⭐ NEW

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
      case "reopened": return "red";
      default: return "gray";
    }
  };

  // -------- FILTER LOGIC (NO CHANGE) --------
  const filteredComplaints =
    selectedCategory === "All"
      ? complaints
      : complaints.filter(c => c.category === selectedCategory);

  // ⭐ SUBMIT FEEDBACK (NEW)
  const submitFeedback = async (complaintId, rating, note) => {
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    let reopen = rating <= 2; // ⭐ if <=2 → REOPEN complaint

    const res = await fetch(`http://localhost:8080/api/complaints/feedback/${complaintId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        note,
        reopen
      })
    });

    if (res.ok) {
      alert("Feedback submitted!");

      // Refresh complaints
      fetch("http://localhost:8080/api/complaints")
        .then(r => r.json())
        .then(data => {
          const filtered = data.filter(c => c.email === citizenEmail);
          setComplaints(filtered);
        });
    } else {
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div style={{ padding: 30, background: "purple", minHeight: "100vh" }}>
      <h1 style={{ color: "white", textAlign: "center" }}>My Complaints</h1>

      {/* --- CATEGORY DROPDOWN --- */}
      <div style={{ textAlign: "left", marginBottom: 20 }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "none",
            fontWeight: "bold",
            cursor: "pointer"
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

      {/* --- CARDS DISPLAY --- */}
      {filteredComplaints.map(c => (
        <div key={c._id}
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
            borderRadius: "8px",
            fontWeight: "bold"
          }}>
            {c.status}
          </span>

          {/* ⭐ VIEW RESOLVED IMAGE */}
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
              onClick={() => window.open(`http://localhost:8080/${c.resolvedImagePath}`, "_blank")}
            >
              View Resolved Image
            </button>
          )}

          {/* ⭐⭐ FEEDBACK SECTION ONLY FOR RESOLVED ⭐⭐ */}
          {c.status === "Resolved" && (
            <div style={{
              marginTop: 20,
              padding: 15,
              borderRadius: 10,
              background: "#f0e1ff"
            }}>
              <h3>Give Feedback</h3>

              {/* ⭐ Rating */}
              <select
                value={feedbackMap[c._id] || ""}
                onChange={(e) =>
                  setFeedbackMap({ ...feedbackMap, [c._id]: Number(e.target.value) })
                }
                style={{ padding: 8, marginTop: 10 }}
              >
                <option value="">Select Rating</option>
                <option value="1">1 ★</option>
                <option value="2">2 ★</option>
                <option value="3">3 ★</option>
                <option value="4">4 ★</option>
                <option value="5">5 ★</option>
              </select>

              {/* ⭐ Feedback note */}
              <textarea
                placeholder="Write feedback (optional)"
                value={noteMap[c._id] || ""}
                onChange={(e) =>
                  setNoteMap({ ...noteMap, [c._id]: e.target.value })
                }
                style={{
                  width: "100%",
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 8
                }}
              />

              <button
                style={{
                  marginTop: 10,
                  padding: "10px 20px",
                  background: "purple",
                  color: "white",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer"
                }}
                onClick={() =>
                  submitFeedback(c._id, feedbackMap[c._id], noteMap[c._id])
                }
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackComplaint;
