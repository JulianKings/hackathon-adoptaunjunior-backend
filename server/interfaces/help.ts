import { ApiAbstractInterface } from "./api";

export interface ApiHelpIssueInterface extends ApiAbstractInterface
{
    created_at: Date;
    updated_at: Date;
    author_id: number;
    votes: number;
    views: number;
    subject: string;
    content: string;
    status: 'open' | 'in_progress' | 'solved' | 'closed';
}