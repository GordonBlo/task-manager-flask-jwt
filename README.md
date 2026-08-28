# Task Manager v2

A Flask-based task management application demonstrating practical backend fundamentals including authentication, authorization, REST APIs, database persistence, and layered application architecture.

## Features

- User registration and login
- JWT authentication
- Password hashing
- User-scoped CRUD operations
- Task creation, update, completion, and deletion
- SQLite persistence
- Basic admin dashboard
- Login activity logging
- Simple HTML, CSS, and JavaScript frontend

## Tech Stack

**Backend:** Python · Flask · PyJWT · SQLite  
**Frontend:** HTML · CSS · JavaScript  
**Architecture:** Route → Service → Repository

## Architecture

The application separates responsibilities into:

- **Routes** — HTTP requests and responses
- **Services** — business logic and validation
- **Repositories** — database operations
- **Models** — application entities
- **Utils** — reusable authentication and helper logic

## Run Locally

```bash
git clone https://github.com/GordonBlo/task-manager-flask-jwt.git
cd task-manager-flask-jwt

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt
python app.py
```

Open:

`http://127.0.0.1:5000/`

## What This Project Demonstrates

- REST API fundamentals
- JWT-based authentication
- User-scoped authorization
- SQL CRUD operations
- Password security
- Layered backend architecture
- Frontend–backend communication

## Author

**Richard Peter André**

[GitHub](https://github.com/GordonBlo) · [LinkedIn](https://www.linkedin.com/in/richard-peter-andre-097b3b24a/)
