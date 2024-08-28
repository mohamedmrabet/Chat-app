import pool from "../db/connectToPst.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user.id;

		// Find the conversation between the sender and receiver
		let conversationResult = await pool.query(
			`SELECT id FROM conversations WHERE id IN (
                SELECT conversation_id FROM conversation_participants WHERE user_id = $1
                INTERSECT
                SELECT conversation_id FROM conversation_participants WHERE user_id = $2
            )`,
			[senderId, receiverId]
		);

		let conversationId;

		if (conversationResult.rows.length === 0) {
			// If no conversation exists, create a new one
			const newConversationResult = await pool.query(
				`INSERT INTO conversations DEFAULT VALUES RETURNING id`
			);
			conversationId = newConversationResult.rows[0].id;

			// Insert participants into the conversation_participants table
			await pool.query(
				`INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)`,
				[conversationId, senderId, receiverId]
			);
		} else {
			conversationId = conversationResult.rows[0].id;
		}

		// Insert the new message into the messages table
		const newMessageResult = await pool.query(
			`INSERT INTO messages (sender_id, receiver_id, message, conversation_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
			[senderId, receiverId, message, conversationId]
		);

		const newMessage = newMessageResult.rows[0];

		// SOCKET IO FUNCTIONALITY
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessage = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user.id;

		// Check if a conversation between the sender and receiver exists
		const conversationQuery = `
            SELECT c.id
            FROM conversations c
            JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
            JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
            WHERE cp1.user_id = $1 AND cp2.user_id = $2
        `;

		const conversationResult = await pool.query(conversationQuery, [senderId, userToChatId]);

		if (conversationResult.rows.length === 0) {
			return res.status(200).json([]); // No conversation found
		}

		const conversationId = conversationResult.rows[0].id;

		// Get all messages for the conversation
		const messagesQuery = `
            SELECT m.id, m.sender_id, m.receiver_id, m.message, m.created_at, m.updated_at
            FROM messages m
            WHERE m.conversation_id = $1
            ORDER BY m.created_at ASC
        `;

		const messagesResult = await pool.query(messagesQuery, [conversationId]);

		const messages = messagesResult.rows;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
