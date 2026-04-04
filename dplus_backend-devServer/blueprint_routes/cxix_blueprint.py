from base import *

cxix_blueprint = Blueprint('cxix_blueprint', __name__)

def call_api_to_tool(url,current_user):
    print("baseUrr")
    baseUrr=os.environ.get("CX_IX_TOOL_BASE_URL")
    print("baseUrr")
    # baseUrr="http://127.0.0.1:8000"
    return capicall.getCall(f"{baseUrr}{url}?rolename={current_user['rolename']}&userId={current_user['id']}&nameuser={current_user['username']}")

def call_api_to_tool_post(url,form,current_user):
    print("baseUrr")
    baseUrr=os.environ.get("CX_IX_TOOL_BASE_URL")
    # baseUrr="http://127.0.0.1:8000"
    print("baseUrr")
    form["rolename"]=current_user["rolename"]
    form["userId"]=current_user["id"]
    form["nameuser"]=current_user["username"]
    return capicall.postCall(baseUrr+url,form)

dataForm=[
    {
        "name":"AT&T",
        "companyimg":"asset/at&t.png",
        "color":"bg-blue-100",
        "uid":"1c30f079-1d38-4e76-a17f-f3bbbdb6dbe5",
        "subList":[
            {
                "name":"Ericsson",
                "":"all",
                "companyimg":"asset/ericsson.png",
                "color":"bg-sky-200",
                "uid":"09449caa-a360-4c8c-9327-d38e6f31542a",
                "toollink":"/ATT/script",
                "tooldata":"/ATT/scriptlist"
            },
            # {
            #     "name":"Nokia",
            #     "":"all",
            #     "companyimg":"asset/nokia.svg",
            #     "color":"bg-sky-100",
            #     "uid":"4dcd4e81-baf8-4cc6-8c31-723a331cd35f",
            #     "toollink":"/ATT/script",
            #     "tooldata":"/ATT/scriptlist"
            # },
            # {
            #     "name":"Samsung",
            #     "":"all",
            #     "companyimg":"asset/samsung.png",
            #     "color":"bg-blue-100",
            #     "uid":"2b2141ff-8a4c-4a5c-b644-00075019e249",
            #     "toollink":"/ATT/script",
            #     "tooldata":"/ATT/scriptlist"
            # },
            # {
            #     "name":"Huawei",
            #     "":"all",
            #     "companyimg":"asset/huawei.png",
            #     "color":"bg-red-100",
            #     "uid":"9d28a149-a4df-4323-b357-b337c0f684bf"
            # },
            # {
            #     "name":"ZTE",
            #     "":"all",
            #     "companyimg":"asset/zte.png",
            #     "color":"bg-cyan-100",
            #     "uid":"4094fa3d-50de-4ffb-a4f0-3a6275d3cef5"
            # }
        ]
    },
    {
        "name":"T-Mobile",
        "companyimg":"asset/T-Mobile-Logo.png",
        "color":"bg-pink-100",
        "uid":"f18aeef1-a746-4c9a-ae50-528f2e157b93",
        "subList":[
            
            {
                "name":"Ericsson",
                "":"all",
                "companyimg":"asset/ericsson.png",
                "color":"bg-sky-200",
                "uid":"f56b1463-0288-4e0c-8752-88cfb4dfc553",
                "toollink":"/TMobile/script",
                "tooldata":"/TMobile/sitelist"
            },
            # {
            #     "name":"Nokia",
            #     "":"all",
            #     "companyimg":"asset/nokia.svg",
            #     "color":"bg-sky-100",
            #     "uid":"4b4f5195-53e4-4253-b0ec-5df542999982",
            #     "toollink":"/TMobile/script",
            #     "tooldata":"/TMobile/scriptlist"
            # },
            # {
            #     "name":"Samsung",
            #     "":"all",
            #     "companyimg":"asset/samsung.png",
            #     "color":"bg-blue-100",
            #     "uid":"3434bea1-544e-4826-9c0e-dd5aeda219ad",
            #     "toollink":"/TMobile/script",
            #     "tooldata":"/TMobile/scriptlist"
            # },
            # {
            #     "name":"Huawei",
            #     "":"all",
            #     "companyimg":"asset/huawei.png",
            #     "color":"bg-red-100",
            #     "uid":"c085297f-32f2-42ed-b138-31f2fdcf52fe"
            # },
            # {
            #     "name":"ZTE",
            #     "":"all",
            #     "companyimg":"asset/zte.png",
            #     "color":"bg-cyan-100",
            #     "uid":"ba549dcd-8893-4f1e-ab22-b28ec8abc7d5"
            # }
        ]
    },
    {
        "name":"SafariComm",
        "companyimg":"asset/safaricomm.png",
        "color":"bg-green-100",
        "uid":"a9ce8a93-9fd7-492c-93cd-462036f800f8",
        "subList":[
            {
                "name":"Nokia",
                "":"all",
                "companyimg":"asset/nokia.svg",
                "color":"bg-sky-100",
                "uid":"204261f7-3f88-4efe-83f2-406f4e034881"
            },
            # {
            #     "name":"Huawei",
            #     "":"all",
            #     "companyimg":"asset/huawei.png",
            #     "color":"bg-red-100",
            #     "uid":"76127d2a-a5c0-475c-b282-4a68a09bb64b"
            # },
            # {
            #     "name":"Ericsson",
            #     "":"all",
            #     "companyimg":"asset/ericsson.png",
            #     "color":"bg-sky-200",
            #     "uid":"955f6a7f-47c8-484e-87ca-17169fbb8748"
            # },
            # {
            #     "name":"Samsung",
            #     "":"all",
            #     "companyimg":"asset/samsung.png",
            #     "color":"bg-blue-100",
            #     "uid":"f05fc44a-cf42-481d-970b-32c53c48dbe7"
            # },
            # {
            #     "name":"ZTE",
            #     "":"all",
            #     "companyimg":"asset/zte.png",
            #     "color":"bg-cyan-100",
            #     "uid":"1f71f563-1c11-4d6f-9ac3-b52424b7f1f9"
            # }
        ]
    }
]


gsauditdataForm=[
    {
        "name":"AT&T",
        "companyimg":"asset/at&t.png",
        "color":"bg-blue-100",
        "uid":"1c30f079-1d38-4e76-a17f-f3bbbdb6dbe5",
        "subList":[
            {
                "name":"Ericsson",
                "":"all",
                "companyimg":"asset/ericsson.png",
                "color":"bg-sky-200",
                "uid":"09449caa-a360-4c8c-9327-d38e6f31542a",
                "toollink":"/ATTS/GSAudit",
                "tooldata":"/ATTS/GSAuditList"
            },
            # {
            #     "name":"Nokia",
            #     "":"all",
            #     "companyimg":"asset/nokia.svg",
            #     "color":"bg-sky-100",
            #     "uid":"4dcd4e81-baf8-4cc6-8c31-723a331cd35f",
            #     "toollink":"/ATT/script",
            #     "tooldata":"/ATT/scriptlist"
            # },
            # {
            #     "name":"Samsung",
            #     "":"all",
            #     "companyimg":"asset/samsung.png",
            #     "color":"bg-blue-100",
            #     "uid":"2b2141ff-8a4c-4a5c-b644-00075019e249",
            #     "toollink":"/ATT/script",
            #     "tooldata":"/ATT/scriptlist"
            # },
            # {
            #     "name":"Huawei",
            #     "":"all",
            #     "companyimg":"asset/huawei.png",
            #     "color":"bg-red-100",
            #     "uid":"9d28a149-a4df-4323-b357-b337c0f684bf"
            # },
            # {
            #     "name":"ZTE",
            #     "":"all",
            #     "companyimg":"asset/zte.png",
            #     "color":"bg-cyan-100",
            #     "uid":"4094fa3d-50de-4ffb-a4f0-3a6275d3cef5"
            # }
        ]
    },
    # {
    #     "name":"T-Mobile",
    #     "companyimg":"asset/T-Mobile-Logo.png",
    #     "color":"bg-pink-100",
    #     "uid":"f18aeef1-a746-4c9a-ae50-528f2e157b93",
    #     "subList":[
            
    #         {
    #             "name":"Ericsson",
    #             "":"all",
    #             "companyimg":"asset/ericsson.png",
    #             "color":"bg-sky-200",
    #             "uid":"f56b1463-0288-4e0c-8752-88cfb4dfc553",
    #             "toollink":"/TMobile/script",
    #             "tooldata":"/TMobile/sitelist"
    #         },
    #         # {
    #         #     "name":"Nokia",
    #         #     "":"all",
    #         #     "companyimg":"asset/nokia.svg",
    #         #     "color":"bg-sky-100",
    #         #     "uid":"4b4f5195-53e4-4253-b0ec-5df542999982",
    #         #     "toollink":"/TMobile/script",
    #         #     "tooldata":"/TMobile/scriptlist"
    #         # },
    #         # {
    #         #     "name":"Samsung",
    #         #     "":"all",
    #         #     "companyimg":"asset/samsung.png",
    #         #     "color":"bg-blue-100",
    #         #     "uid":"3434bea1-544e-4826-9c0e-dd5aeda219ad",
    #         #     "toollink":"/TMobile/script",
    #         #     "tooldata":"/TMobile/scriptlist"
    #         # },
    #         # {
    #         #     "name":"Huawei",
    #         #     "":"all",
    #         #     "companyimg":"asset/huawei.png",
    #         #     "color":"bg-red-100",
    #         #     "uid":"c085297f-32f2-42ed-b138-31f2fdcf52fe"
    #         # },
    #         # {
    #         #     "name":"ZTE",
    #         #     "":"all",
    #         #     "companyimg":"asset/zte.png",
    #         #     "color":"bg-cyan-100",
    #         #     "uid":"ba549dcd-8893-4f1e-ab22-b28ec8abc7d5"
    #         # }
    #     ]
    # },
    # {
    #     "name":"SafariComm",
    #     "companyimg":"asset/safaricomm.png",
    #     "color":"bg-green-100",
    #     "uid":"a9ce8a93-9fd7-492c-93cd-462036f800f8",
    #     "subList":[
    #         {
    #             "name":"Nokia",
    #             "":"all",
    #             "companyimg":"asset/nokia.svg",
    #             "color":"bg-sky-100",
    #             "uid":"204261f7-3f88-4efe-83f2-406f4e034881"
    #         },
    #         # {
    #         #     "name":"Huawei",
    #         #     "":"all",
    #         #     "companyimg":"asset/huawei.png",
    #         #     "color":"bg-red-100",
    #         #     "uid":"76127d2a-a5c0-475c-b282-4a68a09bb64b"
    #         # },
    #         # {
    #         #     "name":"Ericsson",
    #         #     "":"all",
    #         #     "companyimg":"asset/ericsson.png",
    #         #     "color":"bg-sky-200",
    #         #     "uid":"955f6a7f-47c8-484e-87ca-17169fbb8748"
    #         # },
    #         # {
    #         #     "name":"Samsung",
    #         #     "":"all",
    #         #     "companyimg":"asset/samsung.png",
    #         #     "color":"bg-blue-100",
    #         #     "uid":"f05fc44a-cf42-481d-970b-32c53c48dbe7"
    #         # },
    #         # {
    #         #     "name":"ZTE",
    #         #     "":"all",
    #         #     "companyimg":"asset/zte.png",
    #         #     "color":"bg-cyan-100",
    #         #     "uid":"1f71f563-1c11-4d6f-9ac3-b52424b7f1f9"
    #         # }
    #     ]
    # }
]
   
@cxix_blueprint.route('/cxix_scripting',methods=['GET',"POST","PUT","PATCH","DELETE"])
@cxix_blueprint.route('/cxix_scripting/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
# @token_required
# def cxix_scripting(current_user,uniqueId=None):
def cxix_scripting(uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):

        

        return {
            "state":1,
            "msg":"Form Get Successfully",
            "data":dataForm
        }
        # sqlQuery=f"SELECT subscribersInfo.* from subscribersInfo WHERE subscribersInfo.deleteStatus=0 AND subscribersInfo.createdBy='{current_user['id']}';"
        
        # return cso.finding(sqlQuery)
        
        
        
@cxix_blueprint.route('/cxix_audit',methods=['GET',"POST","PUT","PATCH","DELETE"])
@cxix_blueprint.route('/cxix_audit/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
# @token_required
# def cxix_scripting(current_user,uniqueId=None):
def cxix_audit(uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):

        

        return {
            "state":1,
            "msg":"Form Get Successfully",
            "data":gsauditdataForm
        }
        # sqlQuery=f"SELECT subscribersInfo.* from subscribersInfo WHERE subscribersInfo.deleteStatus=0 AND subscribersInfo.createdBy='{current_user['id']}';"
        
        # return cso.finding(sqlQuery)
    
    
@cxix_blueprint.route('/cxix_scripting_form',methods=['GET',"POST","PUT","PATCH","DELETE"])
@cxix_blueprint.route('/cxix_scripting_form/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
# def cxix_scripting(current_user,uniqueId=None):
def cxix_scripting_form(current_user,uniqueId=None):

    print(request.method,uniqueId,"request.method")
    
    
    credew={}
    for onedata in dataForm:
        for dew in onedata["subList"]:
            if(dew["uid"]==uniqueId):
                print(dew,"dewdewdew")
                credew=dew
    if(request.method=="GET"):
        return call_api_to_tool(credew["toollink"],current_user)
        
    if(request.method=="POST"):
        data={}
        print("184")  
        for i in request.form:
            data[i]=request.form.get(i)
        print("186")  
        
        DCGKPath=None
        
        if "DCGKFile[]" in request.files:
                
            DCGKFile=request.files.get("DCGKFile[]")
            DCGKstatus=cform.singleFileSaver(DCGKFile,"",["zip"])
            print("189")
            if(DCGKstatus["status"]==422):
                return respond(DCGKstatus)
            print("192")
        
        CIQFile=request.files.get("CIQFile[]")
        CIQstatus=cform.singleFileSaver(CIQFile,"",["xlsx"])
        print("195")
        if(CIQstatus["status"]==422):
            return respond(CIQstatus)
        print("198")
        print(CIQstatus["msg"])
        data["dbupdate_file"]=CIQstatus["msg"]
        data["dbupdate_file"]=CIQstatus["msg"]
        data["username"]="testdatayog"
        data["userrole"]="testdatayog"
        data["cixsavePath"]="cxixLogs"
        data["cixlogPath"]=os.path.join(os.getcwd(),"cxixLogs")
        data["DCGKPath"]=DCGKPath
        data["CIQFilePath"]=CIQstatus["msg"]
    
        
        
        return call_api_to_tool_post(credew["toollink"],data,current_user)
        return call_api_to_tool_post("/ATT/script",data,current_user)
        return {
            "state":1,
            "msg":"Form Get Successfully",
            "data":dataForm
        }
        # sqlQuery=f"SELECT subscribersInfo.* from subscribersInfo WHERE subscribersInfo.deleteStatus=0 AND subscribersInfo.createdBy='{current_user['id']}';"
        
        # return cso.finding(sqlQuery)
        
        

        
        

@cxix_blueprint.route('/cxix_audit_form',methods=['GET',"POST","PUT","PATCH","DELETE"])
@cxix_blueprint.route('/cxix_audit_form/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
# def cxix_scripting(current_user,uniqueId=None):
def cxix_audit_form(current_user,uniqueId=None):
    
    credew={}
    for onedata in gsauditdataForm:
        for dew in onedata["subList"]:
            if(dew["uid"]==uniqueId):
                print(dew,"dewdewdew")
                credew=dew
    print(request.method,uniqueId,"request.method")
    if(request.method=="GET"):
        return call_api_to_tool(credew["toollink"],current_user)
        
    if(request.method=="POST"):
        data={}
        print("184")  
        for i in request.form:
            data[i]=request.form.get(i)
        print("186")  
        DCGKFile=request.files.get("DCGKFile[]")
        DCGKstatus=cform.singleFileSaver(DCGKFile,"",["zip"])
        print("189")
        if(DCGKstatus["status"]==422):
            return respond(DCGKstatus)
        print("192")
        data["username"]="testdatayog"
        data["userrole"]="testdatayog"
        data["cixsavePath"]="cxixLogs"
        data["cixlogPath"]=os.path.join(os.getcwd(),"cxixLogs")
        data["software_log"]=DCGKstatus["msg"]
        
    
        
        
        return call_api_to_tool_post(credew["toollink"],data,current_user)
        return {
            "state":1,
            "msg":"Form Get Successfully",
            "data":dataForm
        }
        # sqlQuery=f"SELECT subscribersInfo.* from subscribersInfo WHERE subscribersInfo.deleteStatus=0 AND subscribersInfo.createdBy='{current_user['id']}';"
        
        # return cso.finding(sqlQuery)
    

@cxix_blueprint.route('/cxix_scripting/getdata/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
# def cxix_scripting(current_user,uniqueId=None):
def cxix_scripting_getdata(current_user,uniqueId):
    
    print(current_user["rolename"],"current_usercurrent_usercurrent_user")
    # sadsdadsadsa
    if(request.method=="GET"):
        for onedata in dataForm:
            print(onedata)
            for dew in onedata["subList"]:
                if(dew["uid"]==uniqueId):
                    final=call_api_to_tool(dew["tooldata"],current_user)
                    print(final,"onedatadewdewdew")
                    final["name"]=onedata["name"]+" / "+dew["name"]
                    return respond(final)
    return ""
    
@cxix_blueprint.route('/cxix_audit/getdata/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
# def cxix_scripting(current_user,uniqueId=None):
def cxix_audit_getdata(current_user,uniqueId):
    
    if(request.method=="GET"):
        for onedata in gsauditdataForm:
            print(onedata)
            for dew in onedata["subList"]:
                if(dew["uid"]==uniqueId):
                    final=call_api_to_tool(dew["tooldata"],current_user)
                    print(final,"onedatadewdewdew")
                    final["name"]=onedata["name"]+" / "+dew["name"]
                    return respond(final)
    return ""
    

@cxix_blueprint.route('/cxix_scripting/dbUpdate',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
# def cxix_scripting(current_user,uniqueId=None):
def cxix_scripting_dbUpdate(current_user):
    if(request.method=="GET"):
        
        return call_api_to_tool("/dbupdatelist",current_user)
    
    
    if(request.method=="POST"):
        
        print(request.form)
        
        data={
            
        }
        for i in request.form:
            data[i]=request.form.get(i)
        
        uploadedFile=request.files.get("uploadedFile[]")
        status=cform.singleFileSaver(uploadedFile,"",["xlsx"])

        if(status["status"]==422):
            return respond(status)
        
        print(status["msg"])
        data["dbupdate_file"]=status["msg"]
        data["username"]="testdatayog"
        data["savePath"]="cxixLogs"
        data["logPath"]=os.path.join(os.getcwd(),"cxixLogs")
    
        
        
        return call_api_to_tool_post("/dbupdate",data,current_user)