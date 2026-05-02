# Task Manager v2

A Python Flask-based task management application built as a junior backend / full-stack portfolio project.

The goal of this project is to demonstrate a simple but structured web application where users can register, log in, and manage their own tasks.

## Main Features

- User registration
- Password hashing with Werkzeug
- Login with JWT token authentication
- Protected task endpoints
- Listing user-specific tasks
- Task creation
- Task completion status toggle
- Task deletion
- Simple HTML/CSS/JavaScript frontend
- Basic admin dashboard
- Login event logging
- SQLite database
- Route / Service / Repository layered structure

## Screenshots

### Home / Authentication Page

![Home Page](screenshots/home.png)

### Task Dashboard

![Task Dashboard](screenshots/tasks.png)

### Admin Panel

![Admin Panel](screenshots/admin.png)

## Tech Stack

- Python
- Flask
- Flask-Cors
- PyJWT
- Werkzeug
- SQLite
- HTML
- CSS
- JavaScript

## Project Structure

```text
task_manager/
├── app.py
├── config.py
├── requirements.txt
├── .env.example
├── database/
│   ├── db.py
│   └── schema.sql
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── admin.html
│   ├── admin.js
│   └── admin.css
├── models/
│   ├── user.py
│   └── task.py
├── repositories/
├── routes/
├── services/
└── utils/
```

## Running Locally

1. Create a virtual environment:

```bash
python -m venv .venv
```

2. Activate it on Windows:

```bash
.venv\Scripts\activate
```

3. Install the dependencies:

```bash
pip install -r requirements.txt
```

4. Start the application:

```bash
python app.py
```

5. Open it in the browser:

```text
http://127.0.0.1:5000/
```

Admin page:

```text
http://127.0.0.1:5000/admin
```

## API Endpoints

### Auth

```text
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```text
GET    /api/tasks/
POST   /api/tasks/
GET    /api/tasks/<task_id>
PUT    /api/tasks/<task_id>
PATCH  /api/tasks/<task_id>/toggle
DELETE /api/tasks/<task_id>
```

### Admin

```text
GET /api/admin/users
GET /api/admin/logs
GET /api/admin/tasks
```

Admin endpoints require a user account where `is_admin = 1` in the database.

## Security Principles

- Passwords are not stored in plain text.
- The backend identifies the user based on the JWT token.
- Task operations always include `user_id` filtering.
- A user can only view, update, and delete their own tasks.
- The frontend task rendering does not directly inject user-provided task titles or descriptions into an `innerHTML` string.

## Learning Value

This project demonstrates:

- How Flask routes work
- The role of the service layer
- The basics of the repository pattern
- SQL CRUD operations
- JWT authentication
- User-scoped authorization logic
- Simple frontend-backend communication
- Documentation of a portfolio project

## Future Improvements

- Task editing from the frontend
- Task priority field
- Due date field
- Search and filtering
- Bootstrap or Tailwind-based design
- Unit tests
- PostgreSQL support
- Deployment to Render or Railway
- Improved admin permission management