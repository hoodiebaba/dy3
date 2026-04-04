import copy
import os
import datetime
import json
import re
import pandas as pd
from pandas import ExcelWriter
import numpy as np
from collections import OrderedDict
from .att_ciq_data import att_ciq_data
from .att_dcgk_data import att_dcgk_data
from common_func.dcgkextract import dcgkextract


class att_usid_data:
    def __init__(self, client, cix_file, zip_file=None, sites='', base_dir='', log=None):
        self.client = client
        self.enm = self.get_uri_emn_details(enm_name=self.client.enm)
        self.base_dir = base_dir
        self.cix = att_ciq_data(infile=cix_file, client=self.client)
        self.log = log.log

        self.plmn = json.loads(self.client.PlmnList)
        self.mccmnc = F'{self.plmn.get("mcc")}{self.plmn.get("mnc")}'
        self.datetime = datetime.datetime.now().strftime('%d_%B_%Y_%H%M%S')
        self.sitename = sites
        self.y_cable = True
        self.script = {'y_cable': False, 'relation_cleanup': False}
        # CIQ Process
        # DCGK Log file Extract and Store in Dict
        self.sites = {}
        dcgk_extract = dcgkextract(inzip=zip_file)
        for node in dcgk_extract.merged_dict.keys():
            self.sites['site_' + str(node)] = att_dcgk_data(node, dcgk_extract.merged_dict.get(node, {}))
        
        self.site_eq_change = {}
        self.gnodeb = {}
        self.enodeb = {}
        self.df_gnb_cell = pd.DataFrame([], columns=[
            'celltype', 'fdn', 'presite', 'precell', 'pregnbid', 'precellid', 'postsite', 'postcell', 'postcellid', 'sefcix', 'sccix', 'carrier',
            'rrushared', 'frutypecix', 'confpowcix', 'dl_ul_delay_att', 'movement', 'post_bb', 'pre_bb', 'bb_change', 'addcell', 'gnbid', 'cellid',
            'nrpci', 'nrtac', 'rachrootsequence', 'ssbfrequency', 'ssbduration', 'ssboffset', 'ssbperiodicity', 'ssbsubcarrierspacing', 'arfcndl',
            'arfcnul', 'bschannelbwdl', 'bschannelbwul', 'confpow', 'presef', 'seffdn', 'presc', 'scfdn', 'prefru', 'prefrutype',
            'prefrusn', 'sc', 'sef', 'noofrx', 'nooftx', 'fruchange', 'freqband', 'nodegroupsyncltenr', 'esssclocalid', 'essscpairid',
        ])
        self.df_enb_cell = pd.DataFrame([], columns=[
            'celltype', 'fdn', 'presite', 'precell', 'preenbid', 'precellid', 'postsite', 'postcell', 'postcellid', 'sefcix', 'sccix', 'carrier',
            'rrushared', 'frutypecix', 'confpowcix', 'dl_ul_delay_att', 'bbu_xmu', 'port_1', 'port_2', 'port_3', 'port_4', 'p614', 'p614portondu',
            'p614portonp614', 'p614porttoruxmu', 'tandemp614', 'esssclocalid', 'essscpairid', 'nodegroupsyncltenr', 'movement', 'post_bb', 'pre_bb',
            'bb_change', 'addcell', 'enbid', 'freqband', 'cellid', 'earfcndl', 'earfcnul', 'dlchannelbandwidth', 'ulchannelbandwidth',
            'physicallayercellid', 'rachrootsequence', 'cellrange', 'tac', 'userlabel', 'isdlonly', 'scfdn', 'presc', 'noofrx', 'nooftx',
            'confpow', 'sef', 'seffdn', 'presef', 'prefru', 'prefrutype', 'prefrusn', 'sc', 'fruchange', 'nbiotcelltype',
            'precellref', 'postcellref'
        ])
        self.df_ant_near_unit = pd.DataFrame()
        self.df_nr_rel = pd.DataFrame()
        self.df_lte_rel = pd.DataFrame()
        self.df_idle = pd.DataFrame()
        self.ant_system_list = []
        self.initialize()

    def initialize(self):
        self.gnodeb_site_dict()
        self.enodeb_site_dict()
        # gNodeB & eNodeB Cell Data Process
        if len(self.gnodeb) > 0:
            self.gnodeb_cell_status()
            self.gnodeb_create_cell()
        if len(self.enodeb) > 0:
            self.enodeb_cell_status()
            self.enodeb_cell_create()
            self.enodeb_nbiot_create()
            # eNodeB Relations Data Process
            self.eutran_network()
            self.enodeb_gutranetwork()
            self.enodeb_utranetwork()
            self.enodeb_validate_cix_dcgk_data()
        # self.enodeb_validate_cix_dcgk_data()
        self.gnodeb_enodeb_data_update()
        self.enodeb_gnodeb_antenna_system()
        self.enodeb_gnodeb_antnearunit()
        self.xmu_all_site()
        self.rilink_all_site()
        self.idle_all_site()
        self.ext_lte_nr_rel_ciq()
        self.save_different_dataframe()
        del self.ant_system_list
        del self.cix
        del self.mccmnc

    @staticmethod
    def get_tn_port_for_bb_type(bbtype=''):
        return {'5216': 'TN_B', '6630': 'TN_A', '6648': 'TN_IDL_B', '6651': 'TN_IDL_B'}.get(bbtype, 'TN_A')

    def gnodeb_site_dict(self):
        # from ipaddress import IPv4Interface
        for row in self.cix.edx.get('gNodeB').itertuples():
            # ---equipment type---
            bbtype = self.cix.get_site_field_data_upper(row.siteid, 'gNodeB', 'bbtype')
            TnPort = self.get_tn_port_for_bb_type(bbtype)
            lnode = self.cix.get_site_field_data_upper(row.siteid, 'gNodeB', 'logical_node')
            site = self.sites.get(F'site_{row.siteid}')
            nw_ids = {'GUtraNetwork': '1', 'NRNetwork': '1', 'EUtraNetwork': '1', 'UtraNetwork': '1', 'Lrat': None,  'GNBDU': None, 'GNBCUCP': None,
                      'GNBCUUP': None, 'equ_change': True, 'fingerprint': row.siteid}
            if site:
                for moc in ['GNBDU', 'GNBCUUP', 'GNBCUCP']:
                    mo = site.find_child_mos_of_managedelement(moc=F'{moc}Function')
                    if len(mo) > 0: nw_ids[moc] = mo[0]
                if nw_ids['GNBCUCP']:
                    for moc in ['GUtraNetwork', 'NRNetwork', 'EUtraNetwork', 'UtraNetwork']:
                        nw_nwmo = site.find_mo_ending_with_parent_str(moc=moc, parent=nw_ids['GNBCUCP'])
                        if len(nw_nwmo) > 0: nw_ids[moc] = nw_nwmo[0].split('=')[-1]
                nw_ids['fingerprint'] = site.site_extract_data(site.get_mo_w_end_str('SystemFunctions=1,Lm=1')).get('fingerprint')
                if bbtype in site.equipment_name.upper(): nw_ids['equ_change'] = False
            self.gnodeb[row.siteid] = {
                'postsite': row.siteid,
                'tech': 'NR',
                'fa': self.cix.get_site_field_data_upper(row.siteid, 'gNodeB', 'falocation'),
                'usid': self.cix.get_site_field_data_upper(row.siteid, 'gNodeB', 'usid'),
                'logical_site': self.cix.get_site_field_data_upper(row.siteid, 'gNodeB', 'logical_node'),
                'nodeid': self.cix.get_site_field_data_upper(row.siteid, 'gNodeB', 'gnbid'),
                'rbstype': self.cix.get_site_field_data_upper(row.siteid, 'gNodeB', 'rbstype'),
                'bbtype': bbtype,
                'msmm': False,
                'mmbb': False,
                'gpsdelay': '29',
                'latitude': self.cix.get_site_field_data_upper(row.siteid, 'gNodeB', 'latitude'),
                'longitude': self.cix.get_site_field_data_upper(row.siteid, 'gNodeB', 'longitude'),
                'bbuid': self.sites.get(F'site_{row.siteid}').pre_equipment_id if not nw_ids['equ_change'] else '1',
                'siad_port': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'siad_port_facing_bbu'),
                'port_speed': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'siad_port_size_bbu'),
                'sctpendpoint': '1',
                'sctpprofile': '1',
                'oam': 'OAM',
                'oam_interface': F'{TnPort}_OAM',
                'oam_add': '1',
                'oam_vlanid': 'VLAN_OAM',
                'oam_van': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'oam_enodeb_siad_oam_vlan'),
                'oam_ip': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'ipv6_enodeb_oam_ip'),
                'oam_gway': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'ipv6_siad_oam_ip_def_router'),
                'lte': 'S1',
                'lte_interface': F'{TnPort}_S1',
                'lte_add': '1',
                'lte_vlanid': 'VLAN_NR',
                'lte_dist': '1',
                'lte_vlan': self.cix.get_site_sheet_ip_data_upper(lnode, 'EDP', 'bearer_enodeb_sb_vlan_id'),
                'lte_ip': self.cix.get_site_sheet_ip_data_upper(lnode, 'EDP', 'ipv6_enodeb_bearer_ip'),
                'lte_gway': self.cix.get_site_sheet_ip_data_upper(lnode, 'EDP', 'ipv6_siad_bearer_ip_def_router'),
                'rou_change': False,
                'int_change': False,
                'ptp_vlan': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_vlan_id'),
                'ptp_ip': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_cabinet_ip'),
                'ptp_gway': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_siad_ip'),
                'ptp_mask': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_server_ip'),
                'ptp_server': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_server_ip'),
                'nodetype': self.client.software.nodeTypeBB,
                'sw': self.client.software.UpPacBB,
                'nodeident': self.client.software.nodeIdentBB,
                'dnPrefix': F'SubNetwork={self.client.dnPrefix}',
                'ntpip1': self.client.NTPServer1,
                'ntpip2': self.client.NTPServer2,
                'timeZone': self.client.timeZone,
                'TnPort': TnPort,
                'gnbidlength': self.client.gnbidlength,
                'username': self.client.UserName,
                'password': self.client.Userpass,
                'susername': 'expert',
                'spassword': '5Gexpert',
                'userLabel': '5GRadioNode',
                'tnbw': '9 (10G_FULL)' if self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'siad_port_size_bbu') != '1GE' else '6 (1G_FULL)',
                'plmnlist': json.loads(self.client.PlmnList),
                'addplmnlist': json.loads(self.client.addPlmnList),
                'me': F'SubNetwork={self.client.dnPrefix},MeContext={row.siteid},ManagedElement={row.siteid}',
            }
            self.gnodeb[row.siteid] |= copy.deepcopy(nw_ids)

    def enodeb_site_dict(self):
        from ipaddress import IPv4Interface
        for row in self.cix.edx.get('eNodeB').itertuples():
            bbtype = self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'bbtype')
            TnPort = self.get_tn_port_for_bb_type(bbtype)
            lnode = self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'logical_node')
            site = self.sites.get(F'site_{row.siteid}')
            nw_ids = {'GUtraNetwork': '1', 'NRNetwork': '1', 'EUtraNetwork': '1', 'UtraNetwork': '1', 'fingerprint': row.siteid,
                      'Lrat': None, 'GNBDU': None, 'GNBCUCP': None, 'GNBCUUP': None, 'equ_change': True}
            if site:
                mo = site.find_child_mos_of_managedelement(moc='ENodeBFunction')
                if len(mo) > 0:
                    nw_ids['Lrat'] = mo[0]
                    for key in ['GUtraNetwork', 'NRNetwork', 'EUtraNetwork', 'UtraNetwork']:
                        nw_nwmo = site.find_mo_ending_with_parent_str(moc=key, parent=nw_ids['Lrat'])
                        if len(nw_nwmo) > 0: nw_ids[key] = nw_nwmo[0].split('=')[-1]
                nw_ids['fingerprint'] = site.site_extract_data(site.get_mo_w_end_str('SystemFunctions=1,Lm=1')).get('fingerprint')
                if bbtype in site.equipment_name.upper(): nw_ids['equ_change'] = False

            self.enodeb[row.siteid] = {
                'postsite': row.siteid,
                'tech': 'LTE',
                'fa': self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'falocation'),
                'usid': self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'usid'),
                'logical_site': self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'logical_node'),
                'nodeid': self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'enbid'),
                'rbstype': self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'rbstype'),
                'bbtype': bbtype,
                'msmm': False,
                'mmbb': False,
                'gpsdelay': '29',
                'latitude': self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'latitude'),
                'longitude': self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'longitude'),
                'bbuid': self.sites.get(F'site_{row.siteid}').pre_equipment_id if not nw_ids['equ_change'] else '1',
                'siad_port': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'siad_port_facing_bbu'),
                'port_speed': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'siad_port_size_bbu'),
                'sctpendpoint': '1',
                'sctpprofile': '1',
                'oam': 'vr_OAM',
                'oam_interface': '1',
                'oam_add': '1',
                'oam_vlanid': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'oam_enodeb_siad_oam_vlan'),
                'oam_van': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'oam_enodeb_siad_oam_vlan'),
                'oam_ip': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'ipv6_enodeb_oam_ip'),
                'oam_gway': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'ipv6_siad_oam_ip_def_router'),
                'lte': 'LTE',
                'lte_interface': '1',
                'lte_add': '1',
                'lte_dist': '1',
                'lte_vlanid': self.cix.get_site_sheet_ip_data_upper(lnode, 'EDP', 'bearer_enodeb_sb_vlan_id'),
                'lte_vlan': self.cix.get_site_sheet_ip_data_upper(lnode, 'EDP', 'bearer_enodeb_sb_vlan_id'),
                'lte_ip': self.cix.get_site_sheet_ip_data_upper(lnode, 'EDP', 'ipv6_enodeb_bearer_ip'),
                'lte_gway': self.cix.get_site_sheet_ip_data_upper(lnode, 'EDP', 'ipv6_siad_bearer_ip_def_router'),
                'rou_change': False,
                'int_change': False,
                'ptp_vlan': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_vlan_id'),
                'ptp_ip': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_cabinet_ip'),
                'ptp_gway': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_siad_ip'),
                'ptp_mask': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_server_ip'),
                'ptp_server': self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'bbu_ptp_server_ip'),
                'nodetype': self.client.software.nodeTypeBB,
                'sw': self.client.software.UpPacBB,
                'nodeident': self.client.software.nodeIdentBB,
                'dnPrefix': F'SubNetwork={self.client.dnPrefix}',
                'ntpip1': self.client.NTPServer1,
                'ntpip2': self.client.NTPServer2,
                'timeZone': self.client.timeZone,
                'TnPort': TnPort,
                'gnbidlength': self.client.gnbidlength,
                'username': self.client.UserName,
                'password': self.client.Userpass,
                'susername': self.client.sUserName,
                'spassword': self.client.sUserpass,
                'userLabel': '4GRadioNode',
                'tnbw': '9 (10G_FULL)' if self.cix.get_site_sheet_ip_data_upper(row.siteid, 'EDP', 'siad_port_size_bbu') != '1GE' else '6 (1G_FULL)',
                'plmnlist': json.loads(self.client.PlmnList),
                'addplmnlist': json.loads(self.client.addPlmnList),
                'me': F'SubNetwork={self.client.dnPrefix},MeContext={row.siteid},ManagedElement={row.siteid}',
            }
            self.enodeb[row.siteid] |= copy.deepcopy(nw_ids)

    # --- LTE, 5G Parameters and SW Update ---
    def gnodeb_enodeb_data_update(self):
        for siteid in set().union(self.enodeb.keys(), self.gnodeb.keys()):
            enodeb, gnodeb = self.enodeb.get(siteid), self.gnodeb.get(siteid)
            equ_change = enodeb.get('equ_change') if siteid in self.enodeb.keys() else gnodeb.get('equ_change')
            mo_ids = {}
            if (self.sites.get(F'site_{siteid}')) and (not equ_change):
                mo_ids = self.sites.get(F'site_{siteid}').get_transport_mos_id()
                parameter = ['oam', 'oam_interface', 'oam_add', 'oam_vlanid', 'TnPort']
                lte_parameter = ['sctpprofile', 'sctpendpoint', 'lte', 'lte_interface', 'lte_add', 'lte_vlanid', 'lte_dist']
                for node in [enodeb, gnodeb]:
                    if node:
                        for para in parameter:
                            if mo_ids.get(para): node |= {para: mo_ids.get(para)}
                        temp_str = 'Lrat' if 'LTE' in node.get('tech') else 'GNBDU'
                        if node.get(temp_str):
                            temp_str = '4g_' if 'LTE' in node.get('tech') else ''
                            for para in lte_parameter:
                                if mo_ids.get(F'{temp_str}{para}'): node |= {para: mo_ids.get(F'{temp_str}{para}')}
            
            if siteid in self.enodeb.keys() and siteid in self.gnodeb.keys():
                for node in [enodeb, gnodeb]:
                    node |= {'mmbb': True, 'userLabel': 'MMRadioNode'}
                    if 'LTE' in node['tech'] and len(siteid) >= 10:
                        node |= {'username': gnodeb['username'], 'password': gnodeb['password'], 'susername': gnodeb['susername'],
                                 'spassword': gnodeb['spassword']}
                    elif 'NR' in node['tech'] and len(siteid) < 10:
                        node |= {'username': enodeb['username'], 'password': enodeb['password'], 'susername': enodeb['susername'],
                                 'spassword': enodeb['spassword']}
                if enodeb['Lrat'] and gnodeb['GNBDU']:
                    if len(siteid) < 10:
                        enodeb |= {'oam': 'vr_OAM', 'oam_interface': F'1', 'oam_add': '1', 'oam_vlanid': enodeb['oam_van'],
                                   'lte': 'LTE', 'lte_interface': '1', 'lte_add': '1', 'lte_vlanid': enodeb['lte_vlan'],
                                   'lte_dist': '1', 'sctpendpoint': '1', 'sctpprofile': '1'}
                        gnodeb |= {'oam': 'vr_OAM', 'oam_interface': F'1', 'oam_add': '1', 'oam_vlanid': enodeb['oam_van'],
                                   'lte': 'LTE', 'lte_interface': 'NR', 'lte_add': '1', 'lte_vlanid': 'VLAN_NR',
                                   'lte_dist': '2', 'sctpendpoint': '2', 'sctpprofile': '1'}
                    elif len(siteid) >= 10:
                        gnodeb |= {'oam': 'OAM', 'oam_interface': F'{gnodeb["TnPort"]}_OAM', 'oam_add': '1', 'oam_vlanid': 'VLAN_OAM',
                                   'lte': 'LTE', 'lte_interface': 'NR', 'lte_add': '1', 'lte_vlanid': 'VLAN_NR',
                                   'lte_dist': '1', 'sctpendpoint': '1', 'sctpprofile': '1'}
                        enodeb |= {'oam': 'OAM', 'oam_interface': F'{gnodeb["TnPort"]}_OAM', 'oam_add': '1', 'oam_vlanid': 'VLAN_OAM',
                                   'lte': 'LTE', 'lte_interface': '1', 'lte_add': '1', 'lte_vlanid': 'VLAN_LTE',
                                   'lte_dist': '2', 'sctpendpoint': '2', 'sctpprofile': '1'}
                elif equ_change:
                    if len(siteid) < 10:
                        enodeb |= {'oam': 'vr_OAM', 'oam_interface': F'1', 'oam_add': '1', 'oam_vlanid':  enodeb['oam_van'],
                                       'lte': 'LTE', 'lte_interface': '1', 'lte_add': '1', 'lte_vlanid': enodeb['lte_vlan'],
                                       'lte_dist': '1', 'sctpendpoint': '1', 'sctpprofile': '1'}
                        gnodeb |= {'oam': 'vr_OAM', 'oam_interface': F'1', 'oam_add': '1', 'oam_vlanid':  enodeb['oam_van'],
                                   'lte': 'LTE', 'lte_interface': 'NR', 'lte_add': '1', 'lte_vlanid': 'VLAN_NR',
                                   'lte_dist': '2', 'sctpendpoint': '2', 'sctpprofile': '1'}
                    elif len(siteid) >= 10:
                        gnodeb |= {'oam': 'OAM', 'oam_interface': F'{gnodeb["TnPort"]}_OAM', 'oam_add': '1', 'oam_vlanid': 'VLAN_OAM',
                                   'lte': 'LTE', 'lte_interface': 'NR', 'lte_add': '1', 'lte_vlanid': 'VLAN_NR',
                                   'lte_dist': '1', 'sctpendpoint': '1', 'sctpprofile': '1'}
                        enodeb |= {'oam': 'OAM', 'oam_interface': F'{gnodeb["TnPort"]}_OAM', 'oam_add': '1', 'oam_vlanid': 'VLAN_OAM',
                                   'lte': 'LTE', 'lte_interface': '1', 'lte_add': '1', 'lte_vlanid': 'VLAN_LTE',
                                   'lte_dist': '2', 'sctpendpoint': '2', 'sctpprofile': '1'}

                    # if gnodeb['GNBDU'] and enodeb['Lrat']: continue
                elif enodeb['Lrat'] and gnodeb['GNBDU'] is None:
                    lte_dist = str(int(enodeb.get('lte_dist', '1')) + 1) if int(enodeb.get('lte_dist', '1')) < 64 else '2'
                    sctpendpoint = '2' if enodeb.get('sctpendpoint', '2') != '2' else '1'
                    # sctpprofile = '1' if enodeb.get('sctpprofile', '2') != '2' else '1'
                    if (enodeb.get('lte', '') != 'LTE') or (enodeb.get('lte_interface', '') != '1'):
                        enodeb |= {'lte': 'LTE', 'lte_interface': '1', 'lte_add': '1', 'lte_vlanid':  enodeb['lte_vlan'], 'rou_change': True,
                                   'int_change': True}
                    gnodeb |= {'oam': enodeb['oam'], 'oam_interface': enodeb['oam_interface'], 'oam_add': enodeb['oam_add'],
                               'oam_vlanid': enodeb['oam_vlanid'], 'lte': 'LTE', 'lte_interface': 'NR', 'lte_add': '1',
                               'lte_vlanid': 'VLAN_NR', 'lte_dist': lte_dist, 'sctpendpoint': sctpendpoint, 'sctpprofile': '1'}
                elif enodeb['Lrat'] is None and gnodeb['GNBDU']:
                    lte_dist = str(int(gnodeb.get('lte_dist', '1')) + 1) if int(gnodeb.get('lte_dist', '1')) < 64 else '2'
                    sctpendpoint = '2' if gnodeb.get('sctpendpoint', '2') != '2' else '1'
                    # sctpprofile = '2' if gnodeb.get('sctpprofile', '2') != '2' else '1'
                    if gnodeb.get('lte', '') != 'LTE' or (gnodeb.get('lte_interface', '') != 'NR'):
                        gnodeb |= {'lte': 'LTE', 'lte_interface': 'NR', 'lte_add': '1', 'lte_vlanid': 'VLAN_NR', 'rou_change': True,
                                   'int_change': True}
                    enodeb |= {'oam': gnodeb['oam'], 'oam_interface': gnodeb['oam_interface'], 'oam_add': gnodeb['oam_add'],
                               'oam_vlanid': gnodeb['oam_vlanid'], 'lte': 'LTE', 'lte_interface': '1', 'lte_add': '1', 'lte_vlanid': 'VLAN_LTE',
                               'lte_dist': lte_dist, 'sctpendpoint': sctpendpoint, 'sctpprofile': '1'}
                else: pass

        for siteid in self.gnodeb.keys():
            # Router Name change for N077 (CBAND)
            if len(self.df_gnb_cell.loc[(self.df_gnb_cell.postsite == siteid) & (self.df_gnb_cell.freqband.isin(['n077', 'N077']))].index) > 0:
                if self.sites.get(F'site_{siteid}') and not self.gnodeb.get(siteid).get('equ_change'): pass
                else:
                    self.gnodeb[siteid] |= {
                        'oam': 'OAM', 'oam_interface': F'{self.gnodeb[siteid]["TnPort"]}_OAM', 'oam_add': '1', 'oam_vlanid': 'VLAN_OAM',
                        'lte': 'NR', 'lte_interface': F'{self.gnodeb[siteid]["TnPort"]}_NR', 'lte_add': '1', 'lte_vlanid': 'VLAN_NR',
                        'lte_dist': '1', 'sctpendpoint': '3', 'sctpprofile': '1'
                    }
            # Update userLabel for TMRadioNode (TMBB) if N077 and other freq exist on MMBB node
            if len(self.df_gnb_cell.loc[(self.df_gnb_cell.postsite == siteid)].index) > 0 and \
                len(self.df_enb_cell.loc[(self.df_enb_cell.postsite == siteid)].index) > 0 and \
                    len(self.df_gnb_cell.loc[(self.df_gnb_cell.postsite == siteid)].freqband.unique()) > 1 and \
                    len([_ for _ in self.df_gnb_cell.loc[(self.df_gnb_cell.postsite == siteid)].freqband.unique() if _ in ['n077', 'N077']]) > 0:
                self.gnodeb[siteid]['userLabel'] = 'TMRadioNode'
                self.enodeb[siteid]['userLabel'] = 'TMRadioNode'

        # SW Update for CBAND and CBRS
        sw_dict = {
            'ATT_23_Q3_EC2': {
                '5216': {'sw': 'RadioNode CXP9024418/15 R80D38 23.Q3', 'nodeident': '6811-052-316'},
                '6630': {'sw': 'RadioNode CXP9024418/15 R80D38 23.Q3', 'nodeident': '6811-052-316'},
                '6648': {'sw': 'RadioNode CXP2010174/1 R77D37 23.Q3', 'nodeident': '6811-052-316'},
                '6651': {'sw': 'RadioNode CXP2010174/1 R77D37 23.Q3', 'nodeident': '6811-052-316'},
                'CBRS': {'sw': 'RadioNode CXP2010174/1 R77D37 23.Q3', 'nodeident': '6811-052-316'},
                'G2_CBRS': {'sw': 'RadioNode CXP9024418/15 R80D38 23.Q3', 'nodeident': '6811-052-316'}
            },
            'ATT_23_Q2_EC4': {
                '5216': {'sw': 'RadioNode CXP9024418/15 R74E29 23.Q2', 'nodeident': '4797-523-196'},
                '6630': {'sw': 'RadioNode CXP9024418/15 R74E29 23.Q2', 'nodeident': '4797-523-196'},
                '6648': {'sw': 'RadioNode CXP2010174/1 R71E29 23.Q2', 'nodeident': '4797-523-196'},
                '6651': {'sw': 'RadioNode CXP2010174/1 R71E29 23.Q2', 'nodeident': '4797-523-196'},
                'CBRS': {'sw': 'RadioNode CXP2010174/1 R66D24 23.Q2', 'nodeident': '4797-523-196'},
                'G2_CBRS': {'sw': 'RadioNode CXP9024418/22 R42E28 23.Q2', 'nodeident': '4797-523-196'}
            },
            'ATT_23_Q1_EC1': {'6648': {'sw': 'RadioNode CXP2010174/1 R66D24 23.Q1', 'nodeident': '4114-716-598'},
                              '6651': {'sw': 'RadioNode CXP2010174/1 R66D24 23.Q1', 'nodeident': '4114-716-598'},
                              'CBRS': {'sw': 'RadioNode CXP2010174/1 R66D24 23.Q1', 'nodeident': '4114-716-598'},
                              'G2_CBRS': {'sw': 'RadioNode CXP9024418/15 R69D25 23.Q1', 'nodeident': '4114-716-598'}},
            # 'ATT_22_Q4_EC2': {'6648': {'sw': 'RadioNode CXP2010174/1 R61E52 22.Q4', 'nodeident': '1560-971-286'},
            #                   '6651': {'sw': 'RadioNode CXP2010174/1 R61E52 22.Q4', 'nodeident': '1560-971-286'},
            #                   'CBRS': {'sw': 'RadioNode CXP2010174/1 R61E52 22.Q4', 'nodeident': '1560-971-286'},
            #                   'G2_CBRS': {'sw': 'RadioNode CXP9024418/22 R32E45 22.Q4', 'nodeident': '1560-971-286'}},
            # 'ATT_22_Q3_EC2': {'6648': {'sw': 'RadioNode CXP2010174/1 R56D26 22.Q3', 'nodeident': '4944-884-865'},
            #                   '6651': {'sw': 'RadioNode CXP2010174/1 R56D26 22.Q3', 'nodeident': '4944-884-865'},
            #                   'CBRS': {'sw': 'RadioNode CXP2010174/1 R56D26 22.Q3', 'nodeident': '4944-884-865'}},
            # 'ATT_22_Q2_EC2_EC3': {'6648': {'sw': 'RadioNode CXP2010174/1 R50D29 22.Q2', 'nodeident': '6293-950-918'},
            #                       '6651': {'sw': 'RadioNode CXP2010174/1 R50D29 22.Q2', 'nodeident': '6293-950-918'},
            #                       'CBRS': {'sw': 'RadioNode CXP9024418/22 R21D30 22.Q2', 'nodeident': '6293-950-918'}},
            # 'ATT_22_Q1': {'6648': {'sw': 'RadioNode CXP2010174/1 R45D28 22.Q1', 'nodeident': '3624-728-833'},
            #               '6651': {'sw': 'RadioNode CXP2010174/1 R45D28 22.Q1', 'nodeident': '3624-728-833'}},
        }
        for siteid in set().union(self.gnodeb.keys(), self.enodeb.keys()):
            enodeb, gnodeb = self.enodeb.get(siteid), self.gnodeb.get(siteid)
            for node in [enodeb, gnodeb]:
                if node is None: continue
                if '6648' in node.get('bbtype'): node['sw'] = sw_dict.get(self.client.software.swname, {}).get('6648', {}).get('sw', '')
                elif '6651' in node.get('bbtype'): node['sw'] = sw_dict.get(self.client.software.swname, {}).get('6651', {}).get('sw', '')
    
    def gnodeb_cell_status(self):
        cell_dict_log = {}
        ecolumns = ['celltype', 'fdn', 'presite', 'precell', 'pregnbid', 'precellid', 'postsite', 'postcell', 'postcellid', 'sefcix', 'sccix',
                    'carrier', 'rrushared', 'frutypecix', 'confpowcix', 'dl_ul_delay_att', 'bbu_xmu', 'port_1', 'port_2', 'port_3', 'port_4',
                    'esssclocalidcix', 'essscpairidcix', 'nodegroupsyncltenr', 'freqband', 'userlabelcix']
        for siteid in self.sites:
            site = self.sites.get(siteid)
            pmo = site.find_child_mos_of_managedelement(moc='GNBDUFunction')
            if len(pmo) == 0: continue
            else: pmo = pmo[0]
            for mo in site.find_mo_ending_with_parent_str(moc='NRCellDU', parent=pmo):
                cellid = site.site_extract_data(mo).get('cellLocalId')
                p_gid = site.site_extract_data(','.join(mo.split(',')[:-1])).get('gNBId')
                cell_dict_log[cellid] = ['5G', mo, site.node, mo.split('=')[-1], p_gid, cellid]
        cell_list_info = []
        for row in self.cix.edx.get('gUtranCell').itertuples():
            if cell_dict_log.get(row.cellid):
                cell_list_info.append(cell_dict_log.get(row.cellid) + [row.siteid, row.gutrancell, row.cellid, row.sefcix, row.sectorid,
                                                                       row.carrier, row.rru_shared, row.rru_type, row.configuredmaxtxpower,
                                                                       row.dl_ul_delay_att, row.bbu_xmu, row.port_1, row.port_2, row.port_3,
                                                                       row.port_4, row.esssclocalid, row.essscpairid, row.nodegroupsyncltenr,
                                                                       row.freqband, row.userlabel])
            else:
                cell_list_info.append(['5G', None, None, None, '', '', row.siteid, row.gutrancell, row.cellid, row.sefcix, row.sectorid,
                                       row.carrier, row.rru_shared, row.rru_type, row.configuredmaxtxpower, row.dl_ul_delay_att, row.bbu_xmu,
                                       row.port_1, row.port_2, row.port_3, row.port_4, row.esssclocalid, row.essscpairid, row.nodegroupsyncltenr,
                                       row.freqband, row.userlabel])
        df_gnb_cell = pd.DataFrame(cell_list_info, columns=ecolumns)
        df_gnb_cell['movement'] = 'yes'
        df_gnb_cell.loc[df_gnb_cell.presite.isnull(), 'movement'] = 'new'
        df_gnb_cell.loc[(df_gnb_cell.precell == df_gnb_cell.postcell) & (df_gnb_cell.presite == df_gnb_cell.postsite), 'movement'] = 'no'
        # # ---DU Equipments Info---
        df = self.cix.edx.get('gNodeB')[['siteid', 'bbtype']].rename(columns={'siteid': 'postsite', 'bbtype': 'post_bb'})
        if len(df.index) > 0:
            df['pre_bb'] = df.postsite.map(lambda x: self.sites.get(F'site_{x}').equipment_name if self.sites.get(F'site_{x}') else '')
            df['bb_change'] = df.postsite.map(lambda x: self.gnodeb[x]['equ_change'])
        else:
            df['pre_bb'], df['bb_change'] = None, None
        df_gnb_cell = df_gnb_cell.merge(df, on='postsite', how='left')
        df_gnb_cell['addcell'] = (df_gnb_cell.post_bb != df_gnb_cell.pre_bb) | (df_gnb_cell.movement != 'no')
        self.df_gnb_cell = df_gnb_cell.copy()

    def gnodeb_create_cell(self):
        attrs_cell = ['cellLocalId', 'nRPCI', 'nRTAC', 'rachRootSequence', 'ssbFrequency', 'ssbDuration', 'ssbOffset', 'ssbPeriodicity',
                      'ssbSubCarrierSpacing', 'userLabel']
        attrs_sec = ['arfcnDL', 'arfcnUL', 'bSChannelBwDL', 'bSChannelBwUL', 'configuredMaxTxPower', 'essScLocalId', 'essScPairId']
        gnb_cell_dict = {}
        for row in self.df_gnb_cell.itertuples():
            if row.presite is None: continue
            site = self.sites.get(F'site_{row.presite}')
            tmp = {}
            if row.presite == row.postsite:
                tmp_mo = ','.join(row.fdn.split(',')[:-1])
                tmp |= {'gnbid': site.get_para_w_mo(tmp_mo, 'gNBId'), 'gnbidlength': site.get_para_w_mo(tmp_mo, 'gNBIdLength')}
            else:
                tmp |= {'gnbid': self.cix.get_site_field_data_upper(row.postsite, 'gNodeB', 'gnbid'), 'gnbidlength': self.client.gnbidlength}
            data = site.site_extract_data(row.fdn)
            for attr in attrs_cell:
                tmp[attr] = data.get(attr, '')
            tmp['userLabel'] = row.userlabelcix if tmp['userLabel'] is None else tmp['userLabel'].replace(row.precell, row.postcell)
            rfb_list, temp_fru = [], []
            sc_mo = data.get('nRSectorCarrierRef', '')
            if len(sc_mo) > 0: sc_mo = site.get_mo_w_end_str(sc_mo[0])
            tmp['presc'] = sc_mo.split('=')[-1] if len(sc_mo) > 0 else None
            tmp['scfdn'] = sc_mo if len(sc_mo) > 0 else None
            sector_data = site.site_extract_data(sc_mo) if len(sc_mo) > 0 else {}
            for attr in attrs_sec:
                tmp[attr] = None if len(sc_mo) == 0 else sector_data.get(attr, '')
            sef_mo = sector_data.get('sectorEquipmentFunctionRef', '')
            if len(sef_mo) > 0:
                sef_mo = site.get_mo_w_end_str(sef_mo)
                rfb_list.extend(site.site_extract_data(sef_mo).get('rfBranchRef'))
            tmp['presef'] = sef_mo.split('=')[-1] if len(sef_mo) > 0 else None
            tmp['seffdn'] = sef_mo if len(sef_mo) > 0 else None
            # ---Antenna Systems---
            temp_fru_a = self.antenna_system_cell(site=site, presite=row.presite, precell=row.precell, rfb_list=rfb_list)
            tmp['prefru'] = [_[0] for _ in temp_fru_a]
            tmp['prefrutype'] = [_[1] for _ in temp_fru_a]
            if None not in tmp['prefrutype']:  tmp['prefrutype'].sort()
            # tmp['prefrutype'].sort()
            tmp['prefrusn'] = [_[2] for _ in temp_fru_a]
            gnb_cell_dict[row.postcell] = copy.deepcopy(tmp)
        ecolumns = ['gutrancell', 'gnbid', 'gnbidlength', 'cellid', 'nrpci', 'nrtac', 'rachrootsequence', 'ssbfrequency', 'ssbduration', 'ssboffset',
                    'ssbperiodicity', 'ssbsubcarrierspacing', 'userlabel', 'arfcndl', 'arfcnul', 'bschannelbwdl', 'bschannelbwul',
                    'configuredmaxtxpower', 'esssclocalid', 'essscpairid', 'presc', 'scfdn', 'presef', 'seffdn', 'prefru', 'prefrutype', 'prefrusn']
        df_gnb_move = pd.DataFrame.from_dict(gnb_cell_dict).T
        if len(gnb_cell_dict) > 0:
            df_gnb_move.rename(columns=lambda x: str(x).lower(), inplace=True)
            df_gnb_move.rename(columns={'celllocalid': 'cellid', }, inplace=True)
            df_gnb_move.index.name = 'gutrancell'
            df_gnb_move.reset_index(inplace=True)
        else:
            df_gnb_move = pd.DataFrame([], columns=ecolumns)
        # # ---New Cells---
        ecolumns = ['gutrancell', 'gnbid', 'cellid', 'nrpci', 'nrtac', 'rachrootsequence', 'ssbfrequency', 'ssbduration', 'ssboffset',
                    'ssbperiodicity', 'ssbsubcarrierspacing', 'userlabel', 'arfcndl', 'arfcnul', 'bschannelbwdl', 'bschannelbwul',
                    'configuredmaxtxpower', 'esssclocalid', 'essscpairid']
        # 'presc', 'scfdn', 'presef', 'seffdn', 'prefru', 'prefrutype', 'prefrusn'
        df = self.cix.edx.get('gUtranCell').copy()[ecolumns].assign(presc=None, scfdn=None, presef=None, seffdn=None,  prefru=None,
                                                                    prefrutype=None, prefrusn=None, gnbidlength=self.client.gnbidlength)
        df = df.loc[df.gutrancell.isin(self.df_gnb_cell[self.df_gnb_cell['movement'] == 'new'].postcell)]
        df = pd.concat([df_gnb_move, df], join='inner', ignore_index=True)
        df['sc'] = df.presc
        df['sef'] = df.presef
        self.df_gnb_cell = self.df_gnb_cell.merge(df, left_on='postcell', right_on='gutrancell', suffixes=('', '_mv'))
        self.df_gnb_cell.rename(columns={'configuredmaxtxpower': 'confpow', }, inplace=True)
        self.df_gnb_cell['noofrx'] = '0'
        self.df_gnb_cell['nooftx'] = '0'
        # # ---SEF and SectorCarrier for 8843 and RRU_shared---
        self.df_gnb_cell.loc[((self.df_gnb_cell.sef is None) | self.df_gnb_cell.addcell), 'sef'] = self.df_gnb_cell.sefcix
        self.df_gnb_cell.loc[((self.df_gnb_cell.sc is None) | self.df_gnb_cell.addcell), 'sc'] = self.df_gnb_cell.sccix
        self.df_gnb_cell['fruchange'] = ~(self.df_gnb_cell.prefrutype == self.df_gnb_cell.frutypecix)
        self.df_gnb_cell = self.df_gnb_cell.replace({np.nan: None})

    # --- LTE - 4G ---
    def enodeb_cell_status(self):
        cell_dict_log = {}
        ecolumns = ['celltype', 'fdn', 'presite', 'precell', 'preenbid', 'precellid', 'postsite', 'postcell', 'postcellid', 'sefcix', 'sccix',
                    'carrier', 'rrushared', 'frutypecix', 'confpowcix', 'dl_ul_delay_att', 'bbu_xmu', 'port_1', 'port_2', 'port_3', 'port_4',
                    'p614', 'p614portondu', 'p614portonp614', 'p614porttoruxmu', 'tandemp614', 'esssclocalidcix', 'essscpairidcix',
                    'nodegroupsyncltenr', 'userlabelcix']
        for siteid in self.sites:
            site = self.sites.get(siteid)
            pmo = site.find_child_mos_of_managedelement(moc='ENodeBFunction')
            if len(pmo) == 0: continue
            else: pmo = pmo[0]
            for mo in site.find_mo_ending_with_parent_str(moc='EUtranCellFDD', parent=pmo):
                cellid = site.site_extract_data(mo).get('cellId')
                p_eid = site.site_extract_data(','.join(mo.split(',')[:-1])).get('eNBId')
                cell_dict_log[cellid] = ['FDD', mo, site.node, mo.split('=')[-1], p_eid, cellid]
            for mo in site.find_mo_ending_with_parent_str(moc='EUtranCellTDD', parent=pmo):
                cellid = site.site_extract_data(mo).get('cellId')
                p_eid = site.site_extract_data(','.join(mo.split(',')[:-1])).get('eNBId')
                cell_dict_log[cellid] = ['TDD', mo, site.node, mo.split('=')[-1], p_eid, cellid]
        cell_list_info = []
        for row in self.cix.edx.get('EUtranCellFDD').itertuples():
            if cell_dict_log.get(row.cellid):
                cell_list_info.append(cell_dict_log.get(row.cellid) +
                                      [row.siteid, row.eutrancellfddid, row.cellid, row.sefcix, row.sccix, row.carrier, row.rru_shared, row.rru_type,
                                       row.confpow, row.dl_ul_delay_att, row.bbu_xmu, row.port_1, row.port_2, row.port_3, row.port_4, row.p614,
                                       row.p614portondu, row.p614portonp614, row.p614porttoruxmu, row.tandemp614, row.esssclocalid,
                                       row.essscpairid, row.nodegroupsyncltenr, row.userlabel])
            else:
                cell_list_info.append([row.cell_type, None, None, None, '', '',
                                       row.siteid, row.eutrancellfddid, row.cellid, row.sefcix, row.sccix, row.carrier, row.rru_shared, row.rru_type,
                                       row.confpow, row.dl_ul_delay_att, row.bbu_xmu, row.port_1, row.port_2, row.port_3, row.port_4, row.p614,
                                       row.p614portondu, row.p614portonp614, row.p614porttoruxmu, row.tandemp614, row.esssclocalid,
                                       row.essscpairid, row.nodegroupsyncltenr, row.userlabel])
        df = pd.DataFrame(cell_list_info, columns=ecolumns)
        df['movement'] = 'yes'
        df.loc[df.presite.isnull(), 'movement'] = 'new'
        df.loc[(df.precell == df.postcell) & (df.presite == df.postsite), 'movement'] = 'no'
        # # ---DU Equipments Info---
        df_n = self.cix.edx.get('eNodeB')
        df_n = df_n[['siteid', 'bbtype']].rename(columns={'siteid': 'postsite', 'bbtype': 'post_bb'})
        df_n['pre_bb'] = df_n.postsite.map(lambda x: self.sites.get(F'site_{x}').equipment_name if self.sites.get(F'site_{x}') else '')
        df_n['bb_change'] = df_n.postsite.map(lambda x: self.enodeb[x]['equ_change'])
        df = df.merge(df_n, on='postsite', how='left')
        df['addcell'] = (df.post_bb != df.pre_bb) | (df.movement != 'no')
        self.df_enb_cell = df.copy()

    def enodeb_cell_create(self):
        attrs = ['freqBand', 'cellId', 'earfcndl', 'earfcnul', 'dlChannelBandwidth', 'ulChannelBandwidth',
                 'physicalLayerCellId', 'rachRootSequence', 'cellRange', 'tac', 'userLabel', 'isDlOnly']
        tdd_attr_dict = {'earfcndl': 'earfcn', 'earfcnul': 'earfcn',
                         'dlChannelBandwidth': 'channelBandwidth', 'ulChannelBandwidth': 'channelBandwidth'}
        cell_val_dict = {}
        for row in self.df_enb_cell.itertuples():
            if row.presite is None: continue
            site = self.sites.get(F'site_' + row.presite)
            tmp_dict = {}
            if row.presite == row.postsite:
                tmp_dict['enbid'] = site.site_extract_data(site.get_mo_w_end_str(','.join(row.fdn.split(',')[-4:-1]))).get('eNBId')
            else: tmp_dict['enbid'] = self.cix.get_site_field_data_upper(row.postsite, 'eNodeB', 'enbid')
            data = site.site_extract_data(row.fdn)
            for attr in attrs: tmp_dict[attr] = data.get(attr, data.get(tdd_attr_dict.get(attr, '')))
            tmp_dict['userLabel'] = row.userlabelcix if tmp_dict['userLabel'] is None else tmp_dict['userLabel'].replace(row.precell, row.postcell)
            if tmp_dict['physicalLayerCellId'] is None:
                tmp_dict['physicalLayerCellId'] = int(data.get('physicalLayerCellIdGroup')) * 3 + int(data.get('physicalLayerSubCellId'))
            rfb_list, sector_ref = [], data.get('sectorCarrierRef')
            tmp_dict |= {'scfdn': None, 'presc': None, 'noofrx': None, 'nooftx': None, 'confpow': None, 'presef': None, 'seffdn': None,
                         'esssclocalid': None, 'essscpairid': None}
            if len(sector_ref) > 0:
                sector_ref = sector_ref[0]
                sector_mo = site.get_mo_w_end_str(sector_ref)
                sector_data = site.site_extract_data(sector_mo)
                tmp_dict |= {'scfdn': sector_mo, 'presc': sector_ref.split('=')[-1], 'noofrx': sector_data.get('noOfRxAntennas'),
                            'nooftx': sector_data.get('noOfTxAntennas'), 'confpow': sector_data.get('configuredMaxTxPower'),
                            'esssclocalid': sector_data.get('essScLocalId'), 'essscpairid': sector_data.get('essScPairId')}
                rfb_list.extend(sector_data.get('rfBranchTxRef'))
                rfb_list.extend(sector_data.get('rfBranchRxRef'))
                sef_ref = sector_data.get('sectorFunctionRef')
                if sef_ref is not None:
                    sef_mo = site.get_mo_w_end_str(sef_ref)
                    tmp_dict |= {'presef': sef_ref.split('=')[-1], 'seffdn': sef_mo}
                    rfb_list.extend(site.site_extract_data(sef_mo).get('rfBranchRef'))
            # ---Antenna Systems---
            temp_fru_a = self.antenna_system_cell(site=site, presite=row.presite, precell=row.precell, rfb_list=rfb_list)
            tmp_dict['prefru'] = [_[0] for _ in temp_fru_a]
            tmp_dict['prefrutype'] = [_[1] for _ in temp_fru_a]
            if None not in tmp_dict['prefrutype']:  tmp_dict['prefrutype'].sort()
            tmp_dict['prefrusn'] = [_[2] for _ in temp_fru_a]
            cell_val_dict[row.postcell] = copy.deepcopy(tmp_dict)

        ecolumns = ['eutrancellfddid', 'enbid', 'freqband', 'cellid', 'earfcndl', 'earfcnul', 'dlchannelbandwidth', 'ulchannelbandwidth',
                    'physicallayercellid', 'rachrootsequence', 'cellrange', 'tac', 'userlabel', 'nooftx', 'noofrx', 'confpow', 'isdlonly',
                    'esssclocalid', 'essscpairid']
        if len(cell_val_dict) > 0:
            df = pd.DataFrame.from_dict(cell_val_dict).T
            df.index.name = 'eutrancellfddid'
            df.reset_index(inplace=True)
            df.rename(columns=lambda x: str(x).lower(), inplace=True)
        else:
            df = pd.DataFrame([], columns=ecolumns)
            df = df.assign(presef=None, seffdn=None, presc=None, scfdn=None, prefru=None, prefrutype=None, prefrusn=None)
        # ---New Cells---
        df_new = self.cix.edx.get('EUtranCellFDD')[ecolumns].copy()
        df_new = df_new.loc[df_new.eutrancellfddid.isin(self.df_enb_cell[self.df_enb_cell['movement'] == 'new'].postcell)]
        df_new = df_new.assign(presef=None, seffdn=None, presc=None, scfdn=None, prefru=None, prefrutype=None, prefrusn=None)
        df = pd.concat([df, df_new], join='inner', ignore_index=True)
        df = df.replace({np.nan: None})
        df['sc'] = df.presc
        df['sef'] = df.presef
        
        self.df_enb_cell = self.df_enb_cell.merge(df, left_on='postcell', right_on='eutrancellfddid', suffixes=('', '_mv'))
        self.df_enb_cell.loc[((self.df_enb_cell.sef is None) | (self.df_enb_cell.addcell)), 'sef'] = self.df_enb_cell.sefcix
        self.df_enb_cell.loc[((self.df_enb_cell.sc is None) | (self.df_enb_cell.addcell)), 'sc'] = self.df_enb_cell.sccix
        self.df_enb_cell['fruchange'] = ~(self.df_enb_cell.prefrutype == self.df_enb_cell.frutypecix)

        # ---Sector Carrier Update for MC---
        # ---Macro Site---
        self.df_enb_cell.loc[((self.df_enb_cell.carrier.str.contains('MC')) &
                              (~self.df_enb_cell.sc.str.lower().str.contains('r0'))), 'sc'] = \
            self.df_enb_cell.sef + '_' + self.df_enb_cell.postcell.str.split('_').str[-1]
        self.df_enb_cell.loc[((self.df_enb_cell.carrier.isin(self.df_enb_cell.loc[
                self.df_enb_cell.carrier.str.contains('MC')].carrier.str.replace('MC', '').unique())) &
            (~self.df_enb_cell.sc.str.lower().str.contains('r0'))), 'sc'] = \
            self.df_enb_cell.sef + '_' + self.df_enb_cell.postcell.str.split('_').str[-1]
        # ---CRAN Site---
        self.df_enb_cell.loc[self.df_enb_cell.sc.str.lower().str.contains('r0'), 'sc'] = \
            self.df_enb_cell.sef + self.df_enb_cell.postcell.str.split('_').str[-2]
        
        self.df_enb_cell = self.df_enb_cell.replace({np.nan: None, '': None})

    def enodeb_nbiot_create(self):
        temp_list = []
        for site in self.sites:
            site = self.sites.get(site)
            pmo = site.find_child_mos_of_managedelement(moc='ENodeBFunction')
            if len(pmo) == 0: continue
            else: pmo = pmo[0]
            for n_mo in site.find_mo_ending_with_parent_str(moc='NbIotCell', parent=pmo):
                nbiot_data = site.site_extract_data(n_mo)
                temp_list.append({
                    'celltype': 'IOT',
                    'presite': site.node,
                    'precell': n_mo.split('=')[-1],
                    'precellid': nbiot_data.get('cellId'),
                    'nbiotcelltype': nbiot_data.get('nbIotCellType'),
                    'tac': nbiot_data.get('tac'),
                    'earfcndl': nbiot_data.get('earfcndl'),
                    'earfcnul': nbiot_data.get('earfcnul'),
                    'physicallayercellid': nbiot_data.get('physicalLayerCellId'),
                    'precellref': nbiot_data.get('eutranCellRef', '').split('=')[-1] if nbiot_data.get('eutranCellRef', '').split('=')[-1] != '' else '',
                    'fdn': n_mo
                })

        ecolumns = ['celltype', 'presite', 'precell', 'precellid', 'nbiotcelltype', 'tac', 'earfcndl', 'earfcnul', 'pci', 'precellref', 'fdn']
        df = pd.DataFrame.from_dict(temp_list) if len(temp_list) > 0 else pd.DataFrame([], columns=ecolumns)
        df['cellid'] = df.precellid
        df['postcell'] = df.precell
        df_cell = self.df_enb_cell[['presite', 'precell', 'postsite', 'postcell', 'sc', 'sef', 'addcell', 'preenbid', 'enbid']].rename(
            columns={'precell': 'precellref', 'postcell': 'postcellref'})
        df = df.merge(df_cell[['presite', 'precellref', 'postsite', 'postcellref', 'addcell', 'preenbid', 'enbid']], on=['presite', 'precellref'], how='left')
        df = df.merge(df_cell[['postsite', 'postcellref', 'sc', 'sef']], on=['postsite', 'postcellref'], how='left')
        df = df.loc[~df.postsite.isna()]
        if len(df.index) > 0:
            df['postcell'] = df.apply(lambda x: x.postcell.replace(x.postcell.split("_", 1)[0], x.postcellref.split("_", 1)[0]), axis=1)
        df.loc[df.addcell.isna(), 'addcell'] = True
        self.df_enb_cell = pd.concat([self.df_enb_cell, df], ignore_index=True)
        self.df_enb_cell.reset_index(inplace=True, drop=True)
        self.df_enb_cell = self.df_enb_cell.replace({np.nan: None})

    def enodeb_validate_cix_dcgk_data(self):
        # --- validate eNBId ---
        for row in self.cix.edx.get('eNodeB').itertuples():
            # site = self.sites.get(F'site_{row.siteid}')
            if self.sites.get(F'site_{row.siteid}') and self.enodeb.get(row.siteid, {}).get('Lrat'):
                enbid = self.sites.get(F'site_{row.siteid}').site_extract_data(self.enodeb.get(row.siteid).get('Lrat')).get('eNBId')
                assert enbid == self.cix.get_site_field_data_upper(row.siteid, 'eNodeB', 'enbid'), \
                    F'!!! Input Error, eNBId for site {row.siteid} is not matching!!! '
        # --- validate physicalLayerCellId and cellId ---
        for node_id in self.df_enb_cell.loc[self.df_enb_cell.celltype.isin(['FDD', 'TDD'])].postsite.unique():
            df_tmp = self.df_enb_cell.loc[(self.df_enb_cell.postsite == node_id) & (self.df_enb_cell.celltype.isin(['FDD', 'TDD']))].copy()
            for earfcndl in df_tmp.earfcndl.unique():
                assert len(df_tmp.loc[df_tmp.earfcndl == earfcndl].index) == \
                       len(df_tmp.loc[df_tmp.earfcndl == earfcndl].physicallayercellid.unique()), \
                    F'!!! Input Error, physicalLayerCellId for Node {node_id} earfcndl "{earfcndl}" is not unique !!!'
            assert len(df_tmp.loc[df_tmp.celltype.isin(['FDD', 'TDD'])].index) == \
                   len(df_tmp.loc[df_tmp.celltype.isin(['FDD', 'TDD'])].cellid.unique()), F'!!! Input Error, cellId on USID is not unique !!!'

        # --- validate rrushared ---
        for rrushared in self.df_enb_cell.rrushared.unique():
            if rrushared is not None: assert len(self.df_enb_cell.loc[self.df_enb_cell.postcell == rrushared].index) != 0, \
                F'!!! Input Error, i.e. RRU_shared, cell {rrushared}'

    def eutran_network(self):
        def get_pre_cell_data(cell, field, df_cell): return df_cell[df_cell.precell == cell][field].iloc[0]
        # ---ExternalENodeBFunction, ExternalEUtranCellFDD, ExternalEUtranCellTDD & EUtranFrequency---
        temp1_list, temp2_list, temp3_list = [], [], []
        for site in self.sites:
            site = self.sites.get(site)
            pmo = site.find_child_mos_of_managedelement(moc='ENodeBFunction')
            if len(pmo) == 0: continue
            else: pmo = pmo[0]
            nwmo = site.find_mo_ending_with_parent_str(moc='EUtraNetwork', parent=pmo)
            if len(nwmo) == 0: continue
            nwmo = nwmo[0]
            for frqmo in site.find_mo_ending_with_parent_str(moc='EUtranFrequency', parent=nwmo):
                tmp_dict = {'postsite': site.node,
                            'freqid': frqmo.split("=")[-1],
                            'earfcndl': site.site_extract_data(frqmo).get('arfcnValueEUtranDl'),
                            'flag': False, 'fdn': frqmo}
                temp3_list.append(tmp_dict)
            for xmo in site.find_mo_ending_with_parent_str(moc='ExternalENodeBFunction', parent=nwmo):
                tmp_mo_data = site.site_extract_data(xmo)
                tmp_dict = {'postsite': site.node, 'xid': xmo.split("=")[-1],
                            'plmn': tmp_mo_data.get('eNodeBPlmnId'), 'enbid': tmp_mo_data.get('eNBId'),
                            'flag': False, 'fdn': xmo, 'x2id': None, 'ipv4': None, 'x2fdn': None}
                x2mo = site.find_mo_ending_with_parent_str(moc='TermPointToENB', parent=xmo)
                if len(x2mo) > 0:
                    tmp_dict |= {'x2fdn': x2mo[0], 'x2id': x2mo[0].split('=')[-1], 'ipv4': site.site_extract_data(x2mo[0]).get('ipAddress'),
                                 'ipv6': site.site_extract_data(x2mo[0]).get('ipv6Address'),
                                 'domain': site.site_extract_data(x2mo[0]).get('domainName')}
                temp1_list.append(tmp_dict)
                for celltype in ['FDD', 'TDD']:
                    for xcellmo in site.find_mo_ending_with_parent_str(moc=F'ExternalEUtranCell{celltype}', parent=xmo):
                        tmp_mo_data = site.site_extract_data(xcellmo)
                        tmp_dict = {'postsite': site.node,
                                    'celltype': celltype,
                                    'xid': xcellmo.split(',')[-2].split('=')[-1],
                                    'xcellid': xcellmo.split('=')[-1],
                                    'cellid': tmp_mo_data.get('localCellId'),
                                    'tac': tmp_mo_data.get('tac'),
                                    'pci': tmp_mo_data.get('physicalLayerCellId'),
                                    'freqid': tmp_mo_data.get('eutranFrequencyRef', '=').split('=')[-1],
                                    'flag': False, 'fdn': xcellmo}
                        temp2_list.append(tmp_dict)

        x_col = ['postsite', 'xid', 'plmn', 'enbid', 'flag', 'fdn', 'x2fdn', 'x2id', 'ipv4', 'ipv6', 'domain']
        df_enb_ex = pd.DataFrame.from_dict(temp1_list) if len(temp1_list) > 0 else pd.DataFrame([], columns=x_col)
        xcell_col = ['postsite', 'celltype', 'xid', 'xcellid', 'cellid', 'tac', 'pci', 'freqid', 'flag', 'fdn']
        df_enb_ec = pd.DataFrame.from_dict(temp2_list) if len(temp2_list) > 0 else pd.DataFrame([], columns=xcell_col)
        freq_col = ['postsite', 'freqid', 'earfcndl', 'flag', 'fdn']
        df_enb_ef = pd.DataFrame.from_dict(temp3_list) if len(temp3_list) > 0 else pd.DataFrame([], columns=freq_col)

        # --- EUtranFreqRelation & EUtranCellRelation ---
        temp1_list, temp2_list = [], []
        # att_dict = {'creprio': 'cellReselectionPriority', 'cprio': 'connectedModeMobilityPrio', 'vprio': 'voicePrio',
        # 'thhigh': 'threshXHigh', 'thlow': 'threshXLow'}
        for row in self.df_enb_cell.itertuples():
            if row.fdn is None: continue
            site = self.sites.get(F'site_{row.presite}')
            for rel_mo in site.find_mo_ending_with_parent_str(moc='EUtranFreqRelation', parent=row.fdn):
                rel_data = site.site_extract_data(rel_mo)
                precell = rel_mo.split(',')[-2].split("=")[-1]
                relid = rel_mo.split("=")[-1]
                tmp_dict = {'presite': site.node, 'precell': precell, 'relid': relid,
                            'creprio': site.site_extract_data(rel_mo).get('cellReselectionPriority', '2'),
                            'freqid': rel_data.get('eutranFrequencyRef', 'EutranFrequencyRef').split('=')[-1],
                            'flag': False, 'fdn': rel_mo}
                temp1_list.append(tmp_dict)
                for cellrel_mo in site.find_mo_ending_with_parent_str(moc='EUtranCellRelation', parent=rel_mo):
                    cellrel_data = site.site_extract_data(cellrel_mo)
                    tmp_dict = {'presite': site.node, 'precell': precell, 'relid': relid, 'crelid': cellrel_mo.split("=")[-1],
                                'israllowed': cellrel_data.get('isRemoveAllowed'), 'scell': cellrel_data.get('sCellCandidate'),
                                'xid': cellrel_data.get('neighborCellRef').split(",")[-2].split("=")[-1],
                                'xcellid': cellrel_data.get('neighborCellRef').split("=")[-1],
                                'celltype': cellrel_data.get('neighborCellRef').split(',')[-1].split('=')[0][-3:],
                                'flag': False, 'fdn': cellrel_mo}
                    temp2_list.append(tmp_dict)
        rel_col = ['presite', 'precell', 'relid', 'creprio', 'freqid', 'flag', 'fdn']
        df_enb_er = pd.DataFrame.from_dict(temp1_list) if len(temp1_list) > 0 else pd.DataFrame([], columns=rel_col)
        cellrel_col = ['presite', 'precell', 'relid', 'crelid', 'israllowed', 'scell', 'flag', 'fdn', 'xid', 'xcellid', 'celltype']
        df_enb_ee = pd.DataFrame.from_dict(temp2_list) if len(temp2_list) > 0 else pd.DataFrame([], columns=cellrel_col)

        # --- Update Existing Relations ---
        df_enb_ex['plmn'] = df_enb_ex.plmn.apply(json.dumps)
        df_enb_ec = df_enb_ec.merge(df_enb_ex[['postsite', 'xid', 'enbid', 'plmn']], on=['postsite', 'xid'], how='left')
        df_enb_ec = df_enb_ec.merge(df_enb_ef[['postsite', 'freqid', 'earfcndl']], on=['postsite', 'freqid'], how='left')
        df_enb_er = df_enb_er.merge(self.df_enb_cell[['presite', 'precell', 'postsite', 'postcell']], on=['presite', 'precell'], how='left')
        df_enb_er = df_enb_er.merge(df_enb_ef[['postsite', 'freqid', 'earfcndl']].rename(columns={'postsite': 'presite'}),
                                    on=['presite', 'freqid'], how='left')
        df_enb_ee = df_enb_ee.merge(df_enb_ec[['postsite', 'xid', 'xcellid', 'plmn', 'enbid', 'cellid']].rename(columns={'postsite': 'presite'}),
                                    on=['presite', 'xid', 'xcellid'], how='left')
        df_enb_ee = df_enb_ee.merge(df_enb_er[['presite', 'precell', 'relid', 'postsite', 'postcell', 'earfcndl']],
                                    on=['presite', 'precell', 'relid'], how='left')

        # --- Remove Deleted Cell & there Relations ---
        df_enb_ee = df_enb_ee.loc[((df_enb_ee.xcellid.isin(list(filter(None, self.df_enb_cell['precell'].unique())))) |
                                   (~(df_enb_ee.cellid.isnull())))]
        df_enb_ee.reset_index(inplace=True, drop=True)
        # --- Update post enbid & cellid of co-site cell relations ---
        df_enb_ee.loc[df_enb_ee.cellid.isna(), 'plmn'] = df_enb_ee.loc[df_enb_ee.cellid.isna()]['xcellid'].map(lambda x: json.dumps(self.plmn))
        df_enb_ee.loc[df_enb_ee.enbid.isna(), 'enbid'] = df_enb_ee.loc[df_enb_ee.enbid.isna()]['xcellid'].map(
            lambda x: self.df_enb_cell[self.df_enb_cell.precell == x]['preenbid'].iloc[0])  # get_pre_cell_data(x, 'preenbid', self.df_enb_cell))
        df_enb_ee.loc[df_enb_ee.cellid.isna(), 'cellid'] = df_enb_ee.loc[df_enb_ee.cellid.isna()]['xcellid'].map(
            lambda x: self.df_enb_cell[self.df_enb_cell.precell == x]['precellid'].iloc[0])     # get_pre_cell_data(x, 'precellid', self.df_enb_cell)
        # --- Remove existing External FDD/TDD based on migration ---
        df_enb_ec = df_enb_ec.merge(self.df_enb_cell[['preenbid', 'precellid', 'postsite']].rename(
            columns={'preenbid': 'enbid', 'precellid': 'cellid'}), on=['enbid', 'cellid'], how='left', suffixes=('', '_t'))
        df_enb_ec = df_enb_ec.loc[df_enb_ec.postsite != df_enb_ec.postsite_t].reset_index(inplace=False, drop=True)
        df_enb_ec.drop(['postsite_t'], axis=1, inplace=True)
        # --- Remove ExternalENodeBFunction & External FDD/TDD if node is getting deleted ---
        temp1_list = list(set(list(self.df_enb_cell.preenbid.unique())) - set(list(self.df_enb_cell.enbid.unique())))
        df_enb_ex = df_enb_ex.loc[~df_enb_ex.enbid.isin(temp1_list)].reset_index(inplace=False, drop=True)
        df_enb_ec = df_enb_ec.loc[~df_enb_ec.enbid.isin(temp1_list)].reset_index(inplace=False, drop=True)
        # --- Update existing Cell Relations, enbid, cellid based on migration ---
        df_enb_ee = df_enb_ee.merge(self.df_enb_cell[['preenbid', 'precellid', 'enbid', 'cellid']].rename(
            columns={'preenbid': 'enbid', 'precellid': 'cellid', 'enbid': 'postenbid', 'cellid': 'postcellid'}),
            on=['enbid', 'cellid'], how='left', suffixes=('', '_t'))
        # f1 = (~df_enb_ee.postcellid.isna())
        # f2 = (df_enb_ee.enbid != df_enb_ee.postenbid)
        # f3 = (df_enb_ee.cellid != df_enb_ee.postcellid)
        # f4 = ((~df_enb_ee.postcellid.isna()) & (df_enb_ee.enbid != df_enb_ee.postenbid) &
        #                (df_enb_ee.cellid != df_enb_ee.postcellid))
        # print(len(df_enb_ee.loc[((~df_enb_ee.postcellid.isna()) & ((df_enb_ee.enbid != df_enb_ee.postenbid) |
        #                (df_enb_ee.cellid != df_enb_ee.postcellid)))].index))

        if len(df_enb_ee.loc[(~df_enb_ee.postenbid.isna())].index) > 0:
            df_enb_ee.loc[((~df_enb_ee.postcellid.isna()) & ((df_enb_ee.enbid != df_enb_ee.postenbid) |
                           (df_enb_ee.cellid != df_enb_ee.postcellid))), ['flag']] = True
            df_enb_ee.loc[(~df_enb_ee.postenbid.isna()), ['enbid']] = df_enb_ee.loc[(~df_enb_ee.postenbid.isna()), ['postenbid']].apply(
                lambda x: x.postenbid, axis=1)
            df_enb_ee.loc[(~df_enb_ee.postcellid.isna()), ['cellid']] = df_enb_ee.loc[(~df_enb_ee.postcellid.isna()), ['postcellid']].apply(
                lambda x: x.postcellid, axis=1)
        df_enb_ee.drop(['postcellid', 'postenbid'], axis=1, inplace=True)

        # --- Addition of New Relations ---
        df_n = self.df_enb_cell.loc[self.df_enb_cell.celltype.isin(['FDD']), ['postsite', 'postcell', 'celltype', 'earfcndl', 'enbid', 'cellid',
                                                                              'tac', 'physicallayercellid']].rename(columns={'physicallayercellid': 'pci'})
        if len(df_n.index) > 0:
            df_n[['flag', 'fdn', 'x2fdn', 'plmn', 'xid', 'x2id', 'xcellid', 'ipv4', 'ipv6', 'domain', 'freqid', 'israllowed', 'scell']] = \
                df_n.apply(lambda x: pd.Series([True, None, None, json.dumps(self.plmn), F'{self.mccmnc}-{x.enbid}', F'{self.mccmnc}-{x.enbid}',
                                                F'{self.mccmnc}-{x.enbid}-{x.cellid}', F'0.0.0.0',
                                                '::', '', F'{x.earfcndl}', 'false', '2 (AUTO)']), axis=1)

            # --- Addition of ExternalENodeBFunction & External FDD/TDD ---
            df_t = df_n[['postsite', 'flag']].groupby(['postsite', 'flag'], as_index=False).head(1)
            df_t = df_t.merge(df_n, on='flag', suffixes=('', '_t'))
            df_t = df_t.loc[df_t.postsite != df_t.postsite_t]
            df_enb_ex = pd.concat([df_enb_ex, df_t[['postsite', 'xid', 'plmn', 'enbid', 'flag', 'fdn', 'x2fdn', 'x2id', 'ipv4', 'ipv6', 'domain']]],
                                  ignore_index=True)
            df_enb_ex = df_enb_ex.drop_duplicates().groupby(['postsite', 'plmn', 'enbid'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
            df_enb_ec = pd.concat([df_enb_ec, df_t[['postsite', 'celltype', 'xid', 'xcellid', 'cellid', 'tac', 'pci', 'freqid',
                                                    'flag', 'fdn', 'enbid', 'plmn', 'earfcndl']]], ignore_index=True)
            df_enb_ec = df_enb_ec.drop_duplicates().groupby(['postsite', 'plmn', 'enbid', 'cellid'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
            # --- Addition of EUtranCellRelation ---
            df_t = df_n[['postsite', 'postcell', 'flag']].groupby(['postsite', 'postcell', 'flag'], as_index=False).head(1)
            df_t = df_t.merge(df_n, on='flag', suffixes=('', '_t'))
            df_t = df_t.loc[df_t.postcell != df_t.postcell_t]
            df_t = df_t[['xcellid', 'israllowed', 'scell', 'xid', 'celltype', 'flag', 'fdn', 'plmn', 'enbid', 'cellid', 'postsite', 'postcell',
                         'earfcndl']].rename(columns={'xcellid': 'crelid'})
            df_enb_ee = pd.concat([df_enb_ee, df_t], ignore_index=True)
            df_enb_ee = df_enb_ee.drop_duplicates().groupby(['postsite', 'postcell', 'plmn', 'enbid', 'cellid', 'earfcndl', 'celltype'],
                                                            sort=False, as_index=False).head(1)
            df_enb_ee.reset_index(inplace=True, drop=True)
            del df_t, df_n

        # --- Addition of EUtranFreqRelation ---
        if len(self.cix.edx.get('EUtranFreqRelation').index) > 0:
            df_n = self.cix.edx.get('EUtranFreqRelation').rename(columns={'eutrancellfddid': 'postcell', 'arfcnvalueeutrandl': 'earfcndl',
                                                                          'cellreselectionpriority': 'creprio'})
            df_n[['presite', 'precell', 'fdn', 'flag', 'relid', 'freqid']] = df_n.apply(lambda x: pd.Series([None, None, None, True,
                                                                                                             x.earfcndl, x.earfcndl]), axis=1)
            df_n = df_n.merge(self.df_enb_cell[['postcell', 'postsite']], on=['postcell'], how='left')
            df_n = df_n.loc[~df_n.postsite.isna()]
            df_enb_er = pd.concat([df_enb_er, df_n], ignore_index=True)
        df_enb_er = df_enb_er.drop_duplicates().groupby(['postsite', 'postcell', 'earfcndl'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
        
        # --- Addition of External FDD/TDD based on migrations and Logs
        temp_list = ['postsite', 'celltype', 'plmn', 'enbid', 'cellid', 'earfcndl']
        df_enb_ee.drop(['xid', 'xcellid'], axis=1, inplace=True)
        df_enb_ee = df_enb_ee.merge(df_enb_ec[['xid', 'xcellid'] + temp_list], on=temp_list, how='left')
        for row in df_enb_ee.loc[df_enb_ee.xcellid.isna()].drop_duplicates().groupby(temp_list, as_index=False).head(1).itertuples():
            if row.enbid == self.df_enb_cell.loc[self.df_enb_cell.postsite == row.postsite].enbid.iloc[0]: continue
            df_t = df_enb_ec.loc[(df_enb_ec.plmn == row.plmn) & (df_enb_ec.celltype == row.celltype) &
                                 (df_enb_ec.enbid == row.enbid) & (df_enb_ec.cellid == row.cellid) & (df_enb_ec.earfcndl == row.earfcndl)].head(1)
            if len(df_t.index) == 0: continue
            df_t[['postsite', 'flag', 'fdn']] = df_t.apply(lambda x: pd.Series([row.postsite, True, None]), axis=1)
            df_enb_ec = pd.concat([df_enb_ec, df_t], ignore_index=True)
        
        # --- Addition of ExternalENodeBFunction based on migrations and Logs
        df_enb_ec.drop(['xid'], axis=1, inplace=True)
        df_enb_ec = df_enb_ec.merge(df_enb_ex[['postsite', 'plmn', 'enbid', 'xid']], on=['postsite', 'plmn', 'enbid'], how='left')
        for row in df_enb_ec.loc[df_enb_ec.xid.isna()].drop_duplicates().groupby(['postsite', 'plmn', 'enbid'], as_index=False).head(1).itertuples():
            df_t = df_enb_ex.loc[(df_enb_ex.plmn == row.plmn) & (df_enb_ex.plmn == row.plmn) & (df_enb_ex.enbid == row.enbid)].head(1)
            if len(df_t.index) == 0: continue
            df_t[['postsite', 'flag', 'fdn', 'x2fdn']] = df_t.apply(lambda x: pd.Series([row.postsite, True, None, None]), axis=1)
            df_enb_ex = pd.concat([df_enb_ex, df_t], ignore_index=True)
        
        # --- Addition of EUtranFrequency based on migrations and Logs
        df_t = pd.concat([df_enb_ec[['postsite', 'freqid', 'earfcndl']], df_enb_er[['postsite', 'freqid', 'earfcndl']]], ignore_index=True)
        df_t['flag'] = True
        df_enb_ef = pd.concat([df_enb_ef, df_t], ignore_index=True)
        df_enb_ef = df_enb_ef.drop_duplicates().groupby(['postsite', 'earfcndl'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
        
        # --- Update IDs for to EUtranFrequency remove dublicate IDs
        df_enb_ef = df_enb_ef.loc[~(df_enb_ef.postsite.isna() | df_enb_ef.freqid.isna() | df_enb_ef.earfcndl.isna())]
        df_enb_ef = df_enb_ef.drop_duplicates().groupby(['postsite', 'earfcndl'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
        df_enb_ef['mo_count'] = df_enb_ef.groupby(['postsite', 'freqid']).cumcount() + 1
        df_enb_ef.loc[df_enb_ef.mo_count > 1, 'freqid'] = df_enb_ef.loc[df_enb_ef.mo_count > 1, ['freqid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_ef = df_enb_ef.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)
        
        # --- Update IDs for to EUtranFreqRelation remove dublicate IDs
        df_enb_er.drop(['freqid'], axis=1, inplace=True)
        df_enb_er = df_enb_er.merge(df_enb_ef[['postsite', 'freqid', 'earfcndl']], on=['postsite', 'earfcndl'], how='left')
        df_enb_er = df_enb_er.loc[~(df_enb_er.postsite.isna() | df_enb_er.postcell.isna() | df_enb_er.relid.isna() | df_enb_er.freqid.isna() | df_enb_er.earfcndl.isna())]
        df_enb_er = df_enb_er.drop_duplicates().groupby(['postsite', 'postcell', 'earfcndl'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
        df_enb_er['mo_count'] = df_enb_er.groupby(['postsite', 'postcell', 'relid']).cumcount() + 1
        df_enb_er.loc[df_enb_er.mo_count > 1, 'relid'] = df_enb_er.loc[df_enb_er.mo_count > 1, ['relid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_er = df_enb_er.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)
        
        # --- Update IDs for to ExternalENodeBFunction remove dublicate IDs
        df_enb_ex = df_enb_ex.loc[~(df_enb_ex.postsite.isna() | df_enb_ex.xid.isna() | df_enb_ex.plmn.isna() | df_enb_ex.enbid.isna())]
        df_enb_ex = df_enb_ex.drop_duplicates().groupby(['postsite', 'plmn', 'enbid'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
        df_enb_ex['mo_count'] = df_enb_ex.groupby(['postsite', 'xid']).cumcount() + 1
        df_enb_ex.loc[df_enb_ex.mo_count > 1, 'xid'] = df_enb_ex.loc[df_enb_ex.mo_count > 1, ['xid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_ex = df_enb_ex.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)
        
        # --- Update IDs for to External FDD/TDD remove dublicate IDs
        df_enb_ec.drop(['xid', 'freqid'], axis=1, inplace=True)
        df_enb_ec = df_enb_ec.merge(df_enb_ex[['postsite', 'xid', 'plmn', 'enbid']], on=['postsite', 'plmn', 'enbid'], how='left')
        df_enb_ec = df_enb_ec.merge(df_enb_ef[['postsite', 'freqid', 'earfcndl']], on=['postsite', 'earfcndl'], how='left')
        df_enb_ec = df_enb_ec.loc[~(df_enb_ec.postsite.isna() | df_enb_ec.xid.isna() | df_enb_ec.xcellid.isna() | df_enb_ec.freqid.isna() | df_enb_ec.earfcndl.isna())]
        df_enb_ec = df_enb_ec.drop_duplicates().groupby(['postsite', 'celltype', 'plmn', 'enbid', 'cellid', 'earfcndl'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
        df_enb_ec['mo_count'] = df_enb_ec.groupby(['postsite', 'xid', 'xcellid']).cumcount() + 1
        df_enb_ec.loc[df_enb_ec.mo_count > 1, 'xcellid'] = df_enb_ec.loc[df_enb_ec.mo_count > 1, ['xcellid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_ec = df_enb_ec.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)
        
        # --- Update IDs for to EUtranCellRelation israllowed dublicate IDs and create Final DataFrame
        df_enb_ee.loc[(df_enb_ee.enbid.isin(list(filter(None, self.df_enb_cell['enbid'].unique())))), 'crelid'] = \
            df_enb_ee.loc[(df_enb_ee.enbid.isin(list(filter(None, self.df_enb_cell['enbid'].unique())))), ['enbid', 'cellid']].apply(
                lambda x: F'{self.mccmnc}-' + '-'.join(x.astype(str)), axis=1)

        df_enb_ee.drop(['xid', 'xcellid', 'relid'], axis=1, inplace=True)
        df_enb_ee = df_enb_ee.merge(df_enb_ec[['xid', 'xcellid', 'postsite', 'celltype', 'plmn', 'enbid', 'cellid', 'earfcndl']],
                                    on=['postsite', 'celltype', 'plmn', 'enbid', 'cellid', 'earfcndl'], how='left')
        df_enb_ee = df_enb_ee.merge(df_enb_er[['postsite', 'postcell', 'relid', 'earfcndl']], on=['postsite', 'postcell', 'earfcndl'], how='left')
        df_enb_ee = df_enb_ee.merge(self.df_enb_cell[['enbid', 'cellid', 'postcell']].rename(columns={'postcell': 't_postcell'}),
                                    on=['enbid', 'cellid'], how='left')
        # df_enb_ee.loc[(~df_enb_ee.t_postcell.isna()), ['scell']] = df_enb_ee.loc[(~df_enb_ee.t_postcell.isna()), ['postcell', 't_postcell']].apply(
        #     lambda x: '1 (ALLOWED)' if x.postcell[-2] == x.t_postcell[-2] else '2 (AUTO)', axis=1)
        df_enb_ee.loc[(~df_enb_ee.t_postcell.isna()), 'israllowed'] = 'false'
        # Check EUtranCellRelationId to Cell Name 12/13/2021
        df_enb_ee.loc[(~df_enb_ee.t_postcell.isna()), 'crelid'] = df_enb_ee.loc[(~df_enb_ee.t_postcell.isna())].t_postcell
        # Check EUtranCellRelationId to Cell Name  End
        df_enb_ee.loc[df_enb_ee.xid.isna(), 'xid'] = '1'
        if len(df_enb_ee.index) > 0:
            df_enb_ee.loc[df_enb_ee.xcellid.isna(), 'xcellid'] = df_enb_ee.loc[df_enb_ee.xcellid.isna(),
                                                                               ['t_postcell']].apply(lambda x: x.t_postcell, axis=1)
            df_enb_ee = df_enb_ee.loc[~(df_enb_ee.postsite.isna() | df_enb_ee.postcell.isna() | df_enb_ee.relid.isna() | df_enb_ee.crelid.isna() |
                                        df_enb_ee.xid.isna() | df_enb_ee.xcellid.isna())]
            df_enb_ee = df_enb_ee.drop_duplicates().groupby(['postsite', 'postcell', 'celltype', 'plmn', 'enbid', 'cellid', 'earfcndl'],
                                                            sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
            df_enb_ee['mo_count'] = df_enb_ee.groupby(['postsite', 'postcell', 'relid', 'crelid']).cumcount() + 1
            df_enb_ee.loc[df_enb_ee.mo_count > 1, 'crelid'] = df_enb_ee.loc[df_enb_ee.mo_count > 1,
                                                                            ['crelid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        else: df_enb_ee['mo_count'] = None
        # Update neighborCellRef for Cell Relations
        if len(df_enb_ee.index) > 0:
            df_enb_ee['extcell'] = df_enb_ee[['xid', 'xcellid', 'celltype', 'postsite']].apply(
                lambda x: F'ENodeBFunction=1,EUtraNetwork={self.enodeb[x.postsite]["EUtraNetwork"]},ExternalENodeBFunction={x.xid},ExternalEUtranCell{x.celltype}={x.xcellid}', axis=1)
            df_enb_ee.loc[df_enb_ee.xid == '1', 'extcell'] = df_enb_ee.loc[df_enb_ee.xid == '1', ['xcellid', 'celltype']].apply(
                lambda x: F'ENodeBFunction=1,EUtranCell{x.celltype}={x.xcellid}', axis=1)
        else: df_enb_ee['extcell'] = None
        df_enb_ee = df_enb_ee.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)
        
        # Update EUtranCellRelation__flag for Cells that ar getting Migrated
        migratingcells = self.df_enb_cell.loc[(self.df_enb_cell.addcell & self.df_enb_cell.celltype.isin(['FDD', 'TDD']) &
                                                                     (~self.df_enb_cell.precell.isna()))].postcell.unique()

        df_enb_ee.loc[df_enb_ee.t_postcell.isin(self.df_enb_cell.loc[((self.df_enb_cell.addcell) & (self.df_enb_cell.celltype.isin(['FDD', 'TDD'])) &
                                                                     (~self.df_enb_cell.precell.isna()))].postcell.unique()), ['flag']] = True
        df_enb_ex['plmn'] = df_enb_ex.plmn.apply(json.loads)
        self.df_enb_ef = df_enb_ef.copy()
        self.df_enb_ex = df_enb_ex.copy()
        self.df_enb_ec = df_enb_ec.copy()
        self.df_enb_er = df_enb_er.copy()
        self.df_enb_ee = df_enb_ee.copy()

    def enodeb_gutranetwork(self):
        temp_list, temp1_list, temp2_list = [], [], []
        for site in self.sites:
            site = self.sites.get(site)
            pmo = site.find_child_mos_of_managedelement(moc='ENodeBFunction')
            if len(pmo) == 0: continue
            else: pmo = pmo[0]
            nwmo = site.find_mo_ending_with_parent_str(moc='GUtraNetwork', parent=pmo)
            if len(nwmo) == 0: continue
            nwmo = nwmo[0]
            # GUtranSyncSignalFrequency
            for mo in site.find_mo_ending_with_parent_str(moc='GUtranSyncSignalFrequency', parent=nwmo):
                mo_data = site.site_extract_data(mo)
                temp_list.append({'postsite': site.node, 'freqid': mo.split("=")[-1], 'arfcn': mo_data.get('arfcn'),
                                  'smtcoffset': mo_data.get('smtcOffset'), 'smtcscs': mo_data.get('smtcScs'),
                                  'smtcperiodicity': mo_data.get('smtcPeriodicity'), 'smtcduration': mo_data.get('smtcDuration'),
                                  'flag': False, 'fdn': mo})
            # ExternalGNodeBFunction & TermPointToGNB, ExternalGUtranCell
            for xmo in site.find_mo_ending_with_parent_str(moc='ExternalGNodeBFunction', parent=nwmo):
                mo_data = site.site_extract_data(xmo)
                if len(site.find_mo_ending_with_parent_str(moc='TermPointToGNB', parent=xmo)) > 0:
                    mot = site.find_mo_ending_with_parent_str(moc='TermPointToGNB', parent=xmo)[0]
                    mot_data = site.site_extract_data(mot)
                else: mot, mot_data = None, {}
                temp1_list.append({'postsite': site.node, 'xid': xmo.split("=")[-1], 'gnbid': mo_data.get('gNodeBId'),
                                   'gnblen': mo_data.get('gNodeBIdLength'), 'plmn': mo_data.get('gNodeBPlmnId'), 'flag': False, 'fdn': xmo,
                                   'x2id': mot.split("=")[-1] if mot else mot,
                                   'ipv4': mot_data.get('ipAddress'), 'xt_ipv6': mot_data.get('ipv6Address'),
                                   'xt_domain': mot_data.get('domainName'), 'x2fdn': mot})
                for mo in site.find_mo_ending_with_parent_str(moc='ExternalGUtranCell', parent=xmo):
                    mo_data = site.site_extract_data(mo)
                    temp2_list.append({'postsite': site.node, 'xid': mo.split(",")[-2].split("=")[-1], 'xcellid': mo.split("=")[-1],
                                       'cellid': mo_data.get('localCellId'),
                                       'pci': int(float(mo_data.get('physicalLayerCellIdGroup'))) * 3 + int(float(mo_data.get('physicalLayerSubCellId'))),
                                       'nrtac': mo_data.get('nRTAC'), 'israllowed': mo_data.get('isRemoveAllowed'),
                                       'freqid': mo_data.get('gUtranSyncSignalFrequencyRef').split("=")[-1], 'flag': False, 'fdn': mo})

        ecolumns = ['postsite', 'freqid', 'arfcn', 'smtcscs', 'smtcperiodicity', 'smtcoffset', 'smtcduration', 'flag', 'fdn']
        df_enb_nf = pd.DataFrame.from_dict(temp_list) if len(temp_list) > 0 else pd.DataFrame([], columns=ecolumns)
        ecolumns = ['postsite', 'xid', 'gnbid', 'gnblen', 'plmn', 'flag', 'fdn', 'x2id', 'ipv4', 'xt_ipv6', 'xt_domain', 'x2fdn']
        df_enb_nx = pd.DataFrame.from_dict(temp1_list) if len(temp1_list) > 0 else pd.DataFrame([], columns=ecolumns)
        ecolumns = ['postsite', 'xid', 'xcellid', 'cellid', 'pci', 'nrtac', 'israllowed', 'freqid', 'flag', 'fdn']
        df_enb_nc = pd.DataFrame.from_dict(temp2_list) if len(temp2_list) > 0 else pd.DataFrame([], columns=ecolumns)

        # GUtranFreqRelation, GUtranCellRelation
        temp1_list, temp2_list = [], []
        for row in self.df_enb_cell.itertuples():
            if row.fdn is None: continue
            site = self.sites.get(F'site_{row.presite}')
            for rel_mo in site.find_mo_ending_with_parent_str(moc='GUtranFreqRelation', parent=row.fdn):
                rel_data = site.site_extract_data(rel_mo)
                relid = rel_mo.split("=")[-1]
                temp1_list.append({'presite': site.node, 'precell': row.precell, 'relid': relid,
                                   'creprio': rel_data.get('cellReselectionPriority'),
                                   'freqid': rel_data.get('gUtranSyncSignalFrequencyRef').split("=")[-1],
                                   'flag': False, 'fdn': rel_mo})
                for cellrel_mo in site.find_mo_ending_with_parent_str(moc='GUtranCellRelation', parent=rel_mo):
                    mo_data = site.site_extract_data(cellrel_mo)
                    temp2_list.append({'presite': site.node, 'precell': row.precell, 'relid': relid, 'crelid': cellrel_mo.split("=")[-1],
                                       'israllowed': mo_data.get('isRemoveAllowed'),
                                       'xid': mo_data.get('neighborCellRef').split(",")[-2].split("=")[-1],
                                       'xcellid': mo_data.get('neighborCellRef').split("=")[-1],
                                       'flag': False, 'fdn': cellrel_mo})

        ecolumns = ['presite', 'precell', 'relid', 'creprio', 'freqid', 'flag', 'fdn']
        df_enb_nr = pd.DataFrame.from_dict(temp1_list) if len(temp1_list) > 0 else pd.DataFrame([], columns=ecolumns)
        ecolumns = ['presite', 'precell', 'relid', 'crelid', 'israllowed', 'xid', 'xcellid', 'flag', 'fdn']
        df_enb_ne = pd.DataFrame.from_dict(temp2_list) if len(temp2_list) > 0 else pd.DataFrame([], columns=ecolumns)

        # Update Existing Data
        sfrq_par_list = ['arfcn', 'smtcscs', 'smtcperiodicity', 'smtcoffset', 'smtcduration']
        df_enb_nx['plmn'] = df_enb_nx.plmn.apply(json.dumps)
        df_enb_nc = df_enb_nc.merge(df_enb_nf[['postsite', 'freqid'] + sfrq_par_list], on=['postsite', 'freqid'], how='left')
        df_enb_nc = df_enb_nc.merge(df_enb_nx[['postsite', 'xid', 'plmn', 'gnbid']], on=['postsite', 'xid'], how='left')
        df_enb_nr = df_enb_nr.merge(df_enb_nf[['postsite', 'freqid'] + sfrq_par_list].rename(columns={'postsite': 'presite'}),
                                    on=['presite', 'freqid'], how='left')
        df_enb_nr = df_enb_nr.merge(self.df_enb_cell[['presite', 'precell', 'postsite', 'postcell']], on=['presite', 'precell'], how='left')
        df_enb_ne = df_enb_ne.merge(df_enb_nr[['presite', 'precell', 'postsite', 'postcell', 'relid'] + sfrq_par_list],
                                    on=['presite', 'precell', 'relid'], how='left')
        df_enb_ne = df_enb_ne.merge(df_enb_nc[['postsite', 'xid', 'xcellid', 'plmn', 'gnbid', 'cellid']].rename(columns={'postsite': 'presite'}),
                                    on=['presite', 'xid', 'xcellid'], how='left')

        # Remove Values for nRTAC value '-1' wotn empty value as its out of range while creating it
        df_enb_nc['nrtac'].replace({'-1': ''}, inplace=True)

        # New Relation Addition need to be added here
        # Add & Update Beased on Migration and New Addition

        # Add ExternalGUtranCell
        df_enb_ne.drop(['xid', 'xcellid'], axis=1, inplace=True)
        df_enb_ne = df_enb_ne.merge(df_enb_nc[['postsite', 'xid', 'xcellid', 'plmn', 'gnbid', 'cellid']],
                                    on=['postsite', 'plmn', 'gnbid', 'cellid'], how='left')
        for row in df_enb_ne.loc[df_enb_ne.xcellid.isna()].drop_duplicates().groupby(['postsite', 'plmn', 'gnbid', 'cellid'],
                                                                                     as_index=False).head(1).itertuples():
            df_n = df_enb_nc.loc[(df_enb_nc.plmn == row.plmn) & (df_enb_nc.gnbid == row.gnbid) & (df_enb_nc.cellid == row.cellid)].head(1)
            if len(df_n.index) == 0: continue
            df_n[['postsite', 'flag', 'fdn']] = df_n.apply(lambda x: pd.Series([row.postsite, True, None]), axis=1)
            df_enb_nc = pd.concat([df_enb_nc, df_n], ignore_index=True)
        
        # Add ExternalGNodeBFunction
        df_enb_nc.drop(['xid'], axis=1, inplace=True)
        df_enb_nc = df_enb_nc.merge(df_enb_nx[['postsite', 'xid', 'plmn', 'gnbid']], on=['postsite', 'plmn', 'gnbid'], how='left')
        for row in df_enb_nc.loc[df_enb_nc.xid.isna()].drop_duplicates().groupby(['postsite', 'plmn', 'gnbid'], as_index=False).head(1).itertuples():
            df_n = df_enb_nx.loc[(df_enb_nx.plmn == row.plmn) & (df_enb_nx.gnbid == row.gnbid)].head(1)
            if len(df_n.index) == 0: continue
            df_n[['postsite', 'flag', 'fdn', 'x2fdn']] = df_n.apply(lambda x: pd.Series([row.postsite, True, None, None]), axis=1)
            df_enb_nx = pd.concat([df_enb_nx, df_n], ignore_index=True)
        
        # Add GUtranSyncSignalFrequency
        df_n = pd.concat([df_enb_nr[['postsite'] + sfrq_par_list], df_enb_nc[['postsite'] + sfrq_par_list]], ignore_index=True)
        # df_n = df_enb_nr[['postsite'] + sfrq_par_list].append(df_enb_nc[['postsite'] + sfrq_par_list])
        if len(df_n.index) > 0:
            df_n = df_n.drop_duplicates().groupby(['postsite'] + sfrq_par_list, sort=False, as_index=False).head(1)
            if self.client.software.swname < 'ATT_22_Q3':
                df_n[['freqid', 'flag', 'fdn']] = df_n.apply(
                    lambda x: pd.Series([F'{x.arfcn}-{x.smtcscs}-{x.smtcperiodicity}-{x.smtcoffset}-{x.smtcduration}', True, None]), axis=1)
            else: df_n[['freqid', 'flag', 'fdn']] = df_n.apply(lambda x: pd.Series([F'{x.arfcn}-{x.smtcscs}', True, None]), axis=1)
            df_enb_nf = pd.concat([df_enb_nf, df_n], ignore_index=True)
            # df_enb_nf.append(df_n)

        # Update GUtranSyncSignalFrequency
        df_enb_nf = df_enb_nf.loc[~(df_enb_nf.postsite.isna() | df_enb_nf.arfcn.isna() | df_enb_nf.smtcscs.isna() |
                                    df_enb_nf.smtcperiodicity.isna() | df_enb_nf.smtcoffset.isna() | df_enb_nf.smtcduration.isna())]
        df_enb_nf = df_enb_nf.drop_duplicates().groupby(['postsite'] + sfrq_par_list, sort=False, as_index=False).head(1).reset_index(drop=True, inplace=False)
        df_enb_nf['mo_count'] = df_enb_nf.groupby(['postsite', 'freqid']).cumcount() + 1
        df_enb_nf.loc[df_enb_nf.mo_count > 1, 'freqid'] = df_enb_nf.loc[df_enb_nf.mo_count > 1, ['freqid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_nf = df_enb_nf.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # Update ExternalGNodeBFunction
        df_enb_nx = df_enb_nx.loc[~(df_enb_nx.postsite.isna() | df_enb_nx.xid.isna() | df_enb_nx.plmn.isna() | df_enb_nx.gnbid.isna())]
        df_enb_nx = df_enb_nx.drop_duplicates().groupby(['postsite', 'plmn', 'gnbid'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
        df_enb_nx['mo_count'] = df_enb_nx.groupby(['postsite', 'xid']).cumcount() + 1
        df_enb_nx.loc[df_enb_nx.mo_count > 1, 'xid'] = df_enb_nx.loc[df_enb_nx.mo_count > 1, ['xid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_nx = df_enb_nx.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # Update ExternalGUtranCell
        df_enb_nc.drop(['xid', 'freqid'], axis=1, inplace=True)
        df_enb_nc = df_enb_nc.merge(df_enb_nx[['postsite', 'xid', 'plmn', 'gnbid']], on=['postsite', 'plmn', 'gnbid'], how='left')
        df_enb_nc = df_enb_nc.merge(df_enb_nf[['postsite', 'freqid'] + sfrq_par_list], on=['postsite'] + sfrq_par_list, how='left')
        df_enb_nc = df_enb_nc.loc[~(df_enb_nc.postsite.isna() | df_enb_nc.xid.isna() | df_enb_nc.xcellid.isna() | df_enb_nc.freqid.isna())]
        df_enb_nc = df_enb_nc.drop_duplicates().groupby(['postsite', 'plmn', 'gnbid', 'cellid'], sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
        df_enb_nc['mo_count'] = df_enb_nc.groupby(['postsite', 'xid', 'xcellid']).cumcount() + 1
        df_enb_nc.loc[df_enb_nc.mo_count > 1, 'xcellid'] = df_enb_nc.loc[df_enb_nc.mo_count > 1, ['xcellid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_nc = df_enb_nc.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # Update GUtranFreqRelation
        df_enb_nr.drop(['freqid'], axis=1, inplace=True)
        df_enb_nr = df_enb_nr.merge(df_enb_nf[['postsite', 'freqid'] + sfrq_par_list], on=['postsite'] + sfrq_par_list, how='left')
        df_enb_nr = df_enb_nr.loc[~(df_enb_nr.postsite.isnull() | df_enb_nr.postcell.isnull() | df_enb_nr.relid.isnull() | df_enb_nr.freqid.isnull())]
        df_enb_nr = df_enb_nr.drop_duplicates().groupby(['postsite', 'postcell'] + sfrq_par_list, sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
        df_enb_nr['mo_count'] = df_enb_nr.groupby(['postsite', 'postcell', 'relid']).cumcount() + 1
        df_enb_nr.loc[df_enb_nr.mo_count > 1, 'relid'] = df_enb_nr.loc[df_enb_nr.mo_count > 1, ['relid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_nr = df_enb_nr.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # Update GUtranCellRelation
        df_enb_ne.drop(['relid', 'xid', 'xcellid'], axis=1, inplace=True)
        df_enb_ne = df_enb_ne.merge(df_enb_nc[['postsite', 'xid', 'xcellid', 'plmn', 'gnbid', 'cellid']], on=['postsite', 'plmn', 'gnbid', 'cellid'], how='left')
        df_enb_ne = df_enb_ne.merge(df_enb_nr[['postsite', 'postcell', 'relid'] + sfrq_par_list], on=['postsite', 'postcell'] + sfrq_par_list, how='left')
        df_enb_ne = df_enb_ne.loc[~(df_enb_ne.postsite.isnull() | df_enb_ne.postcell.isnull() | df_enb_ne.relid.isnull() |
                                                df_enb_ne.xcellid.isnull() | df_enb_ne.xid.isnull() | df_enb_ne.xcellid.isnull())]
        df_enb_ne = df_enb_ne.drop_duplicates().groupby(['postsite', 'postcell', 'plmn', 'gnbid', 'cellid'] + sfrq_par_list, sort=False,
                                                        as_index=False).head(1).reset_index(inplace=False, drop=True)
        df_enb_ne['mo_count'] = df_enb_ne.groupby(['postsite', 'postcell', 'relid', 'crelid']).cumcount() + 1
        df_enb_ne.loc[df_enb_ne.mo_count > 1, 'crelid'] = df_enb_ne.loc[df_enb_ne.mo_count > 1, ['crelid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_ne = df_enb_ne.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # Update data type of plmn to dict
        df_enb_nx['plmn'] = df_enb_nx.plmn.apply(json.loads)
        self.df_enb_nf = df_enb_nf.copy()
        self.df_enb_nx = df_enb_nx.copy()
        self.df_enb_nc = df_enb_nc.copy()
        self.df_enb_nr = df_enb_nr.copy()
        self.df_enb_ne = df_enb_ne.copy()

    def enodeb_utranetwork(self):
        temp_list, temp1_list = [], []
        for site in self.sites:
            site = self.sites.get(site)
            pmo = site.find_child_mos_of_managedelement(moc='ENodeBFunction')
            if len(pmo) == 0: continue
            else: pmo = pmo[0]
            nwmo = site.find_mo_ending_with_parent_str(moc='UtraNetwork', parent=pmo)
            if len(nwmo) == 0: continue
            else: nwmo = nwmo[0]
            # UtranFrequency , ExternalUtranCellFDD
            for mo in site.find_mo_ending_with_parent_str(moc='UtranFrequency', parent=nwmo):
                freqid = mo.split("=")[-1]
                temp_list.append({'postsite': site.node, 'freqid': freqid, 'uarfcn': site.site_extract_data(mo).get('arfcnValueUtranDl'),
                                  'flag': False, 'fdn': mo})
                for xmo in site.find_mo_ending_with_parent_str(moc='ExternalUtranCellFDD', parent=mo):
                    data = site.site_extract_data(xmo)
                    temp1_list.append({'postsite': site.node, 'freqid': freqid, 'xcellid': xmo.split('=')[-1], 'plmn': data.get('plmnIdentity'),
                                       'cellid': data.get('cellIdentity'), 'pci': data.get('physicalCellIdentity'), 'lac': data.get('lac'),
                                       'rac': data.get('rac'), 'flag': False, 'fdn': xmo})

        ecolumns = ['postsite', 'freqid', 'uarfcn', 'flag', 'fdn']
        df_enb_uf = pd.DataFrame.from_dict(temp_list) if len(temp_list) > 0 else pd.DataFrame([], columns=ecolumns)
        ecolumns = ['postsite', 'freqid', 'xcellid', 'pci', 'cellid', 'lac', 'rac', 'plmn', 'flag', 'fdn']
        df_enb_uc = pd.DataFrame.from_dict(temp1_list) if len(temp1_list) > 0 else pd.DataFrame([], columns=ecolumns)

        # UtranFreqRelation, UtranCellRelation
        temp1_list, temp2_list = [], []
        for row in self.df_enb_cell.itertuples():
            if row.fdn is None: continue
            site = self.sites.get(F'site_{row.presite}')
            for rel_mo in site.find_mo_ending_with_parent_str(moc='UtranFreqRelation', parent=row.fdn):
                rel_data = site.site_extract_data(rel_mo)
                relid = rel_mo.split("=")[-1]
                temp1_list.append({'presite': site.node, 'precell': row.precell, 'relid': relid, 'creprio': rel_data.get('cellReselectionPriority'),
                                   'freqid': rel_data.get('utranFrequencyRef').split('=')[-1], 'flag': False, 'fdn': rel_mo})
                for cellrel_mo in site.find_mo_ending_with_parent_str(moc='UtranCellRelation', parent=rel_mo):
                    mo_data = site.site_extract_data(cellrel_mo)
                    temp2_list.append({'presite': site.node, 'precell': row.precell, 'relid': relid, 'crelid': cellrel_mo.split("=")[-1],
                                       'freqid': mo_data.get('externalUtranCellFDDRef').split(',')[-2].split('=')[-1],
                                       'xcellid': mo_data.get('externalUtranCellFDDRef').split("=")[-1],
                                       'flag': False, 'fdn': cellrel_mo})

        ecolumns = ['presite', 'precell', 'relid', 'creprio', 'cprio', 'csprio', 'csprioec', 'freqid', 'flag', 'fdn']
        df_enb_ur = pd.DataFrame.from_dict(temp1_list) if len(temp1_list) > 0 else pd.DataFrame([], columns=ecolumns)
        ecolumns = ['presite', 'precell', 'relid', 'crelid', 'freqid', 'xcellid', 'flag', 'fdn']
        df_enb_ue = pd.DataFrame.from_dict(temp2_list) if len(temp2_list) > 0 else pd.DataFrame([], columns=ecolumns)

        # Update Existing Data
        df_enb_uc['plmn'] = df_enb_uc.plmn.apply(json.dumps)
        df_enb_uc['cellid'] = df_enb_uc.cellid.apply(json.dumps)
        df_enb_uc = df_enb_uc.merge(df_enb_uf[['postsite', 'freqid', 'uarfcn']], on=['postsite', 'freqid'], how='left')
        df_enb_ur = df_enb_ur.merge(df_enb_uf[['postsite', 'freqid', 'uarfcn']].rename(columns={'postsite': 'presite'}), on=['presite', 'freqid'], how='left')
        df_enb_ur = df_enb_ur.merge(self.df_enb_cell[['presite', 'precell', 'postsite', 'postcell']], on=['presite', 'precell'], how='left')
        df_enb_ue = df_enb_ue.merge(df_enb_ur[['presite', 'precell', 'postsite', 'postcell', 'relid', 'uarfcn']], on=['presite', 'precell', 'relid'], how='left')
        df_enb_ue = df_enb_ue.merge(df_enb_uc[['postsite', 'freqid', 'xcellid', 'plmn', 'cellid']].rename(columns={'postsite': 'presite'}), on=['presite', 'freqid', 'xcellid'], how='left')

        # New Relation Addition need to be added here
        if len(self.cix.edx.get('UtranFreqRelation').index) > 0:
            df_n = self.cix.edx.get('UtranFreqRelation').copy().rename(
                columns={'eutrancellfddid': 'postcell', 'arfcnvalueutrandl': 'uarfcn', 'cellreselectionpriority': 'creprio'})
            df_n = df_n[['postcell', 'uarfcn', 'creprio']]
            df_n = df_n.merge(self.df_enb_cell[['postsite', 'postcell']], on=['postcell'], how='left')
            df_n[['flag', 'fdn', 'presite', 'precell', 'relid', 'freqid']] = df_n.apply(lambda x: pd.Series(
                [True, None, None, None, x.uarfcn, x.uarfcn]), axis=1)
            df_enb_ur = pd.concat([df_enb_ur, df_n], ignore_index=True).drop_duplicates().groupby(['postcell', 'uarfcn'], sort=False, as_index=False).head(1)
            df_enb_ur.reset_index(drop=True, inplace=True)
            # df_enb_ur = df_enb_ur.append(df_n).drop_duplicates().groupby(['postcell', 'uarfcn'], sort=False, as_index=False).head(1)

        # Add & Update Beased on Migration and New Addition
        # Add ExternalUtranCell
        df_enb_ue.drop(['xcellid'], axis=1, inplace=True)
        df_enb_ue = df_enb_ue.merge(df_enb_uc[['postsite', 'xcellid', 'plmn', 'cellid', 'uarfcn']], on=['postsite', 'plmn', 'cellid', 'uarfcn'], how='left')
        for row in df_enb_ue.loc[df_enb_ue.xcellid.isna()].drop_duplicates().groupby(['postsite', 'plmn', 'cellid', 'uarfcn'],
                                                                                     as_index=False).head(1).itertuples():
            df_t = df_enb_uc.loc[(df_enb_uc.plmn == row.plmn) & (df_enb_uc.cellid == row.cellid) & (df_enb_uc.uarfcn == row.uarfcn)].head(1)
            if len(df_t.index) == 0: continue
            df_t[['postsite', 'flag', 'fdn']] = df_t.apply(lambda x: pd.Series([row.postsite, True, None]), axis=1)
            df_enb_uc = pd.concat([df_enb_uc, df_t], ignore_index=True)

        df_n = pd.concat([df_enb_ur[['postsite', 'uarfcn', 'freqid']], df_enb_uc[['postsite', 'uarfcn', 'freqid']]], ignore_index=True)
        if len(df_n.index) > 0:
            df_n = df_n.drop_duplicates().groupby(['postsite', 'uarfcn'], sort=False, as_index=False).head(1).reset_index(drop=True, inplace=False)
            df_n = df_n.assign(flag=True, fdn=None)
        df_enb_uf = pd.concat([df_enb_uf, df_n], ignore_index=True).drop_duplicates().groupby(['postsite', 'uarfcn'], sort=False, as_index=False).head(1)
        df_enb_uf = df_enb_uf.loc[~(df_enb_uf.postsite.isna() | df_enb_uf.freqid.isna())].reset_index(drop=True, inplace=False)
        df_enb_uf['mo_count'] = df_enb_uf.groupby(['postsite', 'freqid']).cumcount() + 1
        df_enb_uf.loc[df_enb_uf.mo_count > 1, 'freqid'] = df_enb_uf.loc[df_enb_uf.mo_count > 1, ['freqid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_uf = df_enb_uf.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False).reset_index(drop=True, inplace=False)

        df_enb_uc = df_enb_uc.drop(['freqid'], axis=1, inplace=False).merge(df_enb_uf[['postsite', 'freqid', 'uarfcn']], on=['postsite', 'uarfcn'], how='left')
        df_enb_uc = df_enb_uc.loc[~(df_enb_uc.postsite.isna() | df_enb_uc.freqid.isna() | df_enb_uc.cellid.isna())]
        df_enb_uc['mo_count'] = df_enb_uc.groupby(['postsite', 'freqid', 'xcellid']).cumcount() + 1
        df_enb_uc.loc[df_enb_uc.mo_count > 1, 'xcellid'] = df_enb_uc.loc[df_enb_uc.mo_count > 1, ['xcellid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_uc = df_enb_uc.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False).reset_index(drop=True, inplace=False)

        df_enb_ur = df_enb_ur.drop(['freqid'], axis=1, inplace=False).merge(df_enb_uf[['postsite', 'freqid', 'uarfcn']], on=['postsite', 'uarfcn'], how='left')
        df_enb_ur = df_enb_ur.loc[~(df_enb_ur.postsite.isna() | df_enb_ur.freqid.isna() | df_enb_ur.relid.isna() | df_enb_ur.creprio.isna())]
        df_enb_ur['mo_count'] = df_enb_ur.groupby(['postsite', 'postcell', 'relid']).cumcount() + 1
        df_enb_ur.loc[df_enb_ur.mo_count > 1, 'relid'] = df_enb_ur.loc[df_enb_ur.mo_count > 1, ['relid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_ur = df_enb_ur.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False).reset_index(drop=True, inplace=False)

        df_enb_ue.drop(['relid', 'xcellid', 'freqid'], axis=1, inplace=True)
        df_enb_ue = df_enb_ue.merge(df_enb_uc[['postsite', 'freqid', 'xcellid', 'plmn', 'cellid', 'uarfcn']], on=['postsite', 'plmn', 'cellid', 'uarfcn'], how='left')
        df_enb_ue = df_enb_ue.merge(df_enb_ur[['postsite', 'postcell', 'relid', 'uarfcn']], on=['postsite', 'postcell', 'uarfcn'], how='left')
        df_enb_ue = df_enb_ue.loc[~(df_enb_ue.freqid.isna() | df_enb_ue.xcellid.isna() | df_enb_ue.relid.isna() | df_enb_ue.crelid.isna())]
        df_enb_ue['mo_count'] = df_enb_ue.groupby(['postsite', 'postcell', 'relid', 'crelid']).cumcount() + 1
        df_enb_ue.loc[df_enb_ue.mo_count > 1, 'crelid'] = df_enb_ue.loc[df_enb_ue.mo_count > 1, ['crelid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        df_enb_ue = df_enb_ue.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False).reset_index(drop=True, inplace=False)

        df_enb_uc['plmn'] = df_enb_uc.plmn.apply(json.loads)
        df_enb_uc['cellid'] = df_enb_uc.cellid.apply(json.loads)
        self.df_enb_uf = df_enb_uf.copy()
        self.df_enb_uc = df_enb_uc.copy()
        self.df_enb_ur = df_enb_ur.copy()
        self.df_enb_ue = df_enb_ue.copy()

    def gnb_nr_network(self):
        def get_pre_cell_data(cell, field, df_cell): return df_cell[df_cell.precell == cell][field].iloc[0]
        # ---ExternalGNBCUCPFunction, TermPointToGNodeB, ExternalNRCellCU, ExternalEUtranCellTDD & EUtranFrequency---
        temp1_list, temp2_list, temp3_list = [], [], []
        for site in self.sites:
            site = self.sites.get(site)
            if self.gnodeb.get(site.node, {}).get('GNBCUCP') is None: continue
            nwmo = site.find_mo_ending_with_parent_str(moc='NRNetwork', parent=self.gnodeb.get(site.node).get('GNBCUCP'))
            if len(nwmo) == 0: continue
            else: nwmo = nwmo[0]
            for frqmo in site.find_mo_ending_with_parent_str(moc='NRFrequency', parent=nwmo):
                tmp_mo_data = site.site_extract_data(frqmo)
                tmp_dict = {'postsite': site.node, 'freqid': frqmo.split("=")[-1],
                            'ssbfrequency': tmp_mo_data.get('arfcnValueNRDl'), 'ssbduration': tmp_mo_data.get('smtcDuration'),
                            'ssboffset': tmp_mo_data.get('smtcOffset'), 'ssbperiodicity': tmp_mo_data.get('smtcPeriodicity'),
                            'ssc': tmp_mo_data.get('smtcScs'), 'flag': False, 'fdn': frqmo}
                temp3_list.append(tmp_dict)
            for xmo in site.find_mo_ending_with_parent_str(moc='ExternalGNBCUCPFunction', parent=nwmo):
                tmp_mo_data = site.site_extract_data(xmo)
                tmp_dict = {'postsite': site.node, 'xid': xmo.split("=")[-1],
                            'plmn': tmp_mo_data.get('pLMNId'), 'gnbid': tmp_mo_data.get('gNBId'), 'gnbidlength': tmp_mo_data.get('gNBIdLength'),
                            'flag': False, 'fdn': xmo, 'x2id': None, 'ipv4': None, 'ipv6': None, 'x2fdn': None}
                if len(site.find_mo_ending_with_parent_str(moc='TermPointToGNodeB', parent=xmo)) > 0:
                    x2mo = site.find_mo_ending_with_parent_str(moc='TermPointToGNodeB', parent=xmo)[0]
                    tmp_dict |= {'x2fdn': x2mo, 'x2id': x2mo.split('=')[-1], 'ipv4': site.site_extract_data(x2mo).get('ipv4Address'),
                                 'ipv6': site.site_extract_data(x2mo).get('ipv6Address')}
                temp1_list.append(copy.deepcopy(tmp_dict))
                for xcellmo in site.find_mo_ending_with_parent_str(moc='ExternalNRCellCU', parent=xmo):
                    tmp_mo_data = site.site_extract_data(xcellmo)
                    temp2_list.append({'postsite': site.node, 'xid': xcellmo.split(',')[-2].split('=')[-1], 'xcellid': xcellmo.split('=')[-1],
                                       'cellid': tmp_mo_data.get('cellLocalId'), 'tac': tmp_mo_data.get('nRTAC'), 'pci': tmp_mo_data.get('nRPCI'),
                                       'freqid': tmp_mo_data.get('nRFrequencyRef', '=').split('=')[-1], 'plmnidlist': tmp_mo_data.get('plmnIdList'),
                                       'flag': False, 'fdn': xcellmo})
                    # temp2_list.append(tmp_dict)

        x_col = ['postsite', 'xid', 'plmn', 'gnbid', 'flag', 'fdn', 'x2fdn', 'x2id', 'ipv4', 'ipv6']
        df_gnb_ex = pd.DataFrame.from_dict(temp1_list) if len(temp1_list) > 0 else pd.DataFrame([], columns=x_col)
        xcell_col = ['postsite', 'xid', 'xcellid', 'cellid', 'tac', 'pci', 'freqid', 'plmnidlist', 'flag', 'fdn']
        df_gnb_ec = pd.DataFrame.from_dict(temp2_list) if len(temp2_list) > 0 else pd.DataFrame([], columns=xcell_col)
        freq_col = ['postsite', 'freqid', 'ssbfrequency', 'ssbperiodicity', 'ssboffset', 'ssbperiodicity', 'ssc', 'flag', 'fdn']
        df_gnb_ef = pd.DataFrame.from_dict(temp3_list) if len(temp3_list) > 0 else pd.DataFrame([], columns=freq_col)

        # --- NRFreqRelation & NRCellRelation ---
        temp1_list, temp2_list = [], []
        # att_dict = {'creprio': 'cellReselectionPriority', 'cprio': 'connectedModeMobilityPrio', 'vprio': 'voicePrio',
        # 'thhigh': 'threshXHigh', 'thlow': 'threshXLow'}
        rel_ref_para = ['intraFreqMCFreqRelProfileRef', 'mcpcPCellNrFreqRelProfileRef', 'mcpcPSCellNrFreqRelProfileRef',
                        'trStSaNrFreqRelProfileRef', 'ueMCNrFreqRelProfileRef']
        for row in self.df_gnb_cell.itertuples():
            if row.fdn is None: continue
            site = self.sites.get(F'site_{row.presite}')
            for rel_mo in site.find_mo_ending_with_parent_str(moc='NRFreqRelation', parent=row.fdn):
                rel_data = site.site_extract_data(rel_mo)
                precell = rel_mo.split(',')[-2].split("=")[-1]
                relid = rel_mo.split("=")[-1]
                tmp_dict = {'presite': site.node, 'precell': precell, 'relid': relid,
                            'creprio': site.site_extract_data(rel_mo).get('cellReselectionPriority', '7'),
                            'freqid': rel_data.get('nRFrequencyRef').split('=')[-1],
                            'flag': False, 'fdn': rel_mo}
                for para in rel_ref_para: tmp_dict |= {para: site.get_related_ref_mo(rel_mo, para)}
                temp1_list.append(copy.deepcopy(tmp_dict))
            for rel_mo in site.find_mo_ending_with_parent_str(moc='NRCellRelation', parent=row.fdn):
                rel_data = site.site_extract_data(rel_mo)
                precell = rel_mo.split(',')[-2].split("=")[-1]
                cellrel_data = site.site_extract_data(rel_mo)
                tmp_dict = {'presite': site.node, 'precell': precell, 'crelid': rel_mo.split("=")[-1],
                            'israllowed': cellrel_data.get('isRemoveAllowed'),
                            'relid': rel_data.get('nRFreqRelationRef').split('=')[-1],
                            'xid': cellrel_data.get('nRCellRef').split(",")[-2].split("=")[-1],
                            'xcellid': cellrel_data.get('nRCellRef').split("=")[-1],
                            'flag': False, 'fdn': rel_mo}
                temp2_list.append(copy.deepcopy(tmp_dict))
        rel_col = ['presite', 'precell', 'relid', 'creprio', 'freqid', 'flag', 'fdn'] + rel_ref_para
        df_gnb_er = pd.DataFrame.from_dict(temp1_list) if len(temp1_list) > 0 else pd.DataFrame([], columns=rel_col)
        cellrel_col = ['presite', 'precell', 'relid', 'crelid', 'israllowed', 'flag', 'fdn', 'xid', 'xcellid']
        df_gnb_ee = pd.DataFrame.from_dict(temp2_list) if len(temp2_list) > 0 else pd.DataFrame([], columns=cellrel_col)

        # --- Update Existing Relations ---
        df_gnb_ex['plmn'] = df_gnb_ex.plmn.apply(json.dumps)
        df_gnb_ec['plmnidlist'] = df_gnb_ex.plmnidlist.apply(json.dumps)
        df_gnb_ec = df_gnb_ec.merge(df_gnb_ex[['postsite', 'xid', 'gnbid', 'plmn']], on=['postsite', 'xid'], how='left')
        df_gnb_ec = df_gnb_ec.merge(df_gnb_ef[['postsite', 'freqid', 'ssbfrequency', 'ssbperiodicity', 'ssboffset', 'ssbperiodicity', 'ssc']],
                                    on=['postsite', 'freqid'], how='left')
        df_gnb_er = df_gnb_er.merge(self.df_gnb_cell[['presite', 'precell', 'postsite', 'postcell']], on=['presite', 'precell'], how='left')
        df_gnb_er = df_gnb_er.merge(df_gnb_ef[['postsite', 'freqid', 'ssbfrequency', 'ssbperiodicity', 'ssboffset', 'ssbperiodicity', 'ssc']].rename(
            columns={'postsite': 'presite'}), on=['presite', 'freqid'], how='left')
        df_gnb_ee = df_gnb_ee.merge(df_gnb_ec[['postsite', 'xid', 'xcellid', 'plmn', 'gnbid', 'cellid']].rename(columns={'postsite': 'presite'}),
                                    on=['presite', 'xid', 'xcellid'], how='left')
        df_gnb_ee = df_gnb_ee.merge(df_gnb_er[['presite', 'precell', 'relid', 'postsite', 'postcell', 'ssbfrequency', 'ssbperiodicity', 'ssboffset',
                                               'ssbperiodicity', 'ssc']], on=['presite', 'precell', 'relid'], how='left')

        # --- Remove Deleted Cell & there Relations ---
        df_gnb_ee = df_gnb_ee.loc[((df_gnb_ee.xcellid.isin(list(filter(None, self.df_gnb_cell['precell'].unique())))) |
                                   (~(df_gnb_ee.cellid.isnull())))]
        df_gnb_ee.reset_index(inplace=True, drop=True)
        # --- Update post gnbid & cellid of co-site cell relations ---
        df_gnb_ee.loc[df_gnb_ee.cellid.isna(), 'plmn'] = df_gnb_ee.loc[df_gnb_ee.cellid.isna()]['xcellid'].map(lambda x: json.dumps(self.plmn))
        df_gnb_ee.loc[df_gnb_ee.gnbid.isna(), 'gnbid'] = df_gnb_ee.loc[df_gnb_ee.gnbid.isna()]['xcellid'].map(
            lambda x: self.df_gnb_cell[self.df_gnb_cell.precell == x]['preenbid'].iloc[0])  # get_pre_cell_data(x, 'preenbid', self.df_gnb_cell))
        df_gnb_ee.loc[df_gnb_ee.cellid.isna(), 'cellid'] = df_gnb_ee.loc[df_gnb_ee.cellid.isna()]['xcellid'].map(
            lambda x: self.df_gnb_cell[self.df_gnb_cell.precell == x]['precellid'].iloc[0])  # get_pre_cell_data(x, 'precellid', self.df_gnb_cell)
        # --- Remove existing External FDD/TDD based on migration ---
        df_gnb_ec = df_gnb_ec.merge(self.df_gnb_cell[['preenbid', 'precellid', 'postsite']].rename(
            columns={'preenbid': 'gnbid', 'precellid': 'cellid'}), on=['gnbid', 'cellid'], how='left', suffixes=('', '_t'))
        df_gnb_ec = df_gnb_ec.loc[df_gnb_ec.postsite != df_gnb_ec.postsite_t].reset_index(inplace=False, drop=True)
        df_gnb_ec.drop(['postsite_t'], axis=1, inplace=True)
        # --- Remove ExternalENodeBFunction & External FDD/TDD if node is getting deleted ---
        temp1_list = list(set(list(self.df_gnb_cell.preenbid.unique())) - set(list(self.df_gnb_cell.gnbid.unique())))
        df_gnb_ex = df_gnb_ex.loc[~df_gnb_ex.gnbid.isin(temp1_list)].reset_index(inplace=False, drop=True)
        df_gnb_ec = df_gnb_ec.loc[~df_gnb_ec.gnbid.isin(temp1_list)].reset_index(inplace=False, drop=True)
        # --- Update existing Cell Relations, gnbid, cellid based on migration ---
        df_gnb_ee = df_gnb_ee.merge(self.df_gnb_cell[['preenbid', 'precellid', 'gnbid', 'cellid']].rename(
            columns={'preenbid': 'gnbid', 'precellid': 'cellid', 'gnbid': 'postenbid', 'cellid': 'postcellid'}),
            on=['gnbid', 'cellid'], how='left', suffixes=('', '_t'))
        # f1 = (~df_gnb_ee.postcellid.isna())
        # f2 = (df_gnb_ee.gnbid != df_gnb_ee.postenbid)
        # f3 = (df_gnb_ee.cellid != df_gnb_ee.postcellid)
        # f4 = ((~df_gnb_ee.postcellid.isna()) & (df_gnb_ee.gnbid != df_gnb_ee.postenbid) &
        #                (df_gnb_ee.cellid != df_gnb_ee.postcellid))
        # print(len(df_gnb_ee.loc[((~df_gnb_ee.postcellid.isna()) & ((df_gnb_ee.gnbid != df_gnb_ee.postenbid) |
        #                (df_gnb_ee.cellid != df_gnb_ee.postcellid)))].index))

        if len(df_gnb_ee.loc[(~df_gnb_ee.postenbid.isna())].index) > 0:
            df_gnb_ee.loc[((~df_gnb_ee.postcellid.isna()) & ((df_gnb_ee.gnbid != df_gnb_ee.postenbid) |
                                                             (df_gnb_ee.cellid != df_gnb_ee.postcellid))), ['flag']] = True
            df_gnb_ee.loc[(~df_gnb_ee.postenbid.isna()), ['gnbid']] = df_gnb_ee.loc[(~df_gnb_ee.postenbid.isna()), ['postenbid']].apply(
                lambda x: x.postenbid, axis=1)
            df_gnb_ee.loc[(~df_gnb_ee.postcellid.isna()), ['cellid']] = df_gnb_ee.loc[(~df_gnb_ee.postcellid.isna()), ['postcellid']].apply(
                lambda x: x.postcellid, axis=1)
        df_gnb_ee.drop(['postcellid', 'postenbid'], axis=1, inplace=True)

        # --- Addition of New Relations ---
        df_n = self.df_gnb_cell.loc[self.df_gnb_cell.celltype.isin(['FDD']), ['postsite', 'postcell', 'celltype', 'earfcndl', 'gnbid', 'cellid',
                                                                              'tac', 'physicallayercellid']].rename(
            columns={'physicallayercellid': 'pci'})
        if len(df_n.index) > 0:
            df_n[['flag', 'fdn', 'x2fdn', 'plmn', 'xid', 'x2id', 'xcellid', 'ipv4', 'ipv6', 'domain', 'freqid', 'israllowed', 'scell']] = \
                df_n.apply(lambda x: pd.Series([True, None, None, json.dumps(self.plmn), F'{self.mccmnc}-{x.gnbid}', F'{self.mccmnc}-{x.gnbid}',
                                                F'{self.mccmnc}-{x.gnbid}-{x.cellid}', F'0.0.0.0',
                                                '::', '', F'{x.earfcndl}', 'false', '2 (AUTO)']), axis=1)

            # --- Addition of ExternalENodeBFunction & External FDD/TDD ---
            df_t = df_n[['postsite', 'flag']].groupby(['postsite', 'flag'], as_index=False).head(1)
            df_t = df_t.merge(df_n, on='flag', suffixes=('', '_t'))
            df_t = df_t.loc[df_t.postsite != df_t.postsite_t]
            df_gnb_ex = pd.concat([df_gnb_ex, df_t[['postsite', 'xid', 'plmn', 'gnbid', 'flag', 'fdn', 'x2fdn', 'x2id',
                                                    'ipv4', 'ipv6', 'domain']]], ignore_index=True)
            df_gnb_ex = df_gnb_ex.drop_duplicates().groupby(['postsite', 'plmn', 'gnbid'], sort=False, as_index=False).head(1).reset_index(
                inplace=False, drop=True)
            df_gnb_ec = pd.concat([df_gnb_ec, df_t[
                ['postsite', 'celltype', 'xid', 'xcellid', 'cellid', 'tac', 'pci', 'freqid', 'flag', 'fdn',
                 'gnbid', 'plmn', 'earfcndl']]], ignore_index=True)
            df_gnb_ec = df_gnb_ec.drop_duplicates().groupby(['postsite', 'plmn', 'gnbid', 'cellid'], sort=False, as_index=False).head(1).reset_index(
                inplace=False, drop=True)
            # --- Addition of EUtranCellRelation ---
            df_t = df_n[['postsite', 'postcell', 'flag']].groupby(['postsite', 'postcell', 'flag'], as_index=False).head(1)
            df_t = df_t.merge(df_n, on='flag', suffixes=('', '_t'))
            df_t = df_t.loc[df_t.postcell != df_t.postcell_t]
            df_t = df_t[['xcellid', 'israllowed', 'scell', 'xid', 'celltype', 'flag', 'fdn', 'plmn', 'gnbid', 'cellid', 'postsite', 'postcell',
                         'earfcndl']].rename(columns={'xcellid': 'crelid'})
            df_gnb_ee = pd.concat([df_gnb_ee, df_t], ignore_index=True)
            df_gnb_ee = df_gnb_ee.drop_duplicates().groupby(['postsite', 'postcell', 'plmn', 'gnbid', 'cellid', 'earfcndl', 'celltype'],
                                                            sort=False, as_index=False).head(1)
            df_gnb_ee.reset_index(inplace=True, drop=True)
            del df_t, df_n

        # --- Addition of EUtranFreqRelation ---
        if len(self.cix.edx.get('EUtranFreqRelation').index) > 0:
            df_n = self.cix.edx.get('EUtranFreqRelation').rename(columns={'eutrancellfddid': 'postcell', 'arfcnvalueeutrandl': 'earfcndl',
                                                                          'cellreselectionpriority': 'creprio'})
            df_n[['presite', 'precell', 'fdn', 'flag', 'relid', 'freqid']] = df_n.apply(lambda x: pd.Series([None, None, None, True,
                                                                                                             x.earfcndl, x.earfcndl]), axis=1)
            df_n = df_n.merge(self.df_gnb_cell[['postcell', 'postsite']], on=['postcell'], how='left')
            df_n = df_n.loc[~df_n.postsite.isna()]
            df_gnb_er = pd.concat([df_gnb_er, df_n], ignore_index=True)
        df_gnb_er = df_gnb_er.drop_duplicates().groupby(['postsite', 'postcell', 'earfcndl'], sort=False, as_index=False).head(1).reset_index(
            inplace=False, drop=True)

        # --- Addition of External FDD/TDD based on migrations and Logs
        temp_list = ['postsite', 'celltype', 'plmn', 'gnbid', 'cellid', 'earfcndl']
        df_gnb_ee.drop(['xid', 'xcellid'], axis=1, inplace=True)
        df_gnb_ee = df_gnb_ee.merge(df_gnb_ec[['xid', 'xcellid'] + temp_list], on=temp_list, how='left')
        for row in df_gnb_ee.loc[df_gnb_ee.xcellid.isna()].drop_duplicates().groupby(temp_list, as_index=False).head(1).itertuples():
            if row.gnbid == self.df_gnb_cell.loc[self.df_gnb_cell.postsite == row.postsite].gnbid.iloc[0]: continue
            df_t = df_gnb_ec.loc[(df_gnb_ec.plmn == row.plmn) & (df_gnb_ec.celltype == row.celltype) &
                                 (df_gnb_ec.gnbid == row.gnbid) & (df_gnb_ec.cellid == row.cellid) & (df_gnb_ec.earfcndl == row.earfcndl)].head(1)
            if len(df_t.index) == 0: continue
            df_t[['postsite', 'flag', 'fdn']] = df_t.apply(lambda x: pd.Series([row.postsite, True, None]), axis=1)
            df_gnb_ec = pd.concat([df_gnb_ec, df_t], ignore_index=True)

        # --- Addition of ExternalENodeBFunction based on migrations and Logs
        df_gnb_ec.drop(['xid'], axis=1, inplace=True)
        df_gnb_ec = df_gnb_ec.merge(df_gnb_ex[['postsite', 'plmn', 'gnbid', 'xid']], on=['postsite', 'plmn', 'gnbid'], how='left')
        for row in df_gnb_ec.loc[df_gnb_ec.xid.isna()].drop_duplicates().groupby(['postsite', 'plmn', 'gnbid'], as_index=False).head(1).itertuples():
            df_t = df_gnb_ex.loc[(df_gnb_ex.plmn == row.plmn) & (df_gnb_ex.plmn == row.plmn) & (df_gnb_ex.gnbid == row.gnbid)].head(1)
            if len(df_t.index) == 0: continue
            df_t[['postsite', 'flag', 'fdn', 'x2fdn']] = df_t.apply(lambda x: pd.Series([row.postsite, True, None, None]), axis=1)
            df_gnb_ex = pd.concat([df_gnb_ex, df_t], ignore_index=True)

        # --- Addition of EUtranFrequency based on migrations and Logs
        df_t = pd.concat([df_gnb_ec[['postsite', 'freqid', 'earfcndl']], df_gnb_er[['postsite', 'freqid', 'earfcndl']]], ignore_index=True)
        df_t['flag'] = True
        df_gnb_ef = pd.concat([df_gnb_ef, df_t], ignore_index=True)
        df_gnb_ef = df_gnb_ef.drop_duplicates().groupby(['postsite', 'earfcndl'], sort=False, as_index=False).head(1).reset_index(inplace=False,
                                                                                                                                  drop=True)

        # --- Update IDs for to EUtranFrequency remove dublicate IDs
        df_gnb_ef = df_gnb_ef.loc[~(df_gnb_ef.postsite.isna() | df_gnb_ef.freqid.isna() | df_gnb_ef.earfcndl.isna())]
        df_gnb_ef = df_gnb_ef.drop_duplicates().groupby(['postsite', 'earfcndl'], sort=False, as_index=False).head(1).reset_index(inplace=False,
                                                                                                                                  drop=True)
        df_gnb_ef['mo_count'] = df_gnb_ef.groupby(['postsite', 'freqid']).cumcount() + 1
        df_gnb_ef.loc[df_gnb_ef.mo_count > 1, 'freqid'] = df_gnb_ef.loc[df_gnb_ef.mo_count > 1, ['freqid', 'mo_count']].apply(
            lambda x: '_'.join(x.astype(str)), axis=1)
        df_gnb_ef = df_gnb_ef.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # --- Update IDs for to EUtranFreqRelation remove dublicate IDs
        df_gnb_er.drop(['freqid'], axis=1, inplace=True)
        df_gnb_er = df_gnb_er.merge(df_gnb_ef[['postsite', 'freqid', 'earfcndl']], on=['postsite', 'earfcndl'], how='left')
        df_gnb_er = df_gnb_er.loc[
            ~(df_gnb_er.postsite.isna() | df_gnb_er.postcell.isna() | df_gnb_er.relid.isna() | df_gnb_er.freqid.isna() | df_gnb_er.earfcndl.isna())]
        df_gnb_er = df_gnb_er.drop_duplicates().groupby(['postsite', 'postcell', 'earfcndl'], sort=False, as_index=False).head(1).reset_index(
            inplace=False, drop=True)
        df_gnb_er['mo_count'] = df_gnb_er.groupby(['postsite', 'postcell', 'relid']).cumcount() + 1
        df_gnb_er.loc[df_gnb_er.mo_count > 1, 'relid'] = df_gnb_er.loc[df_gnb_er.mo_count > 1, ['relid', 'mo_count']].apply(
            lambda x: '_'.join(x.astype(str)), axis=1)
        df_gnb_er = df_gnb_er.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # --- Update IDs for to ExternalENodeBFunction remove dublicate IDs
        df_gnb_ex = df_gnb_ex.loc[~(df_gnb_ex.postsite.isna() | df_gnb_ex.xid.isna() | df_gnb_ex.plmn.isna() | df_gnb_ex.gnbid.isna())]
        df_gnb_ex = df_gnb_ex.drop_duplicates().groupby(['postsite', 'plmn', 'gnbid'], sort=False, as_index=False).head(1).reset_index(inplace=False,
                                                                                                                                       drop=True)
        df_gnb_ex['mo_count'] = df_gnb_ex.groupby(['postsite', 'xid']).cumcount() + 1
        df_gnb_ex.loc[df_gnb_ex.mo_count > 1, 'xid'] = df_gnb_ex.loc[df_gnb_ex.mo_count > 1, ['xid', 'mo_count']].apply(
            lambda x: '_'.join(x.astype(str)), axis=1)
        df_gnb_ex = df_gnb_ex.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # --- Update IDs for to External FDD/TDD remove dublicate IDs
        df_gnb_ec.drop(['xid', 'freqid'], axis=1, inplace=True)
        df_gnb_ec = df_gnb_ec.merge(df_gnb_ex[['postsite', 'xid', 'plmn', 'gnbid']], on=['postsite', 'plmn', 'gnbid'], how='left')
        df_gnb_ec = df_gnb_ec.merge(df_gnb_ef[['postsite', 'freqid', 'earfcndl']], on=['postsite', 'earfcndl'], how='left')
        df_gnb_ec = df_gnb_ec.loc[
            ~(df_gnb_ec.postsite.isna() | df_gnb_ec.xid.isna() | df_gnb_ec.xcellid.isna() | df_gnb_ec.freqid.isna() | df_gnb_ec.earfcndl.isna())]
        df_gnb_ec = df_gnb_ec.drop_duplicates().groupby(['postsite', 'celltype', 'plmn', 'gnbid', 'cellid', 'earfcndl'], sort=False,
                                                        as_index=False).head(1).reset_index(inplace=False, drop=True)
        df_gnb_ec['mo_count'] = df_gnb_ec.groupby(['postsite', 'xid', 'xcellid']).cumcount() + 1
        df_gnb_ec.loc[df_gnb_ec.mo_count > 1, 'xcellid'] = df_gnb_ec.loc[df_gnb_ec.mo_count > 1, ['xcellid', 'mo_count']].apply(
            lambda x: '_'.join(x.astype(str)), axis=1)
        df_gnb_ec = df_gnb_ec.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # --- Update IDs for to EUtranCellRelation israllowed dublicate IDs and create Final DataFrame
        df_gnb_ee.loc[(df_gnb_ee.gnbid.isin(list(filter(None, self.df_gnb_cell['gnbid'].unique())))), 'crelid'] = \
            df_gnb_ee.loc[(df_gnb_ee.gnbid.isin(list(filter(None, self.df_gnb_cell['gnbid'].unique())))), ['gnbid', 'cellid']].apply(
                lambda x: F'{self.mccmnc}-' + '-'.join(x.astype(str)), axis=1)

        df_gnb_ee.drop(['xid', 'xcellid', 'relid'], axis=1, inplace=True)
        df_gnb_ee = df_gnb_ee.merge(df_gnb_ec[['xid', 'xcellid', 'postsite', 'celltype', 'plmn', 'gnbid', 'cellid', 'earfcndl']],
                                    on=['postsite', 'celltype', 'plmn', 'gnbid', 'cellid', 'earfcndl'], how='left')
        df_gnb_ee = df_gnb_ee.merge(df_gnb_er[['postsite', 'postcell', 'relid', 'earfcndl']], on=['postsite', 'postcell', 'earfcndl'], how='left')
        df_gnb_ee = df_gnb_ee.merge(self.df_gnb_cell[['gnbid', 'cellid', 'postcell']].rename(columns={'postcell': 't_postcell'}),
                                    on=['gnbid', 'cellid'], how='left')
        # df_gnb_ee.loc[(~df_gnb_ee.t_postcell.isna()), ['scell']] = df_gnb_ee.loc[(~df_gnb_ee.t_postcell.isna()), ['postcell', 't_postcell']].apply(
        #     lambda x: '1 (ALLOWED)' if x.postcell[-2] == x.t_postcell[-2] else '2 (AUTO)', axis=1)
        df_gnb_ee.loc[(~df_gnb_ee.t_postcell.isna()), 'israllowed'] = 'false'
        # Check EUtranCellRelationId to Cell Name 12/13/2021
        df_gnb_ee.loc[(~df_gnb_ee.t_postcell.isna()), 'crelid'] = df_gnb_ee.loc[(~df_gnb_ee.t_postcell.isna())].t_postcell
        # Check EUtranCellRelationId to Cell Name  End
        df_gnb_ee.loc[df_gnb_ee.xid.isna(), 'xid'] = '1'
        if len(df_gnb_ee.index) > 0:
            df_gnb_ee.loc[df_gnb_ee.xcellid.isna(), 'xcellid'] = df_gnb_ee.loc[df_gnb_ee.xcellid.isna(),
            ['t_postcell']].apply(lambda x: x.t_postcell, axis=1)
            df_gnb_ee = df_gnb_ee.loc[~(df_gnb_ee.postsite.isna() | df_gnb_ee.postcell.isna() | df_gnb_ee.relid.isna() | df_gnb_ee.crelid.isna() |
                                        df_gnb_ee.xid.isna() | df_gnb_ee.xcellid.isna())]
            df_gnb_ee = df_gnb_ee.drop_duplicates().groupby(['postsite', 'postcell', 'celltype', 'plmn', 'gnbid', 'cellid', 'earfcndl'],
                                                            sort=False, as_index=False).head(1).reset_index(inplace=False, drop=True)
            df_gnb_ee['mo_count'] = df_gnb_ee.groupby(['postsite', 'postcell', 'relid', 'crelid']).cumcount() + 1
            df_gnb_ee.loc[df_gnb_ee.mo_count > 1, 'crelid'] = df_gnb_ee.loc[df_gnb_ee.mo_count > 1,
            ['crelid', 'mo_count']].apply(lambda x: '_'.join(x.astype(str)), axis=1)
        else:
            df_gnb_ee['mo_count'] = None
        # Update neighborCellRef for Cell Relations
        if len(df_gnb_ee.index) > 0:
            df_gnb_ee['extcell'] = df_gnb_ee[['xid', 'xcellid', 'celltype', 'postsite']].apply(
                lambda
                    x: F'ENodeBFunction=1,EUtraNetwork={self.enodeb[x.postsite]["EUtraNetwork"]},ExternalENodeBFunction={x.xid},ExternalEUtranCell{x.celltype}={x.xcellid}',
                axis=1)
            df_gnb_ee.loc[df_gnb_ee.xid == '1', 'extcell'] = df_gnb_ee.loc[df_gnb_ee.xid == '1', ['xcellid', 'celltype']].apply(
                lambda x: F'ENodeBFunction=1,EUtranCell{x.celltype}={x.xcellid}', axis=1)
        else:
            df_gnb_ee['extcell'] = None
        df_gnb_ee = df_gnb_ee.replace({np.nan: None}).drop(['mo_count'], axis=1, inplace=False)

        # Update EUtranCellRelation__flag for Cells that ar getting Migrated
        migratingcells = self.df_gnb_cell.loc[(self.df_gnb_cell.addcell & self.df_gnb_cell.celltype.isin(['FDD', 'TDD']) &
                                               (~self.df_gnb_cell.precell.isna()))].postcell.unique()

        df_gnb_ee.loc[df_gnb_ee.t_postcell.isin(self.df_gnb_cell.loc[((self.df_gnb_cell.addcell) & (self.df_gnb_cell.celltype.isin(['FDD', 'TDD'])) &
                                                                      (~self.df_gnb_cell.precell.isna()))].postcell.unique()), ['flag']] = True
        df_gnb_ex['plmn'] = df_gnb_ex.plmn.apply(json.loads)
        self.df_gnb_ef = df_gnb_ef.copy()
        self.df_gnb_ex = df_gnb_ex.copy()
        self.df_gnb_ec = df_gnb_ec.copy()
        self.df_gnb_er = df_gnb_er.copy()
        self.df_gnb_ee = df_gnb_ee.copy()

    def antenna_system_cell(self, site, presite, precell, rfb_list):
        rfb_list = list(OrderedDict.fromkeys(rfb_list).keys())
        temp_fru = []
        for _, rf_branch_ref in enumerate(rfb_list):
            rfb_tmp_dict = {'presite': presite, 'precell': precell, 'raug': None, 'rfb': None, 'dl_ul_delay_att': None,
                            'fru': None, 'isshared': 'false', 'rfp': None, 'trecid': None,
                            'aug': None, 'au': None, 'asu': None, 'aup': None, 'rfbfdn': None,  'frufdn': None,
                            'aufdn': None, 'asufdn': None, 'aupfdn': None, 'retfdn': None, 'tmafdn': None}
            rfbfdn = site.get_mo_w_end_str(rf_branch_ref)
            rfb_data = site.site_extract_data(rfbfdn)
            rfbfdn_ids = {_.split('=')[0]: _.split('=')[-1] for _ in rfbfdn.split(',')}
            if 'Transceiver' in rfbfdn_ids.keys():
                frufdn = ','.join(rfbfdn.split(',')[:[_.split('=')[0] for _ in rfbfdn.split(',')].index(site.get_fru_string()) + 1])
                rfb_tmp_dict |= {'rfb': rfbfdn_ids.get('Transceiver', None), 'fru': rfbfdn_ids.get(site.get_fru_string(), None),
                                     'trecid': rfbfdn_ids.get('Transceiver', None), 'rfbfdn': rfbfdn, 'frufdn': frufdn}
            else:
                tmafdn = site.get_mo_w_end_str(rfb_data.get('tmaRef')) if rfb_data.get('tmaRef') is not None else None
                rfb_tmp_dict |= {'raug': rfbfdn_ids.get('AntennaUnitGroup'), 'rfb': rfbfdn_ids.get('RfBranch'),
                                     'dl_ul_delay_att': [rfb_data.get('dlTrafficDelay')[0], rfb_data.get('ulTrafficDelay')[0],
                                                         rfb_data.get('dlAttenuation')[0], rfb_data.get('ulAttenuation')[0]],
                                     'tmafdn': tmafdn, 'rfbfdn': rfbfdn}
                aupfdn = rfb_data.get('auPortRef')
                if aupfdn is not None and len(aupfdn) > 0:
                    aupfdn = site.get_mo_w_end_str(aupfdn[0])
                    aupfdn_ids = {_.split('=')[0]: _.split('=')[-1] for _ in aupfdn.split(',')}
                    aufdn = ','.join(aupfdn.split(',')[:[_.split('=')[0] for _ in aupfdn.split(',')].index('AntennaUnit') + 1])
                    asufdn = ','.join(aupfdn.split(',')[:[_.split('=')[0] for _ in aupfdn.split(',')].index('AntennaSubunit') + 1])
                    retfdn = site.site_extract_data(asufdn).get('retSubunitRef', None)
                    if retfdn is not None and len(retfdn) > 0: retfdn = site.get_mo_w_end_str(retfdn)
                    rfb_tmp_dict |= {'aug': aupfdn_ids.get('AntennaUnitGroup', None), 'au': aupfdn_ids.get('AntennaUnit', None),
                                     'asu': aupfdn_ids.get('AntennaSubunit', None), 'aup': aupfdn_ids.get('AuPort', None),
                                     'mt': site.site_extract_data(aufdn).get('mechanicalAntennaTilt', '0'),
                                     'retfdn': retfdn, 'aufdn': aufdn, 'asufdn': asufdn, 'aupfdn': aupfdn}
                rfpfdn = rfb_data.get('rfPortRef')
                if rfpfdn is not None and len(rfpfdn) > 0:
                    rfpfdn = site.get_mo_w_end_str(rfpfdn)
                    frufdn = ','.join(rfpfdn.split(',')[:[_.split('=')[0] for _ in rfpfdn.split(',')].index(site.get_fru_string()) + 1])
                    rfpfdn_ids = {_.split('=')[0]: _.split('=')[-1] for _ in rfpfdn.split(',')}
                    rfb_tmp_dict |= {
                        'fru': rfpfdn_ids.get(site.get_fru_string(), None),
                        'isshared': site.site_extract_data(frufdn).get('isSharedWithExternalMe', 'false'),
                        'rfp': rfpfdn_ids.get('RfPort', None),
                        'frufdn': frufdn,
                    }
            self.ant_system_list.append(rfb_tmp_dict.copy())
            if rfb_tmp_dict.get('frufdn') is None: temp_fru.append([None, None, None])
            else:
                fru_data = site.site_extract_data(rfb_tmp_dict.get('frufdn')).get('productData')
                temp_fru.append([rfb_tmp_dict.get('fru'),
                                 ''.join(fru_data.get('productName')).upper() if fru_data.get('productName', None) is not None else None,
                                 fru_data.get('serialNumber', None)])
        temp_fru_a = []
        for item in temp_fru:
            if item not in temp_fru_a: temp_fru_a.append(item)
        return temp_fru_a

    def enodeb_gnodeb_antenna_system(self):
        def get_antenna_group_from_cell(cell_name):
            instr = '_'.join(cell_name.split('_')[1:]) if '_' in cell_name else cell_name
            #   CRAN Site
            if instr.upper().startswith('R'): return instr.split('_')[0] + '_Q'
            ch, group = instr[1], ['A', 'B', 'C', 'D', 'E', 'F']
            aug_map = {'A': '1', 'B': '2', 'C': '3', 'D': '4', 'E': '5', 'F': '6', 'G': '1'}
            for key in aug_map.keys():
                if key in instr.upper(): return aug_map.get(key)
            return str(int(group.index(ch) + 1)) if ch in group else '1'

        ecolumns = ['presite', 'precell', 'raug', 'rfb', 'dl_ul_delay_att', 'fru', 'isshared', 'rfp', 'trecid',
                    'aug', 'au', 'asu', 'aup', 'rfbfdn', 'frufdn', 'retfdn', 'tmafdn', 'aufdn']
        df_ant = pd.DataFrame.from_dict(self.ant_system_list) if len(self.ant_system_list) > 0 else pd.DataFrame([], columns=ecolumns)
        df_ant['antflag'] = False
        cell_col_list = ['celltype', 'presite', 'precell', 'postsite', 'postcell', 'prefru', 'prefrutype', 'prefrusn', 'frutypecix',
                         'presc', 'addcell', 'sef', 'sefcix', 'sccix', 'carrier', 'rrushared', 'sc', 'nooftx', 'noofrx', 'confpow', 'confpowcix',
                         'fruchange', 'freqband', 'dl_ul_delay_att']
        df_cell = pd.DataFrame([], columns=cell_col_list)
        if len(self.df_enb_cell.index) > 0 and len(self.df_gnb_cell.index) > 0:
            df_cell = pd.concat([self.df_enb_cell[cell_col_list], self.df_gnb_cell[cell_col_list]], ignore_index=True)
        elif len(self.df_enb_cell.index) > 0:
            df_cell = self.df_enb_cell[cell_col_list]
        elif len(self.df_gnb_cell.index) > 0:
            df_cell = self.df_gnb_cell[cell_col_list]
        df_cell = df_cell.loc[(~df_cell.celltype.str.contains('IOT'))]
        cell_col_list.pop(-1)
        df_ant = df_ant.merge(df_cell[cell_col_list], on=['presite', 'precell'], how='left')
        carrier_dict = {}
        # ---Re-Configure AntennaSystem for Movement and New HW---
        if len(df_ant.index) > 0:
            # max_rfb = [0]
            # for site in self.sites:
            #     for mo in self.sites.get(site).find_mo_ending_with_parent_str(moc='RfBranch'):
            #         if re.search(r'\d+', mo) is not None: max_rfb += int(re.search(r'\d+', mo).group(0))
            # max_rfb = max(max_rfb)
            df_ant[['pre_raug', 'pre_rfb', 'pre_aug', 'pre_au', 'pre_asu', 'pre_aup', 'pre_fru']] = \
                df_ant[['raug', 'rfb', 'aug', 'au', 'asu', 'aup', 'fru']]
            df_ant.loc[df_ant.addcell, ['rfb', 'aug', 'au', 'asu', 'aup', 'fru']] = \
                df_ant.loc[df_ant.addcell].apply(lambda x: pd.Series([None, None, None, None, None, None]), axis=1)
            df_ant = df_ant.replace({np.nan: None})
            df_ant = df_ant.loc[~df_ant.pre_fru.isnull()]
            # Radio Name corrections in case of Migration and non-unique name of the radios
            # If non-unique nme is undetermined add "None" to it
            for postsite in df_ant.postsite.unique():
                for pre_fru in df_ant.loc[((df_ant.postsite == postsite) & (df_ant.fru.isnull()))].pre_fru.unique():
                    if len(df_ant.loc[((df_ant.postsite == postsite) & (df_ant.fru == pre_fru))].index) == 0:
                        df_ant.loc[((df_ant.postsite == postsite) & (df_ant.pre_fru == pre_fru)), 'fru'] = pre_fru
                    else:
                        sef = df_ant.loc[((df_ant.postsite == postsite) & (df_ant.fru.isnull()) & (df_ant.pre_fru == pre_fru))]['sef'].values[0]
                        if df_ant.loc[((df_ant.postsite == postsite) & (df_ant.fru.isnull()) &
                                       (df_ant.pre_fru == pre_fru))]['celltype'].values[0] in ['5G', 'NR']: sef = sef.split('_')[-1]
                        tmp_fru = pre_fru.split('-')[0] + '-' + sef
                        if len(df_ant.loc[((df_ant.postsite == postsite) & (df_ant.fru == tmp_fru))].index) == 0:
                            df_ant.loc[((df_ant.postsite == postsite) & (df_ant.pre_fru == pre_fru)), 'fru'] = tmp_fru
                        else: df_ant.loc[((df_ant.postsite == postsite) & (df_ant.pre_fru == pre_fru)), 'fru'] = pre_fru + 'None'
            df_ant['fru_rfp'] = df_ant['postsite'] + df_ant['fru'] + df_ant['rfp']
            df_ant.set_index('fru_rfp', inplace=True)
            for alys in df_ant.index.unique():
                if str(alys) == 'nan': continue
                if df_ant.loc[df_ant.index == alys]['rfb'].values[0] is not None: continue
                if len(df_ant.loc[((df_ant.index != alys) &
                              (df_ant.raug == df_ant.loc[df_ant.index == alys]['raug'].values[0]) &
                              (df_ant.rfb == df_ant.loc[df_ant.index == alys]['pre_rfb'].values[0]))].index) == 0:
                    df_ant.loc[alys, 'rfb'] = df_ant.loc[df_ant.index == alys]['pre_rfb'].values[0]
                if len(df_ant.loc[(df_ant.index != alys) &
                                  (df_ant.aug == df_ant.loc[df_ant.index == alys]['pre_aug'].values[0]) &
                                  (df_ant.au == df_ant.loc[df_ant.index == alys]['pre_au'].values[0]) &
                                  (df_ant.asu == df_ant.loc[df_ant.index == alys]['pre_asu'].values[0]) &
                                  (df_ant.aup == df_ant.loc[df_ant.index == alys]['pre_aup'].values[0])].index) == 0:
                    df_ant.loc[alys, 'aug'] = df_ant.loc[df_ant.index == alys]['pre_aug'].values[0]
                    df_ant.loc[alys, 'au'] = df_ant.loc[df_ant.index == alys]['pre_au'].values[0]
                    df_ant.loc[alys, 'asu'] = df_ant.loc[df_ant.index == alys]['pre_asu'].values[0]
                    df_ant.loc[alys, 'aup'] = df_ant.loc[df_ant.index == alys]['pre_aup'].values[0]

            max_antenna_unit_val = df_ant.au.fillna('0').astype(int).max() + 1
            max_antenna_unit_val = 1 if np.isnan(max_antenna_unit_val) else max_antenna_unit_val
            
            # df_ant['rfb_int'] = df_ant.rfb.str.extract('(\d+)', expand=False).fillna('0').astype(int)
            # rf_branch = df_ant.groupby('raug').rfb_int.max().to_dict()

            max_rfb = ['0']
            for site in self.sites:
                max_rfb += [_.split('=')[-1] for _ in self.sites.get(site).find_mo_ending_with_parent_str(moc='RfBranch')]
            max_rfb = max([int(re.search(r'\d+', _).group(0)) for _ in max_rfb if re.search(r'\d+', _) is not None])
            rf_branch = {str(_): max_rfb for _ in df_ant.raug.unique()}
            for cell in df_ant.loc[(((df_ant.aug.isnull()) | (df_ant.rfb.isnull())) & (df_ant.trecid.isnull()))].precell.unique():
                i = 0
                for row1 in df_ant.loc[(df_ant.precell == cell)].itertuples():
                    if row1.aug is None:
                        if carrier_dict.get(row1.carrier) is None:
                            carrier_dict[row1.carrier] = max_antenna_unit_val
                            max_antenna_unit_val += 1
                        temp_str = df_ant.loc[df_ant.index == row1.Index]['raug'][0]
                        df_ant.loc[row1.Index, 'aug'] = str(temp_str)
                        df_ant.loc[row1.Index, 'au'] = str(carrier_dict.get(row1.carrier))
                        df_ant.loc[row1.Index, 'asu'] = '1'
                        i = i + 1
                        df_ant.loc[row1.Index, 'aup'] = str(i)
                    if row1.rfb is None:
                        rf_branch[str(row1.raug)] = rf_branch.get(str(row1.raug), 0) + 1
                        rfbid = [str(rf_branch[str(row1.raug)])]
                        rfbid.extend(row1.pre_rfb.split('_')[1:])
                        df_ant.loc[row1.Index, 'rfb'] = '_'.join(rfbid)
            df_ant.reset_index(drop=True, inplace=True)

        # ---Antenna System for New Cells---
        df_ant['rfb_int'] = df_ant.rfb.str.extract('(\d+)', expand=False).fillna('0').astype(int)
        max_antenna_unit_val = df_ant.au.fillna('0').astype(int).max() + 1
        max_antenna_unit_val = 1 if np.isnan(max_antenna_unit_val) else max_antenna_unit_val
        rf_branch = df_ant.groupby('raug').rfb_int.max().to_dict()
        max_rf_branch = df_ant.rfb_int.astype(int).max() + 1 if not np.isnan(df_ant.rfb_int.astype(int).max()) else 1
        del df_ant['rfb_int']

        new_antenna = []
        for row in df_cell.loc[df_cell.addcell & ~df_cell.carrier.str.contains('MC', na=False)].itertuples():
            if row.precell is not None: continue
            n_rfbranch = 4 if row.celltype in ['5G'] else max(int(row.noofrx), int(row.nooftx))
            auport = range(1, n_rfbranch + 1)
            sef = row.sef.split('_')[-1] if row.celltype in ['5G'] else row.sef
            fru_id = [F'RRU-{sef}' for _ in range(0, n_rfbranch)]
            rf_port = ['A', 'C', 'B', 'D'] if n_rfbranch == 4 else ['A', 'B']

            if len(row.frutypecix) == 1:
                fru = row.frutypecix[0]
                fru_id = [F'RRU-{sef}' for _ in range(0, n_rfbranch)]
                if ('8843' in fru) and (str(row.freqband) in ['4', '66']): rf_port = ['E', 'G', 'F', 'H']
                if '8863' in fru:
                    n_rfbranch = 8
                    rf_port = ['A', 'B', 'E', 'F', 'C', 'D', 'G', 'H']
                    auport = range(1, n_rfbranch + 1)
                    fru_id = [F'RRU-{sef}' for _ in range(0, n_rfbranch)]
                    if row.celltype in ['5G'] and "_" in row.sef:
                        fru_id = [F'RRU-{"_".join(row.sef.split("_")[1:])}' for _ in range(0, n_rfbranch)]
                if row.rrushared is not None:
                    if '4449' in fru: pass
                    elif '8843' in fru:
                        if (df_cell.loc[df_cell.postcell == row.rrushared].prefrutype.iloc[0] is not None) and \
                                ('8843' in df_cell.loc[df_cell.postcell == row.rrushared].prefrutype.iloc[0][0]):
                            fru_id = [df_cell.loc[df_cell.postcell == row.rrushared].prefru.iloc[0][0] for _ in range(0, n_rfbranch)]
                        elif '8843' in df_cell.loc[df_cell.postcell == row.rrushared].frutypecix.iloc[0][0]:
                            fru_id = [F'RRU-{df_cell.loc[df_cell.postcell == row.rrushared].sef.iloc[0]}' for _ in range(0, n_rfbranch)]
                    elif '8863' in fru:
                        fru_id = [F'RRU-{df_cell.loc[df_cell.postcell == row.rrushared].sef.iloc[0]}' for _ in range(0, n_rfbranch)]
            elif len(row.frutypecix) == 2:
                fru = row.frutypecix[0]
                rf_port = ['A', 'A', 'B', 'B']
                fru_id = [F'RRU-{sef}{"1" if _ % 2 == 0 else "2"}' for _ in range(n_rfbranch)]
                if 'A2' in row.frutypecix[1]:
                    rf_port = ['A', 'B', 'A', 'B']
                    fru_id = [F'RRU-{sef}{"1" if _ < 2 else "2"}' for _ in range(n_rfbranch)]

            aug = get_antenna_group_from_cell(row.postcell)
            tmp_dict = {'presite': row.presite, 'precell': row.precell, 'raug': aug, 'rfb': None, 'dl_ul_delay_att': None, 'fru': None,
                        'isshared': 'false', 'rfp': None, 'trecid': None, 'aug': aug, 'au': '1', 'asu': '1', 'aup': None, 'rfbfdn': None,
                        'frufdn': None, 'retfdn': None, 'tmafdn': None, 'aufdn': None, 'asufdn': None, 'mt': '0', 'aupfdn': None, 'antflag': True,
                        'celltype': row.celltype, 'postsite': row.postsite, 'postcell': row.postcell, 'prefru': row.prefru,
                        'prefrutype': row.prefrutype, 'prefrusn': row.prefrusn, 'frutypecix': row.frutypecix, 'presc': row.presc,
                        'addcell': row.addcell, 'sef': row.sef, 'sefcix': row.sefcix, 'sccix': row.sccix, 'carrier': row.carrier,
                        'rrushared': row.rrushared, 'sc': row.sc, 'nooftx': row.nooftx, 'noofrx': row.noofrx, 'confpow': row.confpow,
                        'confpowcix': row.confpowcix, 'fruchange': row.fruchange}
            for aup in auport:
                carrier = row.carrier
                if carrier_dict.get(carrier, None) is None:
                    carrier_dict[carrier] = max_antenna_unit_val
                    max_antenna_unit_val += 1
                rf_branch[aug] = rf_branch.get(aug, 0) + 1
                tmp_dict1 = copy.deepcopy(tmp_dict)
                if row.frutypecix[0] in ['AIR6448', 'AIR6448B77D', 'AIR6449', 'AIR6449B77D', 'AIR3246', 'AIR1281', 'AIR5331', 'AIR6419']:
                    if aup != auport[0]: continue
                    fru_str = F'AAS-{"_".join(row.sef.split("_")[1:])}' if row.celltype in ['5G'] and "_" in row.sef else F'AAS-{sef}'
                    if len(row.frutypecix) == 1:
                        tmp_dict1 |= {'fru': fru_str, 'trecid': '1', 'frutypecix': row.frutypecix[0]}
                        new_antenna.append(copy.deepcopy(tmp_dict1))
                        break
                    else:
                        for i in range(1, len(row.frutypecix) + 1):
                            tmp_dict1 = copy.deepcopy(tmp_dict)
                            tmp_dict1 |= {'fru': F'{fru_str}_{i}', 'trecid': '1', 'frutypecix': row.frutypecix[i-1]}
                            new_antenna.append(copy.deepcopy(tmp_dict1))
                        break
                else:
                    tmp_dict1 |= {'rfb': F'{rf_branch[aug]}', 'au': str(carrier_dict.get(row.carrier)), 'asu': '1', 'aup': str(aup),
                                  'fru': fru_id[aup - 1], 'rfp': rf_port[aup - 1], 'frutypecix': row.frutypecix[0],
                                  'dl_ul_delay_att': row.dl_ul_delay_att[aup - 1] if len(row.dl_ul_delay_att) >= aup else row.dl_ul_delay_att[0]}
                    new_antenna.append(copy.deepcopy(tmp_dict1))
        if len(new_antenna) > 0:
            df_ant = pd.concat([df_ant, pd.DataFrame.from_dict(new_antenna)], ignore_index=True)
        df_ant = df_ant.replace({np.nan: None})
        df_ant.reset_index(drop=True, inplace=True)
        df_ant.loc[(df_ant.aug.isnull()), 'aug'] = df_ant.postcell.map(df_ant.raug)

        # ---fill empty ant system data---
        for row in df_ant.loc[df_ant.au.isnull()].itertuples():
            carrier = self.cix.get_ru_type_for_cell(row.postcell, 'carrier')
            if carrier_dict.get(carrier) is None:
                carrier_dict[carrier] = max_antenna_unit_val
                max_antenna_unit_val += 1
            df_ant.loc[row.Index, 'au'] = carrier_dict.get(carrier)
        df_ant.loc[df_ant.asu.isnull(), 'asu'] = '1'
        df_ant.loc[df_ant.aup.isnull(), 'aup'] = (df_ant.groupby('postcell').cumcount() + 1).astype(str)
        df_ant.loc[(~df_ant.trecid.isnull()), 'raug'] = None
        df_ant.loc[(~df_ant.trecid.isnull()), 'au'] = None
        df_ant.loc[(~df_ant.trecid.isnull()), 'asu'] = None
        df_ant.loc[(~df_ant.trecid.isnull()), 'aup'] = None
        df_ant.loc[(~df_ant.trecid.isnull()), 'aup'] = None

        # mask_rf = df_cell['rfBranches'].str.contains('rfBranches')
        df_cell['rm_col'] = df_cell.rfBranches.astype(str) if 'rfBranches' in df_cell else ''
        df_cell['postcell_index'] = df_cell.postcell
        df_cell = df_cell.set_index('postcell_index')
        # ---data for multi carrier---
        for sec_equip_fun in df_cell.loc[df_cell.carrier.str.contains('MC')].sef.unique():
            df_t = df_cell.loc[df_cell.sef == sec_equip_fun].sort_values(by='carrier', ascending=True, na_position='last')
            # mc_cell = df_t.index[0]
            df_p_ant = df_ant.loc[df_ant.postcell == df_t.index[0]]
            for new_cell in df_t.index[1:]:
                row = df_t.loc[new_cell]
                if len(df_ant.loc[df_ant.postcell == new_cell].index) > 0: continue
                df_p_ant_c = df_p_ant.copy()
                df_p_ant_c['postcell'] = row.postcell
                df_p_ant_c['carrier'] = row.carrier
                df_p_ant_c['sef'] = row.sef
                df_ant = pd.concat([df_ant, df_p_ant_c])
                # df_ant = df_ant.append(df_p_ant_c)

        # ---format the antenna data---
        df_ant.reset_index(inplace=True, drop=True)
        df_ant[['raug', 'rfb', 'aug', 'au', 'asu', 'aup', 'fru', 'rfp']] = df_ant[['raug', 'rfb', 'aug', 'au', 'asu', 'aup', 'fru', 'rfp']].astype(str)
        df_ant['aup_ref'] = None
        df_ant['rfp_ref'] = None
        df_ant.loc[(df_ant.aup != 'None'), 'aup_ref'] = 'Equipment=1,AntennaUnitGroup=' + df_ant['aug'] + ',AntennaUnit=' + \
            df_ant['au'] + ',AntennaSubunit=' + df_ant['asu'] + ',AuPort=' + df_ant['aup']
        df_ant.loc[(df_ant.fru != 'None') & (df_ant.rfp != 'None'), 'rfp_ref'] = \
            'Equipment=1,FieldReplaceableUnit=' + df_ant['fru'] + ',RfPort=' + df_ant['rfp']
        df_ant.loc[(df_ant.fru != 'None') & (df_ant.trecid != 'None'), 'rfp_ref'] = \
            'Equipment=1,FieldReplaceableUnit=' + df_ant['fru'] + ',Transceiver=' + df_ant['trecid']
        self.df_ant = df_ant.copy()

    def enodeb_gnodeb_antnearunit(self):
        def get_pre_fru_id(r):
            prefru = ''
            if len(r.prefru) == 0: pass
            elif len(r.prefru) == 1: prefru = r.prefru[0]
            elif len(r.prefru) > 1:
                for i in r.prefru:
                    if i.split('-')[-1] == r.fru.split('-')[-1]:
                        prefru = i
                        break
            return [prefru]

        ecolumns = ['prefru', 'aug', 'anu', 'uniqueId', 'fru', 'rfp', 'flag', 'anufdn', 'presite', 'precell', 'postsite', 'postcell', 'addcell',
                    'antflag', 'fruchange']
        ant_near_unit_list = []
        for site in self.sites:
            site = self.sites.get(site)
            for mo in site.find_mo_ending_with_parent_str(moc='AntennaNearUnit'):
                mo_dict = {_.split('=')[0]: _.split('=')[1] for _ in mo.split(',')}
                rfp_ref = site.site_extract_data(mo).get('rfPortRef')
                if rfp_ref is not None:
                    rfp_ref_dict = {_.split('=')[0]: _.split('=')[1] for _ in rfp_ref.split(',')}
                    tmp_dict = {'aug': mo_dict['AntennaUnitGroup'], 'anu': mo_dict['AntennaNearUnit'],
                                'uniqueId': site.site_extract_data(mo).get('uniqueId'),
                                'prefru': None if rfp_ref is None else rfp_ref_dict.get(site.get_fru_string()),
                                'rfp': None if rfp_ref is None else rfp_ref_dict['RfPort'],
                                'flag': False, 'anufdn': mo, 'presite': site.node}
                    ant_near_unit_list.append(tmp_dict)
        if len(ant_near_unit_list) > 0:
            df = pd.DataFrame.from_dict(ant_near_unit_list)
            df_ant_cell = self.df_ant.loc[(~self.df_ant.antflag), ['prefru', 'fru', 'presite', 'precell',
                                                                   'postsite', 'postcell', 'addcell', 'antflag', 'fruchange']]
            if df_ant_cell.shape[0] > 0:
                df_ant_cell[['prefru']] = df_ant_cell.apply(get_pre_fru_id, axis=1, result_type='expand')
            df_ant_cell = df_ant_cell.groupby(['presite', 'prefru'], as_index=False).head(1)
            df = df.merge(df_ant_cell, on=['presite', 'prefru'], how='left').drop_duplicates()
            df['near_int'] = df.anu.str.extract('(\d+)', expand=False).fillna('0').astype(int)
            anu_id_dict = df.groupby('aug').near_int.max().to_dict()
            for row in df.loc[(df.addcell == True)].itertuples():
                if df.loc[(df.aug == row.aug) & (df.anu == row.anu)].shape[0] == 1: continue
                anu_id_dict[row.aug] = anu_id_dict.get(row.aug, 0) + 1
                df.loc[row.Index, 'anu'] = str(anu_id_dict[row.aug])
            del df['near_int']
        else:
            df = pd.DataFrame([], columns=ecolumns)
        self.df_ant_near_unit = df.copy()

    def xmu_all_site(self):
        ecolumns = ['postsite', 'xmu1', 'flag1', 'xmu1p1', 'xmu1p2', 'xmu1p3', 'xmu2', 'flag2', 'xmu2p1', 'xmu2p2', 'xmu2p3']
        temp_list = []
        for row in self.cix.edx.get('eNodeB').itertuples():
            temp_dict = {_: None for _ in ecolumns}
            temp_dict |= {'postsite': row.siteid}

            # temp_dict = {'postsite': row.siteid, 'xmu1': None, 'flag1': False, 'xmu1p1': None, 'xmu1p2': None, 'xmu1p3': None,
            #              'xmu2': None, 'flag2': False, 'xmu2p1': None, 'xmu2p2': None, 'xmu2p3': None}
            site = self.sites.get(F'site_{row.siteid}')
            if site is not None:
                if len(site.site_xmu) >= 1: temp_dict |= {'xmu1': site.site_xmu[0]}
                elif len(site.site_xmu) >= 2: temp_dict |= {'xmu2': site.site_xmu[1]}
            if (row.xmu1 is not None) and (str(row.xmu1).lower() == 'yes' or str(row.xmu1) == '1'):
                if (site is None) or (len(site.site_xmu) < 1): xmu, flag_val = 'XMU03-1-1', True
                else: xmu, flag_val = site.site_xmu[0], self.enodeb[row.siteid]['equ_change']
                temp_dict |= {'xmu1p1': row.xmu1_p1, 'xmu1p2': row.xmu1_p2, 'xmu1p3': row.xmu1_p3, 'xmu1': xmu, 'flag1': flag_val}
            if (row.xmu2 is not None) and (str(row.xmu2).lower() == 'yes' or str(row.xmu2) == '1'):
                if (site is None) or (len(site.site_xmu) < 2): xmu, flag_val = 'XMU03-1-2', True
                else: xmu, flag_val = site.site_xmu[1], self.enodeb[row.siteid]['equ_change']
                temp_dict |= {'xmu2p1': row.xmu2_p1, 'xmu2p2': row.xmu2_p2, 'xmu2p3': row.xmu2_p3, 'xmu2': xmu, 'flag2': flag_val}
            temp_list.append(copy.deepcopy(temp_dict))

        for row in self.cix.edx.get('gNodeB').itertuples():
            if row.siteid in self.cix.edx.get('eNodeB').siteid.unique(): continue
            temp_dict = {_: None for _ in ecolumns}
            temp_dict |= {'postsite': row.siteid}
            # temp_dict = {'postsite': row.siteid, 'xmu1': None, 'flag1': False, 'xmu1p1': None, 'xmu1p2': None, 'xmu1p3': None,
            #              'xmu2': None, 'flag2': False, 'xmu2p1': None, 'xmu2p2': None, 'xmu2p3': None}
            site = self.sites.get(F'site_{row.siteid}')
            if site is not None:
                if len(site.site_xmu) >= 1: temp_dict |= {'xmu1': site.site_xmu[0]}
                elif len(site.site_xmu) >= 2: temp_dict |= {'xmu2': site.site_xmu[1]}

            if (row.xmu1 is not None) and (str(row.xmu1).lower() == 'yes' or str(row.xmu1) == '1'):
                if (site is None) or (len(site.site_xmu) < 1): xmu, flag_val = 'XMU03-1-1', True
                else: xmu, flag_val = site.site_xmu[0], self.gnodeb[row.siteid]['equ_change']
                temp_dict |= {'xmu1p1': row.xmu1_p1, 'xmu1p2': row.xmu1_p2, 'xmu1p3': row.xmu1_p3, 'xmu1': xmu, 'flag1': flag_val}
            if (row.xmu2 is not None) and (str(row.xmu2).lower() == 'yes' or str(row.xmu2) == '1'):
                if (site is None) or (len(site.site_xmu) < 2): xmu, flag_val = 'XMU03-1-2', True
                else: xmu, flag_val = site.site_xmu[1], self.gnodeb[row.siteid]['equ_change']
                temp_dict |= {'xmu2p1': row.xmu2_p1, 'xmu2p2': row.xmu2_p2, 'xmu2p3': row.xmu2_p3, 'xmu2': xmu, 'flag2': flag_val}
            temp_list.append(temp_dict.copy())
        self.df_xmu = pd.DataFrame.from_dict(temp_list) if len(temp_list) > 0 else pd.DataFrame([], columns=ecolumns)
        self.df_xmu = self.df_xmu.where(self.df_xmu.notnull(), None)

    def rilink_all_site(self):
        tmp_list = []
        for key in self.sites:
            site = self.sites.get(key)
            for mo in site.find_mo_ending_with_parent_str(moc='RiLink'):
                data = site.site_extract_data(mo)
                ref1 = ','.join(data.get('riPortRef1').split(',')[-2:])
                ref2 = ','.join(data.get('riPortRef2').split(',')[-2:])
                tmp_list.append([site.node, ref1, ref2, data.get('riLinkId')])
        df = pd.DataFrame(tmp_list, columns=['site', 'ref1', 'ref2', 'rilid'])
        df[['fru1', 'rip1']] = pd.DataFrame([[key.split('=')[-1] for key in _.split(',')] for _ in df.ref1.tolist()], columns=['fru1', 'rip1'])
        df[['fru2', 'rip2']] = pd.DataFrame([[key.split('=')[-1] for key in _.split(',')] for _ in df.ref2.tolist()], columns=['fru2', 'rip2'])
        del df['ref1'], df['ref2']
        df_ant_cell = self.df_ant.loc[~self.df_ant.antflag, ['fru', 'presite', 'precell', 'postsite', 'postcell', 'addcell',
                                                             'antflag', 'fruchange']].drop_duplicates()
        df = df.merge(df_ant_cell, left_on='fru2', right_on='fru', how='left')
        df = df.merge(df_ant_cell, left_on='fru1', right_on='fru', how='left', suffixes=('', '_1'))
        df['port_index'] = df.sort_values(['precell', 'fru2']).groupby('precell').cumcount() + 1
        df.loc[~pd.to_numeric(df.fru, errors='coerce').isnull(), 'fru'] = df.fru_1
        df.port_index = df.port_index.astype(str)
        if df.shape[0] > 0:
            df.loc[df.fru.isnull(), 'presite'] = df.loc[df.fru.isnull()].presite_1
            df.loc[df.fru.isnull(), 'precell'] = df.loc[df.fru.isnull()].precell_1
            df.loc[df.fru.isnull(), 'postsite'] = df.loc[df.fru.isnull()].postsite_1
            df.loc[df.fru.isnull(), 'postcell'] = df.loc[df.fru.isnull()].postcell_1
            df.loc[df.fru.isnull(), 'addcell'] = df.loc[df.fru.isnull()].addcell_1
            df.loc[df.fru.isnull(), 'antflag'] = df.loc[df.fru.isnull()].antflag_1
            df.loc[df.fru.isnull(), 'fruchange'] = df.loc[df.fru.isnull()].fruchange_1
            df.loc[df.fru.isnull(), 'fru'] = df.loc[df.fru.isnull()].fru_1
            
        df.drop([_ for _ in df.columns if _.endswith('_1')], axis=1, inplace=True)
        df = df.groupby(['fru1', 'rip1', 'fru2', 'rip2'], as_index=False).head(1)
        self.df_pre_ril = df.copy()
        del df

        # New Rilink
        df_cix_enb = self.cix.edx.get('EUtranCellFDD')[['siteid', 'eutrancellfddid', 'carrier', 'bbu_xmu', 'port_1', 'port_2', 'port_3', 'port_4',
                                                        'rru_type']].rename(columns={'eutrancellfddid': 'postcell'}, inplace=False)
        df_cix_gnb = self.cix.edx.get('gUtranCell')[['siteid', 'gutrancell', 'carrier', 'bbu_xmu', 'port_1', 'port_2', 'port_3', 'port_4',
                                                     'rru_type']].rename(columns={'gutrancell': 'postcell'}, inplace=False)

        df_cix = pd.concat([df_cix_enb, df_cix_gnb], ignore_index=True)
        del df_cix_enb, df_cix_gnb
        for row in df_cix.itertuples():
            if 'BBU' in row.bbu_xmu.upper() or 'BB' in row.bbu_xmu.upper():
                df_cix.loc[row.Index, 'bbu_xmu'] = self.enodeb[row.siteid]['bbuid'] if row.siteid in self.enodeb.keys() else \
                    self.gnodeb[row.siteid]['bbuid']
            elif 'XMU1' in row.bbu_xmu.upper(): df_cix.loc[row.Index, 'bbu_xmu'] = self.df_xmu.loc[self.df_xmu.postsite == row.siteid].xmu1.iloc[0]
            elif 'XMU2' in row.bbu_xmu.upper(): df_cix.loc[row.Index, 'bbu_xmu'] = self.df_xmu.loc[self.df_xmu.postsite == row.siteid].xmu2.iloc[0]
        
        df_ril = self.df_ant[['presite', 'precell', 'postsite', 'postcell', 'fru', 'antflag', 'addcell', 'fruchange', 'rrushared']].drop_duplicates()
        df_ril = df_ril.merge(df_cix, on='postcell')
        df_ril = df_ril.groupby(['postsite', 'fru'], as_index=False).head(1)
        # df_ril = df_ril.drop_duplicates().groupby(['postsite', 'fru'], as_index=False).head(1)

        ecolumns = ['site', 'rilid', 'fru1', 'rip1', 'fru2', 'rip2', 'fru', 'presite', 'precell',
                    'postsite', 'postcell', 'addcell', 'antflag', 'fruchange', 'rrushared']
        temp_list = []

        for node in set(list(self.enodeb.keys()) + list(self.gnodeb.keys())):
            # bbid = self.enodeb[node]['bbuid'] if node in self.enodeb.keys() else self.gnodeb[node]['bbuid']
            bbid = self.enodeb.get(node, self.gnodeb.get(node)).get('bbuid')
            new_ril_tmp_dict = {_: None for _ in ecolumns}
            new_ril_tmp_dict |= {'site': node, 'postsite': node, 'fru1': bbid}
            # XMU RiLink
            ril_val = 0
            row = self.df_xmu.loc[self.df_xmu.postsite == node].iloc[0]
            for xmu_no in range(1, 3):
                if row.get(F'xmu{xmu_no}') is not None:
                    temp_dict = copy.deepcopy(new_ril_tmp_dict)
                    temp_dict |= {'fru2': row.get(F'xmu{xmu_no}'), 'fru': row.get(F'xmu{xmu_no}'), 'postcell': row.get(F'xmu{xmu_no}'),
                                  'addcell': row.get(F'flag{xmu_no}'), 'antflag': row.get(F'flag{xmu_no}'), 'fruchange': row.get(F'flag{xmu_no}')}
                    for port in range(1, 4):
                        if row.get(F'xmu{xmu_no}p{port}') is not None:
                            ril_val += 1
                            temp_dict |= {'rilid': str(ril_val), 'rip1': row.get(F'xmu{xmu_no}p{port}'), 'rip2': str(port)}
                            temp_list.append(temp_dict.copy())
            df_site = df_ril.loc[df_ril.postsite == node]
            # Old Radios
            for postcell in df_site.postcell.unique():
                # if df_site.loc[(df_site.postcell == postcell) & (~df_site.precell.isna())].shape[0]: continue
                # df_t = df_site.loc[(df_site.postcell == postcell)]
                # ril_ids = self.df_pre_ril.loc[self.df_pre_ril.postcell == postcell, 'rilid'].tolist()
                df_t = df_site.loc[(df_site.postcell == postcell) & (~df_site.antflag)]
                if df_t.shape[0] == 1:
                    row = df_t.iloc[0]
                    if row.port_1 is not None:
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row.bbu_xmu, 'rip1': row.port_1, 'fru2': row.fru,
                                          'rip2': 'DATA_1', 'fru': row.fru, 'presite': row.presite, 'precell': row.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row.addcell, 'antflag': row.antflag, 'fruchange': row.fruchange})
                    if row.port_2 is not None:
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row.bbu_xmu, 'rip1': row.port_2, 'fru2': row.fru,
                                          'rip2': 'DATA_2', 'fru': row.fru, 'presite': row.presite, 'precell': row.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row.addcell, 'antflag': row.antflag, 'fruchange': row.fruchange})
                    if row.port_3 is not None:
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row.bbu_xmu, 'rip1': row.port_3, 'fru2': row.fru,
                                          'rip2': 'DATA_3', 'fru': row.fru, 'presite': row.presite, 'precell': row.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row.addcell, 'antflag': row.antflag, 'fruchange': row.fruchange})
                    if row.port_4 is not None:
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row.bbu_xmu, 'rip1': row.port_4, 'fru2': row.fru,
                                          'rip2': 'DATA_4', 'fru': row.fru, 'presite': row.presite, 'precell': row.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row.addcell, 'antflag': row.antflag, 'fruchange': row.fruchange})
                elif df_t.shape[0] == 2:
                    row_1 = df_t.iloc[0]
                    row_2 = df_t.iloc[1]
                    ril_val += 1
                    temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_1.get("bbu_xmu"), 'rip1': row_1.port_1, 'fru2': row_1.fru,
                                      'rip2': F'DATA_1', 'fru': row_1.fru, 'presite': row_1.presite, 'precell': row_1.precell, 'postsite': node,
                                      'postcell': postcell, 'addcell': row_1.addcell, 'antflag': row_1.antflag, 'fruchange': row_1.fruchange})
                    if row_1.port_2 is None:
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_1.fru, 'rip1': 'DATA_2', 'fru2': row_2.fru, 'rip2': F'DATA_1',
                                          'fru': row_2.fru, 'presite': row_2.presite, 'precell': row_2.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row_2.addcell, 'antflag': row_2.antflag, 'fruchange': row_2.fruchange})
                    else:
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_2.get("bbu_xmu"), 'rip1': row_2.get("port_2"),
                                          'fru2': row_2.fru, 'rip2': F'DATA_1', 'fru': row_2.fru, 'presite': row_2.presite, 'precell': row_2.precell,
                                          'postsite': node, 'postcell': postcell, 'addcell': row_2.addcell, 'antflag': row_2.antflag,
                                          'fruchange': row_2.fruchange})
            #   New Radio
            for postcell in df_site.postcell.unique():
                df_t = df_site.loc[(df_site.postcell == postcell) & df_site.antflag & df_site.rrushared.isna()]
                if df_t.shape[0] == 1:
                    row = df_t.iloc[0]
                    for i in range(1, 5):
                        if row.get(F'port_{i}') is not None:
                            ril_val += 1
                            temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row.get("bbu_xmu"), 'rip1': row.get(F'port_{i}'),
                                              'fru2': row.get("fru"), 'rip2': F'DATA_{i}', 'fru': row.get("fru"), 'presite': row.presite,
                                              'precell': row.precell, 'postsite': node, 'postcell': postcell, 'addcell': row.addcell,
                                              'antflag': row.antflag, 'fruchange': row.fruchange})
                elif df_t.shape[0] == 2:
                    row_1 = df_t.iloc[0]
                    row_2 = df_t.iloc[1]
                    ril_val += 1
                    temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_1.get("bbu_xmu"), 'rip1': row_1.port_1, 'fru2': row_1.fru,
                                      'rip2': F'DATA_1', 'fru': row_1.fru, 'presite': row_1.presite, 'precell': row_1.precell, 'postsite': node,
                                      'postcell': postcell, 'addcell': row_1.addcell, 'antflag': row_1.antflag, 'fruchange': row_1.fruchange})
                    if row_1.get(F'port_2') is None:
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_1.fru, 'rip1': 'DATA_2', 'fru2': row_2.fru, 'rip2': F'DATA_1',
                                          'fru': row_2.fru, 'presite': row_2.presite, 'precell': row_2.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row_2.addcell, 'antflag': row_2.antflag, 'fruchange': row_2.fruchange})
                    else:
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_2.get("bbu_xmu"), 'rip1': row_2.get("port_2"),
                                          'fru2': row_2.fru, 'rip2': F'DATA_1', 'fru': row_2.fru, 'presite': row_2.presite,
                                          'precell': row_2.precell,  'postsite': node, 'postcell': postcell, 'addcell': row_2.addcell,
                                          'antflag': row_2.antflag, 'fruchange': row_2.fruchange})
                elif df_t.shape[0] == 3:
                    row_1 = df_t.iloc[0]
                    row_2 = df_t.iloc[1]
                    row_3 = df_t.iloc[2]
                    if 'AIR1281' in row_1.rru_type[0]:
                        #   1
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_1.get("bbu_xmu"), 'rip1': row_1.get(F'port_1'),
                                          'fru2': row_1.fru, 'rip2': F'DATA_1', 'fru': row_1.fru, 'presite': row_1.presite,
                                          'precell': row_1.precell, 'postsite': node, 'postcell': postcell, 'addcell': row_1.addcell,
                                          'antflag': row_1.antflag, 'fruchange': row_1.fruchange})
                        #   2
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_1.fru, 'rip1': F'DATA_2', 'fru2': row_2.fru, 'rip2': F'DATA_1',
                                          'fru': row_2.fru, 'presite': row_2.presite, 'precell': row_2.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row_2.addcell, 'antflag': row_2.antflag, 'fruchange': row_2.fruchange})
                        #   3
                        ril_val += 1
                        temp_dict = {
                            'site': node, 'rilid': ril_val, 'fru1': row_2.fru, 'rip1': F'DATA_2',
                            'fru2': row_3.fru, 'rip2': F'DATA_1',
                            'fru': row_3.fru, 'presite': row_3.presite, 'precell': row_3.precell, 'postsite': node, 'postcell': postcell,
                            'addcell': row_3.addcell, 'antflag': row_3.antflag, 'fruchange': row_3.fruchange
                        }
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_2.fru, 'rip1': F'DATA_2', 'fru2': row_3.fru, 'rip2': F'DATA_1',
                                          'fru': row_3.fru, 'presite': row_3.presite, 'precell': row_3.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row_3.addcell, 'antflag': row_3.antflag, 'fruchange': row_3.fruchange})
                        #   4
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_1.get("bbu_xmu"), 'rip1': row_1.get(F'port_3'),
                                          'fru2': row_1.fru, 'rip2': F'DATA_3', 'fru': row_1.fru, 'presite': row_1.presite, 'precell': row_1.precell,
                                          'postsite': node, 'postcell': postcell, 'addcell': row_1.addcell, 'antflag': row_1.antflag,
                                          'fruchange': row_1.fruchange})
                        #   5
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_1.fru, 'rip1': 'DATA_4', 'fru2': row_2.fru, 'rip2': F'DATA_3',
                                          'fru': row_2.fru, 'presite': row_2.presite, 'precell': row_2.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row_2.addcell, 'antflag': row_2.antflag, 'fruchange': row_2.fruchange})
                        #   6
                        ril_val += 1
                        temp_list.append({'site': node, 'rilid': ril_val, 'fru1': row_2.fru, 'rip1': 'DATA_4', 'fru2': row_3.fru, 'rip2': F'DATA_3',
                                          'fru': row_3.fru, 'presite': row_3.presite, 'precell': row_3.precell, 'postsite': node,
                                          'postcell': postcell, 'addcell': row_3.addcell, 'antflag': row_3.antflag, 'fruchange': row_3.fruchange})
                    
        self.df_ril = pd.DataFrame.from_dict(temp_list) if len(temp_list) > 0 else pd.DataFrame([], columns=ecolumns)

    def get_idle_data(self, row):
        vlanid_dict = {'ERAN': '1', 'ERAN_CA': '1', 'ERAN_UlCoMP': '2', 'ERAN_NRCA': '3', 'ERAN_SACA': '3'}
        tech = str(row.tech).upper()
        if tech in ['NR', '5G']: tech = 'NR'
        elif tech in ['LTE', '4G']: tech = 'LTE'
        else: tech = ''
        vlanid = vlanid_dict[row.eran_type]
        bbuid = self.enodeb.get(row.siteid, self.gnodeb.get(row.siteid, {})).get('bbuid', '1')
        t_bbuid = self.enodeb.get(row.t_siteid, self.gnodeb.get(row.t_siteid, {})).get('bbuid', '1')
        ethport = F'{row.eran_type}_{row.tnport.split("IDL_")[-1].replace("_", "")}'
        t_ethport = F'{row.eran_type}_{row.t_tnport.split("IDL_")[-1].replace("_", "")}'

        if row.tech == 'LTE':
            nodeid = self.enodeb.get(row.siteid, {}).get('nodeid', row.nodeid)
            t_nodeid = self.enodeb.get(row.t_siteid, {}).get('nodeid', row.t_nodeid)
        else:
            nodeid = self.gnodeb.get(row.siteid, {}).get('nodeid', row.nodeid)
            t_nodeid = self.gnodeb.get(row.t_siteid, {}).get('nodeid', row.t_nodeid)
        # 'tech', 'vlanid', 'nodeid', 'ethport', 'bbuid', 't_nodeid', 't_ethport', 't_bbuid'
        return [tech, vlanid, nodeid, ethport, bbuid, t_nodeid, t_ethport,  t_bbuid]

    def idle_all_site(self):
        df = self.cix.edx.get('IDLE')
        if len(df.index) > 0:
            df[['tech', 'vlanid', 'nodeid', 'ethport', 'bbuid', 't_nodeid', 't_ethport', 't_bbuid']] = \
                df.apply(self.get_idle_data, axis=1, result_type='expand')
            df.reset_index(drop=True, inplace=True)
            df.reset_index(drop=False, inplace=True)
            df.rename(columns={'index': 'idle_pair'}, inplace=True)
            df = pd.concat([df[['idle_pair', 'tech', 'eran_type', 'vlanid', 'siteid', 'nodeid', 'tnport', 'ethport', 'bbuid']],
                            df[['idle_pair', 'tech', 'eran_type', 'vlanid', 't_siteid', 't_nodeid', 't_tnport', 't_ethport', 't_bbuid']].rename(
                                columns={'t_siteid': 'siteid', 't_nodeid': 'nodeid', 't_tnport': 'tnport', 't_ethport': 'ethport',
                                         't_bbuid': 'bbuid'})], ignore_index=False)
            df = df.groupby(['siteid', 'tnport'], sort=False, as_index=False).head(1)
            df = df.merge(df[['siteid', 'eran_type']].value_counts().to_frame('counts').reset_index(drop=False, inplace=False),
                          on=['siteid', 'eran_type'], how='left')
            df.loc[(df.counts == 1), 'ethport'] = df.loc[(df.counts == 1)].eran_type
            df.drop(columns=['counts'], inplace=True)
        else: df = pd.DataFrame([], columns=['idle_pair', 'tech', 'eran_type', 'vlanid', 'siteid', 'nodeid', 'tnport', 'ethport', 'bbuid'])
        self.df_idle = df.copy()

    def ext_lte_nr_rel_ciq(self):
        df = self.cix.edx['NR_REL']
        df = df.merge(self.df_gnb_cell[['postsite', 'postcell', 'addcell']], on=['postsite', 'postcell'], how='left', suffixes=('', '_usid'))
        df = df.loc[(df.addcell.isna())]
        df.drop(['addcell'], axis=1, inplace=True)
        df.reset_index(drop=False, inplace=True)
        self.df_nr_rel = df.copy()

        df = self.cix.edx['LTE_REL']
        df = df.merge(self.df_enb_cell[['postsite', 'postcell', 'addcell']], on=['postsite', 'postcell'], how='left', suffixes=('', '_usid'))
        df = df.loc[(df.addcell.isna())]
        df.drop(['addcell'], axis=1, inplace=True)
        df.reset_index(drop=True, inplace=True)
        self.df_lte_rel = df.copy()

    def set_nodegroupsyncmember_syncnodepriority(self):
        self.df_enb_cell['syncnodepriority'] = None
        self.df_gnb_cell['syncnodepriority'] = None


    def save_xls(self, data, xls_path):
        with ExcelWriter(xls_path) as writer:
            for key in data:
                if key == 'Cell_Move':
                    df = data.get(key).copy()
                    df.index.name = 'cell'
                    df.reset_index().to_excel(writer, key, index=False)
                else:
                    data.get(key).to_excel(writer, key, index=False)

    def save_different_dataframe(self):
        data = {
            'Node': pd.concat([pd.DataFrame.from_dict(self.enodeb).T, pd.DataFrame.from_dict(self.gnodeb).T], ignore_index=True)[[
                'postsite', 'logical_site', 'tech', 'nodeid', 'gnbidlength', 'mmbb', 'msmm', 'bbtype', 'rbstype', 'equ_change',
                'bbuid', 'gpsdelay', 'siad_port', 'port_speed', 'tnbw', 'TnPort', 'latitude', 'longitude',
                'sctpendpoint', 'sctpprofile', 'rou_change', 'int_change',
                'lte', 'lte_vlanid', 'lte_interface', 'lte_add', 'lte_dist', 'lte_vlan', 'lte_ip', 'lte_gway',
                'oam', 'oam_interface', 'oam_vlanid', 'oam_van', 'oam_ip', 'oam_gway',
                'ptp_vlan', 'ptp_ip', 'ptp_gway', 'ptp_mask', 'ptp_server', 'EUtraNetwork', 'UtraNetwork', 'GUtraNetwork', 'NRNetwork',
                'nodetype', 'nodeident', 'sw', 'timeZone', 'username', 'password', 'susername', 'spassword', 'ntpip1', 'ntpip2',
                'fingerprint', 'dnPrefix', 'plmnlist', 'addplmnlist', 'Lrat', 'GNBDU', 'GNBCUCP', 'GNBCUUP',
            ]],
            'GUtranCell': self.df_gnb_cell,
            'EUtranCell': self.df_enb_cell,
            'AntennaSystem': self.df_ant,
            'AntennaNearUnit': self.df_ant_near_unit,
            'Pre_RiLink': self.df_pre_ril,
            'RiLink': self.df_ril,
            'LTE_REL': self.df_lte_rel,
            'NR_REL': self.df_nr_rel,
            'IDLE': self.df_idle,
        }
        self.save_xls(data, os.path.join(self.base_dir, F'1_Node_Report_{self.sitename}_{self.datetime}.xlsx'))

        # Save Different DataFrames for LTE
        if len(self.enodeb) > 0:
            data = {
                'EUtranFrequency': self.df_enb_ef,
                'EUtranFreqRelation': self.df_enb_er,
                'EUtranCellRelation': self.df_enb_ee,
                'ExternalENodeBFunction': self.df_enb_ex,
                'ExternalEUtranCell': self.df_enb_ec,
            }
            if self.df_enb_ef.shape[0] > 0 or self.df_enb_er.shape[0] > 0 or self.df_enb_ee.shape[0] > 0 or self.df_enb_ex.shape[0] > 0 or self.df_enb_ec.shape[0] > 0:
                self.save_xls(data, os.path.join(self.base_dir, F'2_lte_EUtraNetwork_Report_{self.sitename}_{self.datetime}.xlsx'))

            data = {
                'GUtranSyncSignalFrequency': self.df_enb_nf,
                'GUtranFreqRelation': self.df_enb_nr,
                'GUtranCellRelation': self.df_enb_ne,
                'ExternalGNodeBFunction': self.df_enb_nx,
                'ExternalGUtranCell': self.df_enb_nc,
            }
            if self.df_enb_nf.shape[0] > 0 or self.df_enb_nr.shape[0] > 0 or self.df_enb_ne.shape[0] > 0 or self.df_enb_nx.shape[0] > 0 or self.df_enb_nc.shape[0] > 0:
                self.save_xls(data, os.path.join(self.base_dir, F'3_lte_GUtraNetwork_Report_{self.sitename}_{self.datetime}.xlsx'))

            data = {
                'UtranFrequency': self.df_enb_uf,
                'UtranFreqRelation': self.df_enb_ur,
                'UtranCellRelation': self.df_enb_ue,
                'ExternalUtranCell': self.df_enb_uc,
            }
            if self.df_enb_uf.shape[0] > 0 or self.df_enb_ur.shape[0] > 0 or self.df_enb_ue.shape[0] > 0 or self.df_enb_uc.shape[0] > 0:
                self.save_xls(data, os.path.join(self.base_dir, F'4_lte_UtraNetwork_Report_{self.sitename}_{self.datetime}.xlsx'))

    def get_uri_emn_details(self, enm_name):
        enm_dict = {
            'CON1E2ENM': {'uri': '2600:0308:0040:0505:0000:0000:0000:0038', 'uri_user': 'm10121', 'uri_password': 'MRD_105650209_478341'},
            'VAN1E2ENM': {'uri': '2600:0308:0090:0106:0000:0000:0000:0049', 'uri_user': 'm10121', 'uri_password': 'MRD_105650209_478341'},
            'VAN1E1ENM': {'uri': '2600:0308:0090:0103:0107:0076:0019:0252', 'uri_user': 'm10121', 'uri_password': 'MRD_105650209_478341'},
            'ALL2E3ENM': {'uri': '2600:0308:0020:0105:0000:0000:0000:0038', 'uri_user': 'm10121', 'uri_password': 'MRD_105650209_478341'},
            'HOU1E1ENM': {'uri': '2600:0308:0070:0103:0000:0000:0000:0038', 'uri_user': 'm10121', 'uri_password': 'MRD_105650209_478341'},
            'ALL2E4ENM': {'uri': '2600:0308:0020:010b:0000:0000:0000:0049', 'uri_user': 'm10121', 'uri_password': 'MRD_105650209_478341'},
            'AKR1E5ENM': {'uri': '2600:0308:0000:010c:0000:0000:0000:0038', 'uri_user': 'm10121', 'uri_password': 'MRD_105650209_478341'},
            'AKR1E3ENM': {'uri': '2600:0308:0000:0107:0000:0000:0000:0038', 'uri_user': 'm10121', 'uri_password': 'MRD_105650209_478341'},
        }
        return enm_dict[enm_name] if enm_name in enm_dict.keys() else {
            'uri': 'SMRSIPADDRESS', 'uri_user': 'SMRSUSERNAME', 'uri_password': 'SMRSPASSWRD'}
