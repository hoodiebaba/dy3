from base import *

powerBI_blueprint = Blueprint('powerBI_blueprint', __name__)


   
@powerBI_blueprint.route('/powerBI/tokenCreator',methods=['GET','POST'])
def pbitokenCreator():

    print(request.json)

    jsonData=request.json
    
    reportId=jsonData["reportId"]
    userData=tools_pbi.pbi_token_creator_outgoing()

    print(userData)

    if(userData["status"]!=200):
        return respond(userData)
    

    reportData=tools_pbi.pbi_token_embedded_token(access_token=userData["data"],reportId=reportId)

    return reportData


    
