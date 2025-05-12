# User Management Service

A GraphQL-based user management service built with TypeScript, Express, Apollo Server, and PostgreSQL.

## Features

- User CRUD operations
- GraphQL API
- PostgreSQL database
- TypeScript support
- TypeORM for database operations
- Docker support with multi-container setup
- Nginx load balancer
- API service with 2 replicas

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=user_management
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/ofiroz/user-management-service
cd user-management-service
```

2. Install dependencies:
```bash
npm install
```

3. Start the services using Docker Compose:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- API service (2 replicas)
- Nginx load balancer

The GraphQL playground will be available at `http://localhost/graphql`

## API Documentation

### Queries

#### Get All Users
```graphql
query {
  users {
    id
    first_name
    last_name
    birth_date
    city
    created_at
    updated_at
  }
}
```

#### Get User by ID
```graphql
query {
  user(id: 1) {
    id
    first_name
    last_name
    birth_date
    city
    created_at
    updated_at
  }
}
```

### Mutations

#### Create User
```graphql
mutation {
  createUser(input: {
    first_name: "John"
    last_name: "Doe"
    birth_date: "1990-01-01"
    city: NEW_YORK
  }) {
    id
    first_name
    last_name
    birth_date
    city
    created_at
    updated_at
  }
}
```

#### Update User
```graphql
mutation {
  updateUser(
    id: 1
    input: {
      first_name: "John"
      last_name: "Smith"
      birth_date: "1990-01-01"
      city: LONDON
    }
  ) {
    id
    first_name
    last_name
    birth_date
    city
    created_at
    updated_at
  }
}
```

#### Delete User
```graphql
mutation {
  deleteUser(id: 1)
}
```

### Data Types

#### User
```graphql
type User {
  id: Int!
  first_name: String!
  last_name: String!
  birth_date: String!
  city: City!
  created_at: String!
  updated_at: String!
}
```

#### City Enum
```graphql
enum City {
  MAALE_ADUMIM
  NEW_YORK
  LONDON
  PARIS
  TOKYO
  BERLIN
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm test` - Run tests

### Docker Commands

- `docker-compose up -d` - Start all services
- `docker-compose down` - Stop all services
- `docker-compose build` - Rebuild services
- `docker-compose logs -f` - View logs
- `docker-compose ps` - Check service status

### Project Structure

```
src/
├── config/         # Configuration files
├── entity/         # TypeORM entities
├── resolvers/      # GraphQL resolvers
├── schema/         # GraphQL schema
└── app.ts          # Application entry point
```

## TODO

- [ ] Add authentication
- [ ] Add input validation
- [ ] Add rate limiting
- [ ] Add more comprehensive error handling
- [ ] Add logging service
- [ ] Add tests
- [ ] Add CI/CD pipeline

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 