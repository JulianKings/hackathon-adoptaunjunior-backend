import { ApiAbstractInterface } from "./api";

export interface ApiTagInterface extends ApiAbstractInterface {
    tag: string;
}

export interface ApiAbstractTagsByInterface extends ApiAbstractInterface {
    tag_id: number;
}

export interface ApiTagsByChallengesInterface extends ApiAbstractTagsByInterface {
    challenge_id: number;
}

export interface ApiTagsByIssuesInterface extends ApiAbstractTagsByInterface {
    issue_id: number;
}

export interface ApiTagsByResourcesInterface extends ApiAbstractTagsByInterface {
    resource_id: number;
}