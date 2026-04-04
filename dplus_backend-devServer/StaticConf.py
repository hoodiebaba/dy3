<<<<<<< HEAD
def sql_conn_obj():
    return {
        "dbName": "KPI_Gids",
        "dbServer" : "192.168.0.102",
        "port": "1433",
        "dbtype": "MSSQL",
        "password" : "Dy@123",
        "username" : "dy"
=======
# def sql_conn_obj():
#     return {
#         "dbName": "KPI_Gids",
#         "dbServer" : "192.168.0.102",
#         "port": "1433",
#         "dbtype": "MSSQL",
#         "password" : "Dy_123",
#         "username" : "dy"
#     }

def sql_conn_obj():
    
    return {
        "dbName": "postgres",
        "dbServer": "192.168.0.100",
        "port": "5432",          
        "dbtype": "PostgreSQL",    
        "username": "postgres",
        "password": "Safari@1"
    }
def postgresql_conn_obj():
    
    return {
        "dbName": "postgres",
        "dbServer": "192.168.0.100",
        "port": "5432",          
        "dbtype": "PostgreSQL",    
        "username": "postgres",
        "password": "Safari@1"
>>>>>>> prodServer
    }