import jwt from 'jsonwebtoken';
import pool from "../db/connectToPst.js"; 

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const userQuery = 'SELECT id, fullname, username, gender, profilepic, created_at, updated_at FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [decoded.userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = userResult.rows[0];

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
