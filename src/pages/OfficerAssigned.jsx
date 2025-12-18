import React, { useEffect, useState } from "react";

const OfficerAssigned = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadMap, setUploadMap] = useState({});

    const officer = JSON.parse(localStorage.getItem("officer"));
    const officerId = officer?.id || officer?._id;

    useEffect(() => {
        if (!officerId) return;

        fetch(`http://localhost:8080/api/complaints/assigned/${officerId}`)
            .then(res => res.json())
            .then(data => {
                setComplaints(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [officerId]);

    // RESOLVE HANDLER
    const handleResolved = async (compId) => {
        const file = uploadMap[compId];
        if (!file) {
            alert("Please upload a resolved image!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
            `http://localhost:8080/api/complaints/upload-resolved/${compId}`,
            { method: "POST", body: formData }
        );

        if (res.ok) {
            alert("Complaint marked RESOLVED!");

            const updated = await fetch(
                `http://localhost:8080/api/complaints/assigned/${officerId}`
            );
            setComplaints(await updated.json());
        } else {
            alert("Failed to resolve complaint.");
        }
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.heading}>Assigned Complaints</h1>

            {loading && <p style={styles.info}>Loading...</p>}
            {!loading && complaints.length === 0 && (
                <p style={styles.info}>No assigned complaints.</p>
            )}

            <div style={styles.cardList}>
                {complaints.map((c) => (
                    <div key={c.id} style={styles.card}>
                        <h2 style={styles.title}>{c.category}</h2>

                        <p><b>Name:</b> {c.name}</p>
                        <p><b>Location:</b> {c.location}</p>
                        <p><b>Description:</b> {c.description}</p>
                        <p><b>Status:</b> {c.status}</p>

                        {/* VIEW COMPLAINT IMAGE */}
                        {c.imagePath && (
                            <button
                                style={styles.viewBtn}
                                onClick={() => {
                                    const fixedPath = c.imagePath.replace(/\\/g, "/");
                                    window.open(`http://localhost:8080/${fixedPath}`, "_blank");
                                }}
                            >
                                View Complaint Image
                            </button>
                        )}

                        {/* ⭐ CITIZEN FEEDBACK DISPLAY */}
                        {c.rating && (
                            <div style={styles.feedbackBox}>
                                <p><b>Citizen Rating:</b> {c.rating} ⭐</p>
                                {c.feedbackNote && (
                                    <p><b>Feedback:</b> {c.feedbackNote}</p>
                                )}
                                {c.reopened && (
                                    <p style={{ color: "red", fontWeight: "bold" }}>
                                        Complaint Reopened due to low rating
                                    </p>
                                )}
                            </div>
                        )}

                        {/* UPLOAD + RESOLVE */}
                        {c.status !== "Resolved" ? (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setUploadMap({ ...uploadMap, [c.id]: e.target.files[0] })
                                    }
                                    style={styles.fileInput}
                                />

                                <button
                                    style={styles.resolveBtn}
                                    onClick={() => handleResolved(c.id)}
                                >
                                    Mark Resolved
                                </button>
                            </>
                        ) : (
                            <p style={styles.resolvedTag}>✔ Resolved</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfficerAssigned;

const styles = {
    page: { padding: 24, backgroundColor: "#f3e8ff", minHeight: "100vh" },
    heading: {
        textAlign: "center",
        fontSize: 28,
        fontWeight: "bold",
        color: "#4b0082",
        marginBottom: 20,
    },
    info: { textAlign: "center", fontSize: 16, color: "#555" },
    cardList: {
        maxWidth: 850,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 18,
    },
    card: {
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    title: { color: "#6a0dad", fontSize: 20, marginBottom: 10 },
    viewBtn: {
        background: "#4b0082",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: 8,
        cursor: "pointer",
        marginTop: 10,
        fontWeight: 600,
    },
    fileInput: { marginTop: 12 },
    resolveBtn: {
        marginTop: 10,
        padding: "10px 16px",
        background: "green",
        color: "white",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
    },
    resolvedTag: {
        marginTop: 14,
        fontSize: 16,
        color: "green",
        fontWeight: "bold",
    },
    feedbackBox: {
        marginTop: 12,
        padding: 12,
        background: "#f0fdf4",
        borderRadius: 8,
        border: "1px solid #22c55e",
    },
};
