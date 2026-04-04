from base import *
def pbi_token_creator_outgoing():

    
    url=os.environ.get("POWERBI_LOGIN_URL")
    payload = f'grant_type=password&client_id={os.environ.get("POWERBI_CLIENT_ID")}&client_secret={os.environ.get("POWERBI_CLIENT_SECRET")}&username={os.environ.get("POWERBI_USERNAME")}&password={os.environ.get("POWERBI_PASSWORD")}&resource=https://analysis.windows.net/powerbi/api&scope=openid'

    print(url)
    print(payload)



    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }


    
    response = requests.post(url, headers=headers, data=payload)
    userData={}
    if(response.status_code==200):
        userData={
            "status":200,
            "state":2,
            "data":response.json()["access_token"],
            "msg":"Access Token"
        }
    else:
        userData={
            "status":400,
            "state":2,
            "data":[],
            "msg":"Unauthorized Access"
        }
        
    return userData



def pbi_token_embedded_token(access_token,reportId):

    
    url=f"https://api.powerbi.com/v1.0/myorg/reports/{reportId}"
    
    
    headers = {
        'Authorization': f"Bearer {access_token}",  
        'Content-Type': 'application/json',
    }


    # print(url)

    response = requests.request("GET", url, headers=headers)

    print(response.json())


    userData={}
    if(response.status_code==200):
        data=response.json()

        
        userData={
            "status":200,
            "state":2,
            "data":{
                "type": "report",
                "id":data["id"],
                "embedUrl":data["embedUrl"],
                "accessToken":access_token
            },
            "msg":"Access Token",
            "access_tokenn":f"{access_token}"
        }
    else:
        userData={
            "status":400,
            "state":2,
            "data":[],
            "msg":"Unauthorized Access"
        }
        
    return userData