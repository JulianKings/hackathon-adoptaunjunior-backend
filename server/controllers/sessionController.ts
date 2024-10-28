import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, Router } from "express";
import { PassportStatic } from "passport";

export default function(passport: PassportStatic) {

    const sessionController = Router();

    sessionController.get('/validate', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        if(req.user !== null)
        {
            res.status(200).json({ user: req.user })
        } else {
            res.status(400).json({ error: 'Invalid user logged in'});
        }
    }));
        
    return sessionController;
}