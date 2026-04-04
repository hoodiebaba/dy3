from base import *


def zipCreate(source_dir,archive_name):
    shutil.make_archive(source_dir,'zip',archive_name)

    shutil.rmtree(source_dir)
    return archive_name

def fileMover(source_dir,dest_dir,filenames,destfilename):

    print(source_dir,dest_dir,filenames,destfilename,"source_dir,dest_dir,filenames,destfilename")
    desfile=os.path.join(dest_dir,destfilename)
    if(os.path.exists(desfile)!=True):
        os.mkdir(desfile)
    for file in filenames:
        shutil.copy(os.path.join(source_dir,file),desfile)
        os.remove(os.path.join(source_dir,file))

    return desfile
