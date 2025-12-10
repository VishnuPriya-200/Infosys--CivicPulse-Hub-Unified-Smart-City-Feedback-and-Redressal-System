import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddOfficer = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleAddOfficer = async () => {
        if (!name || !email) {
            setMessage("Please fill all fields");
            return;
        }

        const officerData = {
            name,
            email,
            password: "12345"   // FIXED PASSWORD
        };

        try {
            const res = await fetch("http://localhost:8080/api/officers/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(officerData),
            });

            if (res.ok) {
                setMessage("Officer added successfully!");
                setName("");
                setEmail("");
            } else {
                setMessage("Failed to add officer");
            }
        } catch (error) {
            setMessage("Error adding officer");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "purple",
            padding: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                width: "400px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "purple" }}>
                    Add Officer
                </h2>

                <label><b>Name</b></label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        width: "100%", padding: "10px", marginBottom: "15px",
                        borderRadius: "8px", border: "1px solid gray"
                    }}
                />

                <label><b>Email</b></label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%", padding: "10px", marginBottom: "15px",
                        borderRadius: "8px", border: "1px solid gray"
                    }}
                />

                <button
                    onClick={handleAddOfficer}
                    style={{
                        width: "100%", padding: "12px",
                        background: "purple", color: "white",
                        border: "none", borderRadius: "8px",
                        cursor: "pointer", fontWeight: "bold"
                    }}
                >
                    Add Officer
                </button>

                {message && (
                    <p style={{ marginTop: "15px", textAlign: "center", color: "green" }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AddOfficer;
