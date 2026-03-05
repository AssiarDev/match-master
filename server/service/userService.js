import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../repositories/user.repository.js'

const userRepo = new UserRepository()

export class UserService {
    async register(username, email, password){
        const existing = await userRepo.findByEmail(email)
        if(existing){
            return { success: false, message: 'Email déja utilisé.'}
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = await userRepo.create({
            username,
            email,
            password: hashedPassword
        })

        return { success: true, user }
    }

    async login(email, password){
        const user = await userRepo.findByEmail(email)
        if(!user){
            return { success: false, message: "Utilisateur introuvable"}
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword){
            return { success: false, message: "Mot de passe incorrect."}
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        )

        return { success: true, token}
    }

    async getAllUsers(){
        return userRepo.findAll()
    }

    async updateUser(id, data){
        const user = await userRepo.findById(id)
        if(!user){
            return { success: false, message: "Utilisateur introuvable"}
        }

        const updated = await userRepo.update(id, data)
        return { success: true, user: updated}
    }

    async deleteUser(id){
        const user = await userRepo.findById(id)
        if(!user){
            return { success: false, message: "Utilisateur introuvable"}
        }

        await userRepo.delete(id)
        return { success: true, message: "Utilisateur supprimé"}
    }
}