# Relativity Cloud Admin

A simplified enterprise management framework for administrative operations with MongoDB integration, providing direct client-to-API communication for users, agencies, roles, permissions, and teams management.

## Features

- Direct client-to-Admin API communication (no authentication gateway)
- MongoDB Atlas integration with real data
- CRUD operations for Users, Agencies, Roles & Permissions, Teams
- Responsive design with modern UI components
- Streamlined microservices architecture

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v8+)

### Installation and Setup

1. Clone the repository to your local machine or download the source code
```bash
git clone <repository-url>
cd relativity-cloud-admin
```

2. Install dependencies
```bash
npm install
```

3. Environment setup
Create a `.env` file in the root directory with the following contents:
```
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret-key
```

4. Start the application in development mode
```bash
npm run dev
```

5. Access the application
Open your browser and navigate to http://localhost:5000

### Login Credentials

For development and testing, you can use these credentials:
- Username: `admin`
- Password: `password`

## Troubleshooting

### Login Issues
- Make sure both the client and server are running on port 5000
- Check browser console for any authentication errors
- Verify that the JWT_SECRET environment variable is set correctly

### Port Conflicts
- If port 5000 is already in use, you can modify the port in `server/index.ts`
- Remember to update any hardcoded URLs in the client code if you change the port

## Project Structure

- `/client` - Frontend React application with components, hooks, and pages
- `/server` - Backend Express server with authentication and API routes
- `/shared` - Shared types and database schemas
- `/services` - Microservice components for authentication and API services

## Technologies Used

- React with TypeScript for frontend
- Express.js for backend API
- JWT for secure authentication
- TanStack Query for data fetching and state management
- Shadcn UI and Tailwind CSS for styling
- Drizzle ORM for database operations