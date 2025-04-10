const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        console.log("❌ No token found in headers");
        return res.status(401).json({ error: "Access Denied: No Token" });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified; // Attach user data to request
        console.log("✅ Token verified:", verified);
        next();
    } catch (err) {
        console.log("❌ Invalid Token:", err.message);
        res.status(400).json({ error: "Invalid Token" });
    }
};