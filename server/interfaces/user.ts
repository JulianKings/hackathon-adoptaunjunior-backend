import { ApiAbstractInterface } from "./api";
import { ApiHelpIssueInterface } from "./help";
import { ApiSolutionInterface } from "./solution";

export interface ApiUserInterface extends ApiAbstractInterface {
    name: string;
    email: string;
    password: string;
    profile_picture: string;
    created_at: Date;
    role: 'user' | 'moderator' | 'admin';
    level: 'student' | 'junior' | 'senior' | 'manager';
    likes: number;
    issues?: any | ApiHelpIssueInterface[];
    solutions?: any | ApiSolutionInterface[];
}

export type NullableApiUserInterface = ApiUserInterface | null;