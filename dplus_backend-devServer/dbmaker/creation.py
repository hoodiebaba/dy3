from base import *



dbType="mssql"
common_changes={
    "ai":{
        "mssql":"IDENTITY(1,1)",
        "mysql":"IDENTITY(1,1)"
    }
}
def users_table():
    
    tables_name=[{
            "name":"id",
            "type":"INT",
            "pkey":True,
            "ai":True
        },{
            "name":"firstname",
            "type":"VARCHAR",
            "len":32
        },{
            "name":"lastname",
            "type":"VARCHAR",
            "len":32
        },{
            "name":"username",
            "type":"VARCHAR",
            "len":32
        },{
            "name":"password",
            "type":"VARCHAR",
            "len":32
        },{
            "name":"userId",
            "type":"VARCHAR",
            "len":32
        },
        ]
    tablename="users"
    sql_base=f"CREATE TABLE {tablename}"
    queries=""
    for i in tables_name:
        queries=f"{queries+',' if queries!='' else queries}{i['name']} {i['type']}{' ('+str(i['len'])+') ' if 'len' in i else ''}"
        # print(queries)
        queries=f"{queries+(' '+common_changes['ai'][dbType] if 'ai' in i else '')}"
        queries=f"{queries+(' PRIMARY KEY' if 'pkey' in i else '')}"

    sql_base=f"{sql_base}"
    sql_base=f"{sql_base}({queries})"

    print(sql_base,"sql_base")


    print(cso.engine_conn.execute(sql_base))






