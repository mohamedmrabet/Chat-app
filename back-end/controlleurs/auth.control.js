import bcrypt from 'bcrypt';
import pool from "../db/connectToPst.js"
import generateTokenAndSetCookie from '../Utils/generaterToken.js';

export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const userQuery = 'SELECT * FROM users WHERE username = $1';
        const userResult = await pool.query(userQuery, [username]);

        if (userResult.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const insertUserQuery = `
            INSERT INTO users (fullname, username, password, gender, profilepic)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const newUserResult = await pool.query(insertUserQuery, [
            fullname,
            username,
            hashedPassword,
            gender,
            gender === 'male' ? boyProfilePic : girlProfilePic,
        ]);

        const newUser = newUserResult.rows[0];

        if (newUser) {
            generateTokenAndSetCookie(newUser.id, res);

            res.status(201).json({
                _id: newUser.id,
                fullName: newUser.fullname,
                username: newUser.username,
                profilePic: newUser.profilepic,
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.log('Error in signup controller', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userQuery = 'SELECT * FROM users WHERE username = $1';
        const userResult = await pool.query(userQuery, [username]);

        const user = userResult.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        generateTokenAndSetCookie(user.id, res);

        res.status(200).json({
            _id: user.id,
            fullName: user.fullname,
            username: user.username,
            profilePic: user.profilepic,
        });
    } catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getAll = async (req, res) => {
    try {
        const Sql = 'SELECT * FROM users'
        const result = await pool.query(Sql);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log('Error in getAll controller', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

