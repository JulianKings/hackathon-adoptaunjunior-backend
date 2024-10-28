import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, Router } from "express";
import { ApiChallengeInterface } from "interfaces/challenge";
import { ChallengeService } from "../services/challengeService";

export default function() {

    const challengesController = Router();

    challengesController.get('/', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        let challenges: ApiChallengeInterface[] = [];
        const entriesPerPage: number = (req.query.per_page) ? (+req.query.per_page) : req.app.settings.default_per_page;
        const currentPage: number = (req.query.page) ? (+req.query.page) : 1;

        const challengePages = await ChallengeService.countPageNumber(entriesPerPage);

        if(challengePages >= currentPage)
        {
            challenges = await ChallengeService.loadByPage(currentPage, entriesPerPage);
            res.json({ data: challenges, pages: challengePages });
        } else {
            res.status(400).json({ error: 'Invalid page number' });
        }
    }));

    challengesController.get('/all', expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const challenges = await ChallengeService.loadAll();
        res.json({ data: challenges });
    }))

    challengesController.get('/:id', expressAsyncHandler(async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
        const challenge = await ChallengeService.loadById(req.params.id);
        if(challenge)
        {
            res.json({ data: challenge });
        } else {
            res.status(400).json({ error: "Couldn't find and entry for id: " + req.params.id });
        }
    }));
        
    return challengesController;
}