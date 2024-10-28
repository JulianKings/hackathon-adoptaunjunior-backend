import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, Router } from "express";

import jwt from 'jsonwebtoken';
import { body, validationResult } from "express-validator";
import { PassportStatic } from "passport";

export default function(passport: PassportStatic) {

    const loginController = Router();

    loginController.post('/', [
        // Validate and sanitize fields.
        body("email", "Email must not be empty.")
            .trim()
            .isLength({ min: 1 })
            .escape(),
        body("password", "Password must not be empty.")
            .trim()
            .isLength({ min: 1 })
            .escape(),  
            
        expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);

            if(!errors.isEmpty())
            {
                // send response with errors
                const responseObject = {
                    responseStatus: 'invalidLogin',
                    errors: errors.array()
                }
                res.json(responseObject);
            } else {
                passport.authenticate(
                    'login',
                    async (err: any, user: Express.User, info: any) => {
                        try {
                            if (err) {
                                const error = new Error('An error occurred.');
                    
                                return next(error);
                            }

                            if(user === false)
                            {
                                // send response with errors
                                const responseObject = {
                                    responseStatus: 'failedLogin',
                                    errors: [info]
                                }
                                return res.json(responseObject);
                            }
                    
                            req.login(
                                user,
                                { session: false },
                                async (error) => {
                                if (error) return next(error);
                    
                                const userBody = { ...user,
                                        password: undefined
                                    };
                                const token = jwt.sign({ user: userBody }, req.app.settings.jwt_secret_password, { expiresIn: '4h' });
                    
                                return res.json({ responseStatus: 'validLogin', token: token });
                                }
                            );
                        } catch (error) {
                            return next(error);
                        }
                    }
                )(req, res, next);
            }
        })
    ]);
        
    return loginController;
}