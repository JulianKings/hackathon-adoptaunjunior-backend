import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, Router } from "express";
import { ApiUserInterface } from "../interfaces/user";
import { UserService } from "../services/userService";
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

export default function() {

    const usersController = Router();

    usersController.get('/', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const users: ApiUserInterface[] = [];

        const entriesPerPage: number = (req.query.per_page) ? (+req.query.per_page) : req.app.settings.default_per_page;
        const currentPage: number = (req.query.page) ? (+req.query.page) : 1;

        const userPages = await UserService.countPageNumber(entriesPerPage);

        if(userPages >= currentPage)
        {
            users.push(...await UserService.loadByPage(currentPage, entriesPerPage));
            res.json({ data: users, pages: userPages });
        } else {
            res.status(400).json({ error: 'Invalid page number' });
        }
    }));

    usersController.get('/all', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const users = await UserService.loadAll();
        res.json({ data: users });
    }));

    usersController.get('/:id', expressAsyncHandler(async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
        const user = await UserService.loadById(req.params.id);
        if(user)
        {
            res.json({ data: user });
        } else {
            res.status(400).json({ error: 'Invalid user id' });
        }
    }));

    usersController.post('/create', [
            body("name", "User name must not be empty.")
                .trim()
                .isLength({ min: 1 })
                .escape()
                .custom(async value => {
                    const user = await UserService.loadByName(value);
                    if(user) {
                        throw new Error('User name already in use')
                    }
                }), 
            body("email", "User mail must not be empty.")
                .trim()
                .isLength({ min: 1 })
                .escape()
                .custom(async value => {
                    const user = await UserService.loadByMail(value);
                    if(user) {
                        throw new Error('User email already in use')
                    }
                }),
            body("password", "User password must not be empty.")
                .trim()
                .isLength({ min: 1 })
                .escape(),
            body("experience", "User experience.")
                .trim()
                .isLength({ min: 1 })
                .escape(),

            expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.json({ responseStatus: 'invalidRegister', errors: errors.array() });
                } else {

                    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {

                        if(err)
                        {
                            return next(err);
                        }

                        const newUser: ApiUserInterface = {
                            name: req.body.name,
                            email: req.body.email,
                            password: hashedPassword,
                            profile_picture: './assets/default.png',
                            created_at: new Date(),
                            role: 'user',
                            level: req.body.experience,
                            likes: 0
                        }

                        const user = await UserService.create(newUser);
                        res.json({ responseStatus: 'validRegister', data: user });
                    });

                    
                }
            })
    ])
        
    return usersController;

}