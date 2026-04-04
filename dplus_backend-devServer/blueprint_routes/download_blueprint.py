from base import *

download_blueprint = Blueprint('download_blueprint', __name__)


@download_blueprint.route('/output/<fileloc>/<filePath>',methods=['GET'])
def output_queryResult(fileloc,filePath):
    return send_file(os.path.join(os.getcwd(),"output",fileloc,filePath))

@download_blueprint.route('/cxixLogs/<fileloc>/<filePath>',methods=['GET'])
def cxixLogsfilesystem(fileloc,filePath):
    return send_file(os.path.join(os.getcwd(),"cxixLogs",fileloc,filePath))




@download_blueprint.route('/testing',methods=['GET'])
@token_required
def testing(current_user):
    print(current_user)
    return current_user
