import { NextFunction, Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";

export default function ()
{
    const indexController = Router();

    indexController.get('/', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
          res.json({ responseStatus: 'ok' });
    }));

    return indexController;
}