import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <header style={styles.navbar}>
                <div style={styles.logo}>🌆 CivicPulse</div>
                <div style={styles.navLinks}>
                    <button style={styles.navBtn} onClick={() => navigate("/services")}>Services</button>
                    <button style={styles.navBtn} onClick={() => navigate("/register")}>Register</button>
                    <button style={styles.navBtn} onClick={() => navigate("/login")}>Login</button>
                </div>
            </header>

            {/* Main content */}
            <main style={styles.mainContent}>
                <h1 style={styles.title}>CivicPulse — Smart City Feedback System</h1>
                <p style={styles.subtitle}>
                    A platform to submit and track city complaints efficiently.<br />
                    Empowering citizens to improve city services in real time.
                </p>
            </main>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        height: "100vh",
        background: "linear-gradient(135deg, #6C63FF, #52062aff)",
        color: "#100f10ff",
    },
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px",
        backgroundColor: "rgba(152, 49, 49, 0.2)",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
        borderRadius: "0 0 20px 20px",
    },
    logo: {
        fontSize: "28px",
        fontWeight: "bold",
    },
    navLinks: {
        display: "flex",
        gap: "20px",
    },
    navBtn: {
        padding: "12px 25px",
        fontSize: "18px",
        fontWeight: "bold",
        backgroundColor: "#fff",
        color: "#6C63FF",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "0.3s",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
    },
    mainContent: {
        textAlign: "center",
        marginTop: "150px",
        padding: "0 20px",
    },
    title: {
        fontSize: "48px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    subtitle: {
        fontSize: "22px",
        lineHeight: "1.6",
        maxWidth: "700px",
        margin: "0 auto",
    },
};

export default Dashboard;
