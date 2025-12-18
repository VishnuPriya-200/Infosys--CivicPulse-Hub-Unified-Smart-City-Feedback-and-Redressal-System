import React, { useState } from "react";

const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
    },
    modal: {
        background: "#fff",
        padding: "20px",
        width: "350px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)"
    },
    starsContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "6px",
        margin: "10px 0"
    },
    star: {
        fontSize: "32px",
        cursor: "pointer",
        opacity: 0.4
    },
    starSelected: {
        fontSize: "32px",
        cursor: "pointer",
        color: "gold",
        opacity: 1
    },
    textarea: {
        width: "100%",
        minHeight: "70px",
        marginTop: "10px",
        padding: "6px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        resize: "vertical"
    },
    buttonRow: {
        marginTop: "15px",
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px"
    },
    btn: {
        padding: "8px 14px",
        borderRadius: "5px",
        cursor: "pointer",
        border: "none"
    },
    cancel: {
        background: "#ddd"
    },
    submit: {
        background: "#007bff",
        color: "white"
    }
};

export default function FeedbackModal({ open, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [hoverStar, setHoverStar] = useState(0);
    const [note, setNote] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        onSubmit({ rating, note }); // send data back
        setRating(0);
        setNote("");
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h3 style={{ textAlign: "center" }}>Give Feedback</h3>

                {/* Stars */}
                <div style={modalStyles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            style={
                                star <= (hoverStar || rating)
                                    ? modalStyles.starSelected
                                    : modalStyles.star
                            }
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverStar(star)}
                            onMouseLeave={() => setHoverStar(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* Note */}
                <textarea
                    style={modalStyles.textarea}
                    placeholder="Optional feedback note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                {/* Buttons */}
                <div style={modalStyles.buttonRow}>
                    <button
                        style={{ ...modalStyles.btn, ...modalStyles.cancel }}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        style={{ ...modalStyles.btn, ...modalStyles.submit }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
