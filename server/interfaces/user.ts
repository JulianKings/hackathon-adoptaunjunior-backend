import { ApiAbstractInterface } from "./api";

export interface ApiUserInterface extends ApiAbstractInterface {
    name: string;
    email: string;
    password: string;
    profile_picture: string;
    created_at: Date;
    role: 'user' | 'moderator' | 'admin';
    level: 'student' | 'junior' | 'senior' | 'manager';
    likes: number;
}

export type NullableApiUserInterface = ApiUserInterface | null;