# PROMPTS.md

---

# 1. The Architecture Prompt

## Initial Bootstrap Prompt

```text
Build a production-ready multi-tenant SaaS backend system for a project management platform where multiple organizations share the same database but are fully isolated from each other.

Tech Stack:
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication

Architecture Requirements:
- layered architecture
- routes → controllers → services → repositories
- scalable folder structure
- reusable middleware
- centralized error handling
- validation layer using Zod

Core Requirements:

1. Multi-Tenant Architecture
- shared database architecture
- enforce tenant isolation in every query
- organizationId must come from JWT only

2. Authentication
- register/login
- bcrypt password hashing
- JWT auth
- roles:
  - OWNER
  - ADMIN
  - MEMBER

3. Database Models

Organization
- id
- name

User
- id
- name
- email
- password
- role
- organizationId

Project
- id
- name
- description
- status
- organizationId
- createdBy

Task
- id
- title
- description
- priority
- status
- dueDate
- projectId
- assignedTo
- organizationId


Relationships:
Organization → Users
Organization → Projects
Project → Tasks

4. APIs
Implement CRUD APIs for:
- Projects
- Tasks

5. Nested Endpoint
GET /projects/:id/full-data

Response:
Project
→ Tasks
→ Assigned User

Requirements:
- avoid N+1 query problems
- use optimized Prisma include/select
- scalable for 1000+ records

6. Engineering Expectations
- pagination
- indexes
- reusable query helpers
- proper HTTP status codes
- asyncHandler utility
- logger middleware
- secure middleware
```

----

# 2. The Refinement Loop

## Refinement Example 1 — Tenant Isolation Security Flaw

### Original AI Output

```ts
const project = await prisma.project.findUnique({
  where: {
    id: req.params.id,
  },
});
```

### What Was Wrong

The AI only filtered by project ID and ignored tenant ownership.

This created a critical multi-tenant security issue because authenticated users from one organization could access resources belonging to another organization simply by knowing the resource ID.

Authentication alone does not guarantee tenant isolation.

### What I Changed

I updated every database query to include organization filtering:

```ts
const project = await prisma.project.findFirst({
  where: {
    id: req.params.id,
    organizationId: req.user.organizationId,
  },
});
```

I also:

- created tenant-aware repository helpers
- enforced organization context via middleware
- added authorization validation for nested resources

### Re-prompt Used

```text
Never query resources only by ID.
Every database query must include organizationId from authenticated JWT context.
Assume all IDs are globally guessable.
```

### Why This Fix Was Important

This enforced strict tenant isolation and prevented cross-tenant data exposure inside the shared database architecture.

---

## Refinement Example 2 — N+1 Query Performance Problem

### Original AI Output

```ts
const projects = await prisma.project.findMany({
  where: {
    organizationId: req.user.organizationId,
  },
});

for (const project of projects) {
  project.tasks = await prisma.task.findMany({
    where: {
      projectId: project.id,
    },
  });
}
```

### What Was Wrong

The implementation caused an N+1 query problem:

- one query for projects
- additional queries for each project's tasks

This approach became inefficient and slow with large datasets.

### What I Changed

I replaced iterative querying with optimized Prisma nested includes:

```ts
const projects = await prisma.project.findMany({
  where: {
    organizationId: req.user.organizationId,
  },
  include: {
    tasks: {
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    },
  },
});
```

I additionally:

- added pagination
- reduced unnecessary fields using select
- added indexes on organizationId and projectId

### Why This Fix Was Important

This eliminated the N+1 problem and drastically reduced database round trips, allowing the endpoint to scale efficiently for large datasets.

---

# 3. The AI Blindspot Note

The AI consistently struggled with multi-tenant authorization boundaries and scalable database querying. It frequently generated authenticated APIs without enforcing organization-level filtering directly inside database queries. Another recurring issue was generating loop-based relational fetching patterns that introduced N+1 query problems when loading nested project and task data.

The AI was highly effective for scaffolding architecture, generating boilerplate code, and accelerating development speed, but it was overconfident in implementations related to authorization and query optimization.

To work around these limitations, every Prisma query was manually reviewed for:

- tenant scoping
- query efficiency
- relation loading strategy
- pagination support
- unnecessary field selection

Additional manual improvements included:

- enforcing organizationId extraction from JWT middleware only
- adding indexes on organizationId and projectId
- replacing iterative queries with optimized Prisma include/select patterns
- validating nested resource ownership before access

Critical backend concerns like tenant isolation, secure ownership enforcement, and scalable query optimization still required manual engineering judgment beyond AI-generated code.