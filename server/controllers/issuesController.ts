import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, Router } from "express";
import { ApiHelpIssueInterface } from "../interfaces/help";
import { HelpIssueService } from "../services/helpIssueService";

export default function() {

    const issuesController = Router();

    issuesController.get('/', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const issues: ApiHelpIssueInterface[] = [];

        const entriesPerPage: number = (req.query.per_page) ? (+req.query.per_page) : req.app.settings.default_per_page;
        const currentPage: number = (req.query.page) ? (+req.query.page) : 1;

        const issuePages = await HelpIssueService.countPageNumber(entriesPerPage);

        if(issuePages >= currentPage)
        {
            issues.push(...await HelpIssueService.loadByPage(currentPage, entriesPerPage));
            res.json({ data: issues, pages: issuePages });
        } else {
            res.status(400).json({ error: 'Invalid page number' });
        }
    }));

    issuesController.get('/all', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const issues = await HelpIssueService.loadAll();
        res.json({ data: issues });
    }));

    issuesController.get('/:id', expressAsyncHandler(async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
        const issue = await HelpIssueService.loadById(+req.params.id);
        if(issue)
        {
            res.json({ data: issue });
        } else {
            res.status(400).json({ error: "Couldn't find and entry for id: " + req.params.id });
        }
    }));

        
    return issuesController;

}