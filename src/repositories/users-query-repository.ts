import {usersCollection} from "./db";
import {queryUsers, userDbType, userModel, usersViewModel} from "../models/models";

function usersMapperToUserType (user: userDbType): userModel {
    return  {
        login: user.userName,
        email: user.email,
        createdAt: user.createdAt,
        id: user._id.toString()
    }

}

export const usersQueryRepository = {


    async getAllUsers(query: queryUsers): Promise<usersViewModel> {

        const {sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null} = query
        const sortDirectionNumber: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedUsersNumber = (+pageNumber-1)*+pageSize

        if (searchLoginTerm && !searchEmailTerm){
            const countAllWithSearchLoginTerm = await usersCollection.countDocuments({userName: {$regex: searchLoginTerm, $options: 'i' } })
            const usersDb: userDbType[] = await usersCollection
                .find( {userName: {$regex: searchLoginTerm, $options: 'i' } }  )
                .sort( {[sortBy]: sortDirectionNumber} )
                .skip(skippedUsersNumber)
                .limit(+pageSize)
                .toArray()

            const usersView = usersDb.map(usersMapperToUserType)
            return {
                pagesCount: Math.ceil(countAllWithSearchLoginTerm/pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAllWithSearchLoginTerm,
                items: usersView
            }

        }

        if (searchEmailTerm && !searchLoginTerm){
            const countAllWithSearchEmailTerm = await usersCollection.countDocuments({email: {$regex: searchEmailTerm, $options: 'i' } })
            const usersDb: userDbType[] = await usersCollection
                .find( {email: {$regex: searchEmailTerm, $options: 'i' } }  )
                .sort( {[sortBy]: sortDirectionNumber} )
                .skip(skippedUsersNumber)
                .limit(+pageSize)
                .toArray()

            const usersView = usersDb.map(usersMapperToUserType)
            return {
                pagesCount: Math.ceil(countAllWithSearchEmailTerm/pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAllWithSearchEmailTerm,
                items: usersView
            }

        }

        if (searchLoginTerm && searchEmailTerm){
            const countAllWithBothTerms = await usersCollection.countDocuments( {$and: [{email: {$regex: searchEmailTerm, $options: 'i' } }, {userName: {$regex: searchLoginTerm, $options: 'i' }} ] })
            const usersDb: userDbType[] = await usersCollection
                .find(  {$and: [{email: {$regex: searchEmailTerm, $options: 'i' } }, {userName: {$regex: searchLoginTerm, $options: 'i' }} ] } )
                .sort( {[sortBy]: sortDirectionNumber} )
                .skip(skippedUsersNumber)
                .limit(+pageSize)
                .toArray()

            const usersView = usersDb.map(usersMapperToUserType)
            return {
                pagesCount: Math.ceil(countAllWithBothTerms/pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAllWithBothTerms,
                items: usersView
            }

        }

        const countAll = await usersCollection.countDocuments()
        const usersDb = await usersCollection
            .find( { } )
            .sort( {[sortBy]: sortDirectionNumber} )
            .skip(skippedUsersNumber)
            .limit(+pageSize)
            .toArray()

        const usersView = usersDb.map(usersMapperToUserType)
        return {
            pagesCount: Math.ceil(countAll/pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: usersView

         }
    }
}