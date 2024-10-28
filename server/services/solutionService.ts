import { ApiSolutionInterface } from "interfaces/solution";
import { PrismaClient } from "@prisma/client";

export class SolutionService {

    static prisma = new PrismaClient();
    static commonParams = { 
        include: {
            challenge: true,
            author: true
        }
    }

    static async loadAll(): Promise<ApiSolutionInterface[]> {
        const result = await this.prisma.solution.findMany({ orderBy: { id: 'asc' }, ...this.commonParams });
        return this.formatSolutionArray(result as ApiSolutionInterface[]);
    }

    static async countPageNumber(perPageAmount: number): Promise<number> {
        const result = await this.prisma.solution.count();
        return Math.ceil(result / perPageAmount);
    }
    
    static async loadByPage(page: number, perPageAmount: number): Promise<ApiSolutionInterface[]> {
        const result = await this.prisma.solution.findMany({ skip: (page - 1) * perPageAmount, take: perPageAmount, 
            orderBy: { id: 'asc' }, 
            ...this.commonParams
         });
        return this.formatSolutionArray(result as ApiSolutionInterface[]);
    }

    static async loadById(id: number): Promise<ApiSolutionInterface | null> {
        const result = await this.prisma.solution.findMany({ where: { id: id }, ...this.commonParams });
        const solutionResult = this.formatSolutionArray(result as ApiSolutionInterface[]);

        if(solutionResult.length > 0)
        {
            return solutionResult[0];
        } else {
            return null;
        }
    }   

    static async create(solution: ApiSolutionInterface): Promise<ApiSolutionInterface> {
        const result = await this.prisma.solution.create({ data: solution });
        return result;
    }

    static formatSolutionArray(array: ApiSolutionInterface[]): ApiSolutionInterface[] {
        return array.map((solution: ApiSolutionInterface) => {
            return {
                ...solution
            }
        });
    }
}