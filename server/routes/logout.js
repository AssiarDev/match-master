import express from 'express';

const router = express.Router();

router.get('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    });

    res.status(200).json({ message: "Déconnexion réussie" });
}) 

export { router as logout }