import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, Router } from "express";
import { ApiUserInterface } from "../interfaces/user";
import { UserService } from "../services/userService";

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
        
    return usersController;

}