from base import *

querybuilder_blueprint = Blueprint('querybuilder_blueprint', __name__)


   
@querybuilder_blueprint.route('/querybuilder/getDatabase',methods=['GET'])
@token_required
def getDatabaseList(current_user):
    userData={}

    argu=request.args
    arew=apireq.argstostr(argu)

    sqlQuery=f"SELECT CONCAT(dbServer, '/', dbName) as label,id as value FROM dbConfig WHERE deleteStatus=0 AND createdBy='{current_user['id']}' {'AND '+arew['que'] if arew['que']!='' else ''} ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
    userData=cso.finding(sqlQuery)
    userData["data"]=[
        # {
        #     "label":"Please Select DB",
        #     "value":""
        # }
    ]+userData["data"]
    userData["msg"]="List of Database"
    return userData






@querybuilder_blueprint.route('/querybuilder/getdbo/<dboName>',methods=['GET'])
@token_required
def getdbo(current_user,dboName):

    sqlQuery=f"SELECT * FROM dbConfig where id='{dboName}' AND deleteStatus=0;"
    
    savedServer=cso.finding(sqlQuery)["data"][0]

    print(savedServer["dbName"],"savedServer")
    query=f"SELECT DISTINCT(TABLE_SCHEMA) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG='{savedServer['dbName']}';"
    userData=cso.findFromDifferentServer(savedServer,query)

    print(userData["data"].to_dict(orient="dict"),"userDatauserData")


    filal=userData["data"]
    filal["label"]=savedServer['dbName']+"."+filal["TABLE_SCHEMA"]
    filal["value"]=dboName+"/"+savedServer['dbName']+"."+filal["TABLE_SCHEMA"]


    filal=filal[["label","value"]]


    print(filal.to_dict(orient="records"))


    # dic=[""]

    # for i in userData["data"]["common_name"]:
    #     print(i)



    



    userData["data"]=filal.to_dict(orient="records")
    userData["msg"]="List of dbo"
    return userData




@querybuilder_blueprint.route('/querybuilder/<type>',methods=['POST'])
@querybuilder_blueprint.route('/querybuilder/<type>/<filetype>',methods=['POST'])
def querybuilder_dynamic(type,filetype="excel"):
    dataAll=request.get_json()

    print(dataAll)
    sqlQuery=f"SELECT * FROM dbConfig where id='{dataAll['dbServer']}' AND deleteStatus=0;"
    
    savedServer=cso.finding(sqlQuery)["data"][0]
    query=dataAll["queries"]


    # if("startDate" in dataAll and dataAll["startDate"]):
    #     query=query+dataAll["dateTimeKey"]+"="+dataAll["startDate"]
    # if("endDate" in dataAll and dataAll["endDate"]):
    #     query=query+dataAll["dateTimeKey"]+"="+dataAll["endDate"]

    if("@" in query and 1==2):
        print()

        query=query.replace("@",dataAll["dateTimeKey"])
        query=query.replace('startingdate',dataAll["startDate"].replace("T", " "))
        query=query.replace('endingdate',dataAll["endDate"].replace("T", " "))

        print(query)	
        # dsadsadadadas

    print(savedServer,"savedServersavedServersavedServer")

    filen=""
    data=cso.findFromDifferentServer(savedServer,query)
    filen=ctm.fileame_mdy_timestamp()
    filename=os.path.join("output","queryResult",filen)
    queryResultPath=os.path.join(os.getcwd(),filename)
    lenData=cfc.dflen(data["data"])
    threshold=os.environ.get("RUN_QUERY_THRESHOLD")

    print(threshold,"thresholdthreshold")
    
    print(data)
    
    
    if(len(data["data"])>0):
            
        if(lenData<int(threshold) and type=="runQuery"):
            print("cfc.dfjson",data["data"],"cfc.dfjson")

            data["data"]=cfc.dfjson(data["data"])
            data["type"]="Data"
            return respond(data)
        else:

            finalfilen=""
            if(filetype=="excel"):
                cfc.dftoexcel(data["data"],filename+".xlsx")
                finalfilen=filen+".xlsx"
            else:
                cfc.dftocsv(data["data"],filename+".csv")
                finalfilen=filen+".csv"


            
            
            destfilename=filen
            dest_dir=os.path.join("output","queryResultZip")
            move_to=czc.fileMover(dest_dir=dest_dir,destfilename=destfilename,source_dir=os.path.join("output","queryResult"),filenames=[finalfilen])
            zip_path=czc.zipCreate(move_to,os.path.join(dest_dir,destfilename))
            data["data"]=zip_path+".zip"
            data["msg"]="File downloaded successfully your data is greater than "+str(threshold)+" rows" if type=="runQuery" else "File downloaded successfully."
            data["type"]="File"
            return respond(data)
    

    else:
        return respond(data)
    
    print()

    return respond()
    # userData=cso.insertion("dbConfig",columns=list(dataAll.keys()),values=tuple(dataAll.values()))
    # return respond(userData)



@querybuilder_blueprint.route('/querybuilder/saveQuery',methods=['POST'])
@token_required
def querybuilder_saveQuery(current_user):

    print(current_user)
    dataAll=request.get_json()
    dataAll["userId"]=current_user["id"]
    userData=cso.insertion("savedQueries",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
    return respond(userData)

@querybuilder_blueprint.route('/querybuilder/getTables/<dbName>/<dbo>',methods=['GET'])
def getTablesList(dbName,dbo):
    userData={}

    sqlQuery=f"SELECT * FROM dbConfig where id='{dbName}' AND deleteStatus=0;"
    
    savedServer=cso.finding(sqlQuery)["data"][0]

    print(savedServer["dbName"],"savedServer")
    query=f"SELECT TABLE_NAME,COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='{dbo.split('.')[1]}' AND TABLE_CATALOG='{savedServer['dbName']}';"
    dataFull=cso.findFromDifferentServer(savedServer,query)

    if(dataFull["status"]==200):
        data=dataFull["data"]

        print(data,"datadatadata")
        grroupedData=data.groupby('TABLE_NAME')

        dat=[]
        data=[]
        ctt=0
        for name,group in grroupedData:
            print(name,group)

            inner=[]
            itt=0
            for onnegr in group["COLUMN_NAME"]:
                print(onnegr,"onnegr")
                inner.append({
                    "name":onnegr,
                    "index":str(ctt)+str(itt),
                })
                data.append({
                    "category": name,
                    "name": onnegr,
                    "id": ctt
                })

            dat.append({
                "name":name,
                "parentName":name,
                "index":str(ctt),
                "columnName":inner
            })

            
            ctt+=1


        print(dat)

        userData["status"]=200
        userData["state"]=2
        userData["data"]={
            "d1":dat if dbName!="abc" else [],
            "d2":data
        }
        userData["msg"]="List of Table"

        return respond(userData)
    
    else:
        dataFull["data"]={
            "sqlQuery": {
                "color": "text-red",
                "msg": dataFull["msg"]
            }
        }
       
        return respond(dataFull)




    # sqlQuery="SELECT * FROM INFORMATION_SCHEMA.COLUMNS ;"
    
    # data=cso.finding(sqlQuery)["data"]

    # dat=[{
    #     "name":"Abcd",
    #     "parentName":"Abcd",
    #     "index":"0",
    #     "columnName":[
    #         {
    #             "name":"bac",
    #             "index":"00",
    #         },
    #         {
    #             "name":"acd",
    #             "index":"01",
    #         }
    #     ]
    # },{
    #     "name":"Abcd1",
    #     "parentName":"Abcd1",
    #     "index":"1",
    #     "columnName":[
    #         {
    #             "name":"bac",
    #             "index":"10",
    #         },
    #         {
    #             "name":"acd",
    #             "index":"11",
    #         }
    #     ]
    # },{
    #     "name":"Abcd2",
    #     "parentName":"Abcd2",
    #     "index":"2",
    #     "columnName":[
    #         {
    #             "name":"bac",
    #             "index":"10",
    #         },
    #         {
    #             "name":"acd",
    #             "index":"11",
    #         }
    #     ]
    # }]




    # data=[{
    #     "category": 'Abcd',
    #     "name": 'bac',
    #     "id": 2
    #   }, {
    #     "category": 'Abcd',
    #     "name": 'acd',
    #     "id": 1
    #   }, {
    #     "category": 'Abcd1',
    #     "name": 'bac2️',
    #     "id": 2
    #   }, {
    #     "category": 'Abcd1',
    #     "name": 'acd',
    #     "id": 1
    #   }, {
    #     "category": 'Abcd2',
    #     "name": 'bac2️',
    #     "id": 2
    #   }, {
    #     "category": 'Abcd2',
    #     "name": 'acd',
    #     "id": 1
    #   }]
    




    

    


@querybuilder_blueprint.route('/querybuilder/sqlQueryGenerator',methods=['POST'])
def sqlQueryGenerator():


    dataAll=request.get_json()

    # print(csq.sql_maker(dataAll),"dataAll")



    userData={}




    userData["status"]=200
    userData["state"]=2
    userData["data"]={
        "sqlQuery":csq.sql_maker(dataAll)
    }
    userData["msg"]="List of Database"

    return respond(userData)


@querybuilder_blueprint.route('/querybuilder/testDBConfig',methods=['GET',"POST","DELETE"])
@token_required
def testDBConfig(current_user):
    savedServer=request.get_json()
    dataFull=cso.checkConnection(savedServer)

    print(dataFull)
    return respond(dataFull)


@querybuilder_blueprint.route('/querybuilder/DBConfig',methods=['GET',"POST","DELETE"])
@querybuilder_blueprint.route('/querybuilder/DBConfig/<uniqueId>',methods=['GET',"POST","DELETE"])
@token_required
def DBConfig(current_user,uniqueId=None):

    if(request.method=="GET"):
            
        argu=request.args
        arew=apireq.argstostr(argu,"dbConfig")
        sqlQuery=f"SELECT CONCAT(Users.firstname, ' ', Users.lastname) AS name,dbConfig.id AS uniqueId,dbConfig.dbName,dbConfig.dbServer,dbConfig.dbtype,dbConfig.username,dbConfig.port,'********' as password FROM dbConfig INNER JOIN Users on dbConfig.userId=Users.id WHERE dbConfig.deleteStatus=0 AND dbConfig.createdBy='{current_user['id']}' {'AND '+arew['que'] if arew['que']!='' else ''} ORDER BY dbConfig.sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        
        return cso.finding(sqlQuery)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()
        if(uniqueId==None):
            dataAll["createdBy"]=current_user['id']
            userData=cso.insertion("dbConfig",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
            return respond(userData)
        else:
            uniqueId=dataAll["uniqueId"]
            if(dataAll["password"]=="********"):
                del dataAll["password"]
            del dataAll["uniqueId"]

            print(dataAll)
            # print(dasdadaada)
            userData=cso.updating("dbConfig",{"id":uniqueId},dataAll)
            return respond(userData)
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("dbConfig",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }

        # sqlQuery="SELECT CONCAT(Users.firstname, ' ', Users.lastname) AS name,dbConfig.id AS uniqueId,dbConfig.dbName,dbConfig.dbServer,dbConfig.dbtype,dbConfig.username,'********' as password FROM dbConfig INNER JOIN Users on dbConfig.userId=Users.id;"
        
        # return cso.finding(sqlQuery)
    

@querybuilder_blueprint.route('/querybuilder/getSavedQuery',methods=['GET'])
@token_required
def querybuilder_getSavedQuery(current_user):

    argu=request.args
    arew=apireq.argstostr(argu)
    sqlQuery=f"SELECT savedQueries.queries,dbConfig.id,dbConfig.sid,dbConfig.dbName,dbConfig.dbServer FROM savedQueries INNER JOIN dbConfig on savedQueries.dbServer=dbConfig.id WHERE savedQueries.userId='{current_user['id']}' {'AND '+arew['que'] if arew['que']!='' else ''} ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;;"
    
    return cso.finding(sqlQuery)

   
# querybuilder/sqlQueryGenerator