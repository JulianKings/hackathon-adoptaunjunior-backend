import dotenv from "dotenv";
import express from 'express';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexController from './controllers/indexController';
import loginController from './controllers/loginController';
import sessionController from './controllers/sessionController';
import challengesController from './controllers/challengesController';
import issuesController from "./controllers/issuesController";
import solutionController from "./controllers/solutionController";
import resourcesController from "./controllers/resourcesController";
import userController from "./controllers/userController";
import tagController from "./controllers/tagController";

import { applyPassportMiddleware } from './middleware/auth';

dotenv.config();
const app = express();


const jwtKey: string = (process.env.JWT_SECURE_KEY !== undefined) ? process.env.JWT_SECURE_KEY : 'defaultSecretKey915534b';
const sessionKey: string = (process.env.SESSION_SECURE_KEY !== undefined) ? process.env.SESSION_SECURE_KEY : 'defaultSecretKey915534bCats';
const defaultPerPage: number = (process.env.DEFAULT_PER_PAGE !== undefined) ? (+process.env.DEFAULT_PER_PAGE) : 10;

app.set('jwt_secret_password', jwtKey);
app.set('default_per_page', defaultPerPage);

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({ secret: sessionKey, resave: false, saveUninitialized: true }));
app.use(passport.session());


// Lambda middleware to convert request body to JSON
const bufferToJSONMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (req.body.length > 0 && req.body instanceof Buffer) {
	try {
		req.body = JSON.parse(req.body.toString());
	} catch (err) {
		return res.status(400).json({ body: req.body, length: req.body.length, error: 'Invalid JSON data' });
	}
	}

	next();
};

//app.use(bufferToJSONMiddleware)

const indexRouterHandler = indexController();
app.use('/', indexRouterHandler);

const challengesRouterHandler = challengesController();
app.use('/challenge', challengesRouterHandler);

const sessionRouterHandler = sessionController(passport);
app.use('/', sessionRouterHandler);

const loginRouterHandler = loginController(passport);
app.use('/login', loginRouterHandler);

const issuesRouterHandler = issuesController();
app.use('/issue', issuesRouterHandler);

const solutionRouterHandler = solutionController();
app.use('/solution', solutionRouterHandler);

const resourcesRouterHandler = resourcesController();
app.use('/resource', resourcesRouterHandler);

const userRouterHandler = userController();
app.use('/user', userRouterHandler);

const tagRouterHandler = tagController();
app.use('/tag', tagRouterHandler);

applyPassportMiddleware(passport);

app.listen(3000);

console.log('server listening on port 3000');

//export const handler = serverless(app);