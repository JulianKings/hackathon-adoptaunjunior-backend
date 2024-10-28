import { PrismaClient } from "@prisma/client";
import { ApiAbstractTagsByInterface, ApiTagInterface } from "interfaces/tag";

export class TagService {
    static prisma = new PrismaClient();
    static commonParams = { 
        include: {
            challenges: { include: { challenge: true } },
            solutions: { include: { solution: true } },
            resources: { include: { resource: true } }            
        }
    }

    static async loadAll(): Promise<string[]> {
        const result = await this.prisma.tag.findMany({ orderBy: { id: 'asc' }, ...this.commonParams });
        return result.map((tag) => tag.tag);
    }

    static async countPageNumber(perPageAmount: number): Promise<number> {
        const result = await this.prisma.tag.count();
        return Math.ceil(result / perPageAmount);
    }

    static async loadByPage(page: number, perPageAmount: number): Promise<ApiTagInterface[]> {
        const result = await this.prisma.tag.findMany({ skip: (page - 1) * perPageAmount, take: perPageAmount,
            ...this.commonParams, orderBy: { id: 'asc' }
         });
        return this.formatTagArray(result as ApiTagInterface[]);
    }

    static async loadById(id: number): Promise<ApiTagInterface | null> {
        const result = await this.prisma.tag.findMany({ where: { id: id }, ...this.commonParams });
        const tagResult = this.formatTagArray(result as ApiTagInterface[]);

        if(tagResult.length > 0)
        {
            return tagResult[0];
        } else {
            return null;
        }
    }

    static async create(tag: ApiTagInterface): Promise<ApiTagInterface> {
        const result = await this.prisma.tag.create({ data: tag });
        return result;
    }

    static async createFor(type: string, targetId: number, tag: ApiTagInterface): Promise<ApiAbstractTagsByInterface | null> {
        
        if(tag && tag.id !== undefined)
        {
            switch(type)
            {
                case 'challenge':
                    return await this.prisma.tagsByChallenges.create({ data: {
                        challenge_id: targetId,
                        tag_id: tag.id
                    } });
                case 'resource':
                    return await this.prisma.tagsByResources.create({ data: {
                        resource_id: targetId,
                        tag_id: tag.id
                    } });
                case 'issue':
                    return await this.prisma.tagsByIssues.create({ data: {
                        issue_id: targetId,
                        tag_id: tag.id
                    } });
                default:
                    return null;
            }
        }

        return null;
    }

    static formatTagArray(array: ApiTagInterface[]): ApiTagInterface[] {
        return array.map((tag) => {
            return {
                ...tag
            }
        });
    }
}