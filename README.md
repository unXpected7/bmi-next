# Task Manager - Clean Architecture Implementation

A collaborative task management application built with **Next.js 15** following **Clean Architecture** principles. This project demonstrates proper separation of concerns with Domain/Data/Presentation layers, comprehensive testing, and modern web development practices.

## 🏗️ Architecture Overview

This application implements **Clean Architecture** with the following layers:

- **Domain Layer**: Core business logic (Entities, Use Cases, Repository interfaces)
- **Data Layer**: Database operations (Repository implementations, Server Actions)
- **Presentation Layer**: UI components and state management

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router with Turbopack)
- **Language:** TypeScript
- **Architecture:** Clean Architecture (Domain/Data/Presentation layers)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Database:** [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Testing:** [Vitest](https://vitest.dev/) + Testing Library
- **Theme System:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons:** [Lucide React](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have the following:
- Node.js 18+ installed
- Docker and Docker Compose (for database setup)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables Setup**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - The default values work with Docker setup, modify as needed

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.**

6. **Run tests (optional)**
   ```bash
   npm run test:run        # Run all tests once
   npm run test            # Run tests in watch mode
   npm run test:coverage   # Run tests with coverage report
   ```

## Configuration

### Option 1: Docker Setup (Recommended)
1. **Start PostgreSQL with Docker:**
   ```bash
   npm run db:up
   ```
   This starts PostgreSQL in a Docker container with default credentials.

2. **Push database schema:**
   ```bash
   npm run db:push
   ```

### Option 2: Local Database Setup
1. Create a PostgreSQL database locally
2. Update your environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   POSTGRES_DB=your_database_name
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   ```
3. Run database migrations:
   ```bash
   npm run db:push
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (defaults work with Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## ✨ Features

### Core Functionality
- ✅ **Task Management**: Create, read, update, and delete tasks
- ✅ **Status Management**: Tasks can be "to do", "in progress", or "done"
- ✅ **Task Filtering**: Filter tasks by status with real-time counts
- ✅ **User Authentication**: Secure login/signup with Better Auth
- ✅ **User-Specific Tasks**: Each user sees only their own tasks

### Architecture & Development
- ✅ **Clean Architecture**: Proper separation of concerns (Domain/Data/Presentation)
- ✅ **Domain-Driven Design**: Business rules in domain layer, no external dependencies
- ✅ **Dependency Inversion**: Inner layers never depend on outer layers
- ✅ **Unit Testing**: 34 tests covering domain layer use cases
- ✅ **Type Safety**: Full TypeScript coverage with strict configuration
- ✅ **Server Actions**: Type-safe data layer operations
- ✅ **Error Handling**: Comprehensive error handling throughout the application

### UI/UX
- ✅ **Modern UI**: 40+ shadcn/ui components (New York style)
- ✅ **Dark Mode**: System preference detection and toggle support
- ✅ **Responsive Design**: Mobile-first approach with TailwindCSS v4
- ✅ **Real-time Updates**: Toast notifications for user feedback
- ✅ **Intuitive Navigation**: Clear sidebar navigation and breadcrumbs

### Technical Excellence
- ✅ **Modern Stack**: Next.js 15 with App Router and Turbopack
- ✅ **Database**: PostgreSQL with Drizzle ORM and proper schema migrations
- ✅ **Docker Support**: Complete containerization with docker-compose
- ✅ **Production Ready**: Optimized builds and deployment configuration

## 🏗️ Clean Architecture Structure

```
task-manager/
├── 📁 src/
│   ├── 🏛️ domain/                    # Core Business Logic (No external dependencies)
│   │   ├── entities/                 # Business entities with invariants
│   │   │   ├── Task.ts              # Task entity with business rules
│   │   │   └── User.ts              # User entity
│   │   ├── repositories/             # Repository interfaces (abstractions)
│   │   │   ├── ITaskRepository.ts   # Task repository contract
│   │   │   └── interfaces.ts        # Type definitions
│   │   └── useCases/                # Application business logic
│   │       ├── CreateTaskUseCase.ts # Create task business rules
│   │       ├── GetTasksUseCase.ts   # Query tasks with filtering
│   │       ├── UpdateTaskUseCase.ts # Update task business rules
│   │       └── DeleteTaskUseCase.ts # Delete task with authorization
│   ├── 💾 data/                      # Data Access Layer (Infrastructure)
│   │   ├── repositories/             # Repository implementations
│   │   │   └── TaskRepository.ts    # Concrete repository with Drizzle ORM
│   │   └── server-actions/           # Server Actions for Next.js
│   │       └── taskActions.ts      # Type-safe CRUD operations
│   └── 🎨 presentation/             # UI and State Management
│       ├── components/              # React components
│       │   └── task/               # Task-specific components
│       │       ├── TaskCard.tsx    # Individual task display
│       │       ├── TaskForm.tsx    # Create/edit form
│       │       ├── TaskFilter.tsx  # Status filtering
│       │       └── TaskList.tsx    # Main task list component
│       ├── app/                    # Next.js pages
│       │   ├── tasks/             # Task management routes
│       │   │   ├── page.tsx       # Task list page
│       │   │   └── new/page.tsx   # Create task page
│       │   │   └── [id]/edit/     # Edit task page
│       │   └── dashboard/         # Main dashboard (shows tasks)
│       └── test/                  # Testing setup and utilities
├── 📁 app/                         # Next.js App Router pages
│   ├── dashboard/                  # Protected dashboard route
│   ├── tasks/                      # Protected task routes
│   ├── sign-in/                   # Authentication pages
│   └── layout.tsx                 # Root layout
├── 📁 components/                  # Shared React components
│   └── ui/                        # shadcn/ui components (40+)
├── 📁 db/                         # Database configuration
│   ├── schema/                    # Database schemas
│   │   ├── auth.ts               # Authentication tables
│   │   └── task.ts               # Task tables
│   └── index.ts                  # Database connection
├── 📁 lib/                        # Utility functions
│   └── auth.ts                   # Better Auth configuration
├── 📄 test/                       # Test files
│   └── unit/                     # Unit tests for domain layer
├── 📄 vitest.config.ts           # Test configuration
├── 📄 middleware.ts               # Authentication middleware
├── 🐳 docker-compose.yml          # Docker services
└── 📄 README.md                   # This file
```

### Architecture Principles

**🏛️ Domain Layer (Inner Circle)**
- Contains only business logic and rules
- No external dependencies (no framework, no database)
- Pure TypeScript with entities and use cases
- Highly testable and reusable

**💾 Data Layer (Middle Circle)**
- Implements repository interfaces from domain layer
- Contains database-specific code (Drizzle ORM)
- Server Actions for Next.js integration
- Depends on domain layer, not vice versa

**🎨 Presentation Layer (Outer Circle)**
- React components and UI logic
- Depends on both domain and data layers
- Contains state management and user interactions
- No business logic, only orchestrates other layers

## Database Integration

This starter includes modern database integration:

- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** as the database provider
- **Better Auth** integration with Drizzle adapter
- **Database migrations** with Drizzle Kit

## Development Commands

### Application
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run all tests once
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report

### Database
- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL container
- `npm run db:dev` - Start development PostgreSQL (port 5433)
- `npm run db:dev-down` - Stop development PostgreSQL
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Drizzle migration files
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:reset` - Reset database (drop all tables and recreate)

### Styling with shadcn/ui
- Pre-configured with 40+ shadcn/ui components in New York style
- Components are fully customizable and use CSS variables for theming
- Automatic dark mode support with next-themes integration
- Add new components: `npx shadcn@latest add [component-name]`

### Docker
- `npm run docker:build` - Build application Docker image
- `npm run docker:up` - Start full application stack (app + database)
- `npm run docker:down` - Stop all containers
- `npm run docker:logs` - View container logs
- `npm run docker:clean` - Stop containers and clean up volumes

## Docker Development

### Quick Start with Docker
```bash
# Start the entire stack (recommended for new users)
npm run docker:up

# View logs
npm run docker:logs

# Stop everything
npm run docker:down
```

### Development Workflow
```bash
# Option 1: Database only (develop app locally)
npm run db:up          # Start PostgreSQL
npm run dev            # Start Next.js development server

# Option 2: Full Docker stack
npm run docker:up      # Start both app and database
```

### Docker Services

The `docker-compose.yml` includes:

- **postgres**: Main PostgreSQL database (port 5432)
- **postgres-dev**: Development database (port 5433) - use `--profile dev`
- **app**: Next.js application container (port 3000)

### Docker Profiles

```bash
# Start development database on port 5433
docker-compose --profile dev up postgres-dev -d

# Or use the npm script
npm run db:dev
```

## Deployment

### Production Deployment

#### Option 1: Docker Compose (VPS/Server)

1. **Clone and setup on your server:**
   ```bash
   git clone <your-repo>
   cd task-manager
   cp .env.example .env
   ```

2. **Configure environment variables:**
   ```bash
   # Edit .env with production values
   DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/postgres
   POSTGRES_DB=postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password
   BETTER_AUTH_SECRET=your-very-secure-secret-key
   BETTER_AUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
   ```

3. **Deploy:**
   ```bash
   npm run docker:up
   ```

#### Option 2: Container Registry (AWS/GCP/Azure)

1. **Build and push image:**
   ```bash
   # Build the image
   docker build -t your-registry/task-manager:latest .
   
   # Push to registry
   docker push your-registry/task-manager:latest
   ```

2. **Deploy using your cloud provider's container service**

#### Option 3: Vercel + External Database

1. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Add environment variables in Vercel dashboard:**
   - `DATABASE_URL`: Your managed PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate a secure secret
   - `BETTER_AUTH_URL`: Your Vercel deployment URL

3. **Setup database:**
   ```bash
   # Push schema to your managed database
   npm run db:push
   ```

### Environment Variables for Production

```env
# Required for production
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=generate-a-very-secure-32-character-key
BETTER_AUTH_URL=https://yourdomain.com

# Optional optimizations
NODE_ENV=production
```

### Production Considerations

- **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- **Security**: Generate strong secrets, use HTTPS
- **Performance**: Enable Next.js output: 'standalone' for smaller containers
- **Monitoring**: Add logging and health checks
- **Backup**: Regular database backups
- **SSL**: Terminate SSL at load balancer or reverse proxy

### Health Checks

The application includes basic health checks. You can extend them:

```dockerfile
# In Dockerfile, add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```