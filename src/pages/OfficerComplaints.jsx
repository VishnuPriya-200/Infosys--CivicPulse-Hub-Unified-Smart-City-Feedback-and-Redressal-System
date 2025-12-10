import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OfficerComplaints = () => {
    const { type } = useParams();
    const navigate = useNavigate();

    const officer = JSON.parse(localStorage.getItem("officer"));
    const officerId = officer?.id;

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!officerId) return;

        fetch(`http://localhost:8080/api/complaints/assigned/${officerId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched complaints:", data);

                let filtered = data;

                if (type === "resolved") {
                    filtered = data.filter(
                        c =>
                            c.status?.toLowerCase() === "resolved" ||
                            c.status?.toLowerCase() === "checked"
                    );
                }

                setComplaints(filtered);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [officerId, type]);

    if (loading) return <h2>Loading...</h2>;

    return (
        <div>
            <h1>{officer.name} - {type.toUpperCase()} Complaints</h1>

            {complaints.length === 0 && <p>No complaints found.</p>}

            <pre>{JSON.stringify(complaints, null, 2)}</pre>

            <button onClick={() => navigate("/officer")}>Back</button>
        </div>
    );
};

export default OfficerComplaints;
