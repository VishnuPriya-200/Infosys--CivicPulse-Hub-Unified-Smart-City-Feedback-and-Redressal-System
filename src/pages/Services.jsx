import React from "react";
import { useNavigate } from "react-router-dom";

function Services() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* Home Button */}
            <button style={styles.homeBtn} onClick={() => navigate("/")}>🏠 Home</button>

            <h1 style={styles.title}>Our Services</h1>

            <div style={styles.buttonContainer}>
                {/* Navigate to Submit Complaint Page */}
                <button
                    style={styles.btn}
                    onClick={() => navigate("/submit-complaint")}
                >
                    Submit Complaint
                </button>

                {/* Navigate to View Complaint Page */}
                <button
                    style={styles.btn}
                    onClick={() => navigate("/view-complaint")}
                >
                    View Complaint
                </button>

                {/* Navigate to Track Complaint Page */}
                <button
                    style={styles.btn}
                    onClick={() => navigate("/track-complaint")}
                >
                    Track Complaint
                </button>

                {/* Navigate to Complaint Distribution Page */}
                <button
                    style={styles.btn}
                    onClick={() => navigate("/complaint-distribution")}
                >
                    Complaint Distribution
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#007bff",
        height: "100vh",
        color: "white",
        textAlign: "center",
        paddingTop: "100px",
    },
    title: {
        fontSize: "36px",
        fontWeight: "bold",
        marginBottom: "60px",
    },
    buttonContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "40px",
    },
    btn: {
        padding: "40px 80px",
        backgroundColor: "#ffffff",
        color: "#007bff",
        border: "none",
        borderRadius: "20px",
        fontSize: "22px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "0.3s",
        boxShadow: "0px 6px 15px rgba(0,0,0,0.2)",
    },
    homeBtn: {
        position: "absolute",
        top: "20px",
        right: "30px",
        backgroundColor: "#fff",
        color: "#007bff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "10px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
    },
};

export default Services;
