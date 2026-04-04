from base import *

def singleFileSaver(file,path,accept):

    print(file,"filefilefile")

    if file==None:
        return {
                "status":422,
                "msg":'No selected file',
                "icon":'error'
            }
    if file.filename == '':
        return {
            "status":422,
            "msg":'No selected file',
            "icon":'error'
        }

    
    fileExt=file.filename.split(".")[-1]

    if(fileExt in accept):
        filePath=""
        if(path==""):
            filePath=os.path.join(os.getcwd(),"uploads",file.filename)
            file.save(filePath)
        
        else:
            filePath=os.path.join(path,file.filename)
            file.save(os.path.join(path,file.filename))

        return {
            "status":200,
            "msg":filePath
        }
    else:
        return {
            "status":422,
            "msg":'File Type Not allowed',
            "icon":'error'
        }

