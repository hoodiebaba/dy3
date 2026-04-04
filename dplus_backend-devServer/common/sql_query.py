from simple_query_builder import *
import re
# if you want to get results as a list of dictionaries (by default since 0.3.5)
qb = QueryBuilder(DataBase(), 'my_db.db') # result_dict=True, print_errors=False




def addon(nest):
    ordering=""
    value=""
    dta=[]
    for i in nest:
        if("column" in i):
            dta=nest[i].split("smartGame")
        if("expression" in i):
            ordering=nest[i]
        if("formovalue" in i):
            value=nest[i]
    return {
        "tableName":dta[0],
        "colName":dta[1],
        "value":value,
        "expression":ordering
    }

def naddon(nest,column):
    ordering=""
    value=""
    dta=[]
    for i in nest:
        if(column in i):
            dta=nest[i].split("smartGame")
    
    return {
        "tableName":dta[0],
        "colName":dta[1]
    }



def getCheckCond(val,daaa):
    print(val)

    dic={
        "starts with":["LIKE",f"{daaa}%"],
        "contains":["LIKE",f"%{daaa}%"],
        "is equal to":["=",f"%{daaa}%"],
        "does not start with":["NOT LIKE",f"{daaa}%"],
        "does not contain":["NOT LIKE",f"%{daaa}%"],
        "is not equal to":["!=",f"{daaa}"],
        "is not in list":[f"NOT IN",f"{tuple(daaa)}"],
        "is in list":[f"IN",f"{tuple(daaa)}"],
        "is null":["IS NULL"],
        "is not null":["IS NOT NULL"],
        "greater than": [f">",f"{daaa}"],
        "less than": [f"<",f"{daaa}"],
        "greater than or equal to": [f">=",f"{daaa}"],
        "less than or equal to": ["<=",f"{daaa}"],
        "blank":""
    }
    
    print(dic[val],"diccc")
    return dic[val]


def getCheckOrder(val,daaa,sqlq):
    dic={
        "Ascending":"ASC",
        "Descending":"DESC"
    }

    sqlq.order_by(f"{daaa} {dic[val]}")
    return f""

def getCheckAggFun(val,col,table,sqlquery):
    dic={
        "COUNT":sqlquery.select(table, f'{val}({col})'),
        "SUM":sqlquery.select(table, f"{val}({col})"),
        "AVG":sqlquery.select(table, f"{val}({col})"),
        "MIN":sqlquery.select(table, f"{val}({col})"),
        "MAX":sqlquery.select(table, f"{val}({col})")
    }
    return f"{dic[val]}"

def getCheckAggJoins(one,two,orderdata,allData,sqlquery,boolaggfun,aggfun):

    print("getCheckAggJoins",(one,two,orderdata["orderexpression"],sqlquery))
    allcole=[]

    if(one['tableName'] in allData):
        for i in allData[one['tableName']]:
            allcole.append(f"{one['tableName']}.{i}")
    if(two['tableName'] in allData):
        for i in allData[two['tableName']]:
            allcole.append(f"{two['tableName']}.{i}")


    results=None
    print(aggfun)
    if(boolaggfun):
        results=sqlquery.join(two["tableName"], [f"{one['tableName']}.{one['colName']}", f"{two['tableName']}.{two['colName']}"])
    elif len(allcole)>0:
        results=qb.select(one["tableName"],allcole).join(two["tableName"], [f"{one['tableName']}.{one['colName']}", f"{two['tableName']}.{two['colName']}"])
    else:
        results=qb.select(one["tableName"],"*").join(two["tableName"], [f"{one['tableName']}.{one['colName']}", f"{two['tableName']}.{two['colName']}"])

    # print(results.get_sql(),"aaaaaaa")
    # breasaaa


    
    return results

    sdfghjk

    # dic={
    #     "COUNT":sqlquery.select(table, f'{val}({col})'),
    #     "SUM":sqlquery.select(table, f"{val}({col})"),
    #     "AVG":sqlquery.select(table, f"{val}({col})"),
    #     "MIN":sqlquery.select(table, f"{val}({col})"),
    #     "MAX":sqlquery.select(table, f"{val}({col})")
    # }
    # return f"{dic[val]}"




def sql_maker(data):
    try:
        print(data["ServerSelection"])

        if(data["ServerSelection"]=="Select"):
            return {
                "msg":"Please Select Server First",
                "color":"text-red"
            }
        
        if(data["dboSelection"]=="Select"):
            return {
                "msg":"Please Select DBO First",
                "color":"text-red"
            }

            
        # results = qb.select('users' )

        # results = qb.select(
        #     "users", 
        #     ['users.id','users.email','users.username']).join('groups', ['users.group_id', 'groups.id'])

        sqlquery=qb
        compiling_data={
            "ServerSelection":"",
            "where":[]
        }
        wheredata={}
        whereconddata={}
        orderdata={}
        workon=[]
        unqtable=[]

        for i in data:
            if("condition" in i):
                workon.append(data[i])

        for i in data["dataValue"]:
            print(i,data["dataValue"][i])
            unqtable.append(i)

        print(len(unqtable))
        
        for i in data:
            if(i=="ServerSelection"):
                compiling_data["server"]=data[i]

            if(i.startswith("where") and "wheretwocondition" not in i):
                # print(i.split("_"))
                if("where"+i.split("_")[1] not in wheredata):
                    wheredata["where"+i.split("_")[1]]={}
                wheredata["where"+i.split("_")[1]][i.split("_")[0]]=data[i]

            if("wheretwocondition" in i):
                print(i.split("_"))
                if("where"+i.split("_")[1] not in whereconddata):
                    whereconddata["where"+i.split("_")[1]]={}
                whereconddata["where"+i.split("_")[1]][i.split("_")[0]]=data[i]

            if(i.startswith("order")):
                print("order"+i.split("_")[1]+i.split("_")[0])
                if("order"+i.split("_")[1] not in orderdata):
                    orderdata["order"+i.split("_")[1]]={}
                orderdata["order"+i.split("_")[1]][i.split("_")[0]]=data[i]
                # orderdata.append(i)
        print(whereconddata,orderdata)


        # ggfdsa

        index=1
        dataSyntax=[]
        orders=[]
        aggfun=[]
        calcheck=True
        ewy=[]

        dey=[]
        if 1==1:
            finew=data["dataValue"]
            ctt=0
            for i in finew:
                print(finew[i],i)
                ewy.append(i)
                for j in finew[i]:
                    dey.append(f"{j}.{i}")

            # for kk in ewy:
            #     if(ctt==0):
            #         sqlquery.select(kk,dey)
            #     else:
            #         sqlquery.join(kk)

                ctt=ctt+1


            print(dey)
            # brere

        tableNameinJoin=[]

        print(orderdata,"orderdataorderdata")
        for i in orderdata:
            if(orderdata[i]["ordercondition"] == "joins"):
                val=naddon(orderdata[i],"column")["tableName"]
                print(val,"val") 
                if(val not in tableNameinJoin):
                    tableNameinJoin.append(val)

                print(naddon(orderdata[i],"cvalue"),naddon(orderdata[i],"column"))
                newval=naddon(orderdata[i],"cvalue")["tableName"]
                print(newval,"newval") 
                if(newval not in tableNameinJoin):
                    tableNameinJoin.append(newval)


        if(len(ewy)>1 and "joins" not in workon):
            return {
                "msg":"You Select more than one table please add join",
                "color":"text-red"
            }
            return "You Select more than one table please add join"
        
        
        # print(len(ewy) <= len(tableNameinJoin),len(ewy) ,ewy, len(tableNameinJoin),tableNameinJoin)

        if(len(ewy)==0):
            return {
                "msg":"Please select at least one table to view",
                "color":"text-red"
            }
            return "Please select at least one table to view"
        

        print(ewy,"ewy",tableNameinJoin,"tableNameinJoin")
        
        if(len(ewy)!=1 and len(ewy) > len(tableNameinJoin)):
            return {
                "msg":"You Select more than "+str(len(ewy))+" table and add relation join between table ",
                "color":"text-red"
            }
            # dsadsadasdas
            return "You Select more than "+str(len(ewy))+" table and add relation join between table "



        if("where" in workon):    
            for i in wheredata:
                db,col=wheredata[i]["wherecolumn"].split("smartGame")
                exp=wheredata[i]["whereexpression"]
                cond=wheredata[i]["whereformovalue"]
                if("where"+str(index) in whereconddata):
                    dataSyntax.append(whereconddata["where"+str(index)]["wheretwocondition"])
                syntax=[f"{col}.{db}"]+getCheckCond(exp,cond)
                dataSyntax.append(syntax)
                index=index+1

        # FDFWEDWEEWEEW
        
        for i in orderdata:
            if("aggregationFunction" in workon):
                if("aggregationFunction" == orderdata[i]["ordercondition"]):
                    dtee=addon(orderdata[i])
                    calcheck=False
                    getCheckAggFun(dtee["expression"],dtee["colName"],dtee["tableName"],sqlquery)

        
        
        

                
        print(tableNameinJoin)

        # dsfdsfsfsf
        
        for i in orderdata:
            if("joins" in workon):
                if("joins" == orderdata[i]["ordercondition"]):
                    print(orderdata[i])
                    otee=naddon(orderdata[i],"column")
                    stee=naddon(orderdata[i],"cvalue")
                    calcheck=False
                    
                    getCheckAggJoins(otee,stee,orderdata[i],data["dataValue"],sqlquery,"aggregationFunction" in workon,aggfun)

        print(sqlquery.get_sql(),"workonworkon")

            
    
            # dssadsadasdasdadas

        if("aggregationFunction" not in workon and "joins" not in workon):
            if(len(workon)==0):
                sqlquery=qb.select(ewy[0],dey)
            else:
                sqlquery=qb.select(ewy[0],dey).where(dataSyntax)
        else:
            sqlquery.where(dataSyntax)
        
        for i in orderdata:
            if("order" in workon):
                if("order" == orderdata[i]["ordercondition"]):
                    dtee=addon(orderdata[i])
                    orders.append(getCheckOrder(dtee["expression"],dtee["colName"]+'.'+dtee["tableName"],sqlquery))

        print(sqlquery.get_result(),"sqlquery")




        # qb.select("asa").all()

        modified_query = re.sub(r'`([^`]+)`\.`([^`]+)`', r'[\2].[\1]', sqlquery.get_sql())
        modified_query = re.sub(r'`([^`]+)`', r'[\1]', modified_query)

        dbos=data['dboSelection'].split(".")
        dbos[0]=dbos[0].split("/")[1]
        dbos.append(ewy[0])

        modified_query=modified_query.replace("FROM ["+ewy[0]+"]","FROM ["+'].['.join(dbos)+"]")
        print("modified_query",modified_query,"modified_query",modified_query)



        # ewqewqewqewqewqwqe
        return {
            "msg":modified_query,
            "color":"text-green"
        }
    
    
    except sqlite3.ProgrammingError as e:
        print(e)
        return {
            "msg":e.args[0],
            "color":"text-red"
        }
    

    except Exception as e:

        print(e,"dsdassadasdsadsadsadasda")
        return {
            "msg":"Please Select Proper Data",
            "color":"text-red"
        }
    return sqlquery.get_sql()


    dasdadadada
    

    # if("table" in data):
    #     for nest in data["table"]:
    #         sqlquery.select(nest,data["table"][nest])
        
    # if("order" in data):
    #     lener=[]
    #     for nest in data["order"]:
    #         print(nest)
    #         dtee=addon(nest)
    #         lener.append(dtee["colName"]+'.'+dtee["tableName"]+' '+dtee["expression"])
                
    #     sqlquery.order_by(lener)


    if("where" in data):
        # lener=[]
        for nest in data["where"]:
            print(nest)
            dtee=addon(nest)

            print()
            # lener.append(dtee["colName"]+'.'+dtee["tableName"]+' '+dtee["expression"])

        # sqlquery.where(lener)
        
        print(sqlquery.get_sql(),"results")

        return sqlquery.get_sql()



dat={'ServerSelection': 'bd1', 'searchTablename': '', 'ordercondition_1_form': 'aggregationFunction', 'orderexpression_1_form': 'COUNT', 'wherecondition_1_form': 'blank', 'whereexpression_1_form': 'blank', 'whereformovalue_1_form': '', 'ordercolumn_1_form': 'AbcdsmartGamebac', 'dataValue': {}}
# sql_maker(dat)