# CondoManager API

CondoManager is a comprehensive condominium management system that facilitates communication between residents and building management, handles apartment-related requests, and provides a platform for community interaction.

## Features

- **User Authentication**: Secure login and registration system with JWT
- **Google OAuth2 Authentication**: Users can sign in with their Google accounts
- **Discord OAuth2 Authentication**: Users can sign in with their Discord accounts
- **Apartment Management**: Create, update, and manage apartment information
- **Messaging System**: Direct messaging between users and apartment-specific communications
- **Notification System**: Real-time notifications for messages and calls
- **WebRTC Voice Calls**: In-app voice calling functionality
- **Role-Based Access Control**: Different permissions for residents, concierge, and administrators
- **Syndicate (Management) Dashboard**: Activity Feed, Event calendar, Document library, Voting/Polls

## Technology Stack

- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport
- **Real-time Communication**: WebSockets, Socket.IO
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/condomanager-api.git
   cd condomanager-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Update the database credentials and other configuration in the `.env` file

4. Set up the database:
   ```bash
   # Create database
   createdb condomanager
   
   # Run migrations
   npm run migration:run
   ```

## Development

Start the development server:
```bash
npm run start:dev
```

The API will be available at http://localhost:3000 with Swagger documentation at http://localhost:3000/api/docs

## Database Migrations

```bash
# Generate a new migration based on entity changes
npm run migration:generate -- MigrationName

# Create an empty migration file
npm run migration:create -- MigrationName

# Run migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

> **Note:** The database connection must be running for migrations to work. Ensure PostgreSQL is running and accessible with the credentials in your `.env` file.

## API Endpoints

The API includes the following main endpoint groups:

- `/auth`: Authentication endpoints (login, register, OAuth)
- `/users`: User management
- `/apartments`: Apartment management
- `/messages`: Messaging system
- `/notifications`: Notification system

Detailed API documentation is available through Swagger at the `/api/docs` endpoint when the server is running.

## WebSockets

The API uses WebSockets for real-time features:

- Real-time messaging
- Notifications
- Voice calls (WebRTC signaling)

WebSocket events are documented in the code under `src/websockets/`.

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## Deployment

For production deployment:

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

Make sure to set the `NODE_ENV=production` environment variable for production deployments.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
