import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
        role: "",
    });
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.text();

            if (data === "User registered") {
                setSuccess(true);

                // Redirect based on role
                setTimeout(() => {
                    if (formData.role === "Citizen") navigate("/citizen");
                    else if (formData.role === "Admin") navigate("/admin");
                    else if (formData.role === "Officer") navigate("/officer");
                    else navigate("/login");
                }, 1000);

            } else {
                alert(data);
            }
        } catch (err) {
            alert("Server error!");
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <button style={styles.homeBtn} onClick={() => navigate("/")}>🏠 Home</button>
            <h2 style={styles.title}>Create Account</h2>

            {success && <p style={styles.success}>Registered successfully!</p>}

            <form style={styles.form} onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name"
                    value={formData.name} onChange={handleChange}
                    style={styles.input} required />

                <input type="email" name="email" placeholder="Email"
                    value={formData.email} onChange={handleChange}
                    style={styles.input} required />

                <input type="password" name="password" placeholder="Password"
                    value={formData.password} onChange={handleChange}
                    style={styles.input} required />

                <input type="text" name="mobile" placeholder="Mobile Number"
                    value={formData.mobile} onChange={handleChange}
                    style={styles.input} required />

                <select name="role" value={formData.role} onChange={handleChange}
                    style={styles.input} required>
                    <option value="">Select Category</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Officer">Officer</option>
                    <option value="Admin">Admin</option>
                </select>

                <button type="submit" style={styles.button}>Register</button>
            </form>

            <p style={styles.linkText}>
                Already registered? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#56053a",
        height: "100vh",
        color: "white",
        padding: "40px",
        textAlign: "center",
    },
    title: { marginBottom: "20px" },
    form: { display: "inline-block", textAlign: "left", width: "300px" },
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
        backgroundColor: "#0e2b9f",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "bold",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        transition: "0.3s",
    },
    linkText: { marginTop: "10px" },
    homeBtn: {
        position: "absolute",
        top: "15px",
        right: "20px",
        backgroundColor: "#fff",
        color: "#8318d4",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
    },
    success: {
        backgroundColor: "#28a745",
        padding: "10px",
        borderRadius: "8px",
        color: "white",
        marginBottom: "15px",
    },
};

export default Register;
