// src/pages/ComplaintDistribution.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#8884d8"];

const ComplaintDistribution = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8081/api/complaints")
            .then((res) => res.json())
            .then((complaints) => {
                const categoryCount = {};
                complaints.forEach((c) => {
                    const cat = c.category || "Other";
                    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
                });

                const chartData = Object.keys(categoryCount).map((key) => ({
                    name: key,
                    value: categoryCount[key],
                }));

                setData(chartData);
            })
            .catch((err) => console.error("Error fetching complaints:", err));
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {/* Home Button at top-right */}
            <button
                onClick={() => navigate("/")}
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                }}
            >
                🏠 Home
            </button>

            <h2>Complaint Distribution</h2>
            {data.length === 0 ? (
                <p>Loading data...</p>
            ) : (
                <PieChart width={500} height={500}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={200}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            )}
        </div>
    );
};

export default ComplaintDistribution;
