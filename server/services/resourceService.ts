import { ApiResourceInterface } from "interfaces/resource";
import { PrismaClient } from "@prisma/client";

export class ResourceService
{
    static prisma = new PrismaClient()

    static async loadAll(): Promise<ApiResourceInterface[]> {
        const result = await this.prisma.resource.findMany();
        return this.formatResourceArray(result as ApiResourceInterface[]);
    }

    static async loadById(id: string): Promise<ApiResourceInterface | null> {
        const result = await this.prisma.resource.findMany({ where: { id: Number(id) } });
        const resourceResult = this.formatResourceArray(result as ApiResourceInterface[]);

        if(resourceResult.length > 0)
        {
            return resourceResult[0];
        } else {
            return null;
        }   
    }

    static async create(resource: ApiResourceInterface): Promise<ApiResourceInterface> {
        const result = await this.prisma.resource.create({ data: resource });
        return result;
    }

    static formatResourceArray(array: ApiResourceInterface[]): ApiResourceInterface[] {
        return array.map((resource) => {
            return {
                ...resource
            }
        });
    }
}