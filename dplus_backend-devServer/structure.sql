-- SQLBook: Code
CREATE TABLE [dbo].[alertConfig](
	[id] [uniqueidentifier] NOT NULL,
	[frequency] [varchar](32) NULL,
	[dbServer] [uniqueidentifier] NULL,
	[mailQuery] [text] NULL,
	[graphQuery] [text] NULL,
	[mailRecipients] [text] NULL,
	[mailSubject] [text] NULL,
	[mailBody] [text] NULL,
	[startAt] [datetime] NULL,
	[endAt] [datetime] NULL,
	[enabled] [int] NULL,
	[userId] [uniqueidentifier] NULL,
	[createdBy] [uniqueidentifier] NULL,
	[deleteStatus] [int] NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[mailOutput] [varchar](32) NULL,
	[timeall] [varchar](255) NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[alertConfigInstant]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[alertConfigInstant](
	[id] [uniqueidentifier] NOT NULL,
	[frequency] [int] NULL,
	[dbServer] [uniqueidentifier] NULL,
	[mailQuery] [text] NULL,
	[graphQuery] [text] NULL,
	[mailRecipients] [text] NULL,
	[mailSubject] [text] NULL,
	[mailBody] [text] NULL,
	[enabled] [int] NULL,
	[userId] [uniqueidentifier] NULL,
	[createdBy] [uniqueidentifier] NULL,
	[deleteStatus] [int] NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[mailOutput] [varchar](32) NULL,
	[mailQueryBody] [text] NULL,
	[lastSendAt] [datetime] NULL,
	[startAt] [datetime] NULL,
	[endAt] [datetime] NULL,
	[nextSendAt] [datetime] NULL,
	[blockage] [int] NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Alerts_Config]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Alerts_Config](
	[Configured_By] [varchar](max) NOT NULL,
	[Requested_By] [varchar](max) NOT NULL,
	[DB_Url] [varchar](max) NOT NULL,
	[Query] [varchar](max) NULL,
	[Query_Plot] [varchar](max) NULL,
	[Time] [time](7) NULL,
	[Frequency] [varchar](max) NOT NULL,
	[Start_Date] [date] NULL,
	[End_Date] [date] NULL,
	[Mail_Body] [varchar](max) NOT NULL,
	[Mail_Subject] [varchar](max) NOT NULL,
	[Mail_Recipients] [varchar](max) NOT NULL,
	[Enabled] [varchar](max) NOT NULL,
	[Last_Update_DateTime] [datetime] NULL,
	[User] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Alerts_Email_Status]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Alerts_Email_Status](
	[Configured_By] [varchar](max) NOT NULL,
	[Requested_By] [varchar](max) NOT NULL,
	[DB_Url] [varchar](max) NOT NULL,
	[Query] [varchar](max) NOT NULL,
	[Query_Plot] [varchar](max) NULL,
	[Time] [time](7) NULL,
	[Frequency] [varchar](max) NOT NULL,
	[Start_Date] [date] NULL,
	[Mail_Body] [varchar](max) NOT NULL,
	[Mail_Subject] [varchar](max) NOT NULL,
	[Mail_Recipients] [varchar](max) NOT NULL,
	[Enabled] [varchar](max) NOT NULL,
	[Last_Update_DateTime] [datetime] NULL,
	[User] [varchar](max) NOT NULL,
	[Status] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bulk_Update_List]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bulk_Update_List](
	[Name] [varchar](max) NOT NULL,
	[Table_Name] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChatBot_AccessDenied_Users]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChatBot_AccessDenied_Users](
	[First_Name] [varchar](max) NOT NULL,
	[Id] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChatBot_AccessGranted_Users]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChatBot_AccessGranted_Users](
	[First_Name] [varchar](max) NOT NULL,
	[Id] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[corn_exception]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[corn_exception](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[content] [text] NULL,
	[fromTable] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[corncaller]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[corncaller](
	[id] [uniqueidentifier] NOT NULL,
	[calltype] [varchar](255) NULL,
	[startTime] [varchar](255) NULL,
	[endTime] [varchar](255) NULL,
	[lenOfFile] [int] NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Custom_Queries]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Custom_Queries](
	[User] [varchar](max) NOT NULL,
	[Start_DateTime] [datetime] NULL,
	[End_DateTime] [datetime] NULL,
	[Query] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DB_Config]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DB_Config](
	[Input_User] [varchar](max) NOT NULL,
	[DateTime] [datetime] NULL,
	[DB_Type] [varchar](max) NOT NULL,
	[DB_Server] [varchar](max) NOT NULL,
	[DB_Name] [varchar](max) NOT NULL,
	[User_Name] [varchar](max) NOT NULL,
	[Password] [varchar](max) NOT NULL,
	[DB_Url] [varchar](max) NOT NULL,
	[ID] [int] IDENTITY(1,1) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[dbConfig]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[dbConfig](
	[id] [uniqueidentifier] NOT NULL,
	[dbName] [varchar](32) NULL,
	[dbtype] [varchar](32) NULL,
	[username] [varchar](32) NULL,
	[password] [varchar](32) NULL,
	[userId] [uniqueidentifier] NULL,
	[createdBy] [uniqueidentifier] NULL,
	[deleteStatus] [int] NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[content] [varchar](255) NULL,
	[dbServer] [varchar](255) NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Export$]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Export$](
	[Date] [datetime] NULL,
	[Site_Name] [nvarchar](255) NULL,
	[Site_Code] [nvarchar](255) NULL,
	[Cell_Code] [nvarchar](255) NULL,
	[Cell_Name] [nvarchar](255) NULL,
	[Technology] [nvarchar](255) NULL,
	[Voice Traffic Daily] [float] NULL,
	[Data Traffic in MB Daily] [float] NULL,
	[Network Availability Daily] [float] NULL,
	[Voice Drop Call Rate Daily] [float] NULL,
	[Data Setup Success Rate Daily] [float] NULL,
	[Voice Setup Success Rate Daily] [float] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[maillogger]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[maillogger](
	[id] [uniqueidentifier] NOT NULL,
	[fromtable] [varchar](32) NULL,
	[uid] [uniqueidentifier] NULL,
	[CC] [text] NULL,
	[bcc] [text] NULL,
	[Subject] [text] NULL,
	[message] [text] NULL,
	[timestamp] [varchar](48) NULL,
	[all_email] [text] NULL,
	[userId] [uniqueidentifier] NULL,
	[createdBy] [uniqueidentifier] NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[msgas_string] [text] NULL,
	[passmail] [text] NULL,
	[filePath] [text] NULL,
	[query] [text] NULL,
	[fromemail] [text] NULL,
	[toemail] [text] NULL,
	[imageList] [text] NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Saved_Queries]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Saved_Queries](
	[User] [varchar](max) NOT NULL,
	[DateTime] [datetime] NULL,
	[Query_Name] [varchar](max) NOT NULL,
	[Query] [varchar](max) NOT NULL,
	[ID] [int] IDENTITY(1,1) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Saved_Queries_list]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Saved_Queries_list](
	[User] [varchar](max) NOT NULL,
	[Start_DateTime] [datetime] NULL,
	[End_DateTime] [datetime] NULL,
	[Query] [varchar](max) NOT NULL,
	[Engine] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[savedQueries]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[savedQueries](
	[id] [uniqueidentifier] NOT NULL,
	[dbServer] [uniqueidentifier] NULL,
	[queries] [text] NULL,
	[userId] [uniqueidentifier] NULL,
	[deleteStatus] [int] NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[content] [varchar](255) NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Subscribers_Info]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Subscribers_Info](
	[Date] [date] NOT NULL,
	[Subscriber_No] [varchar](max) NOT NULL,
	[Incident_No] [varchar](max) NULL,
	[Remarks] [varchar](max) NULL,
	[Status] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userRole]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userRole](
	[id] [uniqueidentifier] NOT NULL,
	[rolename] [varchar](32) NULL,
	[deleteStatus] [int] NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[permission] [text] NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [uniqueidentifier] NOT NULL,
	[firstname] [varchar](32) NULL,
	[lastname] [varchar](32) NULL,
	[username] [varchar](32) NULL,
	[password] [varchar](32) NULL,
	[roleId] [uniqueidentifier] NULL,
	[deleteStatus] [int] NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
	[loginType] [varchar](32) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Whatsapp_Alerts_Data]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Whatsapp_Alerts_Data](
	[Name] [varchar](max) NOT NULL,
	[Contact_Number] [varchar](max) NOT NULL,
	[Message] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Whatsapp_Alerts_Status]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Whatsapp_Alerts_Status](
	[Name] [varchar](max) NOT NULL,
	[Contact_Number] [varchar](max) NOT NULL,
	[Message] [varchar](max) NOT NULL,
	[Sent_Message_DateTime] [datetime] NULL,
	[Status] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[zAlerts_Config]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[zAlerts_Config](
	[Configured_By] [varchar](max) NOT NULL,
	[Requested_By] [varchar](max) NOT NULL,
	[Server_IP] [varchar](max) NOT NULL,
	[DB_Name] [varchar](max) NOT NULL,
	[DB_Type] [varchar](max) NOT NULL,
	[Query] [varchar](max) NULL,
	[Time] [time](7) NULL,
	[Frequency] [varchar](max) NOT NULL,
	[Start_Date] [date] NULL,
	[End_Date] [date] NULL,
	[Mail_Body] [varchar](max) NOT NULL,
	[Mail_Subject] [varchar](max) NOT NULL,
	[Mail_Recipients] [varchar](max) NOT NULL,
	[Enabled] [varchar](max) NOT NULL,
	[Last_Update_DateTime] [datetime] NULL,
	[User] [varchar](max) NOT NULL,
	[Query_Plot] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[zAlerts_Email_Status]    Script Date: 1/15/2024 2:07:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[zAlerts_Email_Status](
	[Configured_By] [varchar](max) NOT NULL,
	[Requested_By] [varchar](max) NOT NULL,
	[DB_Type] [varchar](max) NOT NULL,
	[DB_Name] [varchar](max) NOT NULL,
	[Server_IP] [varchar](max) NOT NULL,
	[Query] [varchar](max) NOT NULL,
	[Time] [time](7) NULL,
	[Frequency] [varchar](max) NOT NULL,
	[Start_Date] [date] NULL,
	[Mail_Body] [varchar](max) NOT NULL,
	[Mail_Subject] [varchar](max) NOT NULL,
	[Mail_Recipients] [varchar](max) NOT NULL,
	[Enabled] [varchar](max) NOT NULL,
	[Last_Update_DateTime] [datetime] NULL,
	[User] [varchar](max) NOT NULL,
	[Status] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[alertConfig] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[alertConfig] ADD  DEFAULT ((1)) FOR [enabled]
GO
ALTER TABLE [dbo].[alertConfig] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
ALTER TABLE [dbo].[alertConfigInstant] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[alertConfigInstant] ADD  DEFAULT ((1)) FOR [enabled]
GO
ALTER TABLE [dbo].[alertConfigInstant] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
ALTER TABLE [dbo].[alertConfigInstant] ADD  DEFAULT ((0)) FOR [blockage]
GO
ALTER TABLE [dbo].[dbConfig] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[dbConfig] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
ALTER TABLE [dbo].[maillogger] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[savedQueries] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[savedQueries] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
ALTER TABLE [dbo].[userRole] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[userRole] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO




INSERT into userrole(id,rolename) VALUES(NEWID(),'Admin');

INSERT into users(id
      ,firstname
      ,lastname
      ,username
      ,password
      ,roleId)VALUES(NEWID(),'Test','Test','Test','Test','92b2f065-0283-4a88-96be-d8efb2a9f516')




-- docker run -d --name sql_server_test -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=hellotech@123' -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
CREATE TABLE [dbo].[nokiapreposttool](
	[id] [uniqueidentifier] NOT NULL,
	[Code] [varchar](100) NULL,
	[KPI_Name] [varchar](100) NULL,
	[Technology] [text] NULL,
	[Query] [text] NULL,
	[Agrregation] [text] NULL,
	[Type] [varchar](48) NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
    [deleteStatus] [int],
	[sid] [int] IDENTITY(1,1) NOT NULL,
	)


ALTER TABLE [dbo].[nokiapreposttool] ADD  DEFAULT (newid()) FOR [id]
ALTER TABLE [dbo].[nokiapreposttool] ADD  DEFAULT ((0)) FOR [deleteStatus]




insert into 
  "userRole" (
    id, 
    rolename
  )
values
  (
    newid(), 
    'Admin'
  );
  
  SELECT id,rolename,"deleteStatus",create_time,update_time,permission,sid FROM "userRole";
  
  insert into 
    users (
      id, 
      firstname, 
      lastname, 
      username, 
      password, 
      "roleId", 
      "loginType"
    )
  values
    (
      newid(), 
      'Test', 
      'Test', 
      'Test', 
      'Test', 
      '8C563013-D825-4425-9C11-E49A22526CBC', 
      'Password Based'
    );
    
    SELECT id,firstname,lastname,username,password,"roleId","deleteStatus",create_time,update_time,sid,"loginType" FROM users;


	nokiapreposttool