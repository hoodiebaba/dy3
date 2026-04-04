import os
import re
from datetime import datetime
from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test
from common_func.django_user_func import get_paginated_list, save_file
from common_func.custom_log import Custom_Log
from django.core.serializers.json import DjangoJSONEncoder
from .models import Software, Client, ATTScriptJob
from .att_ix.aa_att_script_job import aa_att_script_job

import json

from django.core.serializers import serialize
from django.http import JsonResponse
from common_func.datayog_cfun import user_existance_check

def check_user_group(user):
    return user.groups.filter(name='attscripter').exists() or user.is_superuser


# @login_required(login_url='/')
# @user_passes_test(check_user_group, login_url='/')
def script_att(request):
    if request.method == 'POST':
        sites = re.sub('[^a-zA-Z0-9_-]', '', request.POST.get('siteid'))
        cname = request.POST.get('cname')
        mname = request.POST.get('mname')
        swrel = request.POST.get('swrel')
        swenm = request.POST.get('sw_enm')
        username = request.POST.get('username')
        cixsavePath=request.POST.get('cixsavePath')
        cixlogPath=request.POST.get('cixlogPath')
        DCGKPath=request.POST.get('DCGKPath')
        CIQFilePath=request.POST.get('CIQFilePath')
        
        
        # user = User.objects.get(username=request.user.username)
        user=user_existance_check(username)
        software = Software.objects.get(swname=swrel)
        client = Client.objects.get(cname=cname, mname=mname, software=software, enm=swenm)
        script_job = ATTScriptJob.objects.create(client=client, sites=sites, user=user)
        script_job.save()
        curr_dt = datetime.now().strftime('%Y%m%d%H%M%S')
        
        
        # out_dir, software_log = save_file(request, 'software_log', curr_dt, location=sites, activity='attscripter')
        # out_dir, cix_file = save_file(request, 'ciqfile', curr_dt, location=sites, activity='attscripter')
        file_name = re.sub('[^a-zA-Z0-9_-]', '', str("attscripter"))
        scriptSave=os.path.join(cixsavePath, 'attscripter', F'{file_name}_{curr_dt}')
        outdir = os.path.join(cixlogPath, "attscripter", F'{file_name}_{curr_dt}')
        
        os.mkdir(outdir)
        # log_file = os.path.join(cixlogPath, '')
        # aa_att_script_job(script_job=script_job.id, cix_file=cix_file, software_log=software_log, outdir=cixsavePath, sites=sites)
        aa_att_script_job(script_job=script_job.id, cix_file=CIQFilePath, software_log=DCGKPath, outdir=outdir, sites=sites, scriptSave=scriptSave)
        return JsonResponse({"code":200,"msg":"","data":""})
        # return HttpResponseRedirect('/ATT/scriptlist/')
    else:
        client_att = {}
        cols = ['cname', 'mname', 'software__swname', 'enm']
        qs = Client.objects.all().values(*cols)
        for row in [[_.get(col) for col in cols] for _ in qs]:
            t = client_att
            for col in row:
                t[col] = t.get(col, {})
                t = t[col]
                
        print(client_att,"client_attclient_attclient_att")
        
        
        print(client_att,"serialized_jobsserialized_jobs")
        return JsonResponse({"code":200,"data":client_att})
    return render(request, 'script_att.html', {'customer1': client_att})


# @login_required(login_url='/')
# @user_passes_test(check_user_group, login_url='/')
def scriptlist_att(request):
    # jobs = ATTScriptJob.objects.all()
    
    jobs = ATTScriptJob.objects.select_related('client').all()

    serialized_jobs = [
        {
            'id': job.id,
            'sites': job.sites,
            'status': job.status,
            'script': job.script,
            'create_dt': job.create_dt,
            'cname': job.client.cname,
            'mname': job.client.mname,
            'srname': job.client.software.swname,
            'enm': job.client.enm,
            'user': job.user.username,
        }
        for job in jobs
    ]
    # for i in jobs:
    #     print(i)
    
    serialized_jobs_json = json.dumps(serialized_jobs, cls=DjangoJSONEncoder)
    # serialized_jobs = serialize('json', jobs)
    print(serialized_jobs,"serialized_jobsserialized_jobs")
    return JsonResponse({"code":200,"data":serialized_jobs})
    if not request.user.is_superuser: jobs = jobs.filter(user=request.user)
    jobs = get_paginated_list(request, jobs)
    return render(request, 'scriptlist_att.html', {'jobs': jobs})
