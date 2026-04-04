from base import *

common_blueprint = Blueprint('common_blueprint', __name__)


@common_blueprint.route('/asset/<filePath>',methods=['GET'])
def staticasset(filePath):
    return send_file(os.path.join(os.getcwd(),"staticasset",filePath))


