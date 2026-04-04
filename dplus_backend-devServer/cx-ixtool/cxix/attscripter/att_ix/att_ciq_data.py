import copy
import numpy as np
import pandas as pd
import re
import os
import sys


class att_ciq_data:
    def __init__(self, infile, client):
        # self.sites = sites
        self.client = client
        self.edx = {}

        self.ciq_dict = {
            'IDLE': {
                'key': 'siteid',
                'key_columns': ['tech', 'eran_type', 'siteid', 'tnport', 't_siteid', 't_tnport'],
                'columns': ['tech', 'eran_type', 'siteid', 'nodeid', 'tnport', 't_siteid', 't_nodeid', 't_tnport'],
            },
            'LTE_REL': {
                'key': 'eutrancellfddid',
                'key_columns': ['siteid', 'eutrancellfddid', 'cellid', 'dlchannelbandwidth', 'freqband', 'isdlonly', 'enbid'],
                'columns': ['siteid', 'eutrancellfddid', 'cellid', 'dlchannelbandwidth', 'earfcndl', 'freqband', 'isdlonly',
                            'physicallayercellid', 'rachrootsequence', 'tac', 'enbid', 'bearer_address'],
            },
            'NR_REL': {
                'key': 'gutrancell',
                'key_columns': ['siteid', 'gutrancell', 'celllocalid', 'nrpci', 'ssbfrequency', 'ssbduration', 'ssboffset',
                                'ssbperiodicity', 'ssbsubcarrierspacing', 'gnbid'],
                'columns': ['siteid', 'gutrancell', 'celllocalid', 'nrpci', 'nrtac', 'ssbfrequency', 'ssbduration', 'ssboffset',
                            'ssbperiodicity', 'ssbsubcarrierspacing', 'gnbid', 'bearer_address'],
            },
            'EDP': {
                'key': 'siteid',
                'key_columns': ['siteid'],
                'columns': [
                    'edp_site_id', 'site_usid', 'region', 'market', 'hardware_type', 'msn_model', 'build_type', 'siad_model', 'carrier',
                    'cabinet_id', 'cabinet', 'bbu_type', 'node_model', 'status', 'cabinet_usid', 'siteid', 'siad_port_size_bbu',
                    'siad_port_facing_bbu', 'bearer_enodeb_sb_vlan_id', 'ipv6_siad_bearer_ip_def_router', 'ipv6_enodeb_bearer_ip',
                    'oam_enodeb_siad_oam_vlan', 'ipv6_siad_oam_ip_def_router', 'ipv6_enodeb_oam_ip', 'bbu_ptp_vlan_id', 'bbu_ptp_siad_ip',
                    'bbu_ptp_cabinet_ip', 'bbu_ptp_server_ip'],
            },
            'gNodeB': {
                'key': 'siteid',
                'key_columns': ['siteid', 'logical_node', 'bbtype', 'gnbid'],
                'columns': ['falocation', 'usid', 'siteid', 'logical_node', 'rbstype', 'gnbid', 'latitude', 'longitude', 'bbtype',
                             'xmu1', 'xmu1_p1', 'xmu1_p2', 'xmu1_p3', 'xmu2', 'xmu2_p1', 'xmu2_p2', 'xmu2_p3'],
            },
            'gUtranCell': {
                'key': 'gutrancell',
                'key_columns': ['siteid', 'gutrancell', 'carrier', 'sectorid', 'celllocalid', 'configuredmaxtxpower', 'arfcndl', 'arfcnul',
                                'bschannelbwdl', 'bschannelbwul', 'nrpci', 'rachrootsequence', 'nrtac', 'rru_type', 'bbu_xmu'],
                # 'sectorid', 'celllocalid', 'noofrfbranch'
                'columns': ['siteid', 'gutrancell', 'userlabel', 'carrier', 'sectorid', 'celllocalid', 'configuredmaxtxpower',
                            'arfcndl', 'arfcnul', 'bschannelbwdl', 'bschannelbwul', 'nrpci', 'rachrootsequence', 'nrtac', 'rru_type', 'rru_shared',
                            'noofrfbranch', 'bbu_xmu', 'port_1', 'port_2', 'port_3', 'port_4', 'esssclocalid', 'essscpairid',
                            'nodegroupsyncltenr', 'ssbfrequency', 'ssbduration', 'ssboffset', 'ssbperiodicity', 'ssbsubcarrierspacing',
                            'ru1_dltrafficdelay', 'ru1_ultrafficdelay', 'ru1_dlattenuation', 'ru1_ulattenuation',
                            'ru2_dltrafficdelay', 'ru2_ultrafficdelay', 'ru2_dlattenuation', 'ru2_ulattenuation',
                            'ru3_dltrafficdelay', 'ru3_ultrafficdelay', 'ru3_dlattenuation', 'ru3_ulattenuation',
                            'ru4_dltrafficdelay',  'ru4_ultrafficdelay', 'ru4_dlattenuation', 'ru4_ulattenuation', ],
            },
            'eNodeB': {
                'key': 'siteid',
                'key_columns': ['siteid', 'logical_node', 'bbtype', 'enbid'],
                'columns': ['falocation', 'usid', 'siteid', 'logical_node', 'rbstype', 'enbid', 'bbtype', 'latitude', 'longitude',
                            'xmu1', 'xmu1_p1', 'xmu1_p2', 'xmu1_p3', 'xmu2', 'xmu2_p1', 'xmu2_p2', 'xmu2_p3'],
            },
            'EUtranCellFDD': {
                'key': 'eutrancellfddid',
                'key_columns': ['siteid', 'eutrancellfddid',  'carrier', 'sectorid', 'freqband', 'cellid', 'earfcndl', 'earfcnul',
                                'dlchannelbandwidth', 'ulchannelbandwidth', 'physicallayercellid', 'rachrootsequence', 'cellrange', 'tac',
                                'nooftxantennas', 'noofrxantennas', 'configuredmaxtxpower', 'rru_type', 'bbu_xmu'],
                'columns': ['siteid', 'eutrancellfddid', 'userlabel', 'carrier', 'sectorid', 'freqband', 'cellid', 'earfcndl', 'earfcnul',
                            'dlchannelbandwidth', 'ulchannelbandwidth', 'physicallayercellid', 'rachrootsequence', 'cellrange', 'tac',
                            'mechanicalantennatilt', 'nooftxantennas', 'noofrxantennas', 'configuredmaxtxpower', 'rru_type', 'rru_shared',
                            'bbu_xmu', 'port_1', 'port_2', 'port_3', 'port_4',
                            'p614', 'p614portondu', 'p614portonp614', 'p614porttoruxmu', 'tandemp614',
                            'esssclocalid', 'essscpairid', 'nodegroupsyncltenr',
                            'ru1_dltrafficdelay', 'ru1_ultrafficdelay', 'ru1_dlattenuation', 'ru1_ulattenuation',
                            'ru2_dltrafficdelay', 'ru2_ultrafficdelay', 'ru2_dlattenuation', 'ru2_ulattenuation',
                            'ru3_dltrafficdelay',  'ru3_ultrafficdelay', 'ru3_dlattenuation', 'ru3_ulattenuation',
                            'ru4_dltrafficdelay', 'ru4_ultrafficdelay', 'ru4_dlattenuation', 'ru4_ulattenuation', ],
            },
            'EUtranFreqRelation': {
                'key': 'eutrancellfddid',
                'key_columns': ['eutrancellfddid', 'arfcnvalueeutrandl', 'cellreselectionpriority'],
                'columns': ['eutrancellfddid', 'arfcnvalueeutrandl', 'cellreselectionpriority'],
            },
            'UtranFreqRelation': {
                'key': 'eutrancellfddid',
                'key_columns': ['eutrancellfddid', 'arfcnvalueutrandl', 'cellreselectionpriority'],
                'columns': ['eutrancellfddid', 'arfcnvalueutrandl', 'cellreselectionpriority'],
            },
        }
        for sheet in self.ciq_dict.keys():
            try:
                df = pd.read_excel(infile, sheet_name=sheet, dtype='str')
                df.columns = df.columns.str.replace(r'[^a-zA-Z0-9_-]', '', regex=True)
                df.rename(columns=lambda x: str(x).lower(), inplace=True)
                df = df.replace('[^a-zA-Z0-9.,-_/+]', '', regex=True)
                df.replace({np.nan: None, '': None}, inplace=True)
                df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
                if sheet == 'EDP': df.rename(columns={'node_name': 'siteid'}, inplace=True)
                df = df[self.ciq_dict[sheet]['columns']]
                df.dropna(subset=self.ciq_dict[sheet]['key_columns'], inplace=True)
                df.reset_index(drop=True, inplace=True)
                self.edx[sheet] = df.copy()
            except:
                self.edx[sheet] = pd.DataFrame([], columns=self.ciq_dict[sheet]['columns'])

        self.edx['LTE_REL'].rename(columns={'siteid': 'postsite', 'eutrancellfddid': 'postcell', 'bearer_address': 'lte_ip'}, inplace=True)
        self.edx['LTE_REL']['isdlonly'] = self.edx['LTE_REL'].isdlonly.astype(str).str.lower()
        self.edx['LTE_REL'] = self.edx['LTE_REL'].groupby(['postsite', 'postcell'], sort=False, as_index=False).head(1)

        self.edx['NR_REL'].rename(columns={'siteid': 'postsite', 'gutrancell': 'postcell', 'celllocalid': 'cellid',
                                           'bearer_address': 'lte_ip'}, inplace=True)
        self.edx['NR_REL'] = self.edx['NR_REL'].groupby(['postsite', 'postcell'], sort=False, as_index=False).head(1)
        self.edx['NR_REL'] = self.edx['NR_REL'].assign(freqband=None, carrier=None, gnbidlength=self.client.gnbidlength)
        if len(self.edx['NR_REL'].index) > 0:
            self.edx['NR_REL'][['freqband', 'carrier']] = \
                    self.edx['NR_REL'].apply(self.get_nr_lte_relation_data, axis=1, result_type='expand')

        # ---EDP CIQ Data Frame Modification---
        self.edx['EDP'] = self.edx['EDP'].loc[self.edx['EDP']['siteid'].isin(
            list(set(list(self.edx['eNodeB'].siteid.unique()) + list(self.edx['eNodeB'].logical_node.unique()) +
                     list(self.edx['gNodeB'].siteid.unique()) + list(self.edx['gNodeB'].logical_node.unique())))
        )].groupby(['siteid'], sort=False, as_index=False).head(1)

        # ---eNodeBs and gNodeBs List for Scripting ---
        enodeb_list = list(self.edx['eNodeB'].siteid.unique())
        self.edx['eNodeB'] = self.edx['eNodeB'].loc[self.edx['eNodeB']['siteid'].isin(enodeb_list)]
        self.edx['eNodeB'] = self.edx['eNodeB'].groupby(['siteid'], sort=False, as_index=False).head(1)

        gnodeb_list = list(self.edx['gNodeB'].siteid.unique())
        self.edx['gNodeB'] = self.edx['gNodeB'].loc[self.edx['gNodeB']['siteid'].isin(gnodeb_list)]
        self.edx['gNodeB'] = self.edx['gNodeB'].groupby(['siteid'], sort=False, as_index=False).head(1)

        for key in ['eNodeB', 'gNodeB']:
            if len(self.edx.get(key).index) == 0: continue
            self.edx[key][['latitude', 'longitude']] = self.edx[key].apply(self.get_lat_long_data, axis=1, result_type='expand')
            self.edx[key][['bbtype', 'rbstype']] = self.edx[key][['bbtype', 'rbstype']].replace('[^0-9]', '', regex=True)
        # --- eNodeB CIQ Data Frame Modification --- --- EUtranCellFDD CIQ Data Frame Modification ---
        self.edx['EUtranCellFDD'] = self.edx['EUtranCellFDD'].loc[self.edx['EUtranCellFDD']['siteid'].isin(enodeb_list)]
        self.edx['EUtranCellFDD'] = self.edx['EUtranCellFDD'].groupby(['eutrancellfddid'], sort=False, as_index=False).head(1)
        self.edx['EUtranCellFDD'].rename(columns={'configuredmaxtxpower': 'confpow', 'nooftxantennas': 'nooftx',
                                                  'noofrxantennas': 'noofrx', 'sectorid': 'sefcix'}, inplace=True)
        self.edx['EUtranCellFDD'] = self.edx['EUtranCellFDD'].merge(
            self.edx['eNodeB'][['siteid', 'enbid', 'logical_node']], on='siteid', how='left', suffixes=('', '_enb'))
        if len(self.edx.get('EUtranCellFDD').index) > 0:
            delays = []
            attenuations = []
            for i in range(1, 9):
                delays.extend([F'ru{i}_dltrafficdelay', F'ru{i}_ultrafficdelay'])
                attenuations.extend([F'ru{i}_dlattenuation', F'ru{i}_ulattenuation'])
            for para in delays:
                if para not in self.edx.get('EUtranCellFDD').columns: self.edx.get('EUtranCellFDD')[para] = '32'
                self.edx.get('EUtranCellFDD').loc[self.edx.get('EUtranCellFDD')[para].isna(), [para]] = '32'
            for para in attenuations:
                if para not in self.edx.get('EUtranCellFDD').columns: self.edx.get('EUtranCellFDD')[para] = '0'
                self.edx.get('EUtranCellFDD').loc[self.edx.get('EUtranCellFDD')[para].isna(), [para]] = '0'

            self.edx.get('EUtranCellFDD')[['cell', 'cell_type', 'userlabel', 'dl_ul_delay_att', 'rru_type', 'isdlonly', 'sccix', 'carrier']] = \
                self.edx.get('EUtranCellFDD').apply(self.get_enodeb_cell_data, axis=1, result_type='expand')

        # --- gNodeB CIQ Data Frame Modification --- --- gUtranCell CIQ Data Frame Modification ---
        self.edx['gUtranCell'] = self.edx['gUtranCell'].loc[self.edx['gUtranCell']['siteid'].isin(gnodeb_list)]
        self.edx['gUtranCell'] = self.edx['gUtranCell'].groupby(['gutrancell'], sort=False, as_index=False).head(1)
        self.edx['gUtranCell'] = self.edx['gUtranCell'].merge(
            self.edx['gNodeB'][['siteid', 'gnbid', 'logical_node']], on='siteid', how='left', suffixes=('', '_gnb'))
        self.edx['gUtranCell'].rename(columns={'noofrfbranch': 'nooftx', 'celllocalid': 'cellid', 'sectorid': 'sefcix'}, inplace=True)
        if len(self.edx.get('gUtranCell').index) > 0:
            delays = []
            attenuations = []
            for i in range(1, 9):
                delays.extend([F'ru{i}_dltrafficdelay', F'ru{i}_ultrafficdelay'])
                attenuations.extend([F'ru{i}_dlattenuation', F'ru{i}_ulattenuation'])
            for para in delays:
                if para not in self.edx.get('gUtranCell').columns: self.edx.get('gUtranCell')[para] = '32'
                self.edx.get('gUtranCell').loc[self.edx.get('gUtranCell')[para].isna(), [para]] = '32'
            for para in attenuations:
                if para not in self.edx.get('gUtranCell').columns: self.edx.get('gUtranCell')[para] = '0'
                self.edx.get('gUtranCell').loc[self.edx.get('gUtranCell')[para].isna(), [para]] = '0'
            self.edx.get('gUtranCell')[[
                'cell', 'cell_type', 'userlabel', 'dl_ul_delay_att', 'rru_type', 'noofrx', 'sefcix', 'sectorid', 'ssbfrequency', 'ssbduration',
                'ssboffset', 'ssbperiodicity', 'ssbsubcarrierspacing', 'freqband', 'carrier']] = self.edx.get('gUtranCell').apply(
                self.get_gnodeb_cell_data, axis=1, result_type='expand')

        for key in ['EUtranCellFDD', 'gUtranCell']:
            for i in range(1, 9):
                for para in [F'ru{i}_dltrafficdelay', F'ru{i}_ultrafficdelay', F'ru{i}_dlattenuation', F'ru{i}_ulattenuation']:
                    if para in self.edx.get(key).columns: self.edx.get(key).drop([para], axis=1, inplace=True)

        for key in self.edx.keys(): self.edx[key].reset_index(inplace=True, drop=True)

    def get_lat_long_data(self, row):
        def lat_long_update(lat):
            if lat is not None and lat != '':
                while len(re.sub(r'[-.]', '', lat)) > 7:
                    lat = lat[:len(lat) - 1]
            return lat
        
        try: latitude = row.latitude
        except: latitude = None
        latitude = lat_long_update(latitude)
    
        try: longitude = row.longitude
        except: longitude = None
        longitude = lat_long_update(longitude)
        return [latitude, longitude]
    
    def get_enodeb_cell_data(self, row):
        try: cell_type = str(row.cell_type).upper()
        except: cell_type = 'TDD' if row.earfcndl == row.earfcnul else 'FDD'
        if len(cell_type) == 0: cell_type = 'TDD' if row.earfcndl == row.earfcnul else 'FDD'

        try: ulabel = str(row.userlabel)
        except: ulabel = row.eutrancellfddid
        if len(ulabel) == 0: ulabel = row.eutrancellfddid
        dl_ul_delay_att = [
            [row.get(F'ru1_dltrafficdelay'), row.get(F'ru1_ultrafficdelay'), row.get(F'ru1_dlattenuation'), row.get(F'ru1_ulattenuation')],
            [row.get(F'ru2_dltrafficdelay'), row.get(F'ru2_ultrafficdelay'), row.get(F'ru2_dlattenuation'), row.get(F'ru2_ulattenuation')],
            [row.get(F'ru3_dltrafficdelay'), row.get(F'ru3_ultrafficdelay'), row.get(F'ru3_dlattenuation'), row.get(F'ru3_ulattenuation')],
            [row.get(F'ru4_dltrafficdelay'), row.get(F'ru4_ultrafficdelay'), row.get(F'ru4_dlattenuation'), row.get(F'ru4_ulattenuation')]
        ]
        rru_type = str(row.rru_type).upper().split(',')
        rru_type.sort()

        isdlonly = str(row.noofrx == '0').lower()

        if 'r0' in row.carrier.lower(): sccix = F'{row.sefcix}_{row.eutrancellfddid.split("_")[-1]}'
        elif 'MC' in row.carrier: sccix = F'{row.sefcix}_{row.eutrancellfddid.split("_")[-1]}'
        else: sccix = row.sefcix
        carrier = str(row.carrier).upper()
        # 'cell', 'celltype', 'userlabel', 'dl_ul_delay_att', 'rru_type', 'isdlonly', 'sccix', carrier
        return [row.eutrancellfddid, cell_type, ulabel, dl_ul_delay_att, rru_type, isdlonly, sccix, carrier]

    def get_nr_lte_relation_data(self, row):
        # 'freqband', 'carrier',
        carrier = str(row.postcell).split('_')[-1]
        try:
            if int(re.search(r'\d+', carrier).group(0)) != 1: carrier += 'MC'
        except: pass
        return [self.get_freqband_form_nr_cell_name(str(row.postcell).upper()), carrier]

    def get_gnodeb_cell_data(self, row):
        carrier = str(row.carrier).upper()
        sefcix = row.sefcix

        try: ulabel = str(row.userlabel)
        except: ulabel = row.gutrancell
        if len(ulabel) == 0: ulabel = row.gutrancell

        dl_ul_delay_att = [
            [row.get(F'ru1_dltrafficdelay'), row.get(F'ru1_ultrafficdelay'), row.get(F'ru1_dlattenuation'), row.get(F'ru1_ulattenuation')],
            [row.get(F'ru2_dltrafficdelay'), row.get(F'ru2_ultrafficdelay'), row.get(F'ru2_dlattenuation'), row.get(F'ru2_ulattenuation')],
            [row.get(F'ru3_dltrafficdelay'), row.get(F'ru3_ultrafficdelay'), row.get(F'ru3_dlattenuation'), row.get(F'ru3_ulattenuation')],
            [row.get(F'ru4_dltrafficdelay'), row.get(F'ru4_ultrafficdelay'), row.get(F'ru4_dlattenuation'), row.get(F'ru4_ulattenuation')]
        ]
        rru_type = str(row.rru_type).upper().split(',')
        rru_type.sort()

        ssbfrequency, ssbduration, ssboffset = row.ssbfrequency, row.ssbduration, row.ssboffset
        ssbperiodicity, ssbsubcarrierspacing = row.ssbperiodicity, row.ssbsubcarrierspacing
        if ssbfrequency is None:
            os.environ.setdefault("DJANGO_SETTINGS_MODULE", "angustel.settings")
            sys.path.append(os.path.dirname(os.path.dirname(__file__)))
            from attscripter.models import ssbFrequency
            try:
                ssb = ssbFrequency.objects.get(mname=self.client.mname, arfcndl=row.arfcndl, bschannelbwdl=row.bschannelbwdl)
                ssbfrequency, ssbduration, ssboffset = ssb.ssbfrequency, ssb.ssbduration, ssb.ssboffset
                ssbperiodicity, ssbsubcarrierspacing = ssb.ssbperiodicity, ssb.ssbsubcarrierspacing
            except:
                assert False, F'!!! ssbFrequency DataBase doesnot have instance ' \
                              F'"arfcnDL-->{row.arfcndl}, bSChannelBwDL-->{row.bschannelbwdl}" for Market {self.client.mname}"  !!!'
            if ('AIR1281' in row.rru_type) and len(row.rru_type) > 0: ssbduration = '4'
        # 'cell', 'celltype', 'userlabel', 'dl_ul_delay_att', 'radiotype', 'noofrx', 'sefcix', 'sectorid',
        # 'ssbfrequency', 'ssbduration', 'ssboffset', 'ssbperiodicity', 'ssbsubcarrierspacing',
        # 'freqband', 'carrier'
        return [row.gutrancell, '5GNR', ulabel, dl_ul_delay_att, rru_type, row.nooftx, sefcix, row.gutrancell,
                ssbfrequency, ssbduration, ssboffset, ssbperiodicity, ssbsubcarrierspacing,
                self.get_freqband_form_nr_cell_name(row.gutrancell), carrier]
    
    @staticmethod
    def get_freqband_form_nr_cell_name(nr_cell):
        cell_split = nr_cell.upper().split('_')
        return cell_split[-2][:4] if len(cell_split) >= 2 and len(cell_split[-2]) >= 4 and cell_split[-2][0] == 'N' else 'None'
        
    def get_ru_type_for_cell(self, cell, outcol):
        if len(self.edx.get('EUtranCellFDD').loc[self.edx.get('EUtranCellFDD').eutrancellfddid.str.contains(cell)].index) > 0:
            return self.edx.get('EUtranCellFDD').loc[self.edx.get('EUtranCellFDD').eutrancellfddid.str.contains(cell)].iloc[0][outcol]
        elif len(self.edx.get('gUtranCell').loc[self.edx.get('gUtranCell').gutrancell.str.contains(cell)].index) > 0:
            return self.edx.get('gUtranCell').loc[self.edx.get('gUtranCell').gutrancell.str.contains(cell)].iloc[0][outcol]


    def get_sheet_data(self, sheet_name, field_name):
        return self.edx.get(sheet_name).to_dict('records')[0].get(field_name)

    def get_sheet_data_upper(self, sheet_name, field_name):
        if self.edx.get(sheet_name).to_dict('records')[0].get(field_name) is None: return None
        else: return self.edx.get(sheet_name).to_dict('records')[0].get(field_name).upper()

    def get_site_field_data_upper(self, siteid, sheet_name, field):
        if self.site_sheet_data(sheet_name, siteid).iloc[0][field] is None: return None
        else: return self.site_sheet_data(sheet_name, siteid).iloc[0][field].upper()

    def get_edp_ip_site_data_upper(self, siteid, field):
        if (self.site_sheet_data('EDP', siteid).iloc[0][field] != '') and (not pd.isnull(self.site_sheet_data('EDP', siteid).iloc[0][field])):
            return ':'.join([i.lstrip('0') for i in self.site_sheet_data('EDP', siteid).iloc[0][field].upper().split(':')])
        else: return ''

    def get_site_sheet_ip_data_upper(self, siteid, sheet, field):
        if (self.site_sheet_data(sheet, siteid).iloc[0][field] != '') and (not pd.isnull(self.site_sheet_data(sheet, siteid).iloc[0][field])):
            return ':'.join([i.lstrip('0') for i in self.site_sheet_data(sheet, siteid).iloc[0][field].upper().split(':')])
        else: return ''

    def get_eutrancell_field(self, cell, field):
        return self.edx.get('EUtranCellFDD')[self.edx.get('EUtranCellFDD').cell == cell][field].iloc[0]

    def site_sheet_data(self, sheet_name, siteid):
        return self.edx.get(sheet_name).loc[self.edx.get(sheet_name)[self.ciq_dict[sheet_name]['key']] == siteid]


    # def get_idle_data(self, row):
    #     vlanid_dict = {'ERAN': '1', 'ERAN_CA': '1', 'ERAN_UlCoMP': '2', 'ERAN_NRCA': '3', 'ERAN_SACA': '3'}
    #     tech = str(row.tech).upper()
    #     if tech in ['NR']: tech = 'NR'
    #     elif tech in ['LTE', '4G']: tech = 'LTE'
    #     else: tech = None
    #     vlanid = vlanid_dict[row.eran_type]
    #     ethernetport = F'{row.eran_type}_{row.tnport.split("IDL_")[-1].replace("_", "")}'
    #     t_ethernetport = F'{row.eran_type}_{row.t_tnport.split("IDL_")[-1].replace("_", "")}'
    #     # 'tech', 'vlanid', 'ethernetport', 't_ethernetport'
    #     return [tech, vlanid, ethernetport, t_ethernetport]