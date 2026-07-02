from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import schemas
import crud
from auth import get_current_user

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    return crud.get_dashboard_stats(db)
