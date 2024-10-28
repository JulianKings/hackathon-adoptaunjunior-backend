import { ApiAbstractInterface } from "./api";
import { ApiChallengeInterface } from "./challenge";
import { ApiUserInterface } from "./user";

export interface ApiSolutionInterface extends ApiAbstractInterface {
    challenge_id: number;
    author_id: number;
    votes: number;
    views: number;
    subject: string;
    description: string;
    code: string;
    verified: boolean;
    challenge?: any | ApiChallengeInterface;
    author?: any | ApiUserInterface;
}