import { Server } from "socket.io";
import http from "http";
import express from "express";
import pool from "../db/connectToPst.js"; // PostgreSQL connection pool

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") {
        userSocketMap[userId] = socket.id;

        // Optionally, save the user's socket ID in the PostgreSQL database
        const updateSocketIdQuery = `
            INSERT INTO user_sockets (user_id, socket_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id)
            DO UPDATE SET socket_id = $2;
        `;

        pool.query(updateSocketIdQuery, [userId, socket.id])
            .then(() => console.log(`Socket ID updated for user ${userId}`))
            .catch((error) => console.log("Error updating socket ID:", error.message));
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);

        // Optionally, remove the user's socket ID from the PostgreSQL database
        const deleteSocketIdQuery = `
            DELETE FROM user_sockets WHERE user_id = $1;
        `;

        pool.query(deleteSocketIdQuery, [userId])
            .then(() => console.log(`Socket ID removed for user ${userId}`))
            .catch((error) => console.log("Error removing socket ID:", error.message));

        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
