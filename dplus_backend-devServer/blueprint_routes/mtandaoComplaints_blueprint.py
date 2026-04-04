from base import *

mtandaoComplaints_blueprint = Blueprint('mtandaoComplaints_blueprint', __name__)


   
   
@mtandaoComplaints_blueprint.route('/mtandaoComplaints',methods=['GET',"POST","PUT","PATCH","DELETE"])
@mtandaoComplaints_blueprint.route('/mtandaoComplaints/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def configureAlert(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu)
        
        sqlQuery=f"SELECT overall_table_count = COUNT(*) OVER(), subscribersInfo.* from subscribersInfo WHERE subscribersInfo.deleteStatus=0 {'AND '+arew['que'] if arew['que']!='' else ''} ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;"
        data=cso.finding(sqlQuery)

        
        return respond(data)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()

        # dataAll["startAt"]=ctm.stringdatetodate(dataAll["startAt"],'%Y-%m-%dT%H:%M')
        # dataAll["endAt"]=ctm.stringdatetodate(dataAll["endAt"],'%Y-%m-%dT%H:%M')

        if("T" in dataAll['date']):
            dataAll["date"]=f"cnvrtCONVERT(DATETIME, '{dataAll['date'].split('T')[0]+' 00:00:00'}', 121)cnvrt"
        else:
            dataAll["date"]=f"cnvrtCONVERT(DATETIME, '{dataAll['date'].split(' ')[0]+' 00:00:00'}', 121)cnvrt"
        print(dataAll)
        # dsadsadasdad


        # dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt']}', 127)cnvrt"
        dataAll["createdBy"]=current_user['id']
        userData=cso.insertion("subscribersInfo",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
        return respond(userData)
        
    elif(request.method=="PUT"):
        dataAll=request.get_json()
        
        if("T" in dataAll['date']):
            dataAll["date"]=f"cnvrtCONVERT(DATETIME, '{dataAll['date'].split('T')[0]+' 00:00:00'}', 121)cnvrt"
        else:
            dataAll["date"]=f"cnvrtCONVERT(DATETIME, '{dataAll['date'].split(' ')[0]+' 00:00:00'}', 121)cnvrt"
        
        dataAll=del_itm(dataAll,["create_time","update_time","id","dbName"])

        

        print(dataAll)
        # print(dasdadaada)
        userData=cso.updating("subscribersInfo",{"id":uniqueId},dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        userData=cso.updating("subscribersInfo",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("subscribersInfo",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }
    