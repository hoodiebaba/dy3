USE [master]
GO
/****** Object:  Database [test_dy_web]    Script Date: 16-03-2024 00:00:05 ******/
CREATE DATABASE [test_dy_web]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'test_dy_web', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER_SFC\MSSQL\DATA\test_dy_web.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'test_dy_web_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER_SFC\MSSQL\DATA\test_dy_web_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [test_dy_web] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [test_dy_web].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [test_dy_web] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [test_dy_web] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [test_dy_web] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [test_dy_web] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [test_dy_web] SET ARITHABORT OFF 
GO
ALTER DATABASE [test_dy_web] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [test_dy_web] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [test_dy_web] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [test_dy_web] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [test_dy_web] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [test_dy_web] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [test_dy_web] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [test_dy_web] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [test_dy_web] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [test_dy_web] SET  DISABLE_BROKER 
GO
ALTER DATABASE [test_dy_web] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [test_dy_web] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [test_dy_web] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [test_dy_web] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [test_dy_web] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [test_dy_web] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [test_dy_web] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [test_dy_web] SET RECOVERY FULL 
GO
ALTER DATABASE [test_dy_web] SET  MULTI_USER 
GO
ALTER DATABASE [test_dy_web] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [test_dy_web] SET DB_CHAINING OFF 
GO
ALTER DATABASE [test_dy_web] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [test_dy_web] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [test_dy_web] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [test_dy_web] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'test_dy_web', N'ON'
GO
ALTER DATABASE [test_dy_web] SET QUERY_STORE = OFF
GO
USE [test_dy_web]
GO
/****** Object:  Table [dbo].[alertConfig]    Script Date: 16-03-2024 00:00:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
/****** Object:  Table [dbo].[alertConfigInstant]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[Alerts_Config]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[Alerts_Email_Status]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[Bulk_Update_List]    Script Date: 16-03-2024 00:00:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bulk_Update_List](
	[Name] [varchar](max) NOT NULL,
	[Table_Name] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChatBot_AccessDenied_Users]    Script Date: 16-03-2024 00:00:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChatBot_AccessDenied_Users](
	[First_Name] [varchar](max) NOT NULL,
	[Id] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChatBot_AccessGranted_Users]    Script Date: 16-03-2024 00:00:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChatBot_AccessGranted_Users](
	[First_Name] [varchar](max) NOT NULL,
	[Id] [varchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[corn_exception]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[corncaller]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[Custom_Queries]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[DB_Config]    Script Date: 16-03-2024 00:00:07 ******/
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
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[port] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[dbConfig]    Script Date: 16-03-2024 00:00:07 ******/
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
	[port] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Export$]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[LocationData]    Script Date: 16-03-2024 00:00:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LocationData](
	[Latitude] [float] NULL,
	[Longitude] [float] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[maillogger]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[nokiapreposttool]    Script Date: 16-03-2024 00:00:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[deleteStatus] [int] NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
	[groupBy] [varchar](50) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Saved_Queries]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[Saved_Queries_list]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[savedQueries]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[Subscribers_Info]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[userConfig]    Script Date: 16-03-2024 00:00:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userConfig](
	[id] [uniqueidentifier] NOT NULL,
	[configName] [varchar](255) NULL,
	[configType] [varchar](255) NULL,
	[configValue] [varchar](255) NULL,
	[userId] [uniqueidentifier] NULL,
	[createdBy] [uniqueidentifier] NULL,
	[deleteStatus] [int] NULL,
	[create_time] [datetime] NULL,
	[update_time] [datetime] NULL,
	[sid] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userRole]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[users]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[Whatsapp_Alerts_Data]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[Whatsapp_Alerts_Status]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[zAlerts_Config]    Script Date: 16-03-2024 00:00:07 ******/
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
/****** Object:  Table [dbo].[zAlerts_Email_Status]    Script Date: 16-03-2024 00:00:07 ******/
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
ALTER TABLE [dbo].[nokiapreposttool] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[nokiapreposttool] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
ALTER TABLE [dbo].[savedQueries] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[savedQueries] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
ALTER TABLE [dbo].[userConfig] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[userConfig] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
ALTER TABLE [dbo].[userRole] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[userRole] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [deleteStatus]
GO
USE [master]
GO
ALTER DATABASE [test_dy_web] SET  READ_WRITE 
GO
