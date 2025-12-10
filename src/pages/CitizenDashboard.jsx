import React from "react";
import { useNavigate } from "react-router-dom";

const CitizenDashboard = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.wrapper}>
            <h1 style={styles.title}>Citizen Dashboard</h1>

            <div style={styles.grid}>
                {/* Submit Complaint */}
                <div style={styles.card} onClick={() => navigate("/submit-complaint")}>
                    <h2 style={styles.cardTitle}>📝 Submit Complaint</h2>
                    <p style={styles.desc}>Register any civic issue instantly.</p>
                </div>

                {/* Track Complaints */}
                <div style={styles.card} onClick={() => navigate("/track-complaints")}>
                    <h2 style={styles.cardTitle}>📄 My Complaints</h2>
                    <p style={styles.desc}>View your complaints and track progress.</p>
                </div>

                {/* Logout */}
                <div style={styles.card} onClick={() => navigate("/")}>
                    <h2 style={styles.cardTitle}>🚪 Logout</h2>
                    <p style={styles.desc}>Sign out and return to home.</p>
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;

const styles = {
    wrapper: {
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #6C63FF, #52062A)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    title: {
        color: "white",
        fontSize: "40px",
        fontWeight: "bold",
        marginBottom: "30px",
        textShadow: "0px 3px 8px rgba(0,0,0,0.3)",
    },

    grid: {
        width: "100%",
        maxWidth: "1100px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "25px",
    },

    card: {
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        padding: "30px",
        borderRadius: "18px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        cursor: "pointer",
        color: "white",
        transition: "transform 0.25s, background 0.25s",

        /* Hover animation */
        ':hover': {
            transform: "translateY(-8px)",
            background: "rgba(255, 255, 255, 0.25)",
        }
    },

    cardTitle: {
        fontSize: "24px",
        marginBottom: "10px",
        fontWeight: "600",
    },

    desc: {
        fontSize: "16px",
        opacity: 0.85,
    }
};
