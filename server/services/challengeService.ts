import { PrismaClient } from "@prisma/client";
import { ApiChallengeInterface, ApiChallengeRatingInterface } from "interfaces/challenge";
export class ChallengeService {
    static prisma = new PrismaClient();
    static commonParams = { 
        include: {
            tags: { include: { tag: true } },
            solutions: true,
            rating: true
        }
    }

    static async loadAll(): Promise<ApiChallengeInterface[]> {
        const result = await this.prisma.challenge.findMany({            
            orderBy: { id: 'asc' }, 
            ...this.commonParams
        });
        return this.formatChallengeArray(result as ApiChallengeInterface[]);
    }

    static async countPageNumber(perPageAmount: number): Promise<number> {
        const result = await this.prisma.challenge.count();
        return Math.ceil(result / perPageAmount);
    }

    static async loadByPage(page: number, perPageAmount: number): Promise<ApiChallengeInterface[]> {
        const result = await this.prisma.challenge.findMany({ orderBy: { id: 'asc' }, skip: (page - 1) * perPageAmount, take: perPageAmount,
            ...this.commonParams 
         });
        return this.formatChallengeArray(result as ApiChallengeInterface[]);
    }

    static async loadById(id: string): Promise<ApiChallengeInterface | null> {
        const result = await this.prisma.challenge.findMany({ where: { id: Number(id) }, 
            ...this.commonParams });
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

    static async addValorations(challenge: ApiChallengeInterface, rating: number): Promise<ApiChallengeRatingInterface | null> {
        if(challenge.id !== undefined)
        {
            const result = await this.prisma.challengeRating.create({ data: {
                challenge_id: challenge.id,
                value: rating,
                created_at: new Date() 
            }})
            return result;
        }

        return null;
    }

    static formatChallengeArray(array: ApiChallengeInterface[]): ApiChallengeInterface[] {
        return array.map((challenge: ApiChallengeInterface) => {
            return {
                ...challenge,
            }
        })
    }
}