import {usersRepository} from "../repositories/users-repository-db";
import {authInputModel, createUserInputModel, userDbType, userModel} from "../models/models";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";

export const usersService = {

    async createUser(body: createUserInputModel): Promise<userModel> {
        const {login , email, password} = body
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newDbUser: userDbType = {
            _id: new ObjectId(),
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.createUser(newDbUser)
    },

    async checkCredentials(body: authInputModel): Promise<boolean> {
        const {loginOrEmail, password} = body
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return false
        }
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false
        }
        return true


    },

    async _generateHash(password: string, salt: string) {
        const hash = bcrypt.hash(password, salt)
        return hash
    },

    async deleteUserById(id:string): Promise<boolean> {
        return await usersRepository.deleteUserById(id)

    }
}
