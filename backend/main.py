from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import users, students, dashboard

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(students.router)
app.include_router(dashboard.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Student Management System API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
