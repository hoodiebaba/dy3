from base import *

ison_blueprint = Blueprint('ison_blueprint', __name__)


   
   
@ison_blueprint.route('/isonForm',methods=['GET',"POST","PUT","PATCH","DELETE"])
@ison_blueprint.route('/isonForm/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def isonForm(current_user,uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):


        dataForm=[
            {
                "type": "select",
                "name": "Clear Old Plan of Specific User",
                "label": "Clear Old Plan of Specific User",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Delete existing Neighbours If Priority is Lower than Planned",
                "label": "Delete existing Neighbours If Priority is Lower than Planned",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Ignore Neighbours where Source & Target BCCHs are Same",
                "label": "Ignore Neighbours where Source & Target BCCHs are Same",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Ignore Neighbours where Source & Target BCCHs, NCC, BCC are Same",
                "label": "Ignore Neighbours where Source & Target BCCHs, NCC, BCC are Same",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Ignore Neighbours where Targets have same Frequency & Code",
                "label": "Ignore Neighbours where Targets have same Frequency & Code",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Ignore Neighbours where Source & Target have same UARFCN & PSCs",
                "label": "Ignore Neighbours where Source & Target have same UARFCN & PSCs",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Create 2G to 2G Neighhbours",
                "label": "Create 2G to 2G Neighhbours",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Create 2G to 3G Neighhbours",
                "label": "Create 2G to 3G Neighhbours",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Create 3G to 2G Neighhbours",
                "label": "Create 3G to 2G Neighhbours",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Create 3G to 3G Intra Neighhbours",
                "label": "Create 3G to 3G Intra Neighhbours",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "select",
                "name": "Create 3G to 3G Inter Neighhbours",
                "label": "Create 3G to 3G Inter Neighhbours",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "number",
                "name": "Neighbour Tier Level",
                "label": "Neighbour Tier Level",
                "defaultValue": 1
            },
            {
                "type": "select",
                "name": "Sector Used for Find Neighbour Distance",
                "label": "Sector Used for Find Neighbour Distance",
                "value":[
                    {
                        "label":"Left",
                        "value":"Left"
                    },
                    {
                        "label":"Centre",
                        "value":"Centre"
                    },
                    {
                        "label":"Right",
                        "value":"Right"
                    }
                ],
                "defaultValue": "Left"
            },
            {
                "type": "select",
                "name": "Pre Defined Table used for find Inter Neighbour Disatnce",
                "label": "Pre Defined Table used for find Inter Neighbour Disatnce",
                "value":[
                    {
                        "label":"YES",
                        "value":"YES"
                    },
                    {
                        "label":"NO",
                        "value":"NO"
                    }
                ],
                "defaultValue": "YES"
            },
            {
                "type": "number",
                "name": "Minimum Distance For Neighbours",
                "label": "Minimum Distance For Neighbours",
                "defaultValue": 10
            },
            {
                "type": "number",
                "name": "Maximum Distance For Neighbours",
                "label": "Maximum Distance For Neighbours",
                "defaultValue": 10
            },
            {
                "type": "number",
                "name": "Distance Factor For Neighbours with repsect to max distnce",
                "label": "Distance Factor For Neighbours with repsect to max distnce",
                "defaultValue": 1
            },
            {
                "type": "number",
                "name": "Maximum  Neighbours : 2G to 2G",
                "label": "Maximum  Neighbours : 2G to 2G",
                "defaultValue": 30
            },
            {
                "type": "number",
                "name": "Maximum  Neighbours : 2G to 3G",
                "label": "Maximum  Neighbours : 2G to 3G",
                "defaultValue": 30
            },
            {
                "type": "number",
                "name": "Maximum Neighbours: 3G to 2G",
                "label": "Maximum Neighbours: 3G to 2G",
                "defaultValue": 30
            },
            {
                "type": "number",
                "name": "Maximum Neighbours: 3G to 3G Intra",
                "label": "Maximum Neighbours: 3G to 3G Intra",
                "defaultValue": 30
            },
            {
                "type": "number",
                "name": "Maximum Neighbours: 3G to 3G Inter",
                "label": "Maximum Neighbours: 3G to 3G Inter",
                "defaultValue": 30
            }
        ]
        

        return {
            "state":1,
            "msg":"Form Get Successfully",
            "data":dataForm
        }
        # sqlQuery=f"SELECT subscribersInfo.* from subscribersInfo WHERE subscribersInfo.deleteStatus=0 AND subscribersInfo.createdBy='{current_user['id']}';"
        
        # return cso.finding(sqlQuery)
    

    elif(request.method=="POST"):
        dataAll={}
        print(request.form,request.files,"request.files")
        for i in request.form:
            dataAll[i]=request.form.get(i)

        uploadedFile=request.files.get("uploadedFile[]")
        print(dataAll)
        print(uploadedFile)
        status=cform.singleFileSaver(uploadedFile,"")
        print(status)
        if(status["status"]==422):
            return respond(status)
        
        procedureData=staticProcedure.isonProcedure(dataAll)
        print(procedureData)
        
        userData=cso.finding(procedureData)
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
    