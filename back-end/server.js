import express from "express";
import dotenv from "dotenv";
import pool from './db/connectToPst.js';
import cookieParser from "cookie-parser";
import cors from "cors"; 

import authRoutes from "./routes/auth.route.js";
import MessageRoutes from './routes/message.route.js';
import UserRoutes from './routes/user.route.js';

import {app ,server } from "./socket/socket.js"


dotenv.config();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());



app.use(cors({
    origin: 'http://localhost:3000', // Your front-end URL
    credentials: true, // Allows cookies to be sent
    methods: ['GET', 'POST'], // Allows only GET and POST requests
}));
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    //root route http://localhost:5000
    res.send('Hello World');
});

app.use('/auth', authRoutes);
app.use('/message', MessageRoutes);
app.use('/user', UserRoutes);




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
