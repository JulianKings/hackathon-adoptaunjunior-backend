import { ApiAbstractInterface } from "./api";

export interface ApiTagInterface extends ApiAbstractInterface {
    tag: String;
}

export interface ApiTagsByChallengesInterface extends ApiAbstractInterface {
    challenge_id: number;
    tag_id: number;
}

export interface ApiTagsByIssuesInterface extends ApiAbstractInterface {
    issue_id: number;
    tag_id: number;
}

export interface ApiTagsByResourcesInterface extends ApiAbstractInterface {
    resource_id: number;
    tag_id: number;
}