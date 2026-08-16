// middleware auth file created before continuation in navigation of website 
const jwt = require("jsonwebtoken");

// no async since jwt.verify is synchronous
// next allows route to be ran now
const verifyToken = (req, res, next) => {
    // const variables created with the use of Claude to understand
    const authHeader = req.headers["authorization"];
    // since frontend returns Bearer whateverthetokenis,
    // split based on the space character to extract the token
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // decoded will contain key-value pair for user_id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // any route will now know who is making a request instead of keeping in local variable
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;