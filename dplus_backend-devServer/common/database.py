# database.py
import pyodbc

# ? Your MSSQL connection string (ODBC compatible)
CONNECTION_STRING = (
    "Driver={ODBC Driver 18 for SQL Server};"
    "Server=192.168.0.102,1433;"
    "Database=lab_web;"
    "UID=dy;"
<<<<<<< HEAD
    "PWD=Dy@123;"
=======
    "PWD=Dy_123;"
>>>>>>> prodServer
    "TrustServerCertificate=Yes;"
    "MARS_Connection=Yes;"
)

class DataBase:
    """ODBC-compatible class expected by simple_query_builder."""

    def __init__(self):
        self.conn = None
        self.cursor = None

    def connect(self, db_name=None, uri=None):
        """Return an ODBC connection (with cursor support)."""
        try:
            self.conn = pyodbc.connect(CONNECTION_STRING)
            self.cursor = self.conn.cursor()
            return self.conn  # simple_query_builder expects .cursor()
        except Exception as e:
            print(f"? Connection failed: {e}")
            return None

    def execute_query(self, query, params=None):
        """Execute INSERT/UPDATE/DELETE queries."""
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, params or [])
                self.conn.commit()
            return True
        except Exception as e:
            print(f"? DB Error (execute_query): {e}")
            return False

    def fetch_query(self, query, params=None):
        """Execute SELECT queries and return results as list of dicts."""
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, params or [])
                columns = [desc[0] for desc in cur.description]
                return [dict(zip(columns, row)) for row in cur.fetchall()]
        except Exception as e:
            print(f"? DB Error (fetch_query): {e}")
            return []


# ? Optional helper wrappers
def execute_query(query, params=None):
    db = DataBase()
    conn = db.connect()
    if conn:
        return db.execute_query(query, params)
    return False

def fetch_query(query, params=None):
    db = DataBase()
    conn = db.connect()
    if conn:
        return db.fetch_query(query, params)
    return []
