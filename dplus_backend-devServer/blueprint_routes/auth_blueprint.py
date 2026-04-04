from base import *

auth_blueprint = Blueprint('auth_blueprint', __name__)


   
@auth_blueprint.route('/userList',methods=['GET'])
def userList():
    
    sqlQuery="SELECT Users.id AS value,CONCAT(firstname, ' ', lastname)  AS label,rolename FROM Users INNER JOIN userRole ON Users.roleId = userRole.id WHERE Users.deleteStatus=0;"
    
    return cso.finding(sqlQuery)
   
<<<<<<< HEAD
@auth_blueprint.route('/login',methods=['POST'])
def login():

=======
# @auth_blueprint.route('/login',methods=['POST'])
# def login():

#     body = request.get_json()
#     print(body)
#     sqlQuery=f"SELECT userRole.rolename,userRole.permission,Users.firstname,Users.lastname,Users.username,Users.password,Users.id,Users.roleId,Users.loginType FROM Users INNER JOIN userRole ON Users.roleId = userRole.id WHERE Users.username='{body['username']}' AND Users.deleteStatus=0;"
#     print(sqlQuery,"sqlQuery")

#     userData=cso.finding(sqlQuery)


#     print(userData)


#     # dsadsadasdsadas

#     # print(len(userData["data"]),userData["data"],userData["data"][0]["password"]==body['password'],"finnded_data")

#     if(len(userData["data"])>=1 and userData["data"][0]["password"]==body['password']):

#         userData["data"]=userData["data"][0]

#         print(userData)


#         uniqueid=userData["data"]["id"]
#         expisre=datetime.utcnow() + timedelta(days=7)
#         userData["data"]["expiresIn"]="36000" #10 Hour session expire 
#         expsire=ctm.u_timestamp(timedelta(days=7))
#         userData["data"]["expiresTimeStamp"]=expsire 
#         roleName=userData["data"]["rolename"]
#         print(userData,"userRole")
#         # cso.updating("users",{"id":uniqueid},{"isLogin":True,"expiresIn":"36000"})



#         token = jwt.encode({'uniqueid': uniqueid, 'exp' : expsire},key=os.environ.get("SECRET_KEY"),algorithm="HS512")  
#         # return jsonify({'token' : token.decode('UTF-8')})
#         if(type(token)!=type("str")):
#             userData["data"]["idToken"]=str(token.decode('UTF-8'))
#         else:
#             userData["data"]["idToken"]=str(token)
#         print(userData,token,"userRole")
#         response = make_response()
        
#         if(type(token)!=type("str")):
#             response.headers['Authorization'] = "Bearer "+str(token.decode('UTF-8'))
#         else:
#             response.headers['Authorization'] = "Bearer "+str(token)
            
#         sqlQuery=f"SELECT * from userConfig where createdBy='{uniqueid}';"
        
#         confdata=cso.finding(sqlQuery)["data"]
#         confdict={}
#         for i in confdata:
#             confdict[i["configName"]]=i["configValue"]
        
#         response.data = json.dumps(userData["data"])
#         print(response,"responseresponse")
#         # log_manager.response(response)

#         userData["data"]["confdata"]=confdict
#         userData["status"]=200
#         return respond(userData)

#     else:
#         userData["status"]=400
#         userData["msg"]="Please Use Valid Credentials"

#         return respond(userData)
    
ZAMMAD_URL = "http://192.168.0.100:8080"
ZAMMAD_TOKEN = "kuASbo1XzG0lkmFaCIVWfFHV_yKrFVuDZdLETNNxTlU7zwqh_aLWozbLRwh-KZoI"

import requests
def normalize_email(username):

    if "@" in username:
        return username
    else:
        return f"{username}@datayog.com"

def ensure_zammad_user(firstname, lastname, username):

    email = normalize_email(username)
    password = email

    headers = {
        "Authorization": f"Token token={ZAMMAD_TOKEN}",
        "Content-Type": "application/json"
    }

    # -------- check existing user --------
    search_url = f"{ZAMMAD_URL}/api/v1/users/search?query=email:{email}"

    r = requests.get(search_url, headers=headers)
    users = r.json()

    if len(users) > 0:
        user_id = users[0]["id"]

    else:

        payload = {
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "login": email,
            "password": password,
            "web": "",
            "phone": "",
            "fax": "",
            "mobile": "",
            "organization_id": "",
            "department": "",
            "note": "",
            "role_ids": [2,3],
            "group_ids": {},
            "active": True,
            "organization_ids": [],
            "address": "",
            "vip": False
        }

        r = requests.post(
            f"{ZAMMAD_URL}/api/v1/users",
            headers=headers,
            json=payload
        )

        data = r.json()
        # user_id = data["id"]

    # -------- login session create --------
    session = requests.Session()

    # Step 1: get csrf token
    # signshow = session.get(f"{ZAMMAD_URL}/api/v1/signshow")
    signshow = session.get(
            f"{ZAMMAD_URL}/api/v1/signshow",
            headers={
                "Origin": ZAMMAD_URL,
                "Referer": ZAMMAD_URL
            }
        )

    csrf_token = signshow.headers.get("X-CSRF-Token")

    # Step 2: login
    login_payload = {
        "username": email,
        "password": password
    }

    # session.post(
    #     f"{ZAMMAD_URL}/api/v1/signin",
    #     json=login_payload,
    #     headers={
    #         "X-CSRF-Token": csrf_token
    #     }
    # )
    session.post(
        f"{ZAMMAD_URL}/api/v1/signin",
        json=login_payload,
        headers={
            "X-CSRF-Token": csrf_token,
            "Origin": ZAMMAD_URL,
            "Referer": ZAMMAD_URL
        }
    )

    cookies = session.cookies.get_dict()

    return {
        "cookies": cookies
    }


@auth_blueprint.route('/login',methods=['POST'])
def login():
 
>>>>>>> prodServer
    body = request.get_json()
    print(body)
    sqlQuery=f"SELECT userRole.rolename,userRole.permission,Users.firstname,Users.lastname,Users.username,Users.password,Users.id,Users.roleId,Users.loginType FROM Users INNER JOIN userRole ON Users.roleId = userRole.id WHERE Users.username='{body['username']}' AND Users.deleteStatus=0;"
    print(sqlQuery,"sqlQuery")
<<<<<<< HEAD

    userData=cso.finding(sqlQuery)


    print(userData)


    # dsadsadasdsadas

    # print(len(userData["data"]),userData["data"],userData["data"][0]["password"]==body['password'],"finnded_data")

    if(len(userData["data"])>=1 and userData["data"][0]["password"]==body['password']):

        userData["data"]=userData["data"][0]

        print(userData)


        uniqueid=userData["data"]["id"]
        expisre=datetime.utcnow() + timedelta(days=7)
        userData["data"]["expiresIn"]="36000" #10 Hour session expire 
        expsire=ctm.u_timestamp(timedelta(days=7))
        userData["data"]["expiresTimeStamp"]=expsire 
        roleName=userData["data"]["rolename"]
        print(userData,"userRole")
        # cso.updating("users",{"id":uniqueid},{"isLogin":True,"expiresIn":"36000"})



=======
 
    userData=cso.finding(sqlQuery)
 
 
    print(userData)
 
 
    # dsadsadasdsadas
 
    # print(len(userData["data"]),userData["data"],userData["data"][0]["password"]==body['password'],"finnded_data")
 
    if(len(userData["data"])>=1 and userData["data"][0]["password"]==body['password']):
 
        userData["data"]=userData["data"][0]
 
        print(userData)
 
 
        uniqueid=userData["data"]["id"]
        expisre=datetime.utcnow() + timedelta(days=7)
        userData["data"]["expiresIn"]="36000" #10 Hour session expire
        expsire=ctm.u_timestamp(timedelta(days=7))
        userData["data"]["expiresTimeStamp"]=expsire
        roleName=userData["data"]["rolename"]
        print(userData,"userRole")
        # cso.updating("users",{"id":uniqueid},{"isLogin":True,"expiresIn":"36000"})
 
 
 
>>>>>>> prodServer
        token = jwt.encode({'uniqueid': uniqueid, 'exp' : expsire},key=os.environ.get("SECRET_KEY"),algorithm="HS512")  
        # return jsonify({'token' : token.decode('UTF-8')})
        if(type(token)!=type("str")):
            userData["data"]["idToken"]=str(token.decode('UTF-8'))
        else:
            userData["data"]["idToken"]=str(token)
        print(userData,token,"userRole")
        response = make_response()
<<<<<<< HEAD
        
=======
       
>>>>>>> prodServer
        if(type(token)!=type("str")):
            response.headers['Authorization'] = "Bearer "+str(token.decode('UTF-8'))
        else:
            response.headers['Authorization'] = "Bearer "+str(token)
<<<<<<< HEAD
            
        sqlQuery=f"SELECT * from userConfig where createdBy='{uniqueid}';"
        
=======
           
        sqlQuery=f"SELECT * from userConfig where createdBy='{uniqueid}';"
       
>>>>>>> prodServer
        confdata=cso.finding(sqlQuery)["data"]
        confdict={}
        for i in confdata:
            confdict[i["configName"]]=i["configValue"]
<<<<<<< HEAD
        
        response.data = json.dumps(userData["data"])
        print(response,"responseresponse")
        # log_manager.response(response)

        userData["data"]["confdata"]=confdict
        userData["status"]=200
        return respond(userData)

    else:
        userData["status"]=400
        userData["msg"]="Please Use Valid Credentials"

        return respond(userData)
    

=======
       
        response.data = json.dumps(userData["data"])
        print(response,"responseresponse")
        # log_manager.response(response)
 
        userData["data"]["confdata"]=confdict
        
        zammad_data = ensure_zammad_user(
            userData["data"]["firstname"],
            userData["data"]["lastname"],
            userData["data"]["username"]
            # "support@datayog.com"
        )

        z_cookies = zammad_data["cookies"]

        # browser me cookie set karo
        for key, value in z_cookies.items():
            response.set_cookie(
                key,
                value,
                httponly=True,
                samesite="None",
                secure=False,
                domain="192.168.0.102",
                path="/"
            )

        userData["data"]["zammad_session"] = z_cookies

        response.data = json.dumps(userData["data"])

        return response
 
    else:
        userData["status"]=400
        userData["msg"]="Please Use Valid Credentials"
 
        return respond(userData)
   
>>>>>>> prodServer
# @auth_blueprint.route('/get_my_conf',methods=['GET'])
# @token_required
def get_user_all_details(current_user):

    # sqlQuery=f"SELECT userRole.rolename,userRole.permission,Users.firstname,Users.lastname,Users.username,Users.password,Users.id,Users.roleId,Users.loginType FROM Users INNER JOIN userRole ON Users.roleId = userRole.id WHERE Users.id='{current_user['id']}' AND Users.deleteStatus=0;"
    # print(current_user,"sqlQuery")
    

    # userData=cso.finding(sqlQuery)


    # print(userData)
    
    
    sqlQuery=f"SELECT * from userConfig where createdBy='{current_user['id']}';"
    
    confdata=cso.finding(sqlQuery)["data"]
    
    print(confdata)
    confdict={}
    for i in confdata:
        confdict[i["configName"]]=i["configValue"]
    
    return confdict


    # dsadsadsads


    # dsadsadasdsadas

    # print(len(userData["data"]),userData["data"],userData["data"][0]["password"]==body['password'],"finnded_data")

    # if(len(userData["data"])>=1 and userData["data"][0]["password"]==body['password']):

    #     userData["data"]=userData["data"][0]

    #     print(userData)


    #     uniqueid=userData["data"]["id"]
    #     expisre=datetime.utcnow() + timedelta(days=7)
    #     userData["data"]["expiresIn"]="36000" #10 Hour session expire 
    #     expsire=ctm.u_timestamp(timedelta(days=7))
    #     userData["data"]["expiresTimeStamp"]=expsire 
    #     roleName=userData["data"]["rolename"]
    #     print(userData,"userRole")
    #     # cso.updating("users",{"id":uniqueid},{"isLogin":True,"expiresIn":"36000"})



    #     token = jwt.encode({'uniqueid': uniqueid, 'exp' : expsire},key=os.environ.get("SECRET_KEY"),algorithm="HS512")  
    #     # return jsonify({'token' : token.decode('UTF-8')})
    #     if(type(token)!=type("str")):
    #         userData["data"]["idToken"]=str(token.decode('UTF-8'))
    #     else:
    #         userData["data"]["idToken"]=str(token)
    #     print(userData,token,"userRole")
    #     response = make_response()
        
    #     if(type(token)!=type("str")):
    #         response.headers['Authorization'] = "Bearer "+str(token.decode('UTF-8'))
    #     else:
    #         response.headers['Authorization'] = "Bearer "+str(token)
            
    #     sqlQuery=f"SELECT * from userConfig where createdBy='{uniqueid}';"
        
    #     confdata=cso.finding(sqlQuery)["data"]
    #     confdict={}
    #     for i in confdata:
    #         confdict[i["configName"]]=i["configValue"]
        
    #     response.data = json.dumps(userData["data"])
    #     print(response,"responseresponse")
    #     # log_manager.response(response)

    #     userData["data"]["confdata"]=confdict
    #     userData["status"]=200
    #     return respond(userData)

    # else:
    #     userData["status"]=400
    #     userData["msg"]="Please Use Valid Credentials"

    #     return respond(userData)
    
@auth_blueprint.route('/setupConf',methods=['GET',"POST","PUT","PATCH","DELETE"])
@token_required
def setupConf(current_user,uniqueId=None):
<<<<<<< HEAD

=======
    if request.method == "GET":

        olddata = cso.finding(
            f"select * from userConfig where createdBy='{current_user['id']}'"
        )

        finD = {}

        for i in olddata["data"]:
            finD[i["configName"]] = i["configValue"]

        olddata["data"] = finD

        return respond(olddata)
        
>>>>>>> prodServer
    if(request.method=="POST"):
        dataAll=request.get_json()
        
        # print(dataAll,"dataAll")
        
        for i in dataAll:
            
            # print(i)
            
            
            
            print(f"select * from userConfig where configName='{i}' AND createdBy='{current_user['id']}'")
            olddata=cso.finding(f"select * from userConfig where configName='{i}' AND createdBy='{current_user['id']}'")["data"]
            
            print(olddata,"olddataolddataolddata")
            
            if(len(olddata)>0):
                dataA={
                    "configValue":dataAll[i],
                    "createdBy":current_user['id'],
                }
                
                # print("userConfig",{"id":olddata[0]['id']},dataA)
                # dasdsadsadssd
                userData=cso.updating("userConfig",{"id":olddata[0]['id']},dataA)
                
                # return respond(userData)
                # print("update")
            else:
                dataA={
                    "configName":i,
                    "configValue":dataAll[i],
                    "createdBy":current_user['id'],
                    
                }
                # print(dataA,"dataAdataA")
                
                # dasdasdasdas
                userData=cso.insertion("userConfig",total=dataA,columns=list(dataA.keys()),values=tuple(dataA.values()))
                
               
                # print("insert")
            
        # print(olddata)
        
        olddata=cso.finding(f"select * from userConfig where createdBy='{current_user['id']}'")
        
        finD={}
        for i in olddata["data"]:
            print(i)
            finD[i["configName"]]=i["configValue"]
        
        
        olddata["data"]=finD
        
        return respond(olddata)
    
        
        
        

        # # dataAll["endAt"]=f"cnvrtCONVERT(DATETIME, '{dataAll['endAt']}', 127)cnvrt"
        # dataAll["createdBy"]=current_user['id']
        
        # print(dataAll)
        
        # userData=cso.insertion("userConfig",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
        # return respond(userData)


   