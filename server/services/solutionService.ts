import { ApiSolutionInterface } from "interfaces/solution";
import { PrismaClient } from "@prisma/client";

export class SolutionService {

    static prisma = new PrismaClient();

    static async loadAll(): Promise<ApiSolutionInterface[]> {
        const result = await this.prisma.solution.findMany();
        return this.formatSolutionArray(result as ApiSolutionInterface[]);
    }
    static async loadById(id: number): Promise<ApiSolutionInterface | null> {
        const result = await this.prisma.solution.findMany({ where: { id: id } });
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