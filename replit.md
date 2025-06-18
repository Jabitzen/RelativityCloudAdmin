# Enterprise SSO Platform

## Overview

This is a full-stack Enterprise Single Sign-On (SSO) platform built with modern web technologies. The application provides user and agency management capabilities with a clean, responsive interface. It follows a monorepo structure with separate client and server directories, utilizing TypeScript throughout for type safety.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with tsx for development execution
- **Database**: MongoDB with native MongoDB driver
- **ORM**: Drizzle ORM with Zod integration for type-safe database operations
- **Development**: Vite middleware integration for seamless full-stack development

### Data Storage
- **Primary Database**: MongoDB for document storage
- **Collections**: Users, Agencies, Roles, and Teams
- **Schema Validation**: Drizzle schemas with Zod validation
- **Connection Management**: MongoDBStorage class for centralized database operations

## Key Components

### Frontend Components
1. **App Layout**: Responsive navigation with consistent header across pages
2. **Users Page**: Main interface for user management operations
3. **UI Components**: Reusable button, toaster, and form components using Radix UI
4. **Hooks**: Custom toast hook for user notifications

### Backend Components
1. **Express Server**: Main application server with Vite middleware integration
2. **API Routes**: RESTful endpoints for users, agencies, roles, and teams
3. **MongoDB Storage**: Centralized database operations with connection management
4. **Type Definitions**: Shared interfaces for User, Agency, Role, and Team entities

### Shared Components
- TypeScript path aliases for clean imports (@/* and @shared/*)
- Shared type definitions between client and server

## Data Flow

1. **Client Requests**: React components make API calls using fetch
2. **Server Processing**: Express routes handle requests and interact with MongoDB
3. **Database Operations**: MongoDBStorage class manages all database interactions
4. **Response Handling**: JSON responses sent back to client
5. **State Updates**: TanStack React Query manages caching and UI updates
6. **User Feedback**: Toast notifications provide user feedback for operations

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 19, React DOM, React Hook Form
- **Database**: MongoDB native driver, Drizzle ORM
- **UI Framework**: Radix UI components, Tailwind CSS
- **Development**: Vite, TypeScript, tsx
- **Utilities**: Zod validation, nanoid for ID generation, clsx for className management

### Development Dependencies
- **Build Tools**: Vite with React plugin, PostCSS, Autoprefixer
- **Type Definitions**: Type packages for Express, MongoDB, React
- **CSS Processing**: Tailwind CSS with animation plugin

## Deployment Strategy

### Replit Configuration
- **Modules**: Node.js 20, Web server, PostgreSQL 16 (prepared for future use)
- **Development**: `npm run dev` using tsx for TypeScript execution
- **Production Build**: `npm run build` compiles TypeScript and builds Vite bundle
- **Production Start**: `npm run start` runs compiled JavaScript
- **Port Configuration**: Multiple ports configured for different services

### Build Process
1. TypeScript compilation for server code
2. Vite build process for client bundle optimization
3. Static asset processing and optimization

### Environment Setup
- Development uses tsx for direct TypeScript execution
- Production uses compiled JavaScript
- MongoDB connection string configurable via environment variables

## Changelog
- June 18, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.