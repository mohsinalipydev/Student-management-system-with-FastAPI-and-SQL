from database import engine, SessionLocal
import models
from auth import get_password_hash
from datetime import datetime

# Create all tables in MySQL
models.Base.metadata.create_all(bind=engine)

# Create initial data
db = SessionLocal()

# Always make sure we have the admin user (in case it wasn't created)
db.query(models.User).filter(models.User.username == "admin").delete()
db.commit()

hashed_pw = get_password_hash("admin123")
admin_user = models.User(
    username="admin",
    email="admin@example.com",
    password=hashed_pw,
    created_at=datetime.now()
)
db.add(admin_user)
db.commit()
print("[OK] Admin user created! Username: admin, Password: admin123")

# Create sample students
db.query(models.Student).delete()
db.commit()

sample_students = [
    {"name": "John Doe", "age": 22, "gender": "Male", "department": "Computer Science",
     "semester": 6, "cgpa": 8.5, "email": "john@example.com", "phone": "+1234567890"},
    {"name": "Jane Smith", "age": 21, "gender": "Female", "department": "Electronics",
     "semester": 5, "cgpa": 9.2, "email": "jane@example.com", "phone": "+1987654321"},
    {"name": "Bob Johnson", "age": 23, "gender": "Male", "department": "Mechanical",
     "semester": 7, "cgpa": 7.8, "email": "bob@example.com", "phone": "+1122334455"},
]

for student_data in sample_students:
    student = models.Student(**student_data, created_at=datetime.now())
    db.add(student)
    db.commit()
    print(f"[OK] Added student: {student_data['name']}")

db.close()
print("\nMySQL Database initialized successfully!")
