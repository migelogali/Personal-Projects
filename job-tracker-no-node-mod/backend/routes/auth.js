const express = require("express"); 
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

router.post("/signup", async (req, res) => {
    const { user_name, user_email, user_password } = req.body;

    // scramble the user's password (10 times) if possible, then include in user table
    try {
        const hashedPassword = await bcrypt.hash(user_password, 10);

        await db.query(
            "INSERT INTO Users (user_name, user_email, user_password) VALUES (?, ?, ?)",
            [user_name, user_email, hashedPassword]
        );

        // 201=creation status instead of just ok
        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Signup failed" });
    }
});

router.post("/login", async (req, res) => {
    const { user_email, user_password } = req.body;

    try {
        // destructure rows once since array will be returned
        const [rows] = await db.query(
            "SELECT * FROM Users WHERE user_email = ?", [user_email]
        );
        // 401=unuathorized
        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // rows[0] allows use of all aspects found in the presumably one matching row
        // since rows alone returns array of rows
        const user = rows[0];

        const passwordMatch = await bcrypt.compare(user_password, user.user_password);

        if (passwordMatch === false) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // secure token will be used to navigate website, updated .env file accordingly
        const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;