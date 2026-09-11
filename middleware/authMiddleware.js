const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Authentication token required."
        });
    }

    const parts = authHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {
        return res.status(401).json({
            error: "Invalid authentication token."
        });
    }

    const token = parts[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            error: "Invalid or expired token."
        });
    }
}

function authenticateAdmin(req, res, next) {

    if (!req.user) {
        return res.status(401).json({
            error: "Authentication required."
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            error: "Admin access required."
        });
    }

    next();
}

module.exports = {
    authenticateToken,
    authenticateAdmin
};