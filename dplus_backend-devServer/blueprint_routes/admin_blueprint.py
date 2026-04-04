from base import *

admin_blueprint = Blueprint('admin_blueprint', __name__)


   
   
@admin_blueprint.route('/admin/roles',methods=['GET',"POST","PUT","PATCH","DELETE"])
@admin_blueprint.route('/admin/roles/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def admin_roles(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):


        argu=request.args
        arew=apireq.argstostr(argu)
            
        # sqlQuery=f"SELECT dbConfig.dbName,alertConfigInstant.* from alertConfigInstant JOIN dbConfig ON dbConfig.id=alertConfigInstant.dbServer WHERE alertConfigInstant.deleteStatus=0 AND alertConfigInstant.createdBy='{current_user['id']}';"
        sqlQuery=f"SELECT id as value,rolename as label,permission FROM userRole;"
        
        return cso.finding(sqlQuery)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()

        # dataAll["startAt"]=ctm.stringdatetodate(dataAll["startAt"],'%Y-%m-%dT%H:%M')
        # dataAll["endAt"]=ctm.stringdatetodate(dataAll["endAt"],'%Y-%m-%dT%H:%M')

        print(dataAll)
        # dsadsadasdad

        print(dataAll,"dataAlldataAlldataAll")

        # dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt']}', 127)cnvrt"
        dataAll["createdBy"]=current_user['id']
        userData=cso.insertion("userRole",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
        return respond(userData)
        
    elif(request.method=="PUT"):
        dataAll=request.get_json()
        
        
        # print(dasdadaada)

        dataAll=del_itm(dataAll,["label","value"])
        userData=cso.updating("userRole",{"id":uniqueId},dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        userData=cso.updating("userRole",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("userRole",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }
   


@admin_blueprint.route('/admin/users',methods=['GET',"POST","PUT","PATCH","DELETE"])
@admin_blueprint.route('/admin/users/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def admin_users(current_user,uniqueId=None):
    
    if(request.method=="GET"):


        argu=request.args
        arew=apireq.argstostr(argu)
            
        # sqlQuery=f"SELECT dbConfig.dbName,alertConfigInstant.* from alertConfigInstant JOIN dbConfig ON dbConfig.id=alertConfigInstant.dbServer WHERE alertConfigInstant.deleteStatus=0 AND alertConfigInstant.createdBy='{current_user['id']}';"
        sqlQuery=f"SELECT users.*,userRole.rolename FROM users INNER JOIN userRole ON users.roleId=userRole.id {' WHERE '+arew['que'] if arew['que']!='' else ''} ORDER BY sid OFFSET {arew['def_start']} ROWS FETCH NEXT {arew['def_end']} ROWS ONLY;;"
        
        return cso.finding(sqlQuery)
    

    elif(request.method=="POST"):
        dataAll=request.get_json()

        print(dataAll,"dataAlldataAlldataAll")

        # dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt']}', 127)cnvrt"
        # dataAll["createdBy"]=current_user['id']
        userData=cso.insertion("users",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
        return respond(userData)
        
    elif(request.method=="PUT"):
        dataAll=request.get_json()

        if(dataAll["password"]=="********"):
            del dataAll["password"]

        

        dataAll=del_itm(dataAll,["create_time","update_time","id","rolename"])

        print(dataAll,"dataAlldataAlldataAll")

        
        # print(dasdadaada)
        userData=cso.updating("users",{"id":uniqueId},dataAll)
        return respond(userData)
    
    elif(request.method=="PATCH"):
        dataAll=request.get_json()
        print(dataAll,"dataAlldataAlldataAll")
        userData=cso.updating("users",{"id":uniqueId},dataAll)
        return respond(userData)
        
    
    elif(request.method=="DELETE"):

        print(uniqueId)

        cso.updating("users",{"id":uniqueId},{"deleteStatus":1})
        return {
            
        }
   