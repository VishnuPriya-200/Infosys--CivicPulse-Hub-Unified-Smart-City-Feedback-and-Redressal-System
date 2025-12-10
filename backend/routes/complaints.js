const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Update a complaint by ID
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { assignedOfficer, status, deadline, priority } = req.body;

    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { assignedOfficer, status, deadline, priority },
            { new: true } // return the updated document
        );
        res.json(updatedComplaint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating complaint" });
    }
});

module.exports = router;
