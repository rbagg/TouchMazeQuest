# Maze Adventure - Kids Puzzle Game

## Overview

This is a React-based maze puzzle game designed for 4-year-olds. The application features a full-stack architecture with a Node.js/Express backend and a React frontend built with TypeScript and Vite. The game includes progressive difficulty levels, colorful graphics, touch-friendly controls, and user progress tracking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: React hooks with custom game state management
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling

### Database & Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **Local Storage**: Browser localStorage for game progress persistence
- **Session Storage**: In-memory storage implementation for development

## Key Components

### Game Engine
- **Maze Generation**: Procedural maze generation with multiple algorithms (Simple Path, Choose Route, Spiral, Maze, Advanced)
- **Progressive Difficulty**: 15 levels with increasing complexity
- **Game State Management**: Custom hook (`useGameState`) managing player position, progress, and level completion
- **Touch Controls**: Mobile-optimized touch interactions with haptic feedback

### UI Components
- **MazeDisplay**: Interactive maze grid with touch controls
- **GameControls**: Restart and hint functionality
- **ProgressDisplay**: Score and progress visualization
- **LevelPreview**: Level selection interface
- **SuccessModal**: Level completion celebration
- **BottomNavigation**: Future navigation system

### Database Schema
```typescript
users: {
  id: serial (primary key)
  username: text (unique)
  password: text
}

game_progress: {
  id: serial (primary key)
  userId: integer (foreign key)
  currentLevel: integer (default: 1)
  completedLevels: integer[] (default: [])
  totalScore: integer (default: 0)
  unlockedLevels: integer (default: 1)
}
```

## Data Flow

1. **Game Initialization**: Load saved progress from localStorage or start fresh
2. **Maze Generation**: Generate maze based on current level using appropriate algorithm
3. **Player Interaction**: Handle touch/click events to move player through maze
4. **Progress Tracking**: Update game state and persist to localStorage
5. **Level Completion**: Trigger success animation and unlock next level
6. **Score Calculation**: Award points based on level completion and efficiency

## External Dependencies

### Production Dependencies
- **UI/UX**: Radix UI primitives, Tailwind CSS, Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **Database**: Drizzle ORM, Neon Database serverless connector
- **Utilities**: date-fns, clsx, class-variance-authority

### Development Dependencies
- **Build Tools**: Vite, esbuild, PostCSS
- **TypeScript**: Full TypeScript setup with strict configuration
- **Development**: tsx for TypeScript execution, Replit-specific plugins

## Deployment Strategy

### Development
- **Environment**: Replit with Node.js 20, PostgreSQL 16
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend
- **Port Configuration**: Backend on 5000, proxied to port 80

### Production Build
- **Frontend**: Vite build process outputs to `dist/public`
- **Backend**: esbuild bundles server to `dist/index.js`
- **Deployment**: Replit autoscale deployment target
- **Database**: Requires DATABASE_URL environment variable

### Environment Configuration
- **Development**: `NODE_ENV=development` with tsx
- **Production**: `NODE_ENV=production` with compiled JavaScript
- **Database**: PostgreSQL via environment variable

## Changelog

Changelog:
- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.