const express = require("express"); 
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/auth");

// check the token in middleware auth before continuing with each function
router.get("/", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT Jobs_Skills.* FROM Jobs_Skills
             JOIN Jobs ON Jobs_Skills.job_id = Jobs.job_id
             WHERE Jobs.user_id = ?`
            , [req.user.user_id]
        );
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve job skills" });
    }
});

router.get("/:job_id", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT Jobs_Skills.*, Skills.skill_name, Skills.skill_category, Skills.skill_level
             FROM Jobs_Skills
             JOIN Skills ON Jobs_Skills.skill_id = Skills.skill_id
             JOIN Jobs ON Jobs_Skills.job_id = Jobs.job_id
             WHERE Jobs_Skills.job_id = ? AND Jobs.user_id = ?`,
            [req.params.job_id, req.user.user_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "No skills found for this job" });
        }
        // want all skills back from singular job this time
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve skills for this job" });
    }
});

router.post("/", verifyToken, async (req, res) => {
    const { job_id, skill_id } = req.body;

    try {
        // Verify the job belongs to this user
        // provides safety in case job id guessed correctly
        const [job] = await db.query(
            "SELECT * FROM Jobs WHERE job_id = ? AND user_id = ?",
            [job_id, req.user.user_id]
        );
        if (job.length === 0) {
            return res.status(404).json({ error: "Job not found" });
        }

        const [rows] = await db.query(
            "INSERT INTO Jobs_Skills (job_id, skill_id) VALUES (?, ?)",
            [job_id, skill_id]
        );

        res.status(201).json({ message: "Skill linked to job created successfully", job_skill_id: rows.insertId });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to link skill to job" });
    }
});

// no put since this table links one to another, not updating id's

// ex: remove skill 4 from job 2
router.delete("/:job_id/:skill_id", verifyToken, async (req, res) => {
    try {
        // verify again
        const [job] = await db.query(
            "SELECT * FROM Jobs WHERE job_id = ? AND user_id = ?",
            [req.params.job_id, req.user.user_id]
        );
        if (job.length === 0) {
            return res.status(404).json({ error: "Job not found" });
        }

        const [rows] = await db.query(
            "DELETE FROM Jobs_Skills WHERE job_id = ? AND skill_id = ?",
            [req.params.job_id, req.params.skill_id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Linked skill not found" });
        }

        res.json({ message: "Skill removed from job successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to remove skill from job" });
    }
});

module.exports = router;