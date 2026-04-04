from base import *
from sqlalchemy import text
from common.sql_operation import engine_creation


discussion_forum = Blueprint('discussion_forum', __name__)


@discussion_forum.route('/siteList', methods=['GET'])
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


@discussion_forum.route('/cellList', methods=['GET'])
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

@discussion_forum.route('/users', methods=['GET'])
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


@discussion_forum.route('/topic', methods=['POST',"GET"])
@token_required
def create_topic(current_user):
    if request.method=="GET":
        try:

            user_id = current_user["id"]

            query = f"""
SELECT 
    t.id,
    t.title,
    t.description,   -- ✅ ADD THIS
    t.dataset_type,
    t.site_name,

    STRING_AGG(tc.cell_name, ',') AS cells,

    u.username AS created_by_name,

    COUNT(DISTINCT p.user_id) AS participants,

    MAX(m.message) AS last_message,
    MAX(m.create_time) AS last_message_time,

    t.last_activity_at,

    SUM(
        CASE 
            WHEN m.id IS NOT NULL 
            AND m.sender_id <> '{user_id}'
            AND mr.read_at IS NULL 
            THEN 1 ELSE 0 
        END
    ) AS unread_count

FROM discussion.topics t

INNER JOIN discussion.participants p 
    ON p.topic_id = t.id AND p.user_id = '{user_id}'

LEFT JOIN discussion.topic_cells tc 
    ON tc.topic_id = t.id

LEFT JOIN Users u 
    ON u.id = t.created_by

LEFT JOIN discussion.messages m 
    ON m.topic_id = t.id

LEFT JOIN discussion.message_reads mr
    ON mr.message_id = m.id AND mr.user_id = '{user_id}'

WHERE t.is_deleted = 0

GROUP BY 
    t.id,
    t.title,
    t.description,   -- ✅ ADD THIS
    t.dataset_type,
    t.site_name,
    t.last_activity_at,
    u.username

ORDER BY 
    ISNULL(MAX(m.create_time), t.last_activity_at) DESC
"""

            data = cso.finding(query)

            return respond({
                "status":200,
                "state":1,
                "msg":"Topic list fetched",
                "data":data["data"]
            })

        except Exception as e:
            print("topic list error =>",e)
            return respond({"status":400,"state":3,"msg":"Failed to fetch topics","data":[]})
    
    
    if request.method=="POST":
        try:
            data = request.get_json()

            title = data.get("title")
            dataset_type = data.get("datasetType")
            site_name = data.get("siteName")
            cell_names = data.get("cellNames", [])
            description = data.get("description", "")
            users = data.get("users", [])

            # ================= BASIC VALIDATION =================

            if not title or not dataset_type:
                return respond({"status":400,"msg":"title & datasetType required","data":[]})

            if dataset_type not in ["SITE","CELL"]:
                return respond({"status":400,"msg":"datasetType must be SITE or CELL","data":[]})

            if dataset_type == "SITE":
                if not site_name:
                    return respond({"status":400,"msg":"siteName required for SITE topic","data":[]})
                if not cell_names:
                    return respond({"status":400,"msg":"Select atleast one cell","data":[]})

            if dataset_type == "CELL":
                if not cell_names:
                    return respond({"status":400,"msg":"Select atleast one cell","data":[]})

            title_clean = title.strip().replace("'", "''")

            if dataset_type == "SITE":
                duplicate_query = f"""
                SELECT t.id
                FROM discussion.topics t
                WHERE LOWER(t.title) = LOWER('{title_clean}')
                AND t.dataset_type = 'SITE'
                AND t.site_name = '{site_name}'
                AND t.is_deleted = 0
                """
            else:
                duplicate_query = f"""
                SELECT DISTINCT t.id
                FROM discussion.topics t
                INNER JOIN discussion.topic_cells tc ON tc.topic_id = t.id
                WHERE LOWER(t.title) = LOWER('{title_clean}')
                AND t.dataset_type = 'CELL'
                AND tc.cell_name IN ({safe_cells})
                AND t.is_deleted = 0
                """

            dup = cso.finding(duplicate_query)

            if len(dup["data"]) > 0:
                return respond({
                    "status":409,
                    "state":2,
                    "msg":"Similar topic already exists",
                    "data":{"topicId":dup["data"][0]["id"]}
                })
            # ================= CELL VALIDATION =================

            safe_cells = ",".join(["'" + str(c).replace("'", "''") + "'" for c in cell_names])

            cell_check_query = f"""
            SELECT DISTINCT Cell_name, Site_Name
            FROM KPI_Gids.gid.Cell_GIS
            WHERE Cell_name IN ({safe_cells})
            """

            cell_data = cso.finding(cell_check_query)

            if cell_data["status"] != 200 or len(cell_data["data"]) == 0:
                return respond({"status":400,"msg":"Invalid cell selection","data":[]})

            valid_cells = [i["Cell_name"] for i in cell_data["data"]]

            if len(valid_cells) != len(cell_names):
                return respond({"status":400,"msg":"Some selected cells not found","data":[]})

            # SITE cross validation
            if dataset_type == "SITE":
                site_cells = [i["Cell_name"] for i in cell_data["data"] if i["Site_Name"] == site_name]
                if len(site_cells) != len(valid_cells):
                    return respond({"status":400,"msg":"Selected cells do not belong to selected site","data":[]})

            # ================= CREATE TOPIC =================

            topic_insert_data = {
                "title": title,
                "description": description,
                "dataset_type": dataset_type,
                "site_name": site_name,
                "created_by": current_user["id"],
                "last_activity_at": "cnvrtCONVERT(DATETIME, '"+datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')+"',120)cnvrt"
            }

            topic_insert = cso.insertion(
                "discussion.topics",
                topic_insert_data,
                list(topic_insert_data.keys()),
                tuple(topic_insert_data.values())
            )

            if topic_insert["status"] not in [200,201]:
                return respond(topic_insert)

            # ================= FETCH CREATED TOPIC ID =================

            get_id_query = f"""
            SELECT TOP 1 id
            FROM discussion.topics
            WHERE created_by = '{current_user["id"]}'
            ORDER BY create_time DESC
            """

            topic_id = cso.finding(get_id_query)["data"][0]["id"]

            # ================= INSERT CELLS =================

            for cell in valid_cells:
                cso.insertion(
                    "discussion.topic_cells",
                    {
                        "topic_id": topic_id,
                        "cell_name": cell
                    },
                    ["topic_id","cell_name"],
                    (topic_id,cell)
                )

            # ================= INSERT PARTICIPANTS =================

            users = list(set(users + [current_user["id"]]))

            for uid in users:
                cso.insertion(
                    "discussion.participants",
                    {
                        "topic_id": topic_id,
                        "user_id": uid,
                        "added_by": current_user["id"]
                    },
                    ["topic_id","user_id","added_by"],
                    (topic_id,uid,current_user["id"])
                )

            return respond({
                "status":200,
                "msg":"Topic Created Successfully",
                "data":{"topicId":topic_id}
            })

        except Exception as e:
            print("create topic error =>",e)
            return respond({"status":400,"msg":"Unable to create topic","data":[]})


@discussion_forum.route('/message', methods=['POST'])
@discussion_forum.route('/messages/<topic_id>', methods=['GET'])
@token_required
def send_message(current_user,topic_id=None):
    if request.method == "GET":
        try:
            user_id = current_user["id"]

            page = int(request.args.get("page",1))
            limit = int(request.args.get("limit",50))
            offset = (page-1)*limit

            # ===== check participant =====
            chk = cso.finding(f"""
            SELECT 1 FROM discussion.participants
            WHERE topic_id='{topic_id}' AND user_id='{user_id}'
            """)

            if len(chk["data"])==0:
                return respond({"status":403,"state":3,"msg":"Not allowed","data":[]})

            # ===== get messages =====
            query = f"""
            SELECT 
                m.id,
                m.message,
                m.message_type,
                m.sender_id,
                u.username,
                m.create_time,

                CASE 
                    WHEN mr.read_at IS NULL AND m.sender_id <> '{user_id}'
                    THEN 0 ELSE 1 END AS is_read

            FROM discussion.messages m
            LEFT JOIN Users u ON u.id = m.sender_id
            LEFT JOIN discussion.message_reads mr
                ON mr.message_id = m.id AND mr.user_id='{user_id}'

            WHERE m.topic_id='{topic_id}'

            ORDER BY m.create_time DESC
            OFFSET {offset} ROWS FETCH NEXT {limit} ROWS ONLY
            """

            messages = cso.finding(query)["data"]

            # ===== mark messages as read =====
            unread_query = f"""
            SELECT m.id
            FROM discussion.messages m
            LEFT JOIN discussion.message_reads mr
                ON mr.message_id = m.id AND mr.user_id='{user_id}'
            WHERE m.topic_id='{topic_id}'
            AND m.sender_id <> '{user_id}'
            AND mr.id IS NULL
            """

            unread = cso.finding(unread_query)["data"]

            for msg in unread:
                cso.insertion(
                    "discussion.message_reads",
                    {
                        "message_id":msg["id"],
                        "user_id":user_id,
                        "read_at":"cnvrtCONVERT(DATETIME, '"+datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')+"',120)cnvrt"
                    },
                    ["message_id","user_id","read_at"],
                    (msg["id"],user_id,"cnvrtCONVERT(DATETIME, '"+datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')+"',120)cnvrt")
                )

            return respond({
                "status":200,
                "state":1,
                "msg":"Messages fetched",
                "data":messages[::-1]   # oldest first for UI
            })

        except Exception as e:
            print("get messages error =>",e)
            return respond({"status":400,"state":3,"msg":"Failed to load messages","data":[]})
    if request.method == "POST":
        try:
            data = request.get_json()

            topic_id = data.get("topicId")
            message = data.get("message","").strip()

            if not topic_id or message == "":
                return respond({"status":400,"state":3,"msg":"topicId and message required","data":[]})

            if not message or len(message.strip()) == 0:
                return respond({"status":400,"state":3,"msg":"Message cannot be empty","data":[]})


            user_id = current_user["id"]

            # ========== CHECK USER IS PARTICIPANT ==========
            check_query = f"""
            SELECT 1
            FROM discussion.participants
            WHERE topic_id = '{topic_id}'
            AND user_id = '{user_id}'
            """

            chk = cso.finding(check_query)

            if len(chk["data"]) == 0:
                return respond({"status":403,"state":3,"msg":"You are not part of this discussion","data":[]})

            # ========== INSERT MESSAGE ==========
            msg_insert = cso.insertion(
                "discussion.messages",
                {
                    "topic_id": topic_id,
                    "sender_id": user_id,
                    "message": message,
                    "message_type": "TEXT"
                },
                ["topic_id","sender_id","message","message_type"],
                (topic_id,user_id,message,"TEXT")
            )

            if msg_insert["status"] not in [200,201]:
                return respond(msg_insert)

            # get message id
            msg_id_query = f"""
            SELECT TOP 1 id
            FROM discussion.messages
            WHERE topic_id='{topic_id}'
            AND sender_id='{user_id}'
            ORDER BY create_time DESC
            """
            message_id = cso.finding(msg_id_query)["data"][0]["id"]

            # ========== MARK SENDER READ ==========
            cso.insertion(
                "discussion.message_reads",
                {
                    "message_id": message_id,
                    "user_id": user_id,
                    "read_at": "cnvrtCONVERT(DATETIME, '"+datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')+"',120)cnvrt"
                },
                ["message_id","user_id","read_at"],
                (message_id,user_id,"cnvrtCONVERT(DATETIME, '"+datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')+"',120)cnvrt")
            )

            # ========== CREATE NOTIFICATIONS ==========
            participants_query = f"""
            SELECT user_id
            FROM discussion.participants
            WHERE topic_id='{topic_id}'
            AND user_id <> '{user_id}'
            """

            participants = cso.finding(participants_query)["data"]

            for p in participants:
                cso.insertion(
                    "discussion.notifications",
                    {
                        "user_id": p["user_id"],
                        "topic_id": topic_id,
                        "message_id": message_id
                    },
                    ["user_id","topic_id","message_id"],
                    (p["user_id"],topic_id,message_id)
                )

            # ========== UPDATE LAST ACTIVITY ==========
            cso.updating(
                "discussion.topics",
                {"id":topic_id},
                {"last_activity_at":"cnvrtCONVERT(DATETIME, '"+datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')+"',120)cnvrt"}
            )

            return respond({
                "status":200,
                "state":1,
                "msg":"Message sent",
                "data":{"messageId":message_id}
            })

        except Exception as e:
            print("send message error =>",e)
            return respond({"status":400,"state":3,"msg":"Failed to send message","data":[]})


@discussion_forum.route('/unread-summary', methods=['GET'])
@token_required
def unread_summary(current_user):

    try:
        user_id = current_user["id"]

        # total unread messages
        unread_msg_query = f"""
        SELECT COUNT(*) AS total_unread_messages
        FROM discussion.messages m
        INNER JOIN discussion.participants p ON p.topic_id = m.topic_id
        LEFT JOIN discussion.message_reads mr 
            ON mr.message_id = m.id AND mr.user_id='{user_id}'
        WHERE p.user_id='{user_id}'
        AND m.sender_id <> '{user_id}'
        AND mr.id IS NULL
        """

        total_unread_messages = cso.finding(unread_msg_query)["data"][0]["total_unread_messages"]

        # total unread topics
        unread_topic_query = f"""
        SELECT COUNT(DISTINCT m.topic_id) AS total_unread_topics
        FROM discussion.messages m
        INNER JOIN discussion.participants p ON p.topic_id = m.topic_id
        LEFT JOIN discussion.message_reads mr 
            ON mr.message_id = m.id AND mr.user_id='{user_id}'
        WHERE p.user_id='{user_id}'
        AND m.sender_id <> '{user_id}'
        AND mr.id IS NULL
        """

        total_unread_topics = cso.finding(unread_topic_query)["data"][0]["total_unread_topics"]

        # recent notifications (last 10 active topics)
        recent_query = f"""
        SELECT TOP 10
            t.id,
            t.title,
            MAX(m.create_time) AS last_activity,
            COUNT(m.id) AS messages
        FROM discussion.topics t
        INNER JOIN discussion.messages m ON m.topic_id = t.id
        INNER JOIN discussion.participants p ON p.topic_id=t.id
        WHERE p.user_id='{user_id}'
        GROUP BY t.id,t.title
        ORDER BY last_activity DESC
        """

        recent = cso.finding(recent_query)["data"]

        return respond({
            "status":200,
            "state":1,
            "msg":"Unread summary",
            "data":{
                "totalUnreadMessages":total_unread_messages,
                "totalUnreadTopics":total_unread_topics,
                "recent":recent
            }
        })

    except Exception as e:
        print("unread summary error =>",e)
        return respond({"status":400,"state":3,"msg":"Failed to fetch summary","data":[]})


@discussion_forum.route('/notifications', methods=['GET'])
@token_required
def notification_list(current_user):

    try:
        user_id = current_user["id"]

        query = f"""
        SELECT TOP 50
            n.id,
            n.is_read,
            n.create_time,

            t.id AS topic_id,
            t.title AS topic_title,

            m.message,
            u.username AS sender_name,
            m.create_time AS message_time

        FROM discussion.notifications n
        LEFT JOIN discussion.messages m ON m.id = n.message_id
        LEFT JOIN discussion.topics t ON t.id = n.topic_id
        LEFT JOIN Users u ON u.id = m.sender_id

        WHERE n.user_id='{user_id}'

        ORDER BY n.create_time DESC
        """

        data = cso.finding(query)

        return respond({
            "status":200,
            "state":1,
            "msg":"Notifications fetched",
            "data":data["data"]
        })

    except Exception as e:
        print("notification list error =>",e)
        return respond({"status":400,"state":3,"msg":"Failed to fetch notifications","data":[]})


def ensure_discussion_schema_and_tables():
    try:

        ddl = """

        --------------------------------------------------
        -- SCHEMA
        --------------------------------------------------
        IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'discussion')
        BEGIN
            EXEC('CREATE SCHEMA discussion')
        END;


        --------------------------------------------------
        -- TOPICS
        --------------------------------------------------
        IF OBJECT_ID('discussion.topics') IS NULL
        BEGIN
            CREATE TABLE discussion.topics (
                id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                title NVARCHAR(200) NOT NULL,
                description NVARCHAR(MAX),
                dataset_type VARCHAR(10) NOT NULL,
                site_name VARCHAR(100) NULL,
                created_by UNIQUEIDENTIFIER NOT NULL,
                last_activity_at DATETIME2 NULL,
                is_closed BIT DEFAULT 0,
                is_deleted BIT DEFAULT 0,
                create_time DATETIME2 DEFAULT SYSDATETIME(),
                update_time DATETIME2
            );
        END
        ELSE
        BEGIN
            IF EXISTS (
                SELECT 1 FROM sys.columns 
                WHERE object_id = OBJECT_ID('discussion.topics') 
                AND name = 'created_by' AND system_type_id = 56
            )
            ALTER TABLE discussion.topics ALTER COLUMN created_by UNIQUEIDENTIFIER NOT NULL;
        END


        --------------------------------------------------
        -- TOPIC CELLS
        --------------------------------------------------
        IF OBJECT_ID('discussion.topic_cells') IS NULL
        CREATE TABLE discussion.topic_cells (
            id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            topic_id UNIQUEIDENTIFIER NOT NULL,
            cell_name VARCHAR(150) NOT NULL,
            create_time DATETIME2 DEFAULT SYSDATETIME()
        );


        --------------------------------------------------
        -- PARTICIPANTS
        --------------------------------------------------
        IF OBJECT_ID('discussion.participants') IS NULL
        BEGIN
            CREATE TABLE discussion.participants (
                id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                topic_id UNIQUEIDENTIFIER NOT NULL,
                user_id UNIQUEIDENTIFIER NOT NULL,
                added_by UNIQUEIDENTIFIER NULL,
                is_muted BIT DEFAULT 0,
                create_time DATETIME2 DEFAULT SYSDATETIME()
            );
        END
        ELSE
        BEGIN
            IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('discussion.participants') AND name='user_id' AND system_type_id=56)
            ALTER TABLE discussion.participants ALTER COLUMN user_id UNIQUEIDENTIFIER NOT NULL;

            IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('discussion.participants') AND name='added_by' AND system_type_id=56)
            ALTER TABLE discussion.participants ALTER COLUMN added_by UNIQUEIDENTIFIER NULL;
        END


        --------------------------------------------------
        -- MESSAGES
        --------------------------------------------------
        IF OBJECT_ID('discussion.messages') IS NULL
        BEGIN
            CREATE TABLE discussion.messages (
                id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                topic_id UNIQUEIDENTIFIER NOT NULL,
                sender_id UNIQUEIDENTIFIER NOT NULL,
                message NVARCHAR(MAX),
                message_type VARCHAR(20) DEFAULT 'TEXT',
                create_time DATETIME2 DEFAULT SYSDATETIME()
            );
        END
        ELSE
        BEGIN
            IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('discussion.messages') AND name='sender_id' AND system_type_id=56)
            ALTER TABLE discussion.messages ALTER COLUMN sender_id UNIQUEIDENTIFIER NOT NULL;
        END


        --------------------------------------------------
        -- MESSAGE READS
        --------------------------------------------------
        IF OBJECT_ID('discussion.message_reads') IS NULL
        BEGIN
            CREATE TABLE discussion.message_reads (
                id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                message_id UNIQUEIDENTIFIER NOT NULL,
                user_id UNIQUEIDENTIFIER NOT NULL,
                read_at DATETIME2 NULL,
                create_time DATETIME2 DEFAULT SYSDATETIME()
            );
        END
        ELSE
        BEGIN
            IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('discussion.message_reads') AND name='user_id' AND system_type_id=56)
            ALTER TABLE discussion.message_reads ALTER COLUMN user_id UNIQUEIDENTIFIER NOT NULL;
        END


        --------------------------------------------------
        -- ATTACHMENTS
        --------------------------------------------------
        IF OBJECT_ID('discussion.attachments') IS NULL
        CREATE TABLE discussion.attachments (
            id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            message_id UNIQUEIDENTIFIER NOT NULL,
            file_name NVARCHAR(255),
            file_path NVARCHAR(500),
            create_time DATETIME2 DEFAULT SYSDATETIME()
        );


        --------------------------------------------------
        -- NOTIFICATIONS
        --------------------------------------------------
        IF OBJECT_ID('discussion.notifications') IS NULL
        BEGIN
            CREATE TABLE discussion.notifications (
                id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                user_id UNIQUEIDENTIFIER NOT NULL,
                topic_id UNIQUEIDENTIFIER,
                message_id UNIQUEIDENTIFIER,
                is_read BIT DEFAULT 0,
                create_time DATETIME2 DEFAULT SYSDATETIME()
            );
        END
        ELSE
        BEGIN
            IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('discussion.notifications') AND name='user_id' AND system_type_id=56)
            ALTER TABLE discussion.notifications ALTER COLUMN user_id UNIQUEIDENTIFIER NOT NULL;
        END

        """

        with engine_creation.begin() as conn:
            conn.execute(text(ddl))

        print("discussion schema & tables ready ✅")

    except Exception as e:
        print("discussion bootstrap error ❌", e)

# run once on import
ensure_discussion_schema_and_tables()


