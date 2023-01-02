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
exports.authRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../domain/users-service");
const input_validation_1 = require("../middlewares/input-validation");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', input_validation_1.loginOrEmailValidation, input_validation_1.passwordAuthValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checkResult = yield users_service_1.usersService.checkCredentials(req.body);
    if (checkResult) {
        res.send(204);
    }
    res.send(401);
}));
