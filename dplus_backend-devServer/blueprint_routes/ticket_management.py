from base import *
from sqlalchemy import text
from common.sql_operation import engine_creation


ticket_management = Blueprint('ticket_management', __name__)



@ticket_management.route('/siteList', methods=['GET'])
# @token_required
def siteList(current_user=None):

    sql_conn_obj = sconf.sql_conn_obj()

    sqlQuery = """
    SELECT 
    Site_Name AS siteName,
    STRING_AGG(Cell_name, ',') AS cellNames
FROM (
    SELECT DISTINCT Site_Name, Cell_name
    FROM [KPI_Gids].[gid].[Cell_GIS]
) t
GROUP BY Site_Name
ORDER BY Site_Name;

    """

    sitedata = cso.findFromDifferentServer(sql_conn_obj, sqlQuery)

    data = {
        "status": 200,
        "data": cfc.dfjson(sitedata["data"]),
        "msg": ""
    }

    return respond(data)


@ticket_management.route('/cellList', methods=['GET'])
# @token_required
def cellList(current_user=None):

    sql_conn_obj = sconf.sql_conn_obj()

    sqlQuery = """
    SELECT DISTINCT Cell_name AS name
    FROM [KPI_Gids].[gid].[Cell_GIS]
    ORDER BY Cell_name
    """

    celldata = cso.findFromDifferentServer(sql_conn_obj, sqlQuery)

    df = celldata["data"]

    # convert dataframe column -> list
    cell_list = df["name"].dropna().tolist()

    data = {
        "status": 200,
        "data": cell_list,
        "msg": ""
    }

    return respond(data)

@ticket_management.route('/users', methods=['GET'])
@token_required
def discussion_user_list(current_user):

    try:

        query = """
        SELECT 
            id,
            username,
            firstname,
            lastname
        FROM Users
        WHERE deleteStatus = 0
        ORDER BY username
        """

        data = cso.finding(query)["data"]

        # format for dropdown
        users = []
        for u in data:
            fullname = ((u.get("firstname") or "") + " " + (u.get("lastname") or "")).strip()

            users.append({
                "id": u["id"],
                "label": fullname if fullname != "" else u["username"],
                "username": u["username"]
            })

        return respond({
            "status":200,
            "state":1,
            "msg":"Users fetched",
            "data":users
        })

    except Exception as e:
        print("discussion users error =>",e)
        return respond({"status":400,"state":3,"msg":"Failed to fetch users","data":[]})

@ticket_management.route('/ticket_list', methods=['GET', 'POST'])
@ticket_management.route('/create', methods=['POST'])
@token_required
def tickets(current_user):

    user_id = current_user["id"]
    sql_conn_obj = sconf.postgresql_conn_obj()
    engine = create_engine(cso.createConnStr("PostgreSQL", sql_conn_obj))

    # ================= GET =================
    if request.method == "GET":
        try:
            # from uuid import UUID

            # ================= USER UUID =================
            user_uuid = str(current_user["id"])

            # ================= MSSQL USERS =================
            user_query = """
            SELECT id, username
            FROM Users
            WHERE deleteStatus = 0
            """
            user_data = cso.finding(user_query)["data"]
            print("user data =>", user_data)
            # 🔥 USER MAP
            user_map = {str(u["id"]): u["username"] for u in user_data}

            # ================= POSTGRES QUERY =================
            query = text("""
            SELECT 
                t.id,
                t.ticket_id,
                t.title,
                t.description,
                t.dataset_type,
                t.site_name,
                t.technology,
                t.issue_category,
                t.priority,
                t.severity,
                t.region,
                t.assigned_team,
                t.created_by,
                t.last_activity_at,

                -- CELLS
                COALESCE(
                    ARRAY_AGG(DISTINCT tc.cell_name) 
                    FILTER (WHERE tc.cell_name IS NOT NULL),
                    '{}'
                ) AS cells,

                -- PARTICIPANTS COUNT
                COUNT(DISTINCT p_all.user_id) AS participants,

                -- PARTICIPANT IDS
                ARRAY_AGG(DISTINCT p_all.user_id) AS participant_ids,

                -- LAST MESSAGE
                MAX(m.message) AS last_message,
                MAX(m.create_time) AS last_message_time,

                -- UNREAD COUNT
                COALESCE(SUM(
                    CASE 
                        WHEN m.id IS NOT NULL 
                        AND m.sender_id <> :user_id
                        AND mr.read_at IS NULL 
                        THEN 1 ELSE 0 
                    END
                ),0) AS unread_count

            FROM ticketing.tickets t

            INNER JOIN ticketing.participants p_filter
                ON p_filter.ticket_id = t.id 
                AND p_filter.user_id = :user_id

            LEFT JOIN ticketing.participants p_all
                ON p_all.ticket_id = t.id

            LEFT JOIN ticketing.ticket_cells tc 
                ON tc.ticket_id = t.id

            LEFT JOIN ticketing.messages m 
                ON m.ticket_id = t.id

            LEFT JOIN ticketing.message_reads mr
                ON mr.message_id = m.id 
                AND mr.user_id = :user_id

            WHERE t.is_deleted = FALSE

            GROUP BY t.id

            ORDER BY 
                COALESCE(MAX(m.create_time), t.last_activity_at) DESC
            """)

            # ================= EXECUTE =================
            with engine.begin() as conn:
                result = conn.execute(query, {"user_id": user_uuid})
                rows = [dict(r._mapping) for r in result.fetchall()]

            # ================= ENRICH DATA =================
            for r in rows:

                # 🔥 CREATED BY NAME
                r["created_by_name"] = user_map.get(str(r["created_by"]), "Unknown")

                # 🔥 PARTICIPANTS LIST (ID + NAME)
                participants_list = []
                participant_ids = r.get("participant_ids") or []

                for uid in participant_ids:
                    uid_str = str(uid)
                    participants_list.append({
                        "id": uid_str,
                        "name": user_map.get(uid_str.upper(), "Unknown")
                    })

                # 🔥 FINAL STRUCTURE
                r["participants_detail"] = participants_list

                # optional clean
                r["participant_ids"] = [str(uid) for uid in participant_ids]

            return respond({
                "status": 200,
                "msg": "Tickets fetched",
                "data": rows
            })

        except Exception as e:
            print("ticket list error =>", e)
            return respond({
                "status": 400,
                "msg": "Failed to fetch tickets",
                "data": []
            })
    # ================= CREATE =================
    if request.method == "POST":
        try:

            data = request.get_json() or {}

            # -------- BASIC --------
            title = str(data.get("title","")).strip()
            dataset_type = data.get("datasetType")
            site_name = data.get("siteName")
            cell_names = data.get("cellNames", [])
            users = data.get("assignedUsers", [])

            description = str(data.get("description","")).strip()

            # -------- TELECOM --------
            technology = data.get("technology")
            issue_category = data.get("issueCategory")
            priority = data.get("priority")
            severity = data.get("severity")
            region = data.get("region")
            assigned_team = data.get("assignedTeam")

            # ================= VALIDATION =================
            if not title:
                return respond({"status":400,"msg":"Title required"})

            if dataset_type not in ["SITE","CELL"]:
                return respond({"status":400,"msg":"Invalid datasetType"})

            if dataset_type == "SITE" and not site_name:
                return respond({"status":400,"msg":"Site required"})

            if not isinstance(cell_names, list) or len(cell_names) == 0:
                return respond({"status":400,"msg":"Cells required"})

            safe_cells = list(set([str(c).strip() for c in cell_names if c]))

            if not safe_cells:
                return respond({"status":400,"msg":"Invalid cells"})

            # ================= DUPLICATE CHECK =================
            dup_query = text("""
            SELECT id FROM ticketing.tickets
            WHERE LOWER(title)=LOWER(:title)
            AND dataset_type=:dataset_type
            AND COALESCE(site_name,'')=COALESCE(:site_name,'')
            AND is_deleted=FALSE
            LIMIT 1
            """)

            with engine.begin() as conn:
                dup = conn.execute(dup_query, {
                    "title": title,
                    "dataset_type": dataset_type,
                    "site_name": site_name
                }).fetchone()

                if dup:
                    return respond({
                        "status":409,
                        "msg":"Duplicate ticket exists",
                        "data":{"ticketId": str(dup[0])}
                    })

            # ================= CREATE =================
            ticket_code = f"TKT-{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')[:17]}"

            insert_query = text("""
            INSERT INTO ticketing.tickets (
                ticket_id, title, description, dataset_type, site_name,
                technology, issue_category, priority, severity, region,
                assigned_team, created_by, last_activity_at
            )
            VALUES (
                :ticket_id, :title, :description, :dataset_type, :site_name,
                :technology, :issue_category, :priority, :severity, :region,
                :assigned_team, :created_by, CURRENT_TIMESTAMP
            )
            RETURNING id;
            """)

            with engine.begin() as conn:

                result = conn.execute(insert_query, {
                    "ticket_id": ticket_code,
                    "title": title,
                    "description": description,
                    "dataset_type": dataset_type,
                    "site_name": site_name,
                    "technology": technology,
                    "issue_category": issue_category,
                    "priority": priority,
                    "severity": severity,
                    "region": region,
                    "assigned_team": assigned_team,
                    "created_by": user_id
                })

                ticket_id = str(result.fetchone()[0])

                # ================= INSERT CELLS =================
                for cell in safe_cells:
                    conn.execute(text("""
                        INSERT INTO ticketing.ticket_cells (ticket_id, cell_name)
                        VALUES (:tid, :cell)
                    """), {
                        "tid": ticket_id,
                        "cell": cell
                    })

                # ================= USERS FIX =================
                # users = []

                # for u in users:
                #     try:
                #         # UUID(str(u))
                #         valid_users.append()
                #     except:
                #         print("invalid user skipped:", u)

                # always include creator
                if user_id not in users:
                    users.append(user_id)
                print("valid users =>", users)
                # insert participants
                for uid in set(users):
                    conn.execute(text("""
                        INSERT INTO ticketing.participants (ticket_id, user_id, added_by)
                        VALUES (:tid, :uid, :added_by)
                    """), {
                        "tid": ticket_id,
                        "uid": uid,
                        "added_by": user_id
                    })

            return respond({
                "status":200,
                "msg":"Ticket Created",
                "data":{
                    "ticketId": ticket_id,
                    "ticketCode": ticket_code
                }
            })

        except Exception as e:
            print("create ticket error =>", e)
            return respond({"status":400,"msg":"Failed to create ticket"})


@ticket_management.route('/message', methods=['POST'])
@token_required
def send_ticket_message(current_user):

    try:
        data = request.form

        ticket_id = data.get("ticketId")
        message = data.get("message", "").strip()
        file = request.files.get("file")

        if not ticket_id:
            return respond({"status": 400, "msg": "ticketId required"})

        file_url = None
        file_type = None
        file_size = None

        # ================= FILE UPLOAD =================
        if file:
            filename = secure_filename(file.filename)
            path = f"/data/uploads/{filename}"

            file.save(path)

            file_url = path
            file_type = file.content_type

            # ✅ correct way
            file.seek(0, 2)
            file_size = file.tell()
            file.seek(0)

        if not message and not file:
            return respond({"status": 400, "msg": "Empty message"})

        # ================= POSTGRES INSERT =================
        sql_conn_obj = sconf.postgresql_conn_obj()
        engine = create_engine(cso.createConnStr("PostgreSQL", sql_conn_obj))

        insert_query = text("""
            INSERT INTO ticketing.messages (
                ticket_id, sender_id, message, message_type,
                file_url, file_type, file_size
            )
            VALUES (
                :ticket_id, :sender_id, :message, :message_type,
                :file_url, :file_type, :file_size
            )
        """)

        with engine.begin() as conn:
            conn.execute(insert_query, {
                "ticket_id": ticket_id,
                "sender_id": current_user["id"],
                "message": message,
                "message_type": "MEDIA" if file else "TEXT",
                "file_url": file_url,
                "file_type": file_type,
                "file_size": file_size
            })

            # 🔥 update last activity
            conn.execute(text("""
                UPDATE ticketing.tickets
                SET last_activity_at = CURRENT_TIMESTAMP
                WHERE id = :tid
            """), {"tid": ticket_id})

        return respond({"status": 200, "msg": "Message sent"})

    except Exception as e:
        print("chat error =>", e)
        return respond({"status": 400, "msg": "Failed"})


@ticket_management.route('/messages/<ticket_id>', methods=['GET'])
@token_required
def get_ticket_messages(current_user, ticket_id):

    try:

        # ================= MSSQL USERS =================
        user_query = """
        SELECT id, username
        FROM Users
        WHERE deleteStatus = 0
        """
        user_data = cso.finding(user_query)["data"]

        user_map = {str(u["id"]): u["username"] for u in user_data}

        # ================= POSTGRES =================
        sql_conn_obj = sconf.postgresql_conn_obj()
        engine = create_engine(cso.createConnStr("PostgreSQL", sql_conn_obj))

        query = text("""
        SELECT 
            id,
            message,
            message_type,
            file_url,
            file_type,
            sender_id,
            create_time
        FROM ticketing.messages
        WHERE ticket_id = :ticket_id
        ORDER BY create_time ASC
        """)

        with engine.begin() as conn:
            result = conn.execute(query, {"ticket_id": ticket_id})
            rows = [dict(r._mapping) for r in result.fetchall()]

        # ================= MAP USERNAME =================
        for r in rows:
            uid = str(r["sender_id"])
            r["username"] = user_map.get(uid, "Unknown")

        return respond({
            "status": 200,
            "data": rows
        })

    except Exception as e:
        print("get chat error =>", e)
        return respond({"status": 400})











def ensure_ticket_schema_and_tables():
    try:

        # ✅ FORCE PostgreSQL engine (IMPORTANT)
        sql_conn_obj= sconf.postgresql_conn_obj()
        pg_conn_str = cso.createConnStr("PostgreSQL", sql_conn_obj)
        pg_engine = create_engine(pg_conn_str, pool_pre_ping=True)

        ddl = """

        -- EXTENSION (UUID)
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";

        -- ================= SCHEMA =================
        CREATE SCHEMA IF NOT EXISTS ticketing;

        -- ================= TICKETS =================
        CREATE TABLE IF NOT EXISTS ticketing.tickets (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ticket_id VARCHAR(50),

            title TEXT NOT NULL,
            description TEXT,

            dataset_type VARCHAR(10),
            site_name VARCHAR(100),

            technology VARCHAR(10),
            issue_category VARCHAR(50),
            severity VARCHAR(10),
            priority VARCHAR(10),
            region VARCHAR(50),
            assigned_team VARCHAR(100),

            created_by UUID,

            last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_closed BOOLEAN DEFAULT FALSE,
            is_deleted BOOLEAN DEFAULT FALSE,

            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP
        );

        -- ================= CELLS =================
        CREATE TABLE IF NOT EXISTS ticketing.ticket_cells (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ticket_id UUID,
            cell_name VARCHAR(150),
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ================= PARTICIPANTS =================
        CREATE TABLE IF NOT EXISTS ticketing.participants (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ticket_id UUID,
            user_id UUID,
            added_by UUID,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ================= MESSAGES =================
        CREATE TABLE IF NOT EXISTS ticketing.messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ticket_id UUID,
            sender_id UUID,

            message TEXT,
            message_type VARCHAR(20) DEFAULT 'TEXT',

            file_url TEXT,
            file_type VARCHAR(50),
            file_size INTEGER,

            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ================= MESSAGE READ =================
        CREATE TABLE IF NOT EXISTS ticketing.message_reads (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            message_id UUID,
            user_id UUID,
            read_at TIMESTAMP,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ================= NOTIFICATIONS =================
        CREATE TABLE IF NOT EXISTS ticketing.notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID,
            ticket_id UUID,
            message_id UUID,
            is_read BOOLEAN DEFAULT FALSE,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ================= INDEX =================
        CREATE INDEX IF NOT EXISTS idx_ticket_id ON ticketing.tickets(ticket_id);
        CREATE INDEX IF NOT EXISTS idx_ticket_user ON ticketing.tickets(created_by);
        CREATE INDEX IF NOT EXISTS idx_msg_ticket ON ticketing.messages(ticket_id);

        """

        # ✅ PostgreSQL execution
        with pg_engine.begin() as conn:
            conn.execute(text(ddl))

        print("✅ PostgreSQL ticket schema ready")

    except Exception as e:
        print("❌ schema error:", e)

ensure_ticket_schema_and_tables()