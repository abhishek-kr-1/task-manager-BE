# Task Management API

## Overview

This is a Task Management API built with Node.js and MongoDB. It allows users to create, update, assign, and manage tasks efficiently. The API includes user authentication using JWT and provides various functionalities for task management.

## Features

- User Authentication

  - JWT-based authentication for signup and login.
  - Secure storage of user information in MongoDB.

- Task Management

  - Create, update, and soft delete tasks.
  - Assign tasks to users with permission checks.
  - Filter and paginate tasks based on status, priority and deleted flag.

- Security

  - Rate limiting to prevent abuse.
  - Protection against NoSQL injection attacks.

- Logging and Error Handling

  - Centralized error handling for consistent error responses.

- API Documentation
  - Comprehensive API documentation using Swagger.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local instance)
- Postman (for testing the API)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/abhishek-kr-1/task-manager-BE.git
   cd task-management-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```
   DATABASE_URL=mongodb://localhost:27017/taskDB
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRATION_DAYS=1
   PORT=3000
   RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
   RATE_LIMIT_MAX_REQUESTS=100
   ```


4. Install MongoDB Locally
    ```
    # Mac (Using Homebrew)

    brew tap mongodb/brew
    brew install mongodb-community@6.0

    # Start MongoDB
    brew services start mongodb-community@6.0

    # Create a Database for the Project
    # Open the MongoDB shell

    mongosh

    #Then, create a database

    use taskDB
    ```

### Running the Application

To start the server, run:

```
npm start
```

The API will be available at `http://localhost:3000`.

### API Endpoints

- **Authentication**

  - `POST /auth/signup` - Create a new user.
  - `POST /auth/login` - Authenticate a user and return a JWT.

- **Tasks**
  - `POST /tasks` - Create a new task.
  - `PUT /tasks/:id` - Update an existing task.
  - `DELETE /tasks/:id` - Delete a task (soft delete).
  - `POST /tasks/:id/assign` - Assign a task to a user.
  - `GET /tasks` - Get a paginated list of tasks with optional filtering.

### Testing (TBD)

To run the tests, use:

```

```

### API Documentation

API documentation is available in the `swagger.json` file. You can also use Swagger UI to visualize and interact with the API.

Open your browser and go to:

`http://localhost:3000/api-docs`

This will display your interactive Swagger documentation where you can test API endpoints.
