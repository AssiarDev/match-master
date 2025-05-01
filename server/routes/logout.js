import express from 'express'; 

const router = express.Router();

router.post('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur lors de la déconnexion." });
            }

            res.clearCookie("connect.sid");
            res.status(200).json({ message: "Déconnexion réussie." });
        });
    } catch (e) {
        res.status(500).json({ error: "Erreur serveur." });
    }

});

export { router as logout }