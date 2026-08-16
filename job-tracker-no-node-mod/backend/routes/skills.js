const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/auth");

// check the token in middleware auth before continuing with each function
// gets all skills
router.get("/", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Skills WHERE user_id = ?", [req.user.user_id]
        );
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve skills" });
    }
});

// gets singular skill as specified by user and skill id 
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Skills WHERE skill_id = ? AND user_id = ?",
            [req.params.id, req.user.user_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Skill not found" });
        }
        // still want to derefernce from array even though one item each time
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve skill" });
    }
});

// insert a new skill
router.post("/", verifyToken, async (req, res) => {
    const { skill_name, skill_category, skill_level } = req.body;

    try {
        const [rows] = await db.query(
            "INSERT INTO Skills (user_id, skill_name, skill_category, skill_level) VALUES (?, ?, ?, ?)",
            [req.user.user_id, skill_name, skill_category, skill_level]
        );

        res.status(201).json({ message: "Skill created successfully", skill_id: rows.insertId });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create skill" });
    }
});

// updating skill row; including query params for simplicity/security again
router.put("/:id", verifyToken, async (req, res) => {
    const { skill_name, skill_category, skill_level } = req.body;

    try {
        const [rows] = await db.query(
            "UPDATE Skills SET skill_name = ?, skill_category = ?, skill_level = ? WHERE skill_id = ? AND user_id = ?",
            [skill_name, skill_category, skill_level, req.params.id, req.user.user_id]
        );

        // affectedRows is a module inside of mySQL in node_modules
        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Skill not found" });
        }

        res.json({ message: "Skill updated successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update skill" });
    }
});

// delete a skill
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "DELETE FROM Skills WHERE skill_id = ? AND user_id = ?",
            [req.params.id, req.user.user_id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Skill not found" });
        }

        res.json({ message: "Skill deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete skill" });
    }
});

module.exports = router;