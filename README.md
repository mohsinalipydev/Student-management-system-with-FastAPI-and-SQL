# Student Management System

A full-stack Student Management System built with FastAPI, MySQL, and vanilla JavaScript. Perfect for portfolio and entry-level Python backend developer job applications.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with password hashing
- 👥 **Student Management** - Add, edit, delete, and view students
- 🔍 **Search & Filter** - Search by name, filter by department
- 📊 **Dashboard** - Real-time analytics and statistics
- 📄 **Pagination & Sorting** - Efficient data handling
- 🎨 **Modern UI** - Responsive and clean design

## Tech Stack

**Backend:**
- Python 3.8+
- FastAPI - Modern, fast web framework
- SQLAlchemy - ORM for database operations
- PyMySQL - MySQL database connector
- Python-JOSE - JWT token handling
- Passlib - Password hashing with bcrypt

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript

**Database:**
- MySQL 8.0+

## Project Structure

```
student-management-system/
├── backend/
│   ├── main.py          # FastAPI application entry point
│   ├── database.py      # Database connection setup
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── crud.py          # Database operations
│   ├── auth.py          # Authentication utilities
│   ├── config.py        # Configuration settings
│   └── routers/
│       ├── users.py     # User authentication endpoints
│       ├── students.py  # Student CRUD endpoints
│       └── dashboard.py # Dashboard statistics endpoints
├── frontend/
│   ├── index.html       # Home page
│   ├── login.html       # Login page
│   ├── register.html    # Registration page
│   ├── dashboard.html   # Dashboard page
│   ├── students.html    # Students list page
│   ├── add_student.html # Add student page
│   ├── edit_student.html# Edit student page
│   ├── profile.html     # User profile page
│   ├── css/
│   │   └── style.css    # Stylesheet
│   └── js/
│       └── app.js       # Frontend JavaScript
├── database/
│   └── student_management.sql # Database schema
├── requirements.txt     # Python dependencies
└── README.md            # This file
```

## Installation Guide

### Prerequisites

- Python 3.8 or higher
- MySQL 8.0 or higher
- Git (optional)

### Step 1: Clone or Download the Project

```bash
cd "Student Management System"
```

### Step 2: Set Up the Database

1. Open MySQL command line or MySQL Workbench
2. Run the schema script:
```bash
mysql -u root -p < database/student_management.sql
```

Or manually execute the SQL commands from `database/student_management.sql`

### Step 3: Configure Database Connection

Edit `backend/config.py` and update the database URL:

```python
DATABASE_URL: str = "mysql+pymysql://root:your_password@localhost:3306/student_management"
```

Replace `your_password` with your actual MySQL root password.

### Step 4: Create a Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 5: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 6: Run the Backend Server

```bash
cd backend
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Step 7: Open the Frontend

1. Navigate to the `frontend` directory
2. Open `index.html` in your web browser

Or serve the frontend with a simple HTTP server:

**Python:**
```bash
cd frontend
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Default Credentials

- **Username:** admin
- **Password:** admin123

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and get JWT token |
| GET | `/profile` | Get current user profile (protected) |

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/students` | Create a new student (protected) |
| GET | `/students` | Get all students with pagination (protected) |
| GET | `/students/{id}` | Get student by ID (protected) |
| PUT | `/students/{id}` | Update student (protected) |
| DELETE | `/students/{id}` | Delete student (protected) |
| GET | `/students/search?name=...` | Search students by name (protected) |
| GET | `/students/filter?department=...` | Filter students by department (protected) |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get dashboard statistics (protected) |

## How It Works

### 1. Backend Architecture

- **FastAPI:** Handles HTTP requests and responses
- **SQLAlchemy:** ORM layer for database interactions
- **Pydantic:** Data validation and serialization
- **JWT:** Stateless authentication

### 2. Authentication Flow

1. User registers with username, email, and password
2. Password is hashed using bcrypt and stored in database
3. User logs in with credentials
4. Backend verifies credentials and returns JWT token
5. Frontend stores token in localStorage
6. Token is sent in Authorization header for protected routes

### 3. Database Schema

**Users Table:**
- id (INT, PK, AUTO_INCREMENT)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- created_at (DATETIME)

**Students Table:**
- id (INT, PK, AUTO_INCREMENT)
- name (VARCHAR)
- age (INT)
- gender (VARCHAR)
- department (VARCHAR)
- semester (INT)
- cgpa (FLOAT)
- email (VARCHAR, UNIQUE)
- phone (VARCHAR)
- created_at (DATETIME)

## Deployment Guide

### Deploy to Render

1. Create a MySQL database on Render or use a managed database service
2. Update the `DATABASE_URL` in `config.py`
3. Create a `render.yaml` file:

```yaml
services:
  - type: web
    name: student-management-api
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0 --port 10000
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: student-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true

databases:
  - name: student-db
    databaseName: student_management
    user: student_user
```

4. Connect your GitHub repository to Render
5. Deploy!

### Deploy to Railway

1. Create a new project on Railway
2. Add a MySQL database service
3. Add a Python service and connect your repository
4. Set environment variables:
   - `DATABASE_URL`
   - `SECRET_KEY`
5. Deploy!

## Future Enhancements

- 📤 Export students to CSV/Excel
- 📷 Upload student profile images
- 📧 Email notifications
- 🔄 Bulk import students
- 📱 Mobile app
- 📈 More detailed analytics

## Screenshots
<img width="1875" height="907" alt="Screenshot 2026-07-02 110856" src="https://github.com/user-attachments/assets/c3d6e10d-8dbd-4640-8c7b-70f1362e437c" />

<img width="1886" height="908" alt="Screenshot 2026-07-02 110648" src="https://github.com/user-attachments/assets/79c0f08a-6ad7-4cb7-9de9-09261e79440c" />



## Author

### Mohsin Ali

## License

MIT License - feel free to use this project for your portfolio!

## Contributing

Pull requests are welcome! For major changes, please open an issue first.
