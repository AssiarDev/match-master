import { UserService } from "../service/userService.js";

const userService = new UserService()

export const register = async (req, res) => {
    try {
        const { username, mail, password, confirmPassword } = req.body

        if (!username || !mail || !password || !confirmPassword) {
        return res
            .status(400)
            .json({ error: 'Tous les champs sont obligatoires' });
        }

        if (password !== confirmPassword) {
        return res
            .status(400)
            .json({ error: 'Les mots de passe ne correspondent pas' });
        }

        const result = await userService.register(username, mail, password)
        return res.json(result.success)
    } catch(err){
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export const login = async (req, res) => {
    try {
        const { mail, password } = req.body
        const user = await userService.login(mail, password)

        if(!mail || !password){
            return res.status(400).json({ error: "Tous les champs sont obligatoire" })
        }

        if(user.success){
            req.session.user = { id: user.id, email: user.mail, token: user.token }

            res.cookie('token', user.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 36000000
            })

            res.status(200).json({ message: 'Connexion reussie' })
        } else {
            res.status(401).json({ error: 'Identifiants incorrects.' })
        }

    } catch (err){
        res.status(500).json({ error: 'Erreur serveur' })
    }
}

export const logout = (req, res) => {
    res.clearCookie('token', {
        secure: true,
        sameSite: true,
        maxAge: 0,
        path: '/'
    })

    res.status(200).json({ message: 'Déconnexion réussie' })
}

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()

        if(!users){
            return res.status(500).json({ error: 'Impossible de récupérer tous les utilisateurs'})
        }

        res.json(users)
    } catch(err){
        res.status(500).json({ error: 'Erreur serveur' })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID invalide' });
        }

        const result = await userService.deleteUser(id)

        if (result) {
            return res.json({ message: 'Utilisateur supprimé avec succès' });
        } else {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }
    } catch(err){
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { username, email } = req.body

        if (!username || !email) {
            return res
            .status(400)
            .json({ error: 'Tous les champs sont obligatoires' });
        }

        const result = await userService.updateUser(id, { username, email })

        if (!result) {
            return res.status(404).json({ error: 'Erreur lors de la mise à jour' });
        }

        res.json(result)
    } catch (err){
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export const userProfile = (req, res) => {
    if(!req.user){
        return res
        .status(401)
        .json({ isAuthenticated: false, message: 'Non authentifié' });
    }

    res.json({
        isAuthenticated: true,
        user: {
        id: req.user.id,
        mail: req.user.mail,
        username: req.user.username,
        },
    });
}