import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { ApiUserInterface } from './interfaces/user';
import { ApiChallengeInterface } from './interfaces/challenge';
import { ApiSolutionInterface } from './interfaces/solution';
import { ApiResourceInterface } from './interfaces/resource';
import { ApiTagInterface } from './interfaces/tag';
import { ApiHelpIssueInterface } from 'interfaces/help';
import { UserService } from './services/userService';
import { ChallengeService } from './services/challengeService';
import { ResourceService } from './services/resourceService';
import { SolutionService } from './services/solutionService';
import { HelpIssueService } from './services/helpIssueService';
import { TagService } from './services/tagService';

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
    

    static createRandomSolution(): ApiSolutionInterface {
        return {
            challenge_id: (faker.helpers.arrayElement(challenges).id !== undefined) ? faker.helpers.arrayElement(challenges).id as number : 1,
            author_id: (faker.helpers.arrayElement(users).id !== undefined) ? faker.helpers.arrayElement(users).id as number : 1,
            votes: 0,
            views: 0,
            subject: faker.lorem.sentence(),
            description: faker.lorem.paragraphs(10),
            code: faker.lorem.paragraphs(10),
            verified: false
        }
    }

    static createRandomHelpIssue(): ApiHelpIssueInterface {
        return {
            created_at: faker.date.past(),
            updated_at: faker.date.past(),
            author_id: (faker.helpers.arrayElement(users).id !== undefined) ? faker.helpers.arrayElement(users).id as number : 1,
            votes: 0,
            views: 0,
            subject: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(10),
            status: faker.helpers.arrayElement(['open', 'in_progress', 'solved', 'closed'])
        }
    }
}

const users: ApiUserInterface[] = faker.helpers.multiple(createRandomUser, { count: 100 });
const challenges: ApiChallengeInterface[] = faker.helpers.multiple(createRandomChallenge, { count: 200 });
const resources: ApiResourceInterface[] = faker.helpers.multiple(createRandomResource, { count: 200 });
const tags: ApiTagInterface[] = [];

let solutions: ApiSolutionInterface[] = [];
let helpIssues: ApiHelpIssueInterface[] = [];

async function seeder() {
    

    try {
        console.log('Starting work...');
        await runCleanup();
        await createUsers();
        await createChallenges();
        await createResources();

        createRawTags();
        await createTags();

        solutions = faker.helpers.multiple(ChildItemsGenerator.createRandomSolution, { count: 300, });
        helpIssues = faker.helpers.multiple(ChildItemsGenerator.createRandomHelpIssue, { count: 300, });

        await createSolutions();
        await createHelpIssues();

        console.log('All DONE!');
        console.log('Seeding finished, closing...');
    } catch (error) {
        console.error(error)
    }
}

function createRawTags() {
    const tagArray = ['html', 'css', 'javascript', 'react', 'typescript', 'mysql', 'java', 'python', 'angular', 'halloween challenge', 'tips', 'help', 
        'c#', 'c++', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust', 'docker', 'git', 'linux', 'ruby', 'aws', 'lambda', 'azure', 'api', 'node', 'vue', 'django', 'flutter',
        'solution', 'contributions wanted', 'solved', 'new', 'help wanted', 'new challenge', 'new resource', 'new tag', 'new solution', 'new help issue', 
        'new', 'hackathon', 'update'];

    for (const tag of tagArray) {
        tags.push({ tag: tag });
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

async function createChallenge(challenge: ApiChallengeInterface, index: number) {
    const result = await ChallengeService.create(challenge);
    challenges[index] = result;
}

async function createChallenges()
{
    console.log('Adding challenges...');

    const concatPromise: Promise<void>[] = [];
    challenges.forEach((challenge, index) => 
    {
        concatPromise.push(createChallenge(challenge, index));
    });

    await Promise.all(concatPromise);
    console.log('DONE!');
}

async function createResource(resource: ApiResourceInterface, index: number) {
    const result = await ResourceService.create(resource);
    resources[index] = result;
}

async function createResources()
{
    console.log('Adding resources...');        

    const concatPromise: Promise<void>[] = [];
    resources.forEach((resource, index) => 
    {
        concatPromise.push(createResource(resource, index));
    });

    await Promise.all(concatPromise);
    console.log('DONE!');
}

async function createSolution(solution: ApiSolutionInterface, index: number) {
    const result = await SolutionService.create(solution);
    solutions[index] = result;
}

async function createSolutions()
{
    console.log('Adding solutions...');

    const concatPromise: Promise<void>[] = [];
    solutions.forEach((solution, index) => 
    {
        concatPromise.push(createSolution(solution, index));
    });    

    await Promise.all(concatPromise);
    console.log('DONE!');
}

async function createHelpIssue(helpIssue: ApiHelpIssueInterface, index: number) {
    const result = await HelpIssueService.create(helpIssue);
    helpIssues[index] = result;
}

async function createHelpIssues()
{
    console.log('Adding help issues...');

    const concatPromise: Promise<void>[] = [];
    helpIssues.forEach((helpIssue, index) => 
    {
        concatPromise.push(createHelpIssue(helpIssue, index));
    });    

    await Promise.all(concatPromise);
    console.log('DONE!');
}

async function createTag(tag: ApiTagInterface, index: number) {
    const result = await TagService.create(tag);
    tags[index] = result;
}

async function createTags()
{
    console.log('Adding tags...');

    const concatPromise: Promise<void>[] = [];
    tags.forEach((tag, index) => 
    {
        concatPromise.push(createTag(tag, index));
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