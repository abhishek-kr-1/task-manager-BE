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
  - Filter and paginate tasks based on status and priority.

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
- MongoDB (local or cloud instance)
- Postman (for testing the API)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/task-management-api.git
   cd task-management-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
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
  - `DELETE /tasks/:id` - Soft delete a task.
  - `POST /tasks/:id/assign` - Assign a task to a user.
  - `GET /tasks?page=1&limit=10` - Get a paginated list of tasks with optional filtering.

### Testing
To run the tests, use:
```
npm test
```

### API Documentation
API documentation is available in the `swagger.json` file. You can also use Swagger UI to visualize and interact with the API.

## Contribution
Feel free to fork the repository and submit pull requests for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.