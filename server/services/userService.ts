import { PrismaClient } from "@prisma/client";
import { ApiUserInterface } from "../interfaces/user";

export class UserService {
    
    static prisma = new PrismaClient();

    static async loadAll(): Promise<ApiUserInterface[]> {
        const result = await this.prisma.user.findMany();
        return this.formatUserArray(result as ApiUserInterface[]);
    }

    static async loadUserById(id: string): Promise<ApiUserInterface | null> {
        const result = await this.prisma.user.findMany({ where: { id: Number(id) } });
        const userResult = this.formatUserArray(result as ApiUserInterface[]);

        if(userResult.length > 0)
        {
            return userResult[0];
        } else {
            return null;
        }
    }

    static async loadUserByName(name: string): Promise<ApiUserInterface | null> {
        const result = await this.prisma.user.findMany({ where: { name: name } });
        const userResult = this.formatUserArray(result as ApiUserInterface[]);

        if(userResult.length > 0)
        {
            return userResult[0];
        } else {
            return null;
        }
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