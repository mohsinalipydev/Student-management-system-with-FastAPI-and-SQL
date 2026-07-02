from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
from auth import get_password_hash


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_students(db: Session, skip: int = 0, limit: int = 10, sort_by: str = "id", sort_order: str = "asc"):
    sort_column = getattr(models.Student, sort_by)
    if sort_order == "desc":
        sort_column = sort_column.desc()
    query = db.query(models.Student).order_by(sort_column)
    total = query.count()
    students = query.offset(skip).limit(limit).all()
    return students, total


def get_student_by_id(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()


def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def update_student(db: Session, student_id: int, student: schemas.StudentUpdate):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student:
        for key, value in student.model_dump().items():
            setattr(db_student, key, value)
        db.commit()
        db.refresh(db_student)
    return db_student


def delete_student(db: Session, student_id: int):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student:
        db.delete(db_student)
        db.commit()
        return True
    return False


def search_students(db: Session, name: str):
    return db.query(models.Student).filter(models.Student.name.ilike(f"%{name}%")).all()


def filter_students_by_department(db: Session, department: str):
    return db.query(models.Student).filter(models.Student.department == department).all()


def get_dashboard_stats(db: Session):
    total_students = db.query(func.count(models.Student.id)).scalar()
    male_students = db.query(func.count(models.Student.id)).filter(models.Student.gender == "Male").scalar()
    female_students = db.query(func.count(models.Student.id)).filter(models.Student.gender == "Female").scalar()
    average_cgpa = db.query(func.avg(models.Student.cgpa)).scalar() or 0.0

    students_per_dept = db.query(
        models.Student.department,
        func.count(models.Student.id).label('count')
    ).group_by(models.Student.department).all()

    dept_stats = {dept: count for dept, count in students_per_dept}

    return {
        "total_students": total_students,
        "male_students": male_students,
        "female_students": female_students,
        "average_cgpa": round(average_cgpa, 2),
        "students_per_department": dept_stats
    }
