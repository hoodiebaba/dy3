from flask import *
from functools import wraps
import requests
import uuid
import re
import os
import jwt
import json
from datetime import datetime,timedelta
from bson.objectid import ObjectId
from flask_cors import CORS
from sqlalchemy import create_engine, MetaData, Table, text, exc,DateTime
from sqlalchemy.orm import sessionmaker
# import flask_monitoringdashboard as dashboard
import copy
import pandas as pd
import shutil
import json
import sys
import traceback
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
import seaborn as sns
import common.form as cform
import time
from urllib.parse import quote
from flask_socketio import SocketIO, emit, join_room, leave_room

import threading
import time
from geopy.distance import geodesic

import numpy as np



import StaticConf as sconf

import common.config as ctm
import common.fileCreation as cfc
import common.mongo_operations as cmo
import common.sql_operation as cso
import common.sql_query as csq
import common.mailer as cmailer
import common.zipCreation as czc
import common.graph as cgraph
import common.apiReq as apireq
import common.data_col_manipulate as cdcm
import common.fsocket as cfsocket
import common.api_caller as capicall

import staticData.staticProcedure as staticProcedure

# import common.sql_operation as cso
import integrated_tools.powerBI as tools_pbi
env_file_name = ".env"
env_path = os.path.join(os.getcwd(),env_file_name)
load_dotenv(dotenv_path=env_path)


def del_itm(data,remover):
    print(data,remover)


    for i in ["overall_table_count","sid"]:
        print(data,remover)
        if(i in data):
            print(data,remover)
            del data[i]

    for i in remover:
        print(data,remover)
        if(i in data):
            print(data,remover)
            del data[i]

    print(data,remover)

    # dsadsadsadsad
    return data
    


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        
        print("request.headers","request.headers")
        
        
        
        print("===============")
        if 'Authorization' in request.headers:
            print(request.headers)
            token = request.headers['Authorization']

        if not token:

            return jsonify({'message': 'a valid token is missing'}),401
            
        try:
            print("line1")
            data=jwt.decode(token.split("Bearer ")[1], algorithms='HS512', verify=True, key=os.environ.get("SECRET_KEY"))
            print("line1")

            print(data["uniqueid"],"datadatadatadata")


            sqlQuery=f"SELECT userRole.rolename,Users.* FROM Users INNER JOIN userRole ON Users.roleId = userRole.id WHERE Users.id='{data['uniqueid']}';"
                
            userData=cso.finding(sqlQuery)


            print(userData["data"],"userData")

            current_data=userData["data"]

            if(len(current_data)==0):
                return jsonify({'message': 'token is invalid'}),401

            
            
            print("he;llo",current_data)

            current_user=current_data[0]

            
        except Exception as e:
            print(e,"ExceptionException")
            return jsonify({'message': 'token is invalid'}),401
        return f(current_user, *args, **kwargs)
    return decorator



def respond(userRole,data=None,typeuser=None):
    print("respond 5 respond.py file")
    if("operation_id" in userRole):
        del userRole["operation_id"]
    myResponse=0
    # print(data)
    # if(data=="Login"):
    #     if(userRole["state"]==4):
    #         if(len(userRole["data"])!=0):
    #             myResponse=200
    #             uniqueid=userRole["data"][0]["uniqueid"]
    #             expisre=datetime.utcnow() + timedelta(days=7)
    #             userRole["data"][0]["expiresIn"]="36000" #10 Hour session expire 

                
    #             roleName=userRole["data"][0]["rolename"]
    #             print(userRole,"userRole")
    #             cmo.updating(typeuser,{"_id":ObjectId(uniqueid)},{"isLogin":True,"expiresIn":"36000"},False)
    #             token = jwt.encode({'uniqueid': uniqueid, 'exp' : expisre},key=os.environ.get("SECRET_KEY"),algorithm="HS512")  
    #             # return jsonify({'token' : token.decode('UTF-8')})
    #             userRole["data"][0]["idToken"]=token
                
    #             print(userRole,"userRole")
    #             response = make_response()
    #             response.headers['Authorization'] = "Bearer "+token
    #             response.data = json.dumps(userRole["data"][0])
    #             print(response,"responseresponse")
    #             log_manager.response(response)

    #             print(response,roleName,"response")

    #             if(roleName=="Tower Crew"):
    #                 userFinal={
    #                     "state":2,
    #                     "msg":"You Have No Access to use Web Portal",
    #                     "data":[],
    #                 }
    #                 return jsonify(userFinal), 401
    #             return response
    #             return jsonify(token), myResponse

    #         else:
    #             userFinal={
    #                 "state":2,
    #                 "msg":"Please Use Valid Credentials",
    #                 "data":[],
    #             }
    #             return jsonify(userFinal), 401

            
                

    # print(userRole,"userRole")
    if(userRole["status"]==201):
        myResponse=201

    elif(userRole["status"]==1):
        myResponse=201
    elif(userRole["status"]==400):
        myResponse=400
    elif(userRole["status"]==422):
        myResponse=422
    elif(userRole["status"]==200):
        myResponse=200

    elif(userRole["status"]==401):
        myResponse=401

    elif(userRole["state"]==2):
        myResponse=409
        
    elif(userRole["state"]==3):
        myResponse=422
    
    elif(userRole["state"]==4):
        if(len(userRole["data"])!=0):
            myResponse=200
        else:
            myResponse=204

        
    elif(userRole["state"]==22):
        myResponse=401

    

    # print(userRole,"userRole")
    
    # log_manager.response_two(jsonify(userRole), myResponse)
    return jsonify(userRole), myResponse