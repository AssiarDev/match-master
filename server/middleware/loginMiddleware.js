import jwt from 'jsonwebtoken';

export const loginCheck = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ redirect: "/login", message: "Accès refusé. Token absent." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token invalide ou expiré." });
    }

}