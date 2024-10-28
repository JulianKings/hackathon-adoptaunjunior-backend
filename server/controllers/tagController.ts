import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, Router } from "express";
import { ApiTagInterface } from "../interfaces/tag";
import { TagService } from "../services/tagService";

export default function() {

    const tagController = Router();

    tagController.get('/', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const tags: ApiTagInterface[] = [];

        const entriesPerPage: number = (req.query.per_page) ? (+req.query.per_page) : req.app.settings.default_per_page;
        const currentPage: number = (req.query.page) ? (+req.query.page) : 1;

        const tagPages = await TagService.countPageNumber(entriesPerPage);

        if(tagPages >= currentPage)
        {
            tags.push(...await TagService.loadByPage(currentPage, entriesPerPage));
            res.json({ data: tags, pages: tagPages });
        } else {
            res.status(400).json({ error: 'Invalid page number' });
        }
    }));

    tagController.get('/all', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const tags = await TagService.loadAll();
        res.json({ data: tags });
    }));

    tagController.get('/:id', expressAsyncHandler(async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
        const tag = await TagService.loadById(+req.params.id);
        if(tag)
        {
            res.json({ data: tag });
        } else {
            res.status(400).json({ error: "Couldn't find and entry for id: " + req.params.id });
        }
    }));

    return tagController;
}