import { ApiAbstractInterface } from "./api";

export interface ApiSolutionInterface extends ApiAbstractInterface {
    challenge_id: number;
    author_id: number;
    votes: number;
    views: number;
    subject: string;
    description: string;
    code: string;
    verified: boolean;
}