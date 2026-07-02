
from sqlalchemy import create_engine, text
from config import settings

try:
    print("Connecting to MySQL database...")
    print(f"Database URL: {settings.DATABASE_URL}")
    
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        print("\nSuccessfully connected to MySQL!")
        
        # Check tables
        result = conn.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result]
        print(f"\nTables in database: {tables}")
        
        # Check users table
        if 'users' in tables:
            result = conn.execute(text("SELECT id, username, email FROM users"))
            print("\nUsers in database:")
            for row in result:
                print(f"  ID: {row[0]}, Username: {row[1]}, Email: {row[2]}")
        
        # Check students table
        if 'students' in tables:
            result = conn.execute(text("SELECT id, name, department FROM students"))
            print("\nStudents in database:")
            for row in result:
                print(f"  ID: {row[0]}, Name: {row[1]}, Department: {row[2]}")
        
        print("\nMySQL connection test passed!")

except Exception as e:
    print(f"\nError: {type(e).__name__}: {e}")
    import traceback
    print("\nStack trace:")
    traceback.print_exc()
