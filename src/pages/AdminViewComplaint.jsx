import React, { useState } from "react";

// REAL OFFICER IDs from your DB
const officers = [
    { id: "692b8cc456c15a14ba152b02", label: "Officer A" },
    { id: "692b8cc456c15a14ba152b03", label: "Officer B" },
    { id: "692b8cc456c15c15a14ba152b04", label: "Officer C" }
];

const AdminViewComplaint = ({ complaints }) => {
    const [localComplaints, setLocalComplaints] = useState(
        complaints.map(c => ({
            ...c,
            assignedOfficer: c.assignedOfficer || "",
            deadline: c.deadline || "",
            priority: c.priority || "Normal",
            successMessage: ""
        }))
    );

    const handleAssign = (id, assignedOfficer, deadline, priority) => {
        fetch(`http://localhost:8080/api/complaints/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                assignedOfficer,
                deadline,
                priority,
                status: "Assigned"
            })
        })
            .then(res => res.json())
            .then(updated => {
                setLocalComplaints(prev =>
                    prev.map(c =>
                        c._id === id
                            ? { ...updated, successMessage: "Assigned Successfully!" }
                            : c
                    )
                );
            })
            .catch(err => console.error(err));
    };

    // STATUS BADGE UI
    const renderStatusBadge = (status) => {
        const base = {
            padding: "6px 12px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            display: "inline-block",
            marginBottom: "8px"
        };

        if (status === "Resolved")
            return <span style={{ ...base, background: "green" }}>✔ Resolved</span>;

        if (status === "Assigned")
            return <span style={{ ...base, background: "#007bff" }}>📌 Assigned</span>;

        return <span style={{ ...base, background: "gray" }}>⏳ Pending</span>;
    };

    const getImageURL = (path) => {
        if (!path) return null;
        if (path.includes("uploads")) {
            const file = path.split("uploads")[1];
            return `http://localhost:8080/uploads${file}`;
        }
        return `http://localhost:8080/${path}`;
    };

    return (
        <div style={styles.wrapper}>
            {localComplaints.map((c, idx) => {
                const id = c._id;
                return (
                    <div key={id} style={styles.card}>

                        {/* STATUS BADGE */}
                        {renderStatusBadge(c.status)}

                        <h3 style={styles.title}>{c.category}</h3>
                        <p><b>Name:</b> {c.name}</p>
                        <p><b>Location:</b> {c.location}</p>
                        <p><b>Description:</b> {c.description}</p>

                        {/* Show Original Image */}
                        {c.imagePath && (
                            <button
                                style={styles.viewBtn}
                                onClick={() => window.open(getImageURL(c.imagePath), "_blank")}
                            >
                                View Complaint Image
                            </button>
                        )}

                        {/* Show Resolved Image */}
                        {c.resolvedImagePath && (
                            <button
                                style={styles.resolvedImgBtn}
                                onClick={() => window.open(getImageURL(c.resolvedImagePath), "_blank")}
                            >
                                View Resolved Image
                            </button>
                        )}

                        {/* Officer Assignment Section */}
                        <div style={styles.assignBox}>
                            <select
                                value={c.assignedOfficer}
                                onChange={e => {
                                    const value = e.target.value;
                                    setLocalComplaints(prev => {
                                        const copy = [...prev];
                                        copy[idx].assignedOfficer = value;
                                        return copy;
                                    });
                                }}
                                style={styles.select}
                            >
                                <option value="">Assign Officer</option>
                                {officers.map(off => (
                                    <option key={off.id} value={off.id}>{off.label}</option>
                                ))}
                            </select>

                            <input
                                type="date"
                                value={c.deadline}
                                onChange={e => {
                                    const value = e.target.value;
                                    setLocalComplaints(prev => {
                                        const copy = [...prev];
                                        copy[idx].deadline = value;
                                        return copy;
                                    });
                                }}
                                style={styles.input}
                            />

                            <select
                                value={c.priority}
                                onChange={e => {
                                    const value = e.target.value;
                                    setLocalComplaints(prev => {
                                        const copy = [...prev];
                                        copy[idx].priority = value;
                                        return copy;
                                    });
                                }}
                                style={styles.select}
                            >
                                <option value="Low">Low</option>
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                            </select>

                            <button
                                style={styles.assignBtn}
                                onClick={() =>
                                    handleAssign(
                                        id,
                                        c.assignedOfficer,
                                        c.deadline,
                                        c.priority
                                    )
                                }
                            >
                                Assign Officer
                            </button>
                        </div>

                        {c.successMessage && <p style={styles.success}>{c.successMessage}</p>}
                    </div>
                );
            })}
        </div>
    );
};

export default AdminViewComplaint;

/* -------------- STYLES -------------- */

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        background: "#f2e6ff",
        minHeight: "100vh"
    },
    card: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
    },
    title: {
        fontSize: "20px",
        color: "#6a0dad",
        marginBottom: "10px"
    },
    viewBtn: {
        background: "#6a0dad",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "8px"
    },
    resolvedImgBtn: {
        background: "green",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "8px"
    },
    assignBox: {
        marginTop: "12px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },
    select: {
        padding: "6px 8px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },
    input: {
        padding: "6px 8px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },
    assignBtn: {
        padding: "8px 14px",
        background: "#4b0082",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },
    success: {
        color: "green",
        marginTop: "10px",
        fontWeight: "bold"
    }
};
