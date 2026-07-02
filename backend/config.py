from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Connect to your MySQL database!
    # Replace "YOUR_MYSQL_PASSWORD" with your actual MySQL root password!
    DATABASE_URL: str = "mysql+pymysql://root:myfirstsql@localhost:3306/student_management"
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production-123456"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    class Config:
        env_file = ".env"


settings = Settings()
