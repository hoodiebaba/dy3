from base import *

testing_blueprint = Blueprint('testing_blueprint', __name__)


   
@testing_blueprint.route('/testing/sentTestMail',methods=['GET'])
def sentTestMail():

    try:
        cmailer.sendmail(to=[os.environ.get("TEST_MAIL")],subject="Hello",message="Test Mail")
        return "success"
    except Exception as e:
        print(e.args)
        return "e"
    

@testing_blueprint.route('/testing/socket',methods=['GET'])
def testingsocket():
    print(cfsocket.retrieve_socket(),"cfsocket")



@testing_blueprint.route('/testingApi',methods=['GET',"POST","PUT","PATCH","DELETE"])
@testing_blueprint.route('/testingApi/<uniqueId>',methods=['GET',"POST","PUT","PATCH","DELETE"])
def configureAlert(uniqueId=None):

    print(request.method,"request.method")
    if(request.method=="GET"):
        argu=request.args
        arew=apireq.argstostr(argu)
        # Cell_Name like '%_nw%' AND 
        #   WHERE T1.Site_Name LIKE '%15227%'
        sqlQuery = """SELECT TOP 1000 T1.Cell_name,T1.BAND,T1.Azimuth,T1.LATITUDE,T1.LONGITUDE,T1.Technology,T2.length,T2.orderRing,T2.beamWidth,T2.color FROM gid.Cell_GIS AS T1 INNER JOIN dbo.arc_setting_demo T2 on T1.Technology=T2.Technology AND T1.BAND=T2.BAND;""" 

        
        
        sql_conn_obj=sconf.sql_conn_obj()
        data=cso.findFromDifferentServer(sql_conn_obj,sqlQuery)["data"]
        allGrouped=data.groupby(['LATITUDE', 'LONGITUDE'])

        final_groups={}
        for i in allGrouped:
            final_groups[str(i[0][0])+"_"+str(i[0][1])]=cfc.dfjson(i[1])

        # final_groups = (data.groupby(['LATITUDE', 'LONGITUDE']).apply(lambda group: cfc.dfjson(group)).to_dict())

        # print(final_groups)
            

        # for i in final_groups:
        #     print(i)
            

        # print(allGrouped)

        


        # data.

        
        
        return {"data":final_groups}
    

    