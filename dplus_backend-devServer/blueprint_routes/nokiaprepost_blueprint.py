
from base import *

nokiaprepost_blueprint = Blueprint('nokiaprepost_blueprint', __name__)


   
   
@nokiaprepost_blueprint.route('/nokiaprepost',methods=['GET',"POST","PUT","PATCH","DELETE"])
@nokiaprepost_blueprint.route('/nokiaprepost/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def nokiaprepost(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu,"nokiapreposttool")
        
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), nokiapreposttool.* from nokiapreposttool WHERE nokiapreposttool.deleteStatus=0 {'AND '+arew['que'] if arew['que']!='' else ''} ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        data=cso.finding(sqlQuery)

        
        return respond(data)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()

        dataAll["Query"]=dataAll["Query"].replace("\n"," ")

        print(dataAll)
        # dsadsadasdad


        # dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt']}', 127)cnvrt"
        dataAll["createdBy"]=current_user['id']
        userData=cso.insertion("nokiapreposttool",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
        return respond(userData)
        
    elif(request.method=="PUT"):
        dataAll=request.get_json()
        
        dataAll["Query"]=dataAll["Query"].replace("\n"," ")
        
        dataAll=del_itm(dataAll,["create_time","update_time","id"])

        

        print(dataAll)
        # print(dasdadaada)
        userData=cso.updating("nokiapreposttool",{"id":uniqueId},dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        userData=cso.updating("nokiapreposttool",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("nokiapreposttool",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }
    

@nokiaprepost_blueprint.route('/proRulesOutput',methods=['GET',"POST","PUT","PATCH","DELETE"])
@nokiaprepost_blueprint.route('/proRulesOutput/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def proRulesOutput(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu)
        
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), pro_rules.* from pro_rules WHERE pro_rules.deleteStatus=0 AND pro_rules.fromReport='Site Analytics' {'AND '+arew['que'] if arew['que']!='' else ''} ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        
        
        data=cso.finding(sqlQuery)

        
        return respond(data)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()
        
        print(dataAll)
        smartString=f"""Declare @fr_phy_id varchar(10) = '{dataAll["fr_phy_id"]}';
Declare @fr_post_date date = '{dataAll["fr_pre_date"]}';
"""
        
        
        
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), pro_rules.* from pro_rules WHERE pro_rules.deleteStatus=0 AND pro_rules.fromReport='Site Analytics' ORDER BY sid ;"
        data=cso.finding(sqlQuery)
        
        updata=[]
        
        for dtewq in data["data"]:
            dtewq["query"]=smartString+dtewq["query"]
            
            updata.append(dtewq)
            
        data["data"]=updata
        
        print(data,smartString)
        
        
        # ddsadasdsa
        return respond(data)
        
    elif(request.method=="PUT"):
        dataAll=request.get_json()
        
        # dataAll["Query"]=dataAll["Query"].replace("\n"," ")
        
        dataAll["createdBy"]=current_user['id']
        dataAll=del_itm(dataAll,["create_time","update_time","id"])

        

        print(dataAll)
        # print(dasdadaada)
        userData=cso.updating("pro_rules",{"id":uniqueId},dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        userData=cso.updating("pro_rules",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("pro_rules",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }
        
        
@nokiaprepost_blueprint.route('/cellProRulesOutput',methods=['GET',"POST","PUT","PATCH","DELETE"])
@nokiaprepost_blueprint.route('/cellProRulesOutput/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def cellProRulesOutput(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu)
        
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), pro_rules.* from pro_rules WHERE pro_rules.deleteStatus=0 AND pro_rules.fromReport='Cell Analytics' {'AND '+arew['que'] if arew['que']!='' else ''} ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        data=cso.finding(sqlQuery)

        
        return respond(data)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()
        
        print(dataAll)
        def extract_technology(text):
            match = re.search(r'([2-5][Gg])', text or "")
            return match.group(1) if match else None
        smartString=f"""Declare @fr_phy_id varchar(300) = '{dataAll["fr_phy_id"]}'
Declare @fr_post_date date = '{dataAll["fr_pre_date"]}'
"""
        
        
        technology=extract_technology(dataAll["fr_phy_id"])
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), pro_rules.* from pro_rules WHERE pro_rules.deleteStatus=0 AND pro_rules.fromReport='Cell Analytics' ORDER BY sid ;"
        if technology:
            sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), pro_rules.* from pro_rules WHERE pro_rules.deleteStatus=0 AND pro_rules.fromReport='Cell Analytics' AND pro_rules.Technology='{technology}' ORDER BY sid ;"
        data=cso.finding(sqlQuery)
        
        updata=[]
        
        for dtewq in data["data"]:
            dtewq["query"]=smartString+dtewq["query"]
            
            updata.append(dtewq)
            
        data["data"]=updata
        
        print(data,"fchgfhgfhgfhg",smartString)
        
        
        # ddsadasdsa
        return respond(data)
        
    elif(request.method=="PUT"):
        dataAll=request.get_json()
        
        # dataAll["Query"]=dataAll["Query"].replace("\n"," ")
        
        dataAll["createdBy"]=current_user['id']
        dataAll=del_itm(dataAll,["create_time","update_time","id"])

        

        print(dataAll)
        # print(dasdadaada)
        userData=cso.updating("pro_rules",{"id":uniqueId},dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        userData=cso.updating("pro_rules",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("pro_rules",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }
        
        
        
@nokiaprepost_blueprint.route('/proRules',methods=['GET',"POST","PUT","PATCH","DELETE"])
@nokiaprepost_blueprint.route('/proRules/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def proRules(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu,"pro_rules")
        
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), pro_rules.* from pro_rules WHERE pro_rules.deleteStatus=0 {'AND '+arew['que'] if arew['que']!='' else ''} ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        data=cso.finding(sqlQuery)

        
        return respond(data)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()

        # dataAll["Query"]=dataAll["Query"].replace("\n"," ")

        print("sdhgjshgksdgfk",dataAll,"sdfsdkdhfkjsdh")
        # dsadsadasdad


        # dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt']}', 127)cnvrt"
        dataAll["createdBy"]=current_user['id']
        userData=cso.insertion("pro_rules",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
        return respond(userData)
        
    elif(request.method=="PUT"):
        dataAll=request.get_json()
        
        # dataAll["Query"]=dataAll["Query"].replace("\n"," ")
        
        dataAll["createdBy"]=current_user['id']
        dataAll=del_itm(dataAll,["create_time","update_time","id"])

        

        print(dataAll.keys(),"shshfsjfgjsd")
        # print(dasdadaada)
        userData=cso.updating("pro_rules",{"id":uniqueId},dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        userData=cso.updating("pro_rules",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("pro_rules",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }
    

   
@nokiaprepost_blueprint.route('/uniquePhysicalId',methods=['GET',"POST","PUT","PATCH","DELETE"])
@nokiaprepost_blueprint.route('/uniquePhysicalId/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
# @token_required
def uniquePhysicalId(uniqueId=None):
    
    
    
    sql_conn_obj=sconf.sql_conn_obj()
    sqlQuerytech=f"SELECT DISTINCT Physical_id AS label,Physical_id AS value FROM [KPI_Gids].[gid].[KPI_Cell_gids] WHERE Physical_id IS NOT NULL AND ISNUMERIC(Physical_id) = 1 AND Physical_id NOT LIKE '%.%' ORDER BY Physical_id;"        
        
    techdata=cso.findFromDifferentServer(sql_conn_obj,sqlQuerytech)
    techdata["data"]=cfc.dfjson(techdata["data"])
    return techdata



@nokiaprepost_blueprint.route('/uniquecellid',methods=['GET',"POST","PUT","PATCH","DELETE"])
@nokiaprepost_blueprint.route('/uniquecellid/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
# @token_required
def uniquecellid(uniqueId=None):
    
    
    print("uniquecellid")
    
    getUidData=request.args.get("getData")
    
    
    
    sql_conn_obj=sconf.sql_conn_obj()
    sqlQuerytech=f"SELECT Cell_Name AS label,Cell_Name AS value FROM [KPI_Gids].[gid].[KPI_Cell_gids] WHERE Cell_Name IS NOT NULL AND Cell_Name Like '%{getUidData}%' ORDER BY Cell_Name;"        
        
    techdata=cso.findFromDifferentServer(sql_conn_obj,sqlQuerytech)
    
    # print("techdata",techdata,"techdata")
    techdata["data"]=cfc.dfjson(techdata["data"])
    
    return techdata





   
@nokiaprepost_blueprint.route('/networkAnalyticsPro',methods=['GET',"POST","PUT","PATCH","DELETE"])
@nokiaprepost_blueprint.route('/networkAnalyticsPro/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def networkAnalyticsPro(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu)
        
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), nokiapreposttool.* from nokiapreposttool WHERE nokiapreposttool.deleteStatus=0 ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        data=cso.findingddf(sqlQuery)

        print(arew,"arewarewarew")

        dfdata=data["data"]

        # dfdata=pd.DataFrame()
        KPICHECKfinal_data={}

        print(dfdata,argu,"dfdata")

        # dsadsadasda
        # for i in dfdata.groupby(["Technology","groupBy"]):
        #     print(i)

        # dsadasdasdadas
        for i in dfdata.groupby(["Technology","groupBy"]):
            
            # print(i[1]["Query"],"kkkkkkkkkkkkkkkkkkkk")
            i[1]["Query"]=f"DECLARE @fr_phy_id VARCHAR(10) = '{argu['fr_phy_id'] if 'fr_phy_id' in argu else ''}';DECLARE @fr_pre_date VARCHAR(10) = '{argu['fr_pre_date'] if 'fr_pre_date' in argu else ''}';DECLARE @fr_post_date VARCHAR(10) = '{argu['fr_post_date'] if 'fr_post_date' in argu else ''}';"+i[1]["Query"]
            # print(i[1]["Query"],"qqqqqqqqqqqqqqqqqqqq")
            # print(cfc.dfjson(i[1]),i[1],"cfc.dfjson(i[1])")
            KPICHECKfinal_data[i[0][0]+" "+i[0][1]]=cfc.dfjson(i[1])

        # print(final_data)
        # PSBCHECKfinal_data={
        #     "5G PCI Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }],
        #     "4G PCI Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }],
        #     "3G PSC Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }],
        #     "2G BCCH Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }]
        # }
            
        
        fd={
            **KPICHECKfinal_data,
        }

            # **PSBCHECKfinal_data
        # fd=final_data
        fss= {
            "PM KPI Check":{
                "data":["5G PM KPI Check","4G PM KPI Check","3G PM KPI Check", "2G PM KPI Check"],
                "color":"bg-primaryLine",
                "sort":1
            },
            "RSI/PCI/PSC/BCCH":{
                "data":["5G RSI/PCI/PSC/BCCH","4G RSI/PCI/PSC/BCCH","3G RSI/PCI/PSC/BCCH","2G RSI/PCI/PSC/BCCH"],
                "color":"green",
                "sort":2
            },
            "TA Checks":{
                "data":["5G TA Checks","4G TA Checks","3G TA Checks","2G TA Checks"],
                "color":"magenta",
                "sort":3
            },
            "Alarms Checks":{
                "data":[
                        "5G Alarms Checks",
                        "4G Alarms Checks",
                        "3G Alarms Checks",
                        "2G Alarms Checks"
                       ],
                "color":"purple",
                "sort":4
            },
            "CM Checks":{
                "data":["5G CM Checks","4G CM Checks","3G CM Checks","2G CM Checks"],
                "color":"#0000ff",
                "sort":4
            },
            
        }

            # "5G PCI Check","4G PCI Check","3G PSC Check","2G BCCH Check"
        # fd["PCI Check"]=final_data
        
            
        data["data"]=fd
        data["sorter"]=fss
        data["showCols"]={
            
            "5G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"NR/5G PM KPI Check",
                
            },
            "4G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"LTE/4G PM KPI Check"
            },
            "3G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"UMTS/3G PM KPI Check"
            }, 
            "2G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"GSM/2G PM KPI Check"
            }, 

            
            "5G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"5G RSI Check"
            }, 
            "4G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"4G PCI Check"
            }, 
            "3G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"3G PSC Check"
            },
            "2G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"2G BCCH Check"
            },
            "5G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"5G TA Checks"
            },
            "4G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"4G TA Checks"
            },
            "3G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"3G TA Checks"
            },
            "2G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"2G TA Checks"
            },
            "5G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre  Issues ","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":6,
                "name":"5G Alarms Checks"
            },
            "4G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre Issues","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":4,
                "name":"4G Alarms Checks"
            },
            "3G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre Issues","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":4,
                "name":"3G Alarms Checks"
            },
            "2G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre Issues","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":4,
                "name":"2G Alarms Checks"
            },
            "5G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"5G CM Checks"
            },
            "4G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"4G CM Checks"
            },
            "3G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"3G CM Checks"
            },
            "2G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"2G CM Checks"
            }
        }



        
        return respond(data)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()

        dataAll["Query"]=dataAll["Query"].replace("\n"," ")

        print(dataAll)
        # dsadsadasdad


        # dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt']}', 127)cnvrt"
        dataAll["createdBy"]=current_user['id']
        userData=cso.insertion("nokiapreposttool",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
        return respond(userData)
        
    elif(request.method=="PUT"):
        dataAll=request.get_json()
        
        dataAll["Query"]=dataAll["Query"].replace("\n"," ")
        
        dataAll=del_itm(dataAll,["create_time","update_time","id"])

        

        print(dataAll)
        # print(dasdadaada)
        userData=cso.updating("nokiapreposttool",{"id":uniqueId},dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        userData=cso.updating("nokiapreposttool",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("nokiapreposttool",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }
        
        
        
        
        
@nokiaprepost_blueprint.route('/sitenetworkAnalyticsPro',methods=['GET',"POST","PUT","PATCH","DELETE"])
@nokiaprepost_blueprint.route('/sitenetworkAnalyticsPro/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def sitenetworkAnalyticsPro(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu)
        
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), nokiapreposttool.* from nokiapreposttool WHERE nokiapreposttool.deleteStatus=0 AND nokiapreposttool.fromReport='Site Analytics' ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        data=cso.findingddf(sqlQuery)

        print(arew,"arewarewarew")

        dfdata=data["data"]

        # dfdata=pd.DataFrame()
        KPICHECKfinal_data={}

        print(dfdata,argu,"dfdata")

        # dsadsadasda
        # for i in dfdata.groupby(["Technology","groupBy"]):
        #     print(i)

        # dsadasdasdadas
        for i in dfdata.groupby(["Technology","groupBy"]):
            
            # print(i[1]["Query"],"kkkkkkkkkkkkkkkkkkkk")
            i[1]["Query"]=f"DECLARE @fr_phy_id VARCHAR(10) = '{argu['fr_phy_id'] if 'fr_phy_id' in argu else ''}';DECLARE @fr_pre_date VARCHAR(20) = '{argu['fr_pre_date'] if 'fr_pre_date' in argu else ''}';DECLARE @fr_post_date VARCHAR(20) = '{argu['fr_post_date'] if 'fr_post_date' in argu else ''}';"+i[1]["Query"]
            # print(i[1]["Query"],"qqqqqqqqqqqqqqqqqqqq")
            # print(cfc.dfjson(i[1]),i[1],"cfc.dfjson(i[1])")
            KPICHECKfinal_data[i[0][0]+" "+i[0][1]]=cfc.dfjson(i[1])

        # print(final_data)
        # PSBCHECKfinal_data={
        #     "5G PCI Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }],
        #     "4G PCI Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }],
        #     "3G PSC Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }],
        #     "2G BCCH Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }]
        # }
            
        
        fd={
            **KPICHECKfinal_data,
        }

            # **PSBCHECKfinal_data
        # fd=final_data
        fss= {
            "PM KPI Check":{
                "data":["5G PM KPI Check","4G PM KPI Check","3G PM KPI Check", "2G PM KPI Check"],
                "color":"bg-primaryLine",
                "sort":1
            },
            "RSI/PCI/PSC/BCCH":{
                "data":["5G RSI/PCI/PSC/BCCH","4G RSI/PCI/PSC/BCCH","3G RSI/PCI/PSC/BCCH","2G RSI/PCI/PSC/BCCH"],
                "color":"green",
                "sort":2
            },
            "TA Checks":{
                "data":["5G TA Checks","4G TA Checks","3G TA Checks","2G TA Checks"],
                "color":"magenta",
                "sort":3
            },
            "Alarms Checks":{
                "data":[
                        "5G Alarms Checks",
                        "4G Alarms Checks",
                        "3G Alarms Checks",
                        "2G Alarms Checks"
                       ],
                "color":"purple",
                "sort":4
            },
            "CM Checks":{
                "data":["5G CM Checks","4G CM Checks","3G CM Checks","2G CM Checks"],
                "color":"#0000ff",
                "sort":4
            },
            
        }

            # "5G PCI Check","4G PCI Check","3G PSC Check","2G BCCH Check"
        # fd["PCI Check"]=final_data
        
            
        data["data"]=fd
        data["sorter"]=fss
        data["showCols"]={
            
            "5G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"NR/5G PM KPI Check",
                
            },
            "4G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"LTE/4G PM KPI Check"
            },
            "3G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"UMTS/3G PM KPI Check"
            }, 
            "2G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"GSM/2G PM KPI Check"
            }, 

            
            "5G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"5G RSI Check"
            }, 
            "4G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"4G PCI Check"
            }, 
            "3G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"3G PSC Check"
            },
            "2G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"2G BCCH Check"
            },
            "5G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"5G TA Checks"
            },
            "4G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"4G TA Checks"
            },
            "3G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"3G TA Checks"
            },
            "2G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"2G TA Checks"
            },
            "5G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre  Issues ","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":6,
                "name":"5G Alarms Checks"
            },
            "4G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre Issues","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":4,
                "name":"4G Alarms Checks"
            },
            "3G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre Issues","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":4,
                "name":"3G Alarms Checks"
            },
            "2G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre Issues","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":4,
                "name":"2G Alarms Checks"
            },
            "5G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"5G CM Checks"
            },
            "4G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"4G CM Checks"
            },
            "3G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"3G CM Checks"
            },
            "2G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"2G CM Checks"
            }
        }



        
        return respond(data)
    
        
@nokiaprepost_blueprint.route('/cellnetworkAnalyticsPro',methods=['GET',"POST","PUT","PATCH","DELETE"])
@nokiaprepost_blueprint.route('/cellnetworkAnalyticsPro/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def cellnetworkAnalyticsPro(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu)
        
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), nokiapreposttool.* from nokiapreposttool WHERE nokiapreposttool.deleteStatus=0 AND nokiapreposttool.fromReport='Cell Analytics' ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        data=cso.findingddf(sqlQuery)

        print(sqlQuery,"arewarewarew")

        dfdata=data["data"]

        # dfdata=pd.DataFrame()
        KPICHECKfinal_data={}

        print(dfdata,argu,"dfdata")

        # dsadsadasda
        # for i in dfdata.groupby(["Technology","groupBy"]):
        #     print(i)

        # dsadasdasdadas
        for i in dfdata.groupby(["Technology","groupBy"]):
            
            # print(i[1]["Query"],"kkkkkkkkkkkkkkkkkkkk")
            i[1]["Query"]=f"DECLARE @fr_phy_id VARCHAR(300) = '{argu['fr_phy_id'] if 'fr_phy_id' in argu else ''}';DECLARE @fr_pre_date VARCHAR(20) = '{argu['fr_pre_date'] if 'fr_pre_date' in argu else ''}';DECLARE @fr_post_date VARCHAR(20) = '{argu['fr_post_date'] if 'fr_post_date' in argu else ''}';"+i[1]["Query"]
            # print(i[1]["Query"],"qqqqqqqqqqqqqqqqqqqq")
            # print(cfc.dfjson(i[1]),i[1],"cfc.dfjson(i[1])")
            KPICHECKfinal_data[i[0][0]+" "+i[0][1]]=cfc.dfjson(i[1])

        # print(final_data)
        # PSBCHECKfinal_data={
        #     "5G PCI Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }],
        #     "4G PCI Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }],
        #     "3G PSC Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }],
        #     "2G BCCH Check":[{
        #         "KPI_Name":"hello",
        #         "Code":"hello",
        #         "id":"hello",
        #     }]
        # }
            
        
        fd={
            **KPICHECKfinal_data,
        }

            # **PSBCHECKfinal_data
        # fd=final_data
        fss= {
            "PM KPI Check":{
                "data":["5G PM KPI Check","4G PM KPI Check","3G PM KPI Check", "2G PM KPI Check"],
                "color":"bg-primaryLine",
                "sort":1
            },
            "RSI/PCI/PSC/BCCH":{
                "data":["5G RSI/PCI/PSC/BCCH","4G RSI/PCI/PSC/BCCH","3G RSI/PCI/PSC/BCCH","2G RSI/PCI/PSC/BCCH"],
                "color":"green",
                "sort":2
            },
            "TA Checks":{
                "data":["5G TA Checks","4G TA Checks","3G TA Checks","2G TA Checks"],
                "color":"magenta",
                "sort":3
            },
            "Alarms Checks":{
                "data":[
                        "5G Alarms Checks",
                        "4G Alarms Checks",
                        "3G Alarms Checks",
                        "2G Alarms Checks"
                       ],
                "color":"purple",
                "sort":4
            },
            "CM Checks":{
                "data":["5G CM Checks","4G CM Checks","3G CM Checks","2G CM Checks"],
                "color":"#0000ff",
                "sort":4
            },
            
        }

            # "5G PCI Check","4G PCI Check","3G PSC Check","2G BCCH Check"
        # fd["PCI Check"]=final_data
        
            
        data["data"]=fd
        data["sorter"]=fss
        data["showCols"]={
            
            "5G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"NR/5G PM KPI Check",
                
            },
            "4G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"LTE/4G PM KPI Check"
            },
            "3G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"UMTS/3G PM KPI Check"
            }, 
            "2G PM KPI Check":{
                "value":["","PreValueAvg","PostValueAvg","DeltaAvg"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["KPI", "Pre", "Post", "Delta"]],
                "name":"GSM/2G PM KPI Check"
            }, 

            
            "5G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"5G RSI Check"
            }, 
            "4G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"4G PCI Check"
            }, 
            "3G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"3G PSC Check"
            },
            "2G RSI/PCI/PSC/BCCH":{
                "value":["","<1KM","1-5KM","5>KM"],
                "color":["","Pre_Value_Colour","Post_Value_Colour","Delta_Colour"],
                "header":[["Issue","<1 KM","1-5 KM",">5KM"]],
                "name":"2G BCCH Check"
            },
            "5G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"5G TA Checks"
            },
            "4G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"4G TA Checks"
            },
            "3G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"3G TA Checks"
            },
            "2G TA Checks":{
                "value":["","Issue","% <1KM","% 1 and 5KM","% 5 and 10KM","% >10KM"],
                "color":["","Issue","<1KM","1-5KM","5-10KM",">10KM"],
                "header":[["KPI","Issue","<1KM","1-5KM","5-10KM",">10KM"]],
                "name":"2G TA Checks"
            },
            "5G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre  Issues ","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":6,
                "name":"5G Alarms Checks"
            },
            "4G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre Issues","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":4,
                "name":"4G Alarms Checks"
            },
            "3G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre Issues","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":4,
                "name":"3G Alarms Checks"
            },
            "2G Alarms Checks":{
                "value":["","Critical Alarms","Medium Alarms","Other Alarms"],
                "color":["","Critial","Major","Minor"],
                "header":[["Pre Issues","Critical","Major","Minor"],["Post Issues","Critical","Major","Minor"]],
                "headerafter":4,
                "name":"2G Alarms Checks"
            },
            "5G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"5G CM Checks"
            },
            "4G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"4G CM Checks"
            },
            "3G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"3G CM Checks"
            },
            "2G CM Checks":{
                "value":["","Pre Results","Post Results"],
                "color":["","Pre Results","Post Results"],
                "header":[["CM Checks","Pre Results","Post Results"]],
                "name":"2G CM Checks"
            }
        }



        
        return respond(data)
    
    

@nokiaprepost_blueprint.route('/BulkUpload/PrePost',methods=['GET',"POST","PUT","PATCH","DELETE"])
def BulkUpload_PrePost():
    print("BulkUpload_PrePost",os.getcwd())

    

    uploadedFile=request.files.get("uploadedFile[]")
    status=cform.singleFileSaver(uploadedFile,"",["xlsx"])

    if(status["status"]==422):
        return respond(status)
    
    datafiler=cfc.exceltodf(excel_file_path=status["msg"],rename=cdcm.rename_BulkUpload_PrePost,validate=cdcm.validate_BulkUpload_PrePost)

    if(datafiler["status"]!=200):
        return respond(datafiler)
    # all_data=cfc.dfjson(data)

    # for i in all_data:
    #     if(i["Code"]!=None):
    #         print(i["Code"])

    data=datafiler["data"]

    data=data.fillna("")

    data["deleteStatus"]=0
    # data["create_time"]=ctm.mdy_timestamp()
    # data["update_time"]=ctm.mdy_timestamp()

    # print(len(data))
    newData=data[data["Code"]!=""]
    newData["Query"]=newData["Query"].str.replace("\n"," ")
    # print(newData)
    # print(data[data["Code"]!=""])
    # dasdsadada


    respdata=cso.dftosql(newData,"nokiapreposttool",["Code","KPI_Name","fromReport"])


    return respond(respdata)