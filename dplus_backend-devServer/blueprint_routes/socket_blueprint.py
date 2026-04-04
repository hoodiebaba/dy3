from base import *

socket_blueprint = Blueprint('socket_blueprint', __name__)


socket=cfsocket.socketio

# print(socket,"socketsocket")


# @socket.on("connect")
# def connected():
#     """event listener when client connects to the server"""
#     print(request.sid)
#     print("client has connected")
#     emit("connect",{"data":f"id: {request.sid} is connected"})

# @socket.on("disconnect")
# def disconnected():
#     """event listener when client disconnects to the server"""
#     print("usenr disconnected")
#     emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

@socket.on('proRules')
def handle_proRules(data,message2=None):
    print(f"proRules:::::::::: {data}")
    room_name = data['room_name']
    message_data = data['message']
    sql_conn_obj=sconf.sql_conn_obj()
    
    data=cso.findFromDifferentServer(sql_conn_obj,message_data["query"])
    
    emit(room_name, {'data': cfc.dfjson(data["data"]),"columns":data["columns"],"que":message_data})
    print("proRules______________",data,"proRules",message_data)

@socket.on('siteanalytics')
def handle_siteanalytics(data,message2=None):
    print(f"siteanalytics: {data}")
    room_name = data['room_name']
    message_data = data['message']

    
    
    sql_conn_obj=sconf.sql_conn_obj()
    # sql_conn_obj={
    #     "dbName": "test_dy_web",
    #     "dbServer" : "127.0.0.1",
    #     "port": "1433",
    #     "dbtype": "MSSQL",
    #     "password" : "helloteam_123",
    #     "username" : "sa",
    # }
    # data=cso.findFromDifferentServer(sql_conn_obj,'select * from nokiapreposttool;')
    data=cso.findFromDifferentServer(sql_conn_obj,message_data["Query"])

    print(data,"data")
    
    # emit(room_name, {'text': f'Broadcast to {room_name}: {message_data}'}, room=room_name)


    emit(room_name, {'data': cfc.dfjson(data["data"]),"columns":data["columns"],"que":message_data})


# @socket.on('get_query_output',namespace='/site-analytics')
# def handle_message(message,namespace):
#     print(f"Received message: {message}")
#     emit('message_from_server', f"Server received: {message}")


# handle_siteanalytics("")