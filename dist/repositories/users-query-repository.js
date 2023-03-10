"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersQueryRepository = void 0;
const db_1 = require("./db");
function usersMapperToUserType(user) {
    return {
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        id: user._id.toString()
    };
}
exports.usersQueryRepository = {
    getAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null } = query;
            const sortDirectionNumber = sortDirection === "desc" ? -1 : 1;
            const skippedUsersNumber = (+pageNumber - 1) * +pageSize;
            if (searchLoginTerm && !searchEmailTerm) {
                const countAllWithSearchLoginTerm = yield db_1.usersCollection.countDocuments({ login: { $regex: searchLoginTerm, $options: 'i' } });
                const usersDb = yield db_1.usersCollection
                    .find({ login: { $regex: searchLoginTerm, $options: 'i' } })
                    .sort({ [sortBy]: sortDirectionNumber })
                    .skip(skippedUsersNumber)
                    .limit(+pageSize)
                    .toArray();
                const usersView = usersDb.map(usersMapperToUserType);
                return {
                    pagesCount: Math.ceil(countAllWithSearchLoginTerm / pageSize),
                    page: +pageNumber,
                    pageSize: +pageSize,
                    totalCount: countAllWithSearchLoginTerm,
                    items: usersView
                };
            }
            if (searchEmailTerm && !searchLoginTerm) {
                const countAllWithSearchEmailTerm = yield db_1.usersCollection.countDocuments({ email: { $regex: searchEmailTerm, $options: 'i' } });
                const usersDb = yield db_1.usersCollection
                    .find({ email: { $regex: searchEmailTerm, $options: 'i' } })
                    .sort({ [sortBy]: sortDirectionNumber })
                    .skip(skippedUsersNumber)
                    .limit(+pageSize)
                    .toArray();
                const usersView = usersDb.map(usersMapperToUserType);
                return {
                    pagesCount: Math.ceil(countAllWithSearchEmailTerm / pageSize),
                    page: +pageNumber,
                    pageSize: +pageSize,
                    totalCount: countAllWithSearchEmailTerm,
                    items: usersView
                };
            }
            if (searchLoginTerm && searchEmailTerm) {
                const countAllWithBothTerms = yield db_1.usersCollection.countDocuments({ $or: [{ email: { $regex: searchEmailTerm, $options: 'i' } }, { login: { $regex: searchLoginTerm, $options: 'i' } }] });
                const usersDb = yield db_1.usersCollection
                    .find({ $or: [{ email: { $regex: searchEmailTerm, $options: 'i' } }, { login: { $regex: searchLoginTerm, $options: 'i' } }] })
                    .sort({ [sortBy]: sortDirectionNumber })
                    .skip(skippedUsersNumber)
                    .limit(+pageSize)
                    .toArray();
                const usersView = usersDb.map(usersMapperToUserType);
                return {
                    pagesCount: Math.ceil(countAllWithBothTerms / pageSize),
                    page: +pageNumber,
                    pageSize: +pageSize,
                    totalCount: countAllWithBothTerms,
                    items: usersView
                };
            }
            const countAll = yield db_1.usersCollection.countDocuments();
            const usersDb = yield db_1.usersCollection
                .find({})
                .sort({ [sortBy]: sortDirectionNumber })
                .skip(skippedUsersNumber)
                .limit(+pageSize)
                .toArray();
            const usersView = usersDb.map(usersMapperToUserType);
            return {
                pagesCount: Math.ceil(countAll / pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAll,
                items: usersView
            };
        });
    }
};
