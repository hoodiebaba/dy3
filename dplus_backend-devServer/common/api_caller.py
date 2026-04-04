from base import *

def getCall(url):
    data=requests.get(url=url)
    

    # Check if the request was successful (status code 200)
    if data.status_code == 200:
        # Print the JSON response
        
        final=data.json()
        final["status"]=200
        return final
    else:
        return {
            "status":data.status_code,
            "state":data.status_code,
            "msg":""
        }

    
    return requests.get(url)


def postCall(url,form):
    data=requests.post(url=url,data=form)
    
    return data.json()