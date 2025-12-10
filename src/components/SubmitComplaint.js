import React, { useState } from "react";

const categoryOptions = [
    { label: "Water", options: ["No water supply", "Rain water stagnation", "Pipeline leakage", "Contaminated drinking water", "Sewage water mixing", "Irregular water timings", "Water tank overflow"] },
    { label: "Electricity", options: ["Street light not working", "Transformer issue", "Electric pole damage", "Power loading issue", "Power cut", "Low Voltage", "Flickering street lights", "Streetlights always ON", "Exposed electrical wires"] },
    { label: "Road", options: ["Road damage issues", "Potholes", "Traffic", "Traffic lights issue", "Speed breaker required", "Road Blockage", "Lack of zebra crossing", "Footpath damaged", "Cracks on roadside"] },
    { label: "Sanitation", options: ["Public toilet", "Roads to be cleaned", "Drainage blockage", "Open Garbage bins", "Public transport cleanliness", "Open drain on roadside"] },
    { label: "Waste Management", options: ["Garbage collection issue", "Bins overflow", "Dumping in Open area", "Drain blocked due to waste"] },
    { label: "Public Transport", options: ["Vehicle Parking issue", "Bus arrival issue", "Over Charging", "Bus Stop damaged", "Missing road signs", "Street name boards missing"] },
    { label: "Public Health/Medical Emergency", options: ["Ambulance not arriving on time", "Medical Negligence", "Lack of Doctors in GH", "Lack of Equipments", "Stray dogs issue", "Accident Hotspot", "Mosquito breeding area"] },
];

const SubmitComplaint = () => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        category: "",
        description: "",
        image: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("location", formData.location);
            data.append("category", formData.category);
            data.append("description", formData.description);
            if (formData.image) data.append("image", formData.image);

            const response = await fetch("http://localhost:8080/api/complaints/add", {
                method: "POST",
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Complaint saved:", result);
                alert("✅ Complaint submitted successfully!");
                setFormData({ name: "", location: "", category: "", description: "", image: null });
            } else {
                alert("❌ Failed to submit complaint.");
            }
        } catch (error) {
            console.error(error);
            alert("❌ Server error. Check backend connection.");
        }
    };

    return (
        <div className="submit-complaint-container">
            <h1 className="submit-complaint-title">Submit Complaint</h1>
            <form className="complaint-form" onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required />

                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categoryOptions.map(cat => (
                        <optgroup key={cat.label} label={cat.label}>
                            {cat.options.map((opt, idx) => (
                                <option key={idx} value={`${cat.label} - ${opt}`}>{opt}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>

                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required />

                <label>Upload Image</label>
                <input type="file" name="image" onChange={handleChange} accept="image/*" />

                <button type="submit">Submit Complaint</button>
            </form>

            <style>{`
        .submit-complaint-container {
          min-height: 100vh;
          background-color: purple;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        .submit-complaint-title { color: white; font-size: 32px; font-weight: bold; margin-bottom: 30px; text-align: center; }
        .complaint-form { display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 500px; background-color: #f8f8f8; padding: 25px; border-radius: 15px; }
        .complaint-form label { font-weight: bold; color: #333; }
        .complaint-form input[type="text"], .complaint-form select, .complaint-form textarea, .complaint-form input[type="file"] {
          padding: 10px; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; width: 100%;
        }
        .complaint-form button { background-color: purple; color: white; padding: 12px; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; transition: 0.3s; }
        .complaint-form button:hover { background-color: darkmagenta; }
      `}</style>
        </div>
    );
};

export default SubmitComplaint;
