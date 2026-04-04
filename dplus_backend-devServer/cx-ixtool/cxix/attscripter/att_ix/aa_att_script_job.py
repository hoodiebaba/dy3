import os
import importlib
import shutil
from common_func.custom_log import Custom_Log
from attscripter.models import ATTScriptJob
from .att_usid_data import att_usid_data


def job_files():
    return [
        'co1_ProjectInfo', 'co2_SiteBasic', 'co3_SiteEquipment', 'co4_SiteInstallation', 'co5_NodeInfo',
        'co_10_feature', 'co_11_TN_reconfig', 'co_12_TN_transport', 'co_13_TN_ptp', 'co_14_TN_queuesystem',
        'co_20_DELETE_xmu_ril', 'co_21_DELETE_cell', 'co_25_EQ_fru_sef_add', 'co_26_EQ_ret_tma_ref',
        'co_27_EQ_nodegroupsync', 'co_28_EQ_mc_control',

        'lte_41_enodebfunction', 'lte_42_mme', 'lte_43_enb_mos', 'lte_44_enb_ext_mo',
        'lte_45_enb_para', 'lte_46_enb_qcitable', 'lte_47_enb_b14',
        'lte_51_enb_cell', 'lte_52_enb_cell_para', 'lte_53_enb_cell_relation',
        'lte_54_enb_lte_nr_relation', 'lte_55_enb_lla_relation', 'lte_56_enb_co_site_relation',
        'lte_57_enb_b14_embms', 'lte_99_post_gs_relation',

        'nr_71_gnbfunction', 'nr_72_gnb_amf', 'nr_73_gnb_mo', 'nr_74_gnb_para', 'nr_75_gnb_5qitable',
        'nr_81_gnb_cell', 'nr_82_gnb_relation', 'nr_83_gnb_ext_relation',
        'nr_84_gnb_ext_relation_anr', 'nr_85_gnb_eutran_relation',

        'co_91_lte_nr_relation', 'co_92_lte_nr_relation_anr', 'co_93_nr_nr_relation', 'co_94_nr_nr_relation_anr',
        'co_95_idle', 'co_96_baseline_lte_nr', 'co_ESS',
        'co_Relation_CleanUp',
        'co_command_file',
    ]


# @background()
def aa_att_script_job(script_job, cix_file, software_log, outdir, sites, scriptSave):
    
    print(script_job, cix_file, software_log, outdir, sites)
    
    # dsadassaas
    script_job = ATTScriptJob.objects.get(id=script_job)
    script_job.status = 'Running'
    script_job.save()
    client = script_job.client
    custom_log = Custom_Log(log_file=os.path.join(outdir, F'{os.path.basename(outdir)}.txt'), activity='AT&T Scripting')
    custom_log.log.info(F'Started Running Job for AT&T Site {sites}')
    try:
        custom_log.log.info(F'Loading/Extracting data from CIQ and DCGK files into memory')
        usid = att_usid_data(client=client, cix_file=cix_file, zip_file=software_log, sites=sites, base_dir=outdir, log=custom_log)
        custom_log.log.info(F'Data Successfully loaded into memory')
        for node in set().union(usid.gnodeb.keys(), usid.enodeb.keys()):
            custom_log.log.info(F'Writing Scripts for {node}')
            for module in job_files():
                if module[:2] not in ['co', 'lt', 'nr']: continue
                elif module[:2] == 'lt' and node not in usid.enodeb.keys(): continue
                elif module[:2] == 'nr' and node not in usid.gnodeb.keys(): continue
                custom_log.log.info(F'Writing for {node}->{module}')
                self = getattr(importlib.import_module(F'attscripter.att_ix.{module}'), module)(usid, node)
                self.run()
        custom_log.log.info(F'Job completed for AT&T Site {sites}, Status: Successful!!!')
        script_job.status = 'Completed'
    except:
        custom_log.log.exception("message")
        custom_log.log.info(F'Job completed for AT&T Site {sites}, Status: Failed!!!')
        custom_log.release()
        script_job.status = 'Failed'
    custom_log.release()
    shutil.make_archive(outdir, 'zip', outdir)
    
    print(outdir,scriptSave,"outdiroutdiroutdiroutdir")
    # d
    # asdsadasdasdsd
    script_job.script = scriptSave + '.zip'
    script_job.save()
    shutil.rmtree(outdir)
