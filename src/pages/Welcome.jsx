import React from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Welcome to CivicPulse</h1>
            <p style={styles.subtitle}>
                Smart City Feedback & Complaint Management System
            </p>

            <div style={styles.btnContainer}>
                <button style={styles.button} onClick={() => navigate("/register")}>
                    Create Account
                </button>

                <button style={styles.button} onClick={() => navigate("/login")}>
                    Login
                </button>
            </div>

        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        background: "linear-gradient(135deg, #6C63FF, #52062a)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },
    title: { fontSize: "48px", fontWeight: "bold" },
    subtitle: { fontSize: "20px", marginBottom: "40px" },
    btnContainer: { display: "flex", gap: "20px" },
    button: {
        padding: "15px 35px",
        fontSize: "18px",
        borderRadius: "10px",
        background: "#fff",
        color: "#6C63FF",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
    }
};

export default Welcome;
