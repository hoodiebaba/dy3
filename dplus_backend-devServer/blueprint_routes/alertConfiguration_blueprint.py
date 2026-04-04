from base import *

alertConfiguration_blueprint = Blueprint('alertConfiguration_blueprint', __name__)

def convert_datetime_format(dt_str, end_of_day=False):
    if dt_str:
        try:
            # Parse datetime from the input format (assuming input is in 'dd-mm-yyyy HH:MM:SS' format)
            dt = datetime.strptime(dt_str, '%d-%m-%Y %H:%M:%S')
        except ValueError:
            # If parsing fails, return the original string or handle as needed
            return dt_str
        
        # Format datetime to SQL Server format
        if end_of_day:
            dt = dt.replace(hour=23, minute=59, second=59)
        
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    return dt_str

@alertConfiguration_blueprint.route('/alertConfiguration/configureAlert',methods=['GET',"POST","PUT","PATCH","DELETE"])
@alertConfiguration_blueprint.route('/alertConfiguration/configureAlert/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def configureAlert(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu)
            
        sqlQuery=f"SELECT dbConfig.dbName,alertConfig.* from alertConfig JOIN dbConfig ON dbConfig.id=alertConfig.dbServer WHERE alertConfig.deleteStatus=0 AND alertConfig.createdBy='{current_user['id']}' {' AND '+arew['que'] if arew['que']!='' else ''} ORDER BY alertConfig.sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        
        return cso.finding(sqlQuery)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()

        # dataAll["startAt"]=ctm.stringdatetodate(dataAll["startAt"],'%Y-%m-%dT%H:%M')
        # dataAll["endAt"]=ctm.stringdatetodate(dataAll["endAt"],'%Y-%m-%dT%H:%M')

        dataAll["startAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['startAt'].split(' ')[0]}', 127)cnvrt"
        if("T" in dataAll['endAt']):
            dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt'].split('T')[0]+' 23:59:59'}', 121)cnvrt"
        else:
            dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt'].split(' ')[0]+' 23:59:59'}', 121)cnvrt"
        dataAll["timeall"]=dataAll['timeall']

        print(dataAll)
        # dsadsadasdad


        # dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt']}', 127)cnvrt"
        dataAll["createdBy"]=current_user['id']
        dataAll['deleteStatus']=0
        userData=cso.insertion("alertConfig",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
        return respond(userData)
        
    elif(request.method=="PUT"):
        dataAll=request.get_json()
        if("T" in dataAll['endAt']):
            dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt'].split('T')[0]+' 23:59:59'}', 121)cnvrt"
        else:
            dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt'].split(' ')[0]+' 23:59:59'}', 121)cnvrt"
        dataAll["startAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['startAt'].split(' ')[0]}', 127)cnvrt"
        dataAll["timeall"]=dataAll['timeall']
        
        dataAll=del_itm(dataAll,["create_time","update_time","id","dbName"])

        

        print(dataAll)
        # print(dasdadaada)
        userData=cso.updating("alertConfig",{"id":uniqueId},dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        userData=cso.updating("alertConfig",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print("sdkjhskjdhskjdhkjsdhkjs",uniqueId)

        res=cso.updating("alertConfig",{"id":uniqueId},{"deleteStatus":1})
        return res
    

@alertConfiguration_blueprint.route('/alertConfiguration/schedulerAlert',methods=['GET',"POST","PUT","PATCH","DELETE"])
@alertConfiguration_blueprint.route('/alertConfiguration/schedulerAlert/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def schedulerAlert(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu)
            
        # sqlQuery=f"SELECT dbConfig.dbName,alertConfigInstant.* from alertConfigInstant JOIN dbConfig ON dbConfig.id=alertConfigInstant.dbServer WHERE alertConfigInstant.deleteStatus=0 AND alertConfigInstant.createdBy='{current_user['id']}';"
        sqlQuery=f"SELECT dbConfig.dbName,alertConfigInstant.* from alertConfigInstant JOIN dbConfig ON dbConfig.id=alertConfigInstant.dbServer WHERE alertConfigInstant.createdBy='{current_user['id']}'{' AND '+arew['que'] if arew['que']!='' else ''} ORDER BY alertConfigInstant.sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        
        return cso.finding(sqlQuery)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()


        dataAll["mailQueryBody"]=dataAll["mailQueryBody"].replace("\n"," ")
        dataAll["mailQuery"]=dataAll["mailQuery"].replace("\n"," ")
        dataAll["mailBody"]=dataAll["mailBody"].replace("\n"," ")
        dataAll["graphQuery"]=dataAll["graphQuery"].replace("\n"," ")


        # dataAll["startAt"]=ctm.stringdatetodate(dataAll["startAt"],'%Y-%m-%dT%H:%M')
        # dataAll["endAt"]=ctm.stringdatetodate(dataAll["endAt"],'%Y-%m-%dT%H:%M')

        dataAll["startAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['startAt'].split(' ')[0]}', 127)cnvrt"
        if("T" in dataAll['endAt']):
            dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt'].split('T')[0]+' 23:59:59'}', 121)cnvrt"
        else:
            dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt'].split(' ')[0]+' 23:59:59'}', 121)cnvrt"

        dataAll["nextSendAt"]=f"cnvrtCONVERT(DATETIME, '{ctm.curr_add_form(form='%Y-%m-%d %H:%M:00',minute=2)}', 121)cnvrt"
        dataAll["lastSendAt"]=f"cnvrtCONVERT(DATETIME, '{ctm.curr_add_form(form='%Y-%m-%d %H:%M:00')}', 121)cnvrt"
        dataAll["blockage"]=0
        print(dataAll)
        # dsadsadasdad

        print(dataAll,"dataAlldataAlldataAll")

        # dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt']}', 127)cnvrt"
        dataAll["createdBy"]=current_user['id']
        userData=cso.insertion("alertConfigInstant",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
        return respond(userData)
        
    elif request.method == "PUT":
        dataAll = request.get_json()

        print("started")
        dataAll["mailQueryBody"] = dataAll.get("mailQueryBody", "").replace("\n", " ")
        print("started2")
        dataAll["mailQuery"] = dataAll.get("mailQuery", "").replace("\n", " ")
        print("started3")
        dataAll["mailBody"] = dataAll.get("mailBody", "").replace("\n", " ")
        print("started4")
        dataAll["graphQuery"] = dataAll.get("graphQuery", "").replace("\n", " ")

        # Handle blockMsg if it's None
        if dataAll.get("blockMsg") is None:
            dataAll["blockMsg"] = "Default message"  # Set a default value or handle accordingly

        # Convert endAt and startAt to the desired format
        dataAll["endAt"] = convert_datetime_format(dataAll.get("endAt"), end_of_day=True)
        dataAll["startAt"] = convert_datetime_format(dataAll.get("startAt"), end_of_day=False)

        # Calculate nextSendAt and lastSendAt
        now = datetime.now()
        dataAll["nextSendAt"] = (now + timedelta(minutes=2)).strftime('%Y-%m-%d %H:%M:%S')
        dataAll["lastSendAt"] = now.strftime('%Y-%m-%d %H:%M:%S')

        print("started6")
        dataAll["blockage"] = 0

        # Remove unwanted items
        dataAll = del_itm(dataAll, ["create_time", "update_time", "id", "dbName"])
        print("started98")

        print(dataAll, "dataAlldataAlldataAll")

        print("dasdadaada")
        userData = cso.updating("alertConfigInstant", {"id": uniqueId}, dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        
        print(dataAll,"dataAlldataAlldataAll")
        userData=cso.updating("alertConfigInstant",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("alertConfigInstant",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }

        # sqlQuery="SELECT CONCAT(Users.firstname, ' ', Users.lastname) AS name,dbConfig.id AS uniqueId,dbConfig.dbName,dbConfig.dbServer,dbConfig.dbtype,dbConfig.username,'********' as password FROM dbConfig INNER JOIN Users on dbConfig.userId=Users.id;"
        
        # return cso.finding(sqlQuery)
    

# @querybuilder_blueprint.route('/querybuilder/getSavedQuery',methods=['GET'])
# @token_required
# def querybuilder_getSavedQuery(current_user):
#     sqlQuery=f"SELECT savedQueries.queries,dbConfig.id,dbConfig.dbName,dbConfig.dbServer FROM savedQueries INNER JOIN dbConfig on savedQueries.dbServer=dbConfig.id WHERE savedQueries.userId='{current_user['id']}';"
    
#     return cso.finding(sqlQuery)

   
# querybuilder/sqlQueryGenerator
