from base import *

def dftocsv(dataf,excel_file_path):
    print(type(dataf),excel_file_path)

    # dsadsadasdsad
    dataf.to_csv(excel_file_path, index=False)
    return excel_file_path

def dftoexcel(dataf,excel_file_path):
    print(type(dataf),excel_file_path)

    # dsadsadasdsad
    dataf.to_excel(excel_file_path, index=False, engine='xlsxwriter')
    return excel_file_path

def dflen(dataf):

    
    return len(dataf)


# def dfjson(dataf):
#     data=dataf.to_json(orient='records')
#     return json.loads(data)
import datetime
def dfjson(dataf):
    # CASE 1: If list of dicts
    if isinstance(dataf, list):
        cleaned = []
        for row in dataf:
            cleaned_row = {}
            for k, v in row.items():
                if isinstance(v, (datetime.date, datetime.datetime)):
                    cleaned_row[k] = v.isoformat()
                else:
                    cleaned_row[k] = v
            cleaned.append(cleaned_row)
        return cleaned

    # CASE 2: If DataFrame
    if isinstance(dataf, pd.DataFrame):
        rows = dataf.to_dict(orient="records")
        cleaned = []
        for row in rows:
            cleaned_row = {}
            for k, v in row.items():
                if isinstance(v, (datetime.date, datetime.datetime)):
                    cleaned_row[k] = v.isoformat()
                else:
                    cleaned_row[k] = v
            cleaned.append(cleaned_row)
        return cleaned

    # CASE 3: JSON string
    if isinstance(dataf, str):
        try:
            return json.loads(dataf)
        except:
            return dataf

    return dataf
    
    
    if isinstance(dataf, str):
        try:
            parsed = json.loads(dataf)
            print("parsed------------")
            return parsed
        except:
            return dataf 

    
    return dataf.to_json(orient='records')
    


def jsondf(dataf):
    data=dataf.to_json(orient='records')
    return json.loads(data)


def jsoncsv(openpath):
    df=pd.read_csv(openpath)
    return df


def exceltodf(excel_file_path,rename,validate):
    

    dataf=pd.read_excel(excel_file_path)


    missing_col=set(validate)-set(dataf.columns.tolist())

    print(missing_col)
    extra_col=set(dataf.columns.tolist())-set(validate)

    print(extra_col)

    if(len(missing_col)>0):
        return {
            "status":400,
            "icon":"error",
            "msg":"Some Columns is missing.Column names is "+"\n".join(missing_col)
        }
    
    # if(len(extra_col)>0):
    #     return {
    #         "status":400,
    #         "icon":"error",
    #         "msg":"Some Columns is extra.Column names is "+"\n".join(extra_col)
    #     }


    print(rename)

    dataf=dataf[list(validate)]
    dataf.rename(columns=rename,inplace=True)
    print(dataf.columns)

    return {
        "status":200,
        "data":dataf
    }


