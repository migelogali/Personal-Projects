const express = require("express"); 
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/auth");

// check the token in middleware auth before continuing with each function
// gets all jobs
router.get("/", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Jobs WHERE user_id = ?", [req.user.user_id]
        );
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve jobs" });
    }
});

// gets singular job as specified by user and job id 
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Jobs WHERE job_id = ? AND user_id = ?",
            [req.params.id, req.user.user_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Job not found" });
        }
        // still want to derefernce from array even though one item each time
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve job" });
    }
});

// insert a new job
router.post("/", verifyToken, async (req, res) => {
    const { job_company, job_title, job_location, job_website, job_date_applied, job_status, job_notes } = req.body;

    try {
        const [rows] = await db.query(
            "INSERT INTO Jobs (user_id, job_company, job_title, job_location, job_website, job_date_applied, job_status, job_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [req.user.user_id, job_company, job_title, job_location, job_website, job_date_applied, job_status, job_notes]
        );

        res.status(201).json({ message: "Job created successfully", job_id: rows.insertId });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create job" });
    }
});

// updating job row; including query params for simplicity/security again
router.put("/:id", verifyToken, async (req, res) => {
    const { job_company, job_title, job_location, job_website, job_date_applied, job_status, job_notes } = req.body;

    try {
        const [rows] = await db.query(
            "UPDATE Jobs SET job_company = ?, job_title = ?, job_location = ?, job_website = ?, job_date_applied = ?, job_status = ?, job_notes = ? WHERE job_id = ? AND user_id = ?",
            [job_company, job_title, job_location, job_website, job_date_applied, job_status, job_notes, req.params.id, req.user.user_id]
        );

        // affectedRows is a module inside of mySQL in node_modules
        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.json({ message: "Job updated successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update job" });
    }
});

// delete a job
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "DELETE FROM Jobs WHERE job_id = ? AND user_id = ?",
            [req.params.id, req.user.user_id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.json({ message: "Job deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete job" });
    }
});

module.exports = router;