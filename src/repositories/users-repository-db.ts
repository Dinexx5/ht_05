import {usersCollection} from "./db";
import {userDbType, userModel} from "../models/models";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser(newDbUser: userDbType): Promise<userModel> {
        await usersCollection.insertOne(newDbUser)
        return {
            id: newDbUser._id.toString(),
            login: newDbUser.login,
            email: newDbUser.email,
            createdAt: newDbUser.createdAt
        }

    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<userDbType | null> {
        const user = await usersCollection.findOne( {$or: [{email: loginOrEmail}, {login: loginOrEmail}] } )
        return user
    },

    async deleteUserById(id:string): Promise<boolean> {
        let _id = new ObjectId(id)
        let result = await usersCollection.deleteOne({_id: _id})
        return result.deletedCount === 1

    },

}