import { PrismaClient } from "@prisma/client";
import { ApiHelpIssueInterface } from "interfaces/help";

export class HelpIssueService
{
    static prisma = new PrismaClient();
    static commonParams = { 
        include: {
            tags: { include: { tag: true } },
            author: true
        }
    }

    static async loadAll(): Promise<ApiHelpIssueInterface[]> {
        const result = await this.prisma.helpIssue.findMany({ orderBy: { id: 'asc' },
            ...this.commonParams});
        return this.formatHelpIssueArray(result as ApiHelpIssueInterface[]);
    }

    static async countPageNumber(perPageAmount: number): Promise<number> {
        const result = await this.prisma.helpIssue.count();
        return Math.ceil(result / perPageAmount);
    }

    static async loadByPage(page: number, perPageAmount: number): Promise<ApiHelpIssueInterface[]> {
        const result = await this.prisma.helpIssue.findMany({ orderBy: { id: 'asc' }, skip: (page - 1) * perPageAmount, take: perPageAmount,
        ...this.commonParams
    });
        return this.formatHelpIssueArray(result as ApiHelpIssueInterface[]);
    }

    static async loadById(id: number): Promise<ApiHelpIssueInterface | null> {
        const result = await this.prisma.helpIssue.findMany({ where: { id: id }, ...this.commonParams });
        const helpIssueResult = this.formatHelpIssueArray(result as ApiHelpIssueInterface[]);
        
        if(helpIssueResult.length > 0)
        {
            return helpIssueResult[0];
        } else {
            return null;
        }
    }

    static async create(helpIssue: ApiHelpIssueInterface): Promise<ApiHelpIssueInterface> {
        const result = await this.prisma.helpIssue.create({ data: helpIssue });
        return result;
    }

    static formatHelpIssueArray(array: ApiHelpIssueInterface[]): ApiHelpIssueInterface[] {
        return array.map((issue) => {
            return { 
                ...issue
            }
        });
    }
}