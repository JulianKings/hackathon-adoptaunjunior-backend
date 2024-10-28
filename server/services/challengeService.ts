import { PrismaClient } from "@prisma/client";
import { ApiChallengeInterface } from "interfaces/challenge";
export class ChallengeService {
    static prisma = new PrismaClient();

    static async loadAll(): Promise<ApiChallengeInterface[]> {
        const result = await this.prisma.challenge.findMany();
        return this.formatChallengeArray(result as ApiChallengeInterface[]);
    }

    static async countPageNumber(perPageAmount: number): Promise<number> {
        const result = await this.prisma.challenge.count();
        return Math.ceil(result / perPageAmount);
    }

    static async loadByPage(page: number, perPageAmount: number): Promise<ApiChallengeInterface[]> {
        const result = await this.prisma.challenge.findMany({ skip: (page - 1) * perPageAmount, take: perPageAmount });
        return this.formatChallengeArray(result as ApiChallengeInterface[]);
    }

    static async loadById(id: string): Promise<ApiChallengeInterface | null> {
        const result = await this.prisma.challenge.findMany({ where: { id: Number(id) } });
        const challengeResult = this.formatChallengeArray(result as ApiChallengeInterface[]);

        if(challengeResult.length > 0)
        {
            return challengeResult[0];
        } else {
            return null;
        }
    } 

    static async create(challenge: ApiChallengeInterface): Promise<ApiChallengeInterface> {
        const result = await this.prisma.challenge.create({ data: challenge });
        return this.formatChallengeArray([result])[0];
    }

    static formatChallengeArray(array: ApiChallengeInterface[]): ApiChallengeInterface[] {
        return array.map((challenge: ApiChallengeInterface) => {
            return {
                ...challenge,
            }
        })
    }
}