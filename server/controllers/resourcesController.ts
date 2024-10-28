import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, Router } from "express";
import { ApiResourceInterface } from "../interfaces/resource";
import { ResourceService } from "../services/resourceService";

export default function() {

    const resourcesController = Router();

    resourcesController.get('/', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        let resources: ApiResourceInterface[] = [];
        const entriesPerPage: number = (req.query.per_page) ? (+req.query.per_page) : req.app.settings.default_per_page;
        const currentPage: number = (req.query.page) ? (+req.query.page) : 1;

        const resourcePages = await ResourceService.countPageNumber(entriesPerPage);

        if(resourcePages >= currentPage)
        {
            resources = await ResourceService.loadByPage(currentPage, entriesPerPage);
            res.json({ data: resources, pages: resourcePages });
        } else {
            res.status(400).json({ error: 'Invalid page number' });
        }
    }));

    resourcesController.get('/all', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const resources = await ResourceService.loadAll();
        res.json({ data: resources });
    }));

    resourcesController.get('/:id', expressAsyncHandler(async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
        const resource = await ResourceService.loadById(req.params.id);
        if(resource)
        {
            res.json({ data: resource });
        } else {
            res.status(400).json({ error: "Couldn't find and entry for id: " + req.params.id });
        }
    }));

    return resourcesController;
}