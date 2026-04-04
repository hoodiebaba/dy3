

from base import *
from common.database import *

app = Flask(__name__)
# socketio=cfsocket.socket_init(app)
# socketio.init_app(app, cors_allowed_origins="*")

import logging
logging.basicConfig(level=logging.DEBUG)
app.logger.setLevel(logging.DEBUG)



from blueprint_routes.auth_blueprint import auth_blueprint as auth_blueprint
from blueprint_routes.querybuilder_blueprint import querybuilder_blueprint as querybuilder_blueprint
from blueprint_routes.powerBI_blueprint import powerBI_blueprint as powerBI_blueprint
from blueprint_routes.download_blueprint import download_blueprint as download_blueprint
from blueprint_routes.alertConfiguration_blueprint import alertConfiguration_blueprint as alertConfiguration_blueprint
from blueprint_routes.mtandaoComplaints_blueprint import mtandaoComplaints_blueprint as mtandaoComplaints_blueprint
from blueprint_routes.ison_blueprint import ison_blueprint as ison_blueprint
from blueprint_routes.testing_blueprint import testing_blueprint as testing_blueprint
from blueprint_routes.admin_blueprint import admin_blueprint as admin_blueprint
from blueprint_routes.nokiaprepost_blueprint import nokiaprepost_blueprint as nokiaprepost_blueprint
from blueprint_routes.socket_blueprint import socket_blueprint as socket_blueprint
from blueprint_routes.map_blueprint import map_blueprint as map_blueprint
from blueprint_routes.cxix_blueprint import cxix_blueprint as cxix_blueprint
from blueprint_routes.common_blueprint import common_blueprint as common_blueprint
from blueprint_routes.discussion_forum import discussion_forum
from blueprint_routes.ticket_management import ticket_management as ticket_management








app.config["SECRET_KEY"]=os.environ.get('SECRET_KEY')
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024
app.register_blueprint(auth_blueprint)
app.register_blueprint(querybuilder_blueprint)
app.register_blueprint(powerBI_blueprint)
app.register_blueprint(download_blueprint)
app.register_blueprint(alertConfiguration_blueprint)
app.register_blueprint(mtandaoComplaints_blueprint)
app.register_blueprint(ison_blueprint)
app.register_blueprint(testing_blueprint)
app.register_blueprint(admin_blueprint)
app.register_blueprint(nokiaprepost_blueprint)
app.register_blueprint(socket_blueprint)
app.register_blueprint(map_blueprint)
app.register_blueprint(cxix_blueprint)
app.register_blueprint(common_blueprint)
app.register_blueprint(discussion_forum, url_prefix='/discussions')
app.register_blueprint(ticket_management, url_prefix='/tickets')




@app.route('/',methods=['GET'])
def home():
    
    return "<h1>NMS Backend Server.https://prod.liveshare.vsengsaas.visualstudio.com/join?AD6DA48D75CC81E77D39D39DABC0B4D58C7D</h1>"

@app.route('/version',methods=['GET'])
def version():
    dsdadas
    # cmailer.sendmailnolog(["lalit.negi@fourbrick.com"],"Testing","Test")
    return "ver0.0.0" 





@app.route('/testdata',methods=['GET'])
def testdata():

    for i in range(100):
        print(i)
        dataAll={'date': "cnvrtCONVERT(DATETIME, '2024-01-07 00:00:00', 121)cnvrt", 'subscriberNo': '112211'+str(i), 'incidentNo': '112211'+str(i), 'remarks': 'Remarks'+str(i), 'status': 'Open'}
        # cso.insertion()

        userData=cso.insertion("subscribersInfo",total=dataAll,columns=list(dataAll.keys()),values=tuple(dataAll.values()))
    return "ver0.0.0" 


@app.errorhandler(Exception)
def handle_error(e):
    print("handle_error globally",e)
    api_name = request.endpoint
    print()
    # code = 500
    # if isinstance(e, HTTPException):
    #     code = e.code
    
    print(e)

    exception_type = type(e).__name__
    exception_message = str(e)
    final_msg="\n"
    
    final_msg+="*"*10+"start"+"*"*10
    final_msg+="\n"+str(f"An error occurred in API endpoint: {api_name},{str(request.headers)},{str(request.full_path)}, Error: {e}")
    # Get the line number where the exception occurred
    exc_type, exc_value, exc_traceback = sys.exc_info()
    line_number = exc_traceback.tb_lineno
    final_msg+="\n"+str(exc_traceback.tb_frame)+str(exc_traceback.tb_lasti)+str(exc_traceback.tb_lineno)+str(exc_traceback.tb_next)
    
    final_msg+="\n"+str("exception_type")+str(exception_type)+str("exception_message")+str(exception_message)+str("exc_type")+str(exc_type)+str("exc_value")+str(exc_value)+str("line_number")+str(line_number)
    
    
    final_msg+="\n"+"*"*10+"finish"+"*"*10
    f=open("fileErrorLog.txt","a+")
    f.write(str(final_msg))
    f.close()
    return jsonify(error=str(e)), 500

CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "*"}}
)
# dashboard.bind(app)



# socketio.run(app,host="0.0.0.0",port=8095,debug=True)
cfsocket.socketio.init_app(app, cors_allowed_origins="*")
cfsocket.socketio.run(app,port=8060,host="0.0.0.0", debug=True,allow_unsafe_werkzeug=True)


