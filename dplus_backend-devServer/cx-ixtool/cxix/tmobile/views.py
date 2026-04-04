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

from .models import Software, Client, ScriptJob
from .tmobile_jobs import tmobile_job

import json

from django.core.serializers import serialize
from django.http import JsonResponse
from common_func.datayog_cfun import user_existance_check


def check_user_group(user):
    return user.groups.filter(name='tmobile').exists() or user.is_superuser


# @login_required(login_url='/')
# @user_passes_test(check_user_group, login_url='/')
def script_tmobile(request):
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
        script_job = ScriptJob.objects.create(client=client, sites=sites, user=user)
        script_job.save()
        curr_dt = datetime.now().strftime('%Y%m%d%H%M%S')
        # base_dir, zip_file = save_file(request, 'software_log', curr_dt, location=sites, activity='tmobile')
        # base_dir, cix_file = save_file(request, 'ciqfile', curr_dt, location=sites, activity='tmobile')
        file_name = re.sub('[^a-zA-Z0-9_-]', '', str("attscripter"))
        scriptSave=os.path.join(cixsavePath, 'attscripter', F'{file_name}_{curr_dt}')
        outdir = os.path.join(cixlogPath, "attscripter", F'{file_name}_{curr_dt}')
        
        os.mkdir(outdir)
        # tmobile_job(script_job_id=script_job.id, cix_file=cix_file, zip_file=zip_file, base_dir=base_dir, sites=sites)
        tmobile_job(script_job_id=script_job.id, cix_file=CIQFilePath, zip_file=DCGKPath, base_dir=outdir, sites=sites,scriptSave=scriptSave)
        return HttpResponseRedirect('/T-Mobile/sitelist/')
    else:
        client_tmo = {}
        cols = ['cname', 'mname', 'software__swname', 'enm']
        qs = Client.objects.all().values(*cols)
        for row in [[_.get(col) for col in cols] for _ in qs if _.get('software__swname') > 'TMO_22_Q4']:
            t = client_tmo
            for col in row:
                t[col] = t.get(col, {})
                t = t[col]
                
        
        print(client_tmo,"client_attclient_attclient_att")
        
        
        print(client_tmo,"serialized_jobsserialized_jobs")
        return JsonResponse({"code":200,"data":client_tmo})
    return render(request, 'script_tmobile.html', {'customer1': client_tmo})


# @login_required(login_url='/')
# @user_passes_test(check_user_group, login_url='/')
def sitelist_tmobile(request):
    jobs = ScriptJob.objects.all()
    
    serialized_jobs = serialize('json', jobs)
    print(serialized_jobs,"serialized_jobsserialized_jobs")
    return JsonResponse({"code":200,"data":json.loads(serialized_jobs)})
    if not request.user.is_superuser: jobs = jobs.filter(user=request.user)
    jobs = get_paginated_list(request, jobs)
    return render(request, 'sitelist_tmobile.html', {'jobs': jobs})
