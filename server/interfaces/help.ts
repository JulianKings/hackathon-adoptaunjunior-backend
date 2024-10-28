import { ApiAbstractInterface } from "./api";
import { ApiTagsByIssuesInterface } from "./tag";
import { ApiUserInterface } from "./user";

export interface ApiHelpIssueInterface extends ApiAbstractInterface
{
    created_at: Date;
    updated_at: Date;
    author_id: number;
    author?: any | ApiUserInterface;
    votes: number;
    views: number;
    subject: string;
    content: string;
    status: 'open' | 'in_progress' | 'solved' | 'closed';
    tags?: any | ApiTagsByIssuesInterface[];
}