import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    LineChart, Line, Legend, ResponsiveContainer
} from "recharts";

const OfficerDashboard = () => {
    const navigate = useNavigate();

    const [officerStats, setOfficerStats] = useState([]);
    const [dailyStats, setDailyStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        setLoading(true);

        // FETCH ALL OFFICERS FROM BACKEND (NEW)
        fetch("http://localhost:8080/api/officers/all")
            .then(res => res.json())
            .then(officersList => {

                // FETCH ASSIGNED COMPLAINTS COUNT
                fetch("http://localhost:8080/api/complaints/officer-stats")
                    .then(res => res.json())
                    .then(data => {
                        let backendArray = [];

                        if (typeof data === "object" && !Array.isArray(data)) {
                            backendArray = Object.keys(data).map(id => ({
                                officerId: id,
                                count: Number(data[id] || 0)
                            }));
                        }

                        // MERGE BACKEND COUNTS WITH OFFICER LIST
                        const merged = officersList.map(off => {
                            const found = backendArray.find(b => b.officerId === off.id);
                            return {
                                officerId: off.id,
                                name: off.name,
                                count: found ? found.count : 0
                            };
                        });

                        setOfficerStats(merged);
                    });
            })
            .catch(() => setOfficerStats([]));

        // DAILY STATS
        fetch("http://localhost:8080/api/complaints/daily-stats")
            .then(res => res.json())
            .then(data => {
                if (typeof data === "object" && !Array.isArray(data)) {
                    const arr = Object.keys(data).map(dt => ({
                        date: dt,
                        count: Number(data[dt] || 0)
                    })).sort((a, b) => new Date(a.date) - new Date(b.date));
                    setDailyStats(arr);
                }
            })
            .catch(() => setDailyStats([]))
            .finally(() => setLoading(false));

    }, []);

    return (
        <div style={styles.container}>

            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>

            <h1 style={styles.heading}>Officer Dashboard</h1>

            <div style={styles.navBox}>
                <button style={styles.button} onClick={() => navigate("/officer/assigned")}>Assigned Complaints</button>
                <button style={styles.button} onClick={() => navigate("/officer/resolved")}>Resolved Complaints</button>

            </div>

            <div style={styles.chartRow}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Assigned Complaints per Officer</h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={officerStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#6a0dad" />
                        </BarChart>
                    </ResponsiveContainer>

                    {loading && <p style={styles.small}>Loading...</p>}
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Total Complaints per Day</h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#4b0082" />
                        </LineChart>
                    </ResponsiveContainer>

                    {!loading && dailyStats.length === 0 && <p style={styles.small}>No data found.</p>}
                </div>
            </div>
        </div>
    );
};

export default OfficerDashboard;

const styles = {
    container: {
        padding: "20px",
        backgroundColor: "#f5f0ff",
        minHeight: "100vh",
        position: "relative"
    },
    logoutBtn: {
        position: "absolute",
        top: "20px",
        right: "20px",
        padding: "8px 16px",
        backgroundColor: "#ff4d4d",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },
    heading: {
        fontSize: "28px",
        textAlign: "center",
        marginBottom: "12px",
        color: "#4b0082"
    },
    navBox: {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        marginBottom: "20px"
    },
    button: {
        padding: "8px 16px",
        backgroundColor: "#6a0dad",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },
    chartRow: {
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        flexWrap: "wrap"
    },
    card: {
        width: "560px",
        backgroundColor: "white",
        padding: "18px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.12)"
    },
    cardTitle: {
        marginBottom: "10px",
        textAlign: "center",
        fontSize: "18px",
        fontWeight: "700",
        color: "#4b0082"
    },
    small: { textAlign: "center", marginTop: 8, color: "#666" }
};
