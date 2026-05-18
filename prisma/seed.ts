import { PrismaClient, Role, ProjectStatus, TaskPriority, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
    },
  });
  console.log(`🏢 Created Organization: ${org.name} (ID: ${org.id})`);

  // 2. Create Users (Owner, Admin, Member)
  const owner = await prisma.user.create({
    data: {
      name: 'Alice Owner',
      email: 'alice@acme.com',
      password: '$2b$10$Ep...hashedpasswordplaceholder...', // In production, use bcrypt/argon2
      role: Role.OWNER,
      organizationId: org.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Bob Admin',
      email: 'bob@acme.com',
      password: '$2b$10$Ep...hashedpasswordplaceholder...',
      role: Role.ADMIN,
      organizationId: org.id,
    },
  });

  const member = await prisma.user.create({
    data: {
      name: 'Charlie Member',
      email: 'charlie@acme.com',
      password: '$2b$10$Ep...hashedpasswordplaceholder...',
      role: Role.MEMBER,
      organizationId: org.id,
    },
  });
  console.log(`👥 Created Users: ${owner.name}, ${admin.name}, ${member.name}`);

  // 3. Create Project
  const project = await prisma.project.create({
    data: {
      name: 'Q3 Product Launch',
      description: 'Major release of the SaaS platform core features',
      status: ProjectStatus.ACTIVE,
      organizationId: org.id,
      createdBy: owner.id,
    },
  });
  console.log(`📁 Created Project: ${project.name} (ID: ${project.id})`);

  // 4. Create Tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design Database Schema',
      description: 'Create Prisma schema with multi-tenant support',
      priority: TaskPriority.URGENT,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      projectId: project.id,
      assignedTo: admin.id,
      organizationId: org.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Implement Authentication API',
      description: 'Setup JWT based multi-tenant auth endpoints',
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      projectId: project.id,
      assignedTo: member.id,
      organizationId: org.id,
    },
  });

  console.log(`✅ Created Tasks: "${task1.title}", "${task2.title}"`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
