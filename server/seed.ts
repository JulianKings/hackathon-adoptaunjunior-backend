import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { ApiUserInterface } from './interfaces/user';
import { ApiChallengeInterface } from './interfaces/challenge';
import { ApiSolutionInterface } from './interfaces/solution';
import { ApiResourceInterface } from './interfaces/resource';
import { ApiTagInterface } from './interfaces/tag';
import { ApiHelpIssueInterface } from 'interfaces/help';
import { UserService } from './services/userService';

const prisma = new PrismaClient();

function createRandomUser(): ApiUserInterface {
    return {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: "$2a$10$3ZaCp.V0lvHyqyle9aKfmOX2APUb960o1oX0EWFNFtX4/lyMCRkcG", // test
        profile_picture: faker.image.avatarGitHub(),
        created_at: faker.date.past(),
        role: 'user',
        level: faker.helpers.arrayElement(['student', 'junior', 'senior', 'manager']),
        likes: 0
    }
}

function createRandomChallenge(): ApiChallengeInterface {
    return {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        content: faker.lorem.paragraphs(10),
        published: true,
        difficulty: faker.helpers.arrayElement(['basic', 'easy', 'medium', 'hard', 'expert']),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        picture: faker.image.urlLoremFlickr()
    }
}

function createRandomResource(): ApiResourceInterface {
    return {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        content: faker.lorem.paragraphs(10),
        published: true,
        type: faker.helpers.arrayElement(['video', 'course']),
        url: faker.internet.url(),
        created_at: faker.date.past(),
        updated_at: faker.date.past()
    }
}

class ChildItemsGenerator {
    challengeList: ApiChallengeInterface[];
    userList: ApiUserInterface[];

    constructor(challengeList: ApiChallengeInterface[], userList: ApiUserInterface[]) {
        this.challengeList = challengeList;
        this.userList = userList;
    }

    createRandomSolution(): ApiSolutionInterface {
        return {
            challenge_id: (faker.helpers.arrayElement(this.challengeList).id !== undefined) ? faker.helpers.arrayElement(this.challengeList).id as number : 1,
            author_id: (faker.helpers.arrayElement(this.userList).id !== undefined) ? faker.helpers.arrayElement(this.userList).id as number : 1,
            votes: 0,
            views: 0,
            subject: faker.lorem.sentence(),
            description: faker.lorem.paragraphs(10),
            code: faker.lorem.paragraphs(10),
            verified: false
        }
    }

    createRandomHelpIssue(): ApiHelpIssueInterface {
        return {
            created_at: faker.date.past(),
            updated_at: faker.date.past(),
            author_id: (faker.helpers.arrayElement(this.userList).id !== undefined) ? faker.helpers.arrayElement(this.userList).id as number : 1,
            votes: 0,
            views: 0,
            subject: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(10),
            status: faker.helpers.arrayElement(['open', 'in_progress', 'solved', 'closed'])
        }
    }
}

const users: ApiUserInterface[] = faker.helpers.multiple(createRandomUser, { count: 50 });
const challenges: ApiChallengeInterface[] = faker.helpers.multiple(createRandomChallenge, { count: 100 });
const resources: ApiResourceInterface[] = faker.helpers.multiple(createRandomResource, { count: 100 });
const tags: ApiTagInterface[] = [];

const solutions: ApiSolutionInterface[] = [];
const helpIssues: ApiHelpIssueInterface[] = [];

async function seeder() {
    

    try {
        console.log('Starting work...');
        await runCleanup();
        await createUsers();

        console.log('All DONE!');
    } catch (error) {
        console.error(error)
    }
}

async function runCleanup() {
    console.log('Cleaning up the database...');
    await prisma.user.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.solution.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.helpIssue.deleteMany();
    console.log('DONE!');
}

async function createUser(user: ApiUserInterface, index: number) {
    const result = await UserService.create(user);
    users[index] = result;
}

async function createUsers()
{
    console.log('Adding users...');

    const concatPromise: Promise<void>[] = [];
	users.forEach((user, index) => 
	{
		concatPromise.push(createUser(user, index));
	});

	await Promise.all(concatPromise);
    console.log('DONE!');
}

seeder()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });