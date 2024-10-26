import { PrismaClient } from "@prisma/client";
import { ApiTagInterface } from "interfaces/tag";

export class TagService {
    static prisma = new PrismaClient();

    static async loadAll(): Promise<string[]> {
        const result = await this.prisma.tag.findMany();
        return result.map((tag) => tag.tag);
    }

    static async loadById(id: number): Promise<ApiTagInterface | null> {
        const result = await this.prisma.tag.findMany({ where: { id: id } });
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

    static formatTagArray(array: ApiTagInterface[]): ApiTagInterface[] {
        return array.map((tag) => {
            return {
                ...tag
            }
        });
    }
}