import os
import shutil
import importlib
from datetime import datetime
from django.conf import settings
from common_func.custom_log import Custom_Log
from tmobile.models import ScriptJob
from tmobile.tmo_ix.tmo_usid_data import tmo_usid_data


def tmobile_job(script_job_id, cix_file, zip_file, base_dir, sites,scriptSave):
    script_job = ScriptJob.objects.get(id=script_job_id)
    client = script_job.client
    script_job.status = 'Running'
    script_job.save()
    script_list = script_job_files(sw=script_job.client.software.swname)

    curr_dt = datetime.now().strftime('%Y%m%d%H%M%S')
    log_file = os.path.join(settings.MEDIA_ROOT, 'tmobile', F'{sites}_{curr_dt}.log')
    custom_log = Custom_Log(log_file=log_file, activity='T-Mobile Scripting')
    log = custom_log.log
    log.info(F'Started running job for T-Mobile Site : {sites}')
    log.info(F'Customer: {script_job.client.cname}')
    log.info(F'Market: {script_job.client.mname}')
    log.info(F'ENM : {script_job.client.enm}')
    log.info(F'SW : {script_job.client.software.swname}')
    log.info(F'SiteID: {sites}')
    try:
        log.info(F'Loading/Extracting data from CIQ and DCGK files into memory!!!')
        usid = tmo_usid_data(client=client, base_dir=base_dir, log=log, cix_file=cix_file, zip_file=zip_file, sites=sites)
        log.info(F'Data Successfully loaded into memory!!!')
        for node in set().union(usid.gnodeb.keys(), usid.enodeb.keys()):
            log.info(F'Writing Scripts for T-Mobile Node {node}!!!')
            for module in script_list:
                if module[:2] not in ['te', 'lt', 'nr']: continue
                elif module[:3] == 'lte' and node not in usid.enodeb.keys(): continue
                elif module[:2] == 'nr' and node not in usid.gnodeb.keys(): continue
                log.info(F'Writing Scripts for T-Mobile Node {node} ---->{module}')
                self = getattr(importlib.import_module(F'tmobile.tmo_ix.{module}'), module)(usid=usid, node=node)
                self.run()
        log.info(F'Job completed for T-Mobile Site : {sites}, Status: Successful!!!')
        script_job.status = 'Completed'
    except:
        log.exception("message")
        log.info(F'Job completed for T-Mobile Site : {sites}, Status: Failed!!!')
        script_job.status = 'Failed'

    custom_log.release()
    shutil.copy(log_file, base_dir)
    # shutil.make_archive(base_dir, 'zip', base_dir)
    # script_job.script = os.path.basename(base_dir + '.zip')
    
    shutil.make_archive(base_dir, 'zip', base_dir)
    
    print(base_dir,scriptSave,"outdiroutdiroutdiroutdir")
    # d
    # asdsadasdasdsd
    script_job.script = scriptSave + '.zip'
    script_job.save()
    shutil.rmtree(base_dir)
    os.remove(log_file)


def script_job_files(sw=''):
    if sw[:9] < 'TMO_23_Q4':
        return [
            'lte0_ProjectInfo', 'lte1_SiteBasic', 'lte2_SiteEquipment', 'lte3_SiteInstallation', 'lte4_NodeInfo',
            'lte_01_Transport', 'lte_01b_Ptp_Sync', 'lte_02_ENodeBFunction', 'lte_03_TermPointToMme',
            'lte_04_Delete_EUtranCell', 'lte_05_Parameter', 'lte_06_Equipment', 'lte_15_RadioCutOver',
            'lte_07_eNodeBMOsCreate', 'lte_08_ENodeBParaUpdate', 'lte_09_CellMOsCreate', 'lte_10_CellParaUpdate',
            'lte_11_Relations', 'lte_12_BaseLine', 'lte_13_Idle', 'lte_14_GUtraRelation',
            'lte_Script07MOsBackUp_eNodeBMOs', 'lte_Script09MOsBackUp_CellMosCreate',
            'nr0_ProjectInfo', 'nr1_SiteBasic', 'nr2_SiteEquipment', 'nr3_SiteInstallation', 'nr4_NodeInfo',
            'nr_01a_Transport', 'nr_01b_Ptp_Sync', 'nr_01c_MMBB_Internal_Routing',
            'nr_02_GNBFunction', 'nr_03_TermPointToAmf',
            'nr_04_Equipment', 'nr_05a_gNB_MOs', 'nr_05b_gNB_Parameter',
            'nr_06a_NRCell',
            'nr_08_BaseLine', 'nr_09_Idle',
            'nr_10a_EUtranRelation', 'nr_10b_NRRel_Intra_gNodeB', 'nr_10c1_NRRel_Inter_gNodeB', 'nr_10c2_NRRel_Inter_gNodeB', 'nr_10d_NSA_NR_CA',
            'nr_10e_NRRel_EAST_parameter', 'nr_10f_NRRel_EAST_Disabled_PCELL_HO_to_N41_N19_for_GalaxyA53_V6',
            'testScripts_DonotUse_lte', 'testScripts_DonotUse_nr',
            'nr_11_VoNR_scripts',
        ]
    else:
        return [
            'lte0_ProjectInfo', 'lte1_SiteBasic', 'lte2_SiteEquipment', 'lte3_SiteInstallation', 'lte4_NodeInfo',
            'lte_01_Transport', 'lte_01b_Ptp_Sync', 'lte_02_ENodeBFunction', 'lte_03_TermPointToMme',
            'lte_04_Delete_EUtranCell', 'lte_05_Parameter', 'lte_06_Equipment', 'lte_15_RadioCutOver',
            'lte_07_eNodeBMOsCreate', 'lte_08_ENodeBParaUpdate', 'lte_09_CellMOsCreate', 'lte_10_CellParaUpdate',
            'lte_11_Relations', 'lte_12_BaseLine', 'lte_13_Idle', 'lte_14_GUtraRelation',
            'lte_Script07MOsBackUp_eNodeBMOs', 'lte_Script09MOsBackUp_CellMosCreate',
            'nr0_ProjectInfo', 'nr1_SiteBasic', 'nr2_SiteEquipment', 'nr3_SiteInstallation', 'nr4_NodeInfo',
            'nr_01a_Transport', 'nr_01b_Ptp_Sync', 'nr_01c_MMBB_Internal_Routing',
            'nr_02_GNBFunction', 'nr_03_TermPointToAmf', 'nr_04_Equipment',
            # 'nr_05a_gNB_MOs', 'nr_05b_gNB_Parameter',
            'nr_05_gNB_MOs', 'nr_06a_NRCell',
            'nr_08_BaseLine', 'nr_09_Idle',
            'nr_10a_EUtranRelation', 'nr_10b_NRRel_Intra_gNodeB', 'nr_10c1_NRRel_Inter_gNodeB', 'nr_10c2_NRRel_Inter_gNodeB', 'nr_10d_NSA_NR_CA',
            'nr_10e_NRRel_EAST_parameter', 'nr_10f_NRRel_EAST_Disabled_PCELL_HO_to_N41_N19_for_GalaxyA53_V6',
            'testScripts_DonotUse_lte', 'testScripts_DonotUse_nr',
            'nr_11_VoNR_scripts',
        ]
