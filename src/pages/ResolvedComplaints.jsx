import React, { useEffect, useState } from "react";

const ResolvedComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const officer = JSON.parse(localStorage.getItem("officer"));
    const officerId = officer?._id || officer?.id;

    useEffect(() => {
        if (!officerId) return;

        fetch(`http://localhost:8080/api/complaints/assigned/${officerId}`)
            .then(res => res.json())
            .then(data => {
                const resolved = data.filter(c => c.status === "Resolved");
                setComplaints(resolved);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [officerId]);

    return (
        <div style={styles.page}>
            <h1 style={styles.heading}>Resolved Complaints</h1>

            {loading && <p style={styles.info}>Loading...</p>}

            {!loading && complaints.length === 0 && (
                <p style={styles.info}>No resolved complaints.</p>
            )}

            <div style={styles.cardList}>
                {complaints.map(c => (
                    <div key={c.id || c._id} style={styles.card}>
                        <h2 style={styles.title}>{c.category}</h2>
                        <p><b>Name:</b> {c.name}</p>
                        <p><b>Location:</b> {c.location}</p>
                        <p><b>Description:</b> {c.description}</p>
                        <p><b>Status:</b> {c.status}</p>

                        {c.resolvedImagePath && (
                            <button
                                style={styles.viewBtn}
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
        </div>
    );
};

export default ResolvedComplaints;

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
    cardList: { maxWidth: 850, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 },
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
    }
};
