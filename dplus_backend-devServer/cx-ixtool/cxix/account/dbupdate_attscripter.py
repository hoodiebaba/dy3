import sys
import os
import pandas as pd
from django.db import transaction
from common_func.custom_log import Custom_Log

from attscripter.models import ssbFrequency
from attscripter.models import MMEPool, TermPointToMme
from attscripter.models import AMFPool, TermPointToAmf
from attscripter.models import Software
from attscripter.models import Client
from attscripter.models import MoRelation
from attscripter.models import MoAttribute
from attscripter.models import MoName, MoDetail

from django.conf import settings
custom_log_db = Custom_Log(log_file=os.path.join(settings.MEDIA_ROOT, 'dbupdate', F'test.log'), activity='Updating DB Tables')

sw = Software()
pd_sheets = None
sw_name = 'test'


@transaction.atomic
def load_ssbfrequency():
    table_name = 'ssbFrequency'
    df = dataprocess_form_excell(table_name)
    df = df.loc[(~((df.mname == 'nan') | (df.mname.isna()) | (df.arfcndl == 'nan') | (df.arfcndl.isna()) |
                   (df.bschannelbwdl == 'nan') | (df.bschannelbwdl.isna())))]
    if len(df.index) > 0:
        df = df[['mname', 'arfcndl', 'bschannelbwdl', 'ssbfrequency', 'ssboffset', 'ssbduration', 'ssbperiodicity',
                 'ssbsubcarrierspacing', 'arfcnul', 'bschannelbwul', 'band']]
        for index, row in df.iterrows():
            o_d = row.to_dict()
            obj, created = ssbFrequency.objects.update_or_create(mname=o_d['mname'], arfcndl=o_d['arfcndl'], bschannelbwdl=o_d['bschannelbwdl'],
                                                                 defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_mme_pool_list():
    table_name = 'TermPointToMme'
    df = dataprocess_form_excell(table_name)
    if len(df.index) > 0:
        df = df[['MMEPoolID', 'mmeName', 'termPointToMmeId', 'ipAddress1', 'ipAddress2', 'ipv6Address1', 'ipv6Address2',
                 'mmeSupportLegacyLte', 'mmeSupportNbIoT']]
        df.mmeSupportLegacyLte = df.mmeSupportLegacyLte.str.lower()
        df.mmeSupportNbIoT = df.mmeSupportNbIoT.str.lower()
        for name in df.MMEPoolID.unique():
            obj, created = MMEPool.objects.update_or_create(name=name, defaults={'name': name})
            custom_log_db.log.info(F'MMEPoolID--{created}---{obj}')
            obj, created = AMFPool.objects.update_or_create(name=name, defaults={'name': name})
        for index, row in df.iterrows():
            o_d = row.to_dict()
            o_d.update({'mmepool': MMEPool.objects.get(name=o_d.get('MMEPoolID'))})
            del o_d['MMEPoolID']
            obj, created = TermPointToMme.objects.update_or_create(mmepool=o_d['mmepool'], mmeName=o_d['mmeName'], defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_anf_pool_list():
    table_name = 'TermPointToAmf'
    df = dataprocess_form_excell('TermPointToAmf')
    if len(df.index) > 0:
        df = df[['AMFPoolID', 'amfName', 'termPointToAmfId', 'defaultAmf', 'ipv4Address1', 'ipv4Address2', 'ipv6Address1', 'ipv6Address2']]
        df.defaultAmf = df.defaultAmf.str.lower()
        for name in df.AMFPoolID.unique():
            obj, created = AMFPool.objects.update_or_create(name=name, defaults={'name': name})
            custom_log_db.log.info(F'AMFPoolID--{created}---{obj}')
        for index, row in df.iterrows():
            o_d = row.to_dict()
            o_d.update({'mmepool': AMFPool.objects.get(name=o_d.get('AMFPoolID'))})
            del o_d['AMFPoolID']
            obj, created = TermPointToAmf.objects.update_or_create(mmepool=o_d['amfpool'], mmeName=o_d['amfName'], defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_software():
    table_name = 'Software'
    df = dataprocess_form_excell(table_name)
    if len(df.index) > 0:
        df = df[['swname', 'nodeIdentBB', 'nodeTypeBB', 'UpPacBB']]
        df = df.loc[df.swname == sw_name]
        for index, row in df.iterrows():
            o_d = row.to_dict()
            obj, created = Software.objects.update_or_create(swname=o_d['swname'], defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_customer():
    table_name = 'Client'
    df = dataprocess_form_excell(table_name)
    df = df.loc[(~((df.cname == 'nan') | (df.cname.isna()) | (df.mname == 'nan') | (df.mname.isna()) |
                   (df.software == 'nan') | (df.software.isna()) | (df.mmepool == 'nan') | (df.mmepool.isna()) |
                   (df.amfpool == 'nan') | (df.amfpool.isna())))]
    if len(df.index) > 0:
        df = df[['cname', 'mname', 'enm', 'software', 'mmepool', 'amfpool', 'NTPServer1', 'NTPServer2', 'timeZone', 'dnPrefix', 'SubNetwork',
                 'UserName', 'Userpass', 'sUserName', 'sUserpass', 'creator', 'TnPort', 'gnbidlength', 'PlmnList', 'addPlmnList']]
        df = df.loc[df.software == sw_name]
        df['software'] = sw
        if len(df.index) > 0:
            for index, row in df.iterrows():
                o_d = row.to_dict()
                o_d |= {'mmepool': MMEPool.objects.get(name=o_d['mmepool']), 'amfpool': AMFPool.objects.get(name=o_d['amfpool'])}
                obj, created = Client.objects.update_or_create(cname=o_d.get('cname'), mname=o_d['mname'], software=o_d['software'],
                                                               enm=o_d['enm'], mmepool=o_d['mmepool'], defaults=o_d)
                custom_log_db.log.info(F'{table_name}--{created}---{obj}')
            custom_log_db.log.info(F'{table_name} Updated Complete!!!')
        else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_morelation():
    table_name = 'MoRelation'
    df = dataprocess_form_excell(table_name)
    df = df.loc[(~((df.parent == 'nan') | (df.parent.isna()) | (df.child == 'nan') | (df.child.isna()) | (df.tag == 'nan') | (df.tag.isna())))]
    if len(df.index) > 0:
        df = df[['parent', 'child', 'tag']].drop_duplicates()
        df['software'] = sw
        for index, row in df.iterrows():
            o_d = row.to_dict()
            obj, created = MoRelation.objects.update_or_create(parent=o_d['parent'], child=o_d['child'], tag=o_d['tag'], software=o_d['software'],
                                                               defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_moattribute():
    table_name = 'MoAttribute'
    df = dataprocess_form_excell(table_name)
    df = df.loc[(~((df.moc == 'nan') | (df.moc.isna()) | (df.attribute == 'nan') | (df.attribute.isna())))]
    if len(df.index) > 0:
        df = df[['moc', 'attribute']].drop_duplicates()
        df = df.dropna()
        df['software'] = sw
        for index, row in df.iterrows():
            o_d = row.to_dict()
            obj, created = MoAttribute.objects.update_or_create(software=o_d['software'], moc=o_d['moc'], defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_moname_modetail():
    table_name = 'MOC'
    df_moc = dataprocess_form_excell(table_name)
    df_moc = df_moc.loc[(~((df_moc.motype == 'nan') | (df_moc.moc == 'nan') | (df_moc.parameter == 'nan') |
                           (df_moc.motype.isna()) | (df_moc.moc.isna()) | (df_moc.parameter.isna())))]
    if len(df_moc.index) > 0:
        df_moc = df_moc[['motype', 'moc', 'moid', 'parameter', 'value', 'flag']]
        df_moc = df_moc.replace({'': '""', 'nan': '""'})
        df_moc['moid'] = df_moc.moid.replace({'nan': '', None: '', '""': '', 'None': '', '[]': '', '{}': ''})
        df_moc['flag'] = df_moc.flag.str.lower().replace({'true': True, 'false': False})
        df_moc['software'] = sw
        # MoName
        df = df_moc[['software', 'motype', 'moc', 'moid']].drop_duplicates()
        if len(df.index) > 0:
            for index, row in df.iterrows():
                o_d = row.to_dict()
                obj, created = MoName.objects.update_or_create(software=o_d.get('software'), motype=o_d.get('motype'),
                                                               moc=o_d.get('moc'), moid=o_d.get('moid'), defaults=o_d)
                custom_log_db.log.info(F'MoName--{created}---{obj}')
            custom_log_db.log.info(F'MoName Updated Complete!!!')
        else: custom_log_db.log.info(F'--------------> No Data for MoName <--------------')
        # MoDetail
        if len(df_moc.index) > 0:
            for index, row in df_moc.iterrows():
                mo = MoName.objects.get(software=row.software, motype=row.motype, moc=row.moc, moid=row.moid)
                obj, created = MoDetail.objects.update_or_create(mo=mo, parameter=row.parameter, defaults={
                    'mo': mo, 'parameter': row.parameter, 'value': row.value, 'flag': row.flag})
                custom_log_db.log.info(F'MoDetail--{created}---{obj}')
            custom_log_db.log.info(F'MoDetail Updated Complete!!!')
        else: custom_log_db.log.info(F'--------------> No Data for MoDetail <--------------')
    else: custom_log_db.log.info(F'--------------> No Data for MoName, MoDetail <--------------')


def dataprocess_form_excell(sheets_name):
    df_sheet = pd.DataFrame([])
    if sheets_name in pd_sheets.sheet_names:
        df_sheet = pd_sheets.parse(sheets_name).astype(str)
        if len(df_sheet.index):
            df_sheet = df_sheet.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    return df_sheet


def dbupdate_attscripter(db_update_file, custom_log_defined):
    global custom_log_db
    global pd_sheets
    global sw
    global sw_name

    try:
        custom_log_db = custom_log_defined
        sw_name = os.path.basename(db_update_file).split('.')[0]
        pd_sheets = pd.ExcelFile(db_update_file)

        load_ssbfrequency()
        load_mme_pool_list()
        load_anf_pool_list()
        load_software()
        sw = Software.objects.get(swname=sw_name)
        load_customer()
        load_morelation()
        load_moattribute()
        load_moname_modetail()
        return True
    except:
        return False
