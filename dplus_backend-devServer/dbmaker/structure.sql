CREATE TABLE dbConfig(
    id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
    "dbName" varchar(32),
    dbtype varchar(32),
    username varchar(32),
    password varchar(32),
    "userId" uniqueidentifier,
    "createdBy" uniqueidentifier,
    "deleteStatus" int DEFAULT ((0)),
    create_time datetime,
    update_time datetime,
    content varchar(255),
    "dbServer" varchar(255)
);




CREATE TABLE pro_rules (
    id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
    technology NVARCHAR(255),
    rule_name NVARCHAR(255),
    query TEXT,
    sid INT PRIMARY KEY IDENTITY(1,1),
    "deleteStatus" int DEFAULT ((0)),
    "createdBy" uniqueidentifier,
    create_time datetime,
    update_time datetime
);


CREATE TABLE savedQueries(
    id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
    "dbServer" uniqueidentifier,
    queries text,
    "userId" uniqueidentifier,
    "deleteStatus" int DEFAULT ((0)),
    create_time datetime,
    update_time datetime,
    content varchar(255)
);
CREATE TABLE userRole(
    id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
    rolename varchar(32),
    "deleteStatus" int DEFAULT ((0)),
    create_time datetime,
    update_time datetime
);
CREATE TABLE users(
    id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
    firstname varchar(32),
    lastname varchar(32),
    username varchar(32),
    password varchar(32),
    "roleId" uniqueidentifier,
    "deleteStatus" int DEFAULT ((0)),
    create_time datetime,
    update_time datetime
);




CREATE TABLE alertConfig(
    id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
    "frequency" varchar(32),
    dbServer uniqueidentifier,
    mailQuery TEXT,
    graphQuery TEXT,
    mailSubject TEXT,
    mailBody TEXT,
    "userId" uniqueidentifier,
    "createdBy" uniqueidentifier,
    "deleteStatus" int DEFAULT ((0)),
    create_time datetime,
    update_time datetime
);




INSERT INTO "userRole"(rolename) VALUES('User');
INSERT INTO users(firstname,lastname,username,password,roleId) VALUES('Test','Test','Test','Test','32E4552B-DF3F-4000-A4D3-FE394444D122');

SELECT * FROM userRole;
SELECT * FROM alertConfigInstant;

INSERT INTO faker(a)VALUES('a');

WITH TimeGapCTE AS (SELECT alertConfigInstant.*,DATEPART(MINUTE, CONVERT(DATETIME, 'cnvrtCONVERT(DATETIME, "2024-01-02 01:03:00", 121)cnvrt', 121) - lastSendAt) AS timeGap FROM alertConfigInstant)SELECT * FROM TimeGapCTE WHERE timeGap > frequency;


SELECT subscribersInfo.* from subscribersInfo;
SELECT TOP 2 subscribersInfo.* from subscribersInfo;


SELECT * FROM subscribersInfo ORDER BY id OFFSET 0 ROWS FETCH NEXT 100 ROWS ONLY;

SELECT overall_count = COUNT(*) OVER(), subscribersInfo.* from subscribersInfo ORDER BY id OFFSET 1 ROWS FETCH NEXT 10 ROWS ONLY;



WITH TimeGapCTE AS (SELECT alertConfigInstant.*,(DATEPART(MINUTE, CONVERT(DATETIME, '2024-01-07 16:25:00', 121) - lastSendAt)+(DATEPART(HOUR, CONVERT(DATETIME, '2024-01-07 16:25:00', 121) - lastSendAt))*60) AS timeGap FROM alertConfigInstant)SELECT * FROM TimeGapCTE WHERE enabled=1 AND deleteStatus=0 AND timeGap >= frequency;


WITH TimeGapCTE AS (SELECT alertConfigInstant.*,(DATEPART(MINUTE, CONVERT(DATETIME, '2024-01-07 15:41:00', 121) - lastSendAt)+(DATEPART(HOUR, CONVERT(DATETIME, '2024-01-07 15:41:00', 121) - lastSendAt))*60) AS timeGap FROM alertConfigInstant)SELECT * FROM TimeGapCTE;