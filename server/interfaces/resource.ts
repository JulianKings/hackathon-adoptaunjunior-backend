import { ApiAbstractInterface } from "./api";
import { ApiTagsByResourcesInterface } from "./tag";

export interface ApiResourceInterface extends ApiAbstractInterface {
    created_at: Date;
    updated_at: Date;
    title: string;
    description: string;
    content: string;
    published: boolean;
    type: 'video' | 'course';
    url: string;
    image: string;
    tags?: any | ApiTagsByResourcesInterface[];
}