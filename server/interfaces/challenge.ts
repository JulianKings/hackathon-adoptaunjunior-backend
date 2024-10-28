import { ApiAbstractInterface } from "./api";
import { ApiSolutionInterface } from "./solution";
import { ApiTagsByChallengesInterface } from "./tag";

export interface ApiChallengeInterface extends ApiAbstractInterface {
    created_at: Date;
    updated_at: Date;
    title: string;
    description: string;
    content: string;
    published: boolean;
    difficulty: 'basic' | 'easy' | 'medium' | 'hard' | 'expert';
    picture: string;
    tags?: any | ApiTagsByChallengesInterface[];
    solutions?: any | ApiSolutionInterface[];
    rating?: any | ApiChallengeRatingInterface[];

}

export interface ApiChallengeRatingInterface extends ApiAbstractInterface {
    created_at: Date;
    challenge_id: number;
    value: number;
}