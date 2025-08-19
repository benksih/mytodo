# Todoist Clone Project

This project is a full-stack web application that mimics the core functionality of Todoist. It features a backend API built with Node.js and a frontend single-page application built with React.

## Features

- **User Authentication**: Secure user registration and login using JWTs.
- **Task Management**: Full CRUD (Create, Read, Update, Delete) functionality for tasks.
- **Scoring System**: Users earn points for completing tasks.
- **API and Frontend Separation**: A modern, decoupled architecture with a backend API and a frontend client.

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT), bcryptjs for password hashing

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **API Communication**: Axios
- **Routing**: React Router

---

## Project Setup and Installation

Follow these steps to get the project running locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Backend Setup

The backend server is located at the root of the project.

**a. Install Dependencies**
```bash
npm install
```

**b. Set Up Environment Variables**

Copy the example environment file and update it with your own secret key.

```bash
cp .env.example .env
```

Open the `.env` file and replace `YOUR_JWT_SECRET_HERE` with a long, random, and secure string.

**c. Run Database Migrations**

Prisma needs to set up the SQLite database based on the schema.

```bash
npx prisma migrate dev
```

This will create the `prisma/dev.db` file and all necessary tables.

**d. Start the Backend Server**

```bash
npm run start # Or use 'nodemon index.js' for development
```

The backend API will now be running on `http://localhost:3000`.

### 3. Frontend Setup

The frontend application is located in the `frontend/` directory.

**a. Install Dependencies**

Navigate to the frontend directory and install its dependencies.

```bash
cd frontend
npm install
```

**b. Start the Frontend Development Server**

```bash
npm run dev
```

The frontend application will now be running on `http://localhost:5173` (or the next available port). The Vite development server is pre-configured to proxy API requests to the backend, so there should be no CORS issues.

### 4. Access the Application

- Open your web browser and navigate to `http://localhost:5173`.
- You should see the login page.
- You can register a new user and start using the application.

---

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication (`/api/auth`)
- `POST /register`: Create a new user.
  - Body: `{ "email": "user@example.com", "password": "password123" }`
- `POST /login`: Log in a user and receive a JWT.
  - Body: `{ "email": "user@example.com", "password": "password123" }`

### Tasks (`/api/tasks`)
*All task routes require a valid JWT in the `Authorization: Bearer <token>` header.*

- `GET /`: Get all tasks for the authenticated user.
- `POST /`: Create a new task.
  - Body: `{ "title": "My New Task", "dueDate": "2024-12-31T23:59:59Z", "reminderTime": "2024-12-31T23:00:00Z", "points": 10 }`
- `PUT /:id`: Update a task.
- `DELETE /:id`: Delete a task.
