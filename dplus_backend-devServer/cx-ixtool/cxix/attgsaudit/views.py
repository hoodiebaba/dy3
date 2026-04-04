import re
from datetime import datetime
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test
from common_func.django_user_func import get_paginated_list, save_file
from .models import AuditJob
from django.http import JsonResponse
from django.core.serializers import serialize   
from .attgsaudit_jobs import attgsaudit_jobs
import json
import os
from common_func.datayog_cfun import user_existance_check
# from django.conf import settings


def check_user_group(user):
    return user.groups.filter(name='attgsaudit').exists() or user.is_superuser


# @login_required(login_url='/login/')
# @user_passes_test(check_user_group, login_url='/')
def att_gsaudit(request):
    if request.method == 'POST':
        version = request.POST.get('version')
        market = request.POST.get('market')
        sites = re.sub('[^a-zA-Z0-9_-]', '', request.POST.get('sites'))
        dlonly = request.POST.get('dlonly')
        audit_type = request.POST.get('audit_type')
        femto = request.POST.get('femto')
        cixlogPath = request.POST.get('cixlogPath')
        software_log = request.POST.get('software_log')
        username = request.POST.get('username')
        cixsavePath=request.POST.get('cixsavePath')
        
        user=user_existance_check(username)
        
        curr_dt = datetime.now().strftime('%Y%m%d%H%M%S')
        
        # user = User.objects.get(username=request.user.username)
        audit_job = AuditJob.objects.create(version=version, market=market, sites=sites, dlonly=dlonly, audit_type=audit_type, femto=femto, user=user)
        audit_job.save()
        
        # out_dir, software_log = save_file(request, 'software_log', curr_datetime, location=sites, activity='attgsaudit')
        out_dir = os.path.join(cixlogPath, "attgsaudit", F'{"attgsaudit"}_{curr_dt}')
        
        os.mkdir(out_dir)
        scriptSave=os.path.join(cixsavePath, 'attgsaudit', F'{"attgsaudit"}_{curr_dt}')
        attgsaudit_jobs(audit_job=audit_job.id, software_log=software_log, outdir=out_dir, odir=scriptSave)
        return JsonResponse({"code":200,"msg":"","data":""})
        # return HttpResponseRedirect('/ATT/GSAuditList/')


    # return render(request, 'att_gsaudit.html', {
    #     'versions': ['ATT_23Q3', 'ATT_23Q2', 'ATT_23Q1'],
    #     'market': ['SFO', 'LA', 'STX', 'NTX'],
    #     'audit_type': ['LTE/NR', 'LTE', 'NR'],
    # })
    return JsonResponse({"code":200,"data":{
        'versions': ['ATT_23Q3', 'ATT_23Q2', 'ATT_23Q1'],
        'market': ['SFO', 'LA', 'STX', 'NTX'],
        'audit_type': ['LTE/NR', 'LTE', 'NR'],
    }})
    


# @login_required(login_url='/login/')
# @user_passes_test(check_user_group, login_url='/')
def att_gsauditlist(request):
    # jobs = AuditJob.objects.all()
    
    jobs = AuditJob.objects.all()

    # serialized_jobs = [
    #     {
    #         'id': job.id,
    #         'sites': job.sites,
    #         'status': job.status,
    #         'script': job.script,
    #         'create_dt': job.create_dt,
    #         'cname': job.client.cname,
    #         'mname': job.client.mname,
    #         'srname': job.client.software.swname,
    #         'enm': job.client.enm,
    #         'user': job.user.username,
    #     }
    #     for job in jobs
    # ]
    # for i in jobs:
    #     print(i)
    
    # serialized_jobs_json = json.dumps(serialized_jobs, cls=DjangoJSONEncoder)
    serialized_jobs = serialize('json', jobs)
    print(serialized_jobs,"m")
    return JsonResponse({"code":200,"data":json.loads(serialized_jobs)})
    if not request.user.is_superuser: jobs = jobs.filter(user=request.user)
    jobs = get_paginated_list(request, jobs)
    return render(request, 'att_gsauditlist.html', {'jobs': jobs})
