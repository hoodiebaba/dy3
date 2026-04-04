import os
import shutil
import importlib
from datetime import datetime
from .models import AuditJob
from django.conf import settings
# from background_task import background

from attgsaudit.att_gsaudit.GSAuditUSID import GSAuditUSID
from attgsaudit.att_gsaudit.GSAuditReport import GSAuditReport
from attgsaudit.att_gsaudit.GSAuditScript import GSAuditScript
from common_func.custom_log import Custom_Log


# @background()
def attgsaudit_jobs(audit_job, software_log, outdir,odir):
    job = AuditJob.objects.get(id=audit_job)
    job.status = 'Running'
    job.save()
    gs_admin = ['amit@fourbrick.com', 'tech@fourbrick.com']
    gs_admin = True if job.user.email in gs_admin else False
    curr_dt = datetime.now().strftime('%Y%m%d%H%M%S')
    log_file = os.path.join(settings.MEDIA_ROOT, 'attgsaudit', F'{job.sites}_{curr_dt}.log')
    custom_log = Custom_Log(log_file=log_file, activity='AT&T GS Audit')
    
    try:
        usid = GSAuditUSID(software_log, job, custom_log, outdir)
        for module in job_files(str(job.audit_type)):
            custom_log.log.info(F'Running Module for site {job.sites} ----> {module}')
            getattr(importlib.import_module(F'attgsaudit.att_gsaudit.{module}'), module)(usid=usid)
        usid.df_report['flag'].replace({'True': True, 'False': False}, inplace=True)
        GSAuditReport(usid=usid, gs_admin=gs_admin)
        GSAuditScript(usid=usid)
        custom_log.log.info(F'Job completed for AT&T GS Audit Site : {job.sites}, Status: Successful!!!')
        job.status = 'Completed'
    except:
        custom_log.log.exception("message")
        custom_log.log.info(F'Job completed for AT&T GS Audit Site : {job.sites}, Status: Failed!!!')
        job.status = 'Failed'

    custom_log.release()
    shutil.copy(log_file, outdir)
    shutil.make_archive(outdir, 'zip', outdir)
    job.script = odir + '.zip'
    job.save()
    shutil.rmtree(outdir)
    os.remove(log_file)


def job_files(audit_type_c=''):
    modules = ['Audit00Defult', 'Audit01LTE', 'Audit02LTECell', 'Audit03LTERelation', 'Audit11NR', 'Audit12NRCell', 'Audit13NRRelation']
    if audit_type_c == 'LTE':
        modules = ['Audit00Defult', 'Audit01LTE', 'Audit02LTECell', 'Audit03LTERelation']
    elif audit_type_c == 'NR':
        modules = ['Audit00Defult', 'Audit11NR', 'Audit12NRCell', 'Audit13NRRelation']
    return modules
