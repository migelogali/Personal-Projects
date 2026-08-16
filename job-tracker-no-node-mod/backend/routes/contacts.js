const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/auth");

// check the token in middleware auth before continuing with each function
// gets all contacts
router.get("/", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Contacts WHERE user_id = ?", [req.user.user_id]
        );
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve contacts" });
    }
});

// gets singular contact as specified by user and contact id 
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Contacts WHERE contact_id = ? AND user_id = ?",
            [req.params.id, req.user.user_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Contact not found" });
        }
        // still want to derefernce from array even though one item each time
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve contact" });
    }
});

// insert a new contact
router.post("/", verifyToken, async (req, res) => {
    const { job_id, contact_name, contact_email, contact_linkedin, contact_notes } = req.body;

    try {
        const [rows] = await db.query(
            "INSERT INTO Contacts (user_id, job_id, contact_name, contact_email, contact_linkedin, contact_notes) VALUES (?, ?, ?, ?, ?, ?)",
            [req.user.user_id, job_id, contact_name, contact_email, contact_linkedin, contact_notes]
        );

        res.status(201).json({ message: "Contact created successfully", contact_id: rows.insertId });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create contact" });
    }
});

// updating contact row; including query params for simplicity/security again
router.put("/:id", verifyToken, async (req, res) => {
    const { job_id, contact_name, contact_email, contact_linkedin, contact_notes } = req.body;

    try {
        const [rows] = await db.query(
            "UPDATE Contacts SET job_id = ?, contact_name = ?, contact_email = ?, contact_linkedin = ?, contact_notes = ? WHERE contact_id = ? AND user_id = ?",
            [job_id, contact_name, contact_email, contact_linkedin, contact_notes, req.params.id, req.user.user_id]
        );

        // affectedRows is a module inside of mySQL in node_modules
        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Contact not found" });
        }

        res.json({ message: "Contact updated successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update contact" });
    }
});

// delete a contact
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "DELETE FROM Contacts WHERE contact_id = ? AND user_id = ?",
            [req.params.id, req.user.user_id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Contact not found" });
        }

        res.json({ message: "Contact deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete contact" });
    }
});

module.exports = router;