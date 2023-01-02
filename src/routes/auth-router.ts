import {Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../repositories/types";
import {authInputModel} from "../models/models";
import {
    inputValidationMiddleware,
    loginOrEmailValidation,
    passwordAuthValidation,
} from "../middlewares/input-validation";


export const authRouter = Router({})



authRouter.post('/login',
    loginOrEmailValidation,
    passwordAuthValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<authInputModel>, res: Response) => {
        const checkResult = await usersService.checkCredentials(req.body)
        if (checkResult) {
            res.send(204)
            return
        }
        res.send (401)

    })
