import React, { useEffect, useState } from "react";

const TrackComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeComplaintId, setActiveComplaintId] = useState(null);
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");

  const citizen = JSON.parse(localStorage.getItem("citizen"));
  const citizenEmail = citizen?.email;

  // FETCH COMPLAINTS
  useEffect(() => {
    fetch("http://localhost:8080/api/complaints")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(c => c.email === citizenEmail);
        setComplaints(filtered);
      })
      .catch(err => console.error(err));
  }, [citizenEmail]);

  // STATUS COLOR
  const getColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "orange";
      case "assigned": return "blue";
      case "resolved": return "green";
      case "reopened": return "red";
      default: return "gray";
    }
  };

  // CATEGORY FILTER
  const filteredComplaints =
    selectedCategory === "All"
      ? complaints
      : complaints.filter(c =>
        c.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  // SUBMIT FEEDBACK
  const submitFeedback = async () => {
    if (!rating) {
      alert("Please select rating");
      return;
    }

    if (!activeComplaintId) {
      alert("Invalid complaint ID");
      return;
    }

    const reopen = Number(rating) <= 2;

    try {
      const res = await fetch(
        `http://localhost:8080/api/complaints/feedback/${activeComplaintId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: Number(rating),
            note,
            reopen
          })
        }
      );

      const data = await res.json();
      alert(data.message);

      const refreshed = await fetch("http://localhost:8080/api/complaints");
      const all = await refreshed.json();
      setComplaints(all.filter(c => c.email === citizenEmail));

      setShowFeedback(false);
      setRating("");
      setNote("");
      setActiveComplaintId(null);

    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback");
    }
  };

  return (
    <div style={{ padding: 30, background: "purple", minHeight: "100vh" }}>
      <h1 style={{ color: "white", textAlign: "center" }}>My Complaints</h1>

      {/* CATEGORY DROPDOWN */}
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
      {filteredComplaints.map(c => (
        <div
          key={c.id}
          style={{
            background: "white",
            padding: 20,
            margin: "15px auto",
            maxWidth: 800,
            borderRadius: 12,
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
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
              borderRadius: 8,
              fontWeight: "bold"
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
                cursor: "pointer"
              }}
              onClick={() =>
                window.open(
                  `http://localhost:8080/${c.resolvedImagePath.replace(/\\/g, "/")}`,
                  "_blank"
                )
              }
            >
              View Resolved Image
            </button>
          )}

          {c.status?.toLowerCase() === "resolved" && (
            <button
              style={{
                marginLeft: 10,
                padding: "8px 14px",
                background: "#6a0dad",
                color: "white",
                borderRadius: 8,
                border: "none",
                cursor: "pointer"
              }}
              onClick={() => {
                setActiveComplaintId(c.id);
                setShowFeedback(true);
              }}
            >
              Feedback
            </button>
          )}
        </div>
      ))}

      {/* FEEDBACK MODAL */}
      {showFeedback && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 10,
              width: 300
            }}
          >
            <h3>Give Feedback</h3>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            >
              <option value="">Select Rating</option>
              <option value="1">1 ★</option>
              <option value="2">2 ★</option>
              <option value="3">3 ★</option>
              <option value="4">4 ★</option>
              <option value="5">5 ★</option>
            </select>

            <textarea
              placeholder="Write feedback (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button
                style={{
                  flex: 1,
                  padding: 8,
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: 6
                }}
                onClick={submitFeedback}
              >
                Submit
              </button>

              <button
                style={{
                  flex: 1,
                  padding: 8,
                  background: "gray",
                  color: "white",
                  border: "none",
                  borderRadius: 6
                }}
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackComplaint;
