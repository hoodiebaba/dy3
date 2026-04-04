import sys
import os
import pandas as pd
from django.db import transaction
from common_func.custom_log import Custom_Log

from attgsaudit.models import LTEBandBWLayer
from attgsaudit.models import LTEearfcnBandBWLayer
from attgsaudit.models import LTECAPair
from attgsaudit.models import UMTSBand
from attgsaudit.models import NRBand

from django.conf import settings
custom_log_db = Custom_Log(log_file=os.path.join(settings.MEDIA_ROOT, 'dbupdate', F'test.log'), activity='Updating DB Tables')
pd_sheets = None

@transaction.atomic
def load_lte_band_bwlayer():
    table_name = 'LTEBandBWLayer'
    df = dataprocess_form_excell(pd_sheets, table_name)
    if len(df.index) > 0:
        df = df[['band', 'bandwidth', 'layer']]
        df['band'] = df.band.astype(int)
        df['bandwidth'] = df.bandwidth.astype(int)
        for index, row in df.iterrows():
            o_d = row.to_dict()
            obj, created = LTEBandBWLayer.objects.update_or_create(band=o_d.get("band"), bandwidth=o_d.get("bandwidth"), defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_lte_earfcn_band_bw_layer():
    table_name = 'LTEearfcnBandBWLayer'
    df = dataprocess_form_excell(pd_sheets, table_name)
    if len(df.index) > 0:
        df = df[['earfcndl', 'band', 'bandwidth']]
        df['earfcndl'] = df.earfcndl.astype(int)
        df['band'] = df.band.astype(int)
        df['bandwidth'] = df.bandwidth.astype(int)
        for index, row in df.iterrows():
            o_d = row.to_dict()
            obj, created = LTEearfcnBandBWLayer.objects.update_or_create(earfcndl=o_d.get('earfcndl'), band=o_d.get('band'),
                                                                         bandwidth=o_d.get('bandwidth'), defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_lte_ca_pair():
    table_name = 'LTECAPair'
    df = dataprocess_form_excell(pd_sheets, table_name)
    if len(df.index) > 0:
        df = df[['pcell', 'scell']]
        for index, row in df.iterrows():
            o_d = row.to_dict()
            obj, created = LTECAPair.objects.update_or_create(pcell=o_d.get('pcell'), scell=o_d.get('scell'), defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_umts_band():
    # UMTSBand
    table_name = 'UMTSBand'
    df = dataprocess_form_excell(pd_sheets, table_name)
    if len(df.index) > 0:
        df = df[['start', 'end', 'band']]
        for index, row in df.iterrows():
            o_d = row.to_dict()
            obj, created = UMTSBand.objects.update_or_create(start=o_d.get('start'), end=o_d.get('end'), defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'{table_name} Updated Complete!!!')
    else: custom_log_db.log.info(F'--------------> No Data for {table_name} <--------------')


@transaction.atomic
def load_nr_band():
    table_name = 'NRBand'
    df = dataprocess_form_excell(pd_sheets, table_name)
    if len(df.index) > 0:
        df = df[['market', 'arfcndl', 'bschannelbwdl', 'ssbfrequency', 'ssboffset', 'ssbduration', 'ssbperiodicity', 'ssbsubcarrierspacing']]
        for index, row in df.iterrows():
            o_d = row.to_dict()
            obj, created = NRBand.objects.update_or_create(market=o_d['market'], arfcndl=o_d['arfcndl'], bschannelbwdl=o_d['bschannelbwdl'],
                                                           defaults=o_d)
            custom_log_db.log.info(F'{table_name}--{created}---{obj}')
        custom_log_db.log.info(F'NRBand Updated Complete!!!')


def dataprocess_form_excell(pd_sheets, sheets_name):
    df_sheet = pd.DataFrame([])
    if sheets_name in pd_sheets.sheet_names:
        df_sheet = pd_sheets.parse(sheets_name).astype(str)
        if len(df_sheet.index):
            df_sheet = df_sheet.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    return df_sheet


def dbupdate_attgsaudit(db_update_file, custom_log_defined):
    global custom_log_db
    global pd_sheets
    custom_log_db = custom_log_defined
    pd_sheets = pd.ExcelFile(db_update_file)
    try:
        load_lte_band_bwlayer()
        load_lte_earfcn_band_bw_layer()
        load_lte_ca_pair()
        load_umts_band()
        load_nr_band()
        return True
    except: return False
