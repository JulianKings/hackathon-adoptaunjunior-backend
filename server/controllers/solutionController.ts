import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, Router } from "express";
import { ApiSolutionInterface } from "../interfaces/solution";
import { SolutionService } from "../services/solutionService";

export default function() {

    const solutionController = Router();

    solutionController.get('/', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const solutions: ApiSolutionInterface[] = [];

        const entriesPerPage: number = (req.query.per_page) ? (+req.query.per_page) : req.app.settings.default_per_page;
        const currentPage: number = (req.query.page) ? (+req.query.page) : 1;

        const solutionPages = await SolutionService.countPageNumber(entriesPerPage);

        if(solutionPages >= currentPage)
        {
            solutions.push(...await SolutionService.loadByPage(currentPage, entriesPerPage));
            res.json({ data: solutions, pages: solutionPages });
        } else {
            res.status(400).json({ error: 'Invalid page number' });
        }
    }));

    solutionController.get('/all', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const solutions = await SolutionService.loadAll();
        res.json({ data: solutions });
    }));

    solutionController.get('/:id', expressAsyncHandler(async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
        const solution = await SolutionService.loadById(+req.params.id);
        if(solution)
        {
            res.json({ data: solution });
        } else {
            res.status(400).json({ error: 'Invalid solution id' });
        }
    }));

    return solutionController;
}