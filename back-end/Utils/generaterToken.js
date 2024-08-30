import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true if in production
        sameSite: 'Strict', // or 'Lax' depending on your needs
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
};

export default generateTokenAndSetCookie;
