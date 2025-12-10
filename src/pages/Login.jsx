import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: ""  // ADDED
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!data.role) {
                setError("Invalid credentials!");
                return;
            }

            if (data.role === "Citizen") {
                navigate("/citizen");
            }
            else if (data.role === "Admin") {
                navigate("/admin");
            }
            else if (data.role === "Officer") {
                localStorage.setItem("officer", JSON.stringify(data.officer));
                navigate("/officer");
            }



        } catch (err) {
            console.error(err);
            setError("Server error!");
        }
    };

    return (
        <div style={styles.container}>
            <button style={styles.homeBtn} onClick={() => navigate("/")}>🏠 Home</button>

            <h2>Login</h2>

            {error && <p style={styles.error}>{error}</p>}

            <form style={styles.form} onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />

                {/* ROLE SELECTION */}
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={styles.input}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Admin">Admin</option>
                    <option value="Officer">Officer</option>
                </select>

                <button type="submit" style={styles.button}>Login</button>
            </form>

            <p style={styles.linkText}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#56053aff",
        height: "100vh",
        color: "white",
        padding: "40px",
        textAlign: "center",
    },
    form: { display: "inline-block", width: "300px" },
    input: {
        width: "100%",
        marginBottom: "15px",
        padding: "10px",
        borderRadius: "8px",
        border: "none",
    },
    button: {
        width: "100%",
        padding: "15px",
        borderRadius: "10px",
        backgroundColor: "#0e2b9fff",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "bold",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        transition: "0.3s",
    },
    linkText: { marginTop: "10px", color: "#fff" },
    homeBtn: {
        position: "absolute",
        top: "15px",
        right: "20px",
        backgroundColor: "#fff",
        color: "#8318d4ff",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
    },
    error: {
        backgroundColor: "#ff3333",
        padding: "10px",
        borderRadius: "8px",
        color: "white",
        marginBottom: "15px",
    },
};

export default Login;
