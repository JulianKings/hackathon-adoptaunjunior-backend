import { PrismaClient } from "@prisma/client";
import { ApiUserInterface } from "../interfaces/user";

export class UserService {
    
    static prisma = new PrismaClient();
    static commonParams = { 
        include: {
            issues: true,
            solutions: true
        }
    }

    static async loadAll(): Promise<ApiUserInterface[]> {
        const result = await this.prisma.user.findMany({ orderBy: { id: 'asc' }, ...this.commonParams });
        return this.formatUserArray(result as ApiUserInterface[]);
    }

    static async countPageNumber(perPageAmount: number): Promise<number> {
        const result = await this.prisma.user.count();
        return Math.ceil(result / perPageAmount);
    }

    static async loadByPage(page: number, perPageAmount: number): Promise<ApiUserInterface[]> {
        const result = await this.prisma.user.findMany({ skip: (page - 1) * perPageAmount, take: perPageAmount,
            orderBy: { id: 'asc' }, ...this.commonParams
         });
        return this.formatUserArray(result as ApiUserInterface[]);
    }

    static async loadById(id: string): Promise<ApiUserInterface | null> {
        const result = await this.prisma.user.findMany({ where: { id: Number(id) }, ...this.commonParams });
        const userResult = this.formatUserArray(result as ApiUserInterface[]);

        if(userResult.length > 0)
        {
            return userResult[0];
        } else {
            return null;
        }
    }

    static async loadByName(name: string): Promise<ApiUserInterface | null> {
        const result = await this.prisma.user.findMany({ where: { name: name } });
        const userResult = this.formatUserArray(result as ApiUserInterface[]);

        if(userResult.length > 0)
        {
            return userResult[0];
        } else {
            return null;
        }
    }

    static async loadByMail(mail: string): Promise<ApiUserInterface | null> {
        const result = await this.prisma.user.findMany({ where: { email: mail } });
        const userResult = this.formatUserArray(result as ApiUserInterface[]);

        if(userResult.length > 0)
        {
            return userResult[0];
        } else {
            return null;
        }
    }

    static async create(user: ApiUserInterface): Promise<ApiUserInterface> {
        const result = await this.prisma.user.create({ data: user });
        return this.formatUserArray([result])[0];
    }

    static formatUserArray(array: ApiUserInterface[]): ApiUserInterface[]
    {
        return array.map((user: ApiUserInterface) => {
            return {
                ...user,
                profile_picture: user.profile_picture.replaceAll('&#x2F;', '/'),
                created_at: new Date(Date.parse((typeof(user.created_at) === 'string') ? user.created_at : user.created_at.toDateString()))
            }
        })
    }
}