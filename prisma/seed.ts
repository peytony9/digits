import 'dotenv/config';
import { PrismaClient, Role, Condition } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';
import config from '../config/settings.development.json';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding the database');

  // 1️⃣ Seed users
  const passwordHash = await hash('changeme', 10);
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
    console.log(`Creating user: ${account.email} with role: ${role}`);

    await prisma.user.upsert({
      where: { email: account.email },
      update: { password: passwordHash },
      create: {
        email: account.email,
        password: passwordHash,
        role,
      },
    });
  }

  // 2️⃣ Seed contacts
  // Make sure your schema has: @@unique([firstName, lastName, owner]) in Contact
  for (const contact of config.defaultContacts) {
    await prisma.contact.upsert({
      where: {
        firstName_lastName_owner: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          owner: contact.owner,
        },
      },
      update: {},
      create: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        address: contact.address,
        image: contact.image,
        description: contact.description,
        owner: contact.owner,
      },
    });
    console.log(`Added contact: ${contact.firstName} ${contact.lastName}`);
  }

  // 3️⃣ Seed stuff
  for (const data of config.defaultData) {
    const condition = (data.condition as Condition) || Condition.good;
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
    console.log(`Added stuff: ${data.name}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });