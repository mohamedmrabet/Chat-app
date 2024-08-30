import pool from "../db/connectToPst.js";

export const getUsers = async (req, res) => {
	try {
		const loggedInUserId = req.user.id;

		const query = `
			SELECT id, username,fullname,profilepic,gender 
			FROM users
			WHERE id != $1
		`;
		const values = [loggedInUserId];

		const { rows: filteredUsers } = await pool.query(query, values);

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
