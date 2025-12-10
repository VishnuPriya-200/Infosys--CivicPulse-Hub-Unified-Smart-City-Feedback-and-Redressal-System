import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const COLORS = ["#4b0082", "#ff6600", "#00cc66", "#0099ff", "#ffcc00"];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/complaints")
            .then(res => res.json())
            .then(data => {
                setComplaints(data);
                setLoading(false);

                // -------- CATEGORY BAR CHART DATA --------
                const categoryCounts = {};
                data.forEach(c => {
                    const cat = c.category?.split(" - ")[0];
                    if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                });

                setCategoryData(
                    Object.keys(categoryCounts).map(key => ({
                        category: key,
                        count: categoryCounts[key]
                    }))
                );

                // -------- STATUS LINE CHART DATA --------
                const statusCounts = { Pending: 0, Assigned: 0, Resolved: 0 };

                data.forEach(c => {
                    const s = c.status;
                    if (statusCounts[s] !== undefined) {
                        statusCounts[s] += 1;
                    }
                });

                setStatusData([
                    { status: "Pending", value: statusCounts.Pending },
                    { status: "Assigned", value: statusCounts.Assigned },
                    { status: "Resolved", value: statusCounts.Resolved }
                ]);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading)
        return (
            <div style={{ padding: "50px", color: "purple", fontSize: "24px" }}>
                Loading...
            </div>
        );

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>

            {/* -------- BUTTONS ALIGNED TOP RIGHT -------- */}
            <div className="top-buttons">
                <button className="add-officer" onClick={() => navigate("/add-officer")}>
                    Add Officer
                </button>

                <button className="view-complaints-btn" onClick={() => navigate("/view-complaints")}>
                    View Complaints
                </button>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="charts-container">

                {/* -------- BAR CHART (COMPLAINTS BY CATEGORY) -------- */}
                <div className="chart-wrapper">
                    <h3>Complaints by Category</h3>

                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={categoryData}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#4b0082" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* -------- LINE CHART (PENDING / ASSIGNED / RESOLVED) -------- */}
                <div className="chart-wrapper">
                    <h3>Complaints by Status</h3>

                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={statusData}>
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#ff6600" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <style>{`
                .admin-container {
                    min-height: 100vh;
                    padding: 30px 50px;
                    background: linear-gradient(135deg, #8ec5fc, #e0c3fc);
                    position: relative;
                }
                h1 {
                    text-align: center;
                    color: #4b0082;
                    font-size: 36px;
                    margin-bottom: 40px;
                }

                .top-buttons {
                    display: flex;
                    gap: 15px;
                    position: absolute;
                    top: 30px;
                    right: 40px;
                }

                .add-officer, .view-complaints-btn, .logout-btn {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                    color: white;
                }

                .add-officer { background-color: #0099ff; }
                .view-complaints-btn { background-color: #4b0082; }
                .logout-btn { background-color: #ff3333; }

                .charts-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 40px;
                    margin-top: 60px;
                }

                .chart-wrapper {
                    background: white;
                    padding: 20px;
                    border-radius: 20px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                    flex: 1;
                    min-width: 350px;
                }

                h3 {
                    text-align: center;
                    color: #4b0082;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
