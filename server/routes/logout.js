import express from 'express';

const router = express.Router();

router.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 0,
        path: '/'
    });

    res.status(200).json({ message: "Déconnexion réussie" });
}) 

export { router as logout }