import copy
import os
import json
from .att_xml_base import att_xml_base


class co_96_baseline_lte_nr(att_xml_base):
    def create_rpc_msg(self):
        if len(self.df_enb_cell.loc[self.df_enb_cell.addcell].index) == 0 and len(self.df_gnb_cell.loc[self.df_gnb_cell.addcell].index) == 0:
            return
        self.mo_dict['crate-LogPushTransfer=UDP'] = {'managedElementId': self.node, 'SystemFunctions': {
            'systemFunctionsId': '1', 'LogM': {'logMId': '1', 'Log': []}}}
        if not self.no_eq_change_with_dcgk_flag:
            self.mo_dict['crate-LogPushTransfer=UDP']['SystemFunctions']['LogM']['Log'].extend([
                {'logId': 'AuditTrailLog', 'LogPushTransfer': {'attributes': {'xc:operation': 'create'}, 'logPushTransferId': 'UDP',
                                                              'transferType': '0 (STREAM)', 'uri': 'syslog://[2600:308:0:5::12]:6515'}},
                {'logId': 'SecurityLog', 'LogPushTransfer': {'attributes': {'xc:operation': 'create'}, 'logPushTransferId': 'UDP',
                                                                  'transferType': '0 (STREAM)', 'uri': 'syslog://[2600:308:0:5::12]:6515'}}
            ])
        else:
            if len(self.site.get_mos_w_end_str(search='SystemFunctions=1,LogM=1,Log=AuditTrailLog,LogPushTransfer=UDP')) == 0:
                self.mo_dict['crate-LogPushTransfer=UDP']['SystemFunctions']['LogM']['Log'].extend([
                    {'logId': 'AuditTrailLog', 'LogPushTransfer': {'attributes': {'xc:operation': 'create'}, 'logPushTransferId': 'UDP',
                                                                   'transferType': '0 (STREAM)', 'uri': 'syslog://[2600:308:0:5::12]:6515'}}
                ])
            if len(self.site.get_mos_w_end_str(search='SystemFunctions=1,LogM=1,Log=SecurityLog,LogPushTransfer=UDP')) == 0:
                self.mo_dict['crate-LogPushTransfer=UDP']['SystemFunctions']['LogM']['Log'].extend([
                    {'logId': 'SecurityLog', 'LogPushTransfer': {'attributes': {'xc:operation': 'create'}, 'logPushTransferId': 'UDP',
                                                                 'transferType': '0 (STREAM)', 'uri': 'syslog://[2600:308:0:5::12]:6515'}}
                ])
        # When BB is changed or New BB is integrated
        if not self.no_eq_change_with_dcgk_flag:
            # NR & LTE Site Parameter
            self.mo_dict['nodecredential_trustcategory_update'] = {'managedElementId': self.node, 'SystemFunctions': {
                'systemFunctionsId': '1',
                'SysM': {
                    'sysMId': '1',
                    'NetconfTls': {
                        'attributes': {'xc:operation': 'update'}, 'netconfTlsId': '1', 'port': '6513',
                        'nodeCredential': 'SystemFunctions=1,SecM=1,CertM=1,NodeCredential=oamNodeCredential',
                        'trustCategory': 'SystemFunctions=1,SecM=1,CertM=1,TrustCategory=oamTrustCategory'
                    },
                    'CliTls': {
                        'attributes': {'xc:operation': 'update'}, 'cliTlsId': '1', 'port': '9830', 'administrativeState': '1 (UNLOCKED)',
                        'nodeCredential': 'SystemFunctions=1,SecM=1,CertM=1,NodeCredential=oamNodeCredential',
                        'trustCategory': 'SystemFunctions=1,SecM=1,CertM=1,TrustCategory=oamTrustCategory'
                    },
                    'HttpM': {
                        'httpMId': '1',
                        'Https': {'attributes': {'xc:operation': 'update'}, 'httpsId': '1',
                                  'nodeCredential': 'SystemFunctions=1,SecM=1,CertM=1,NodeCredential=oamNodeCredential',
                                  'trustCategory': 'SystemFunctions=1,SecM=1,CertM=1,TrustCategory=oamTrustCategory'}
                    },
                },
                'SecM': {
                    'secMId': '1',
                    'Tls': {'attributes': {'xc:operation': 'update'}, 'tlsId': '1', 'cipherFilter': 'ALL:TLSv1_2:!3DES-EDE-CBC:!RC4-128:!DES-CBC'},
                    'Ssh': {'attributes': {'xc:operation': 'update'}, 'sshId': '1',
                            'selectedCiphers': ['chacha20-poly1305@openssh.com', 'aes256-ctr', 'aes192-ctr', 'aes128-ctr',
                                                'aes256-gcm@openssh.com', 'aes128-gcm@openssh.com'],
                            'selectedKeyExchanges': ['ecdh-sha2-nistp256', 'ecdh-sha2-nistp384', 'diffie-hellman-group-exchange-sha256',
                                                     'ecdh-sha2-nistp521', 'diffie-hellman-group14-sha256', 'diffie-hellman-group16-sha512',
                                                     'diffie-hellman-group18-sha512', 'curve25519-sha256', 'curve25519-sha256@libssh.org',
                                                     'curve448-sha512'],
                            'selectedMacs': ['hmac-sha2-256-etm@openssh.com', 'hmac-sha2-512-etm@openssh.com', 'hmac-sha2-256', 'hmac-sha2-512',
                                             'hmac-sha1-etm@openssh.com']
                            },
                },
                'PmEventM': {
                    'pmEventMId': '1',
                    'EventProducer': [
                        {'eventProducerId': 'CUCP', 'FileTypes': {'fileTypesId': '1', 'FileType': [
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'CCTR', 'fileSizePercent': '100'},
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'HighPrio', 'fileSizePercent': '100'},
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'NormalPrio', 'fileSizePercent': '30'}
                        ]}},
                        {'eventProducerId': 'CUUP', 'FileTypes': {'fileTypesId': '1', 'FileType': [
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'CCTR', 'fileSizePercent': '100'},
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'HighPrio', 'fileSizePercent': '100'},
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'NormalPrio', 'fileSizePercent': '30'}
                        ]}},
                        {'eventProducerId': 'DU', 'FileTypes': {'fileTypesId': '1', 'FileType': [
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'CCTR', 'fileSizePercent': '100'},
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'HighPrio', 'fileSizePercent': '100'},
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'NormalPrio', 'fileSizePercent': '30'}
                        ]}},
                        {'eventProducerId': 'Lrat', 'FileTypes': {'fileTypesId': '1', 'FileType': [
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'CCTR', 'fileSizePercent': '100'},
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'HighPrio', 'fileSizePercent': '100'},
                            {'attributes': {'xc:operation': 'update'}, 'fileTypeId': 'NormalPrio', 'fileSizePercent': '30'}
                        ]}}
                    ]
                }
            }}
            self.mo_dict['NodeSupport=1,TimeSettings=1-daylightSaving-update'] = {'managedElementId': self.node, 'NodeSupport': {
                'nodeSupportId': '1',
                'TimeSettings': {
                    'attributes': {'xc:operation': 'update'}, 'timeSettingsId': '1', 'daylightSavingTimeOffset': '1:00',
                    'daylightSavingTimeEndDate': {'dayRule': 'Sun>=1', 'month': '11 (NOVEMBER)', 'time': '02:00'},
                    'daylightSavingTimeStartDate': {'dayRule': 'Sun>=8', 'month': '3 (MARCH)', 'time': '02:00'},
                }
            }}
            # LTE Site Parameter
            if len(self.df_enb_cell.index) > 0:
                self.mo_dict['update-ENodeBFunction=1,SecurityHandling=1'] = {'managedElementId': self.node, 'ENodeBFunction': {
                    'eNodeBFunctionId': '1', 'SecurityHandling': {
                        'attributes': {'xc:operation': 'update'}, 'securityHandlingId': '1',
                        'cipheringAlgoPrio': ['2 (EEA2)', '1 (EEA1)', '0 (EEA0)'],
                        'countWrapSupervisionActive': 'true', 'integrityProtectAlgoPrio': ['2 (EIA2)', '1 (EIA1)'],
                        'personalDataProtectionEnabled': 'true', 'rbIdSupervisionActive': 'true'}}}
            # NR Site Parameter
            if not self.validate_empty_none_value(self.gnbdata.get('fa')):
                self.mo_dict['ManagedElement_siteLocation_update'] = {
                    'managedElementId': self.node, 'attributes': {'xc:operation': 'update'}, 'siteLocation': self.gnbdata.get('fa')}
            if len(self.df_gnb_cell.index) > 0:
                self.mo_dict['update-GNBCUCPFunction=1,SecurityHandling=1'] = {'managedElementId': self.node, 'GNBCUCPFunction': {
                    'gNBCUCPFunctionId': '1', 'SecurityHandling': {
                        'attributes': {'xc:operation': 'update'}, 'securityHandlingId': '1',
                        'cipheringAlgoPrio': ['2 (NEA2)', '1 (NEA1)', '0 (NEA0)'],
                        # 'featCtrlIntegProtUserPlane': '0 (OFF)', 'integProtUserPlaneLowRate': '0 (REJECT)',
                        'integrityProtectAlgoPrio': ['2 (NIA2)', '1 (NIA1)'], 'personalDataProtectionEnabled': 'true'}}}
        # MMBB/TMBB IP Parameter When Node is changed SMBB to MMBB/TMBB
        if self.enbdata.get('mmbb', self.gnbdata.get('mmbb')) and ((not self.no_eq_change_with_dcgk_flag) or
                                                                   self.enbdata['Lrat'] is None or self.gnbdata['GNBDU'] is None):
            self.mo_dict['gnbcucp_update'] = {'managedElementId': self.node, 'Transport': {'transportId': '1', 'Router': [
                {'routerId': self.enbdata.get("lte"), 'InterfaceIPv6': {
                    'attributes': {'xc:operation': 'update'}, 'interfaceIPv6Id': self.enbdata.get("lte_interface"), 'mtu': '1500'}},
                {'routerId': self.gnbdata.get("lte"), 'InterfaceIPv6': {
                    'attributes': {'xc:operation': 'update'}, 'interfaceIPv6Id': self.gnbdata.get("lte_interface"), 'mtu': '1954'}}],
            }}
        # LTE Node and Cell Parammetes when it is added
        if len(self.df_enb_cell.loc[(self.df_enb_cell.addcell)].index) > 0:
            celltype_dict = {'FDD': 'EUtranCellFDD', 'TDD': 'EUtranCellTDD', 'IOT': 'NbIotCell'}
            add_plmn = [
                {'mcc': '312', 'mnc': '680', 'mncLength': '3'} if self.node[-1] == "L" else {'mcc': '313', 'mnc': '100', 'mncLength': '3'},
                {'mcc': '1', 'mnc': '1', 'mncLength': '2'}, {'mcc': '1', 'mnc': '1', 'mncLength': '2'},
                {'mcc': '1', 'mnc': '1', 'mncLength': '2'}, {'mcc': '1', 'mnc': '1', 'mncLength': '2'}
            ]
            enb_dict = {'managedElementId': self.node, 'ENodeBFunction': {
                'attributes': {'xc:operation': 'update'}, 'eNodeBFunctionId': '1', 'allowMocnCellLevelCommonTac': 'false',
                'EUtranCellFDD': [], 'EUtranCellTDD': []}}
            for row in self.df_enb_cell.itertuples():
                if row.celltype in ['IOT', '5G']: continue
                moc = celltype_dict.get(row.celltype)
                enb_dict['ENodeBFunction'][moc].append({
                    'attributes': {'xc:operation': 'update'}, self.get_moc_id(moc): row.postcell, 'additionalPlmnList': copy.deepcopy(add_plmn)})
            self.mo_dict['ENodeBFunction=1_allowMocnCellLevelCommonTac_false _cell_additionalplmnlist_update'] = copy.deepcopy(enb_dict)
            # UlCompGroup
            if len(self.df_enb_cell.loc[(self.df_enb_cell.celltype == 'FDD')].index) > 0:
                if self.no_eq_change_with_dcgk_flag and self.enbdata.get('Lrat'):
                    for mo in self.site.find_mo_ending_with_parent_str('UlCompGroup', self.enbdata.get('Lrat')):
                        self.mo_dict[F'lock-{mo}'] = self.site.get_lock_dict_form_mo(mo, 2)
                        self.mo_dict[F'delete-{mo}'] = self.site.get_delete_dict_form_mo(mo, 2)
                i = 0
                df_enb_cell_tmp = self.df_enb_cell.loc[((self.df_enb_cell.isdlonly != 'true') & (self.df_enb_cell.celltype == 'FDD'))]
                for earfcndl in df_enb_cell_tmp.earfcndl.unique():
                    i += 1
                    self.mo_dict[F'create-ENodeBFunction=1,UlCompGroup={i}_for_{earfcndl}'] = {
                        'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'UlCompGroup': {
                            'attributes': {'xc:operation': 'create'}, 'ulCompGroupId': str(i), 'administrativeState': '1 (UNLOCKED)',
                            'sectorCarrierRef': [F'ENodeBFunction=1,SectorCarrier={_}' for _
                                                 in df_enb_cell_tmp.loc[(df_enb_cell_tmp.earfcndl == earfcndl)].sc.unique()]}}
                    }
            # For NE Market CRSGAIN - 300 (NEW CELLs only) for 'non_hicap and non_FWLL and (LB or MB or (HB and 4TX) or B14)'
            df_enb_cell_tmp = self.df_enb_cell.loc[((self.df_enb_cell.isdlonly != 'true') & (self.df_enb_cell.celltype == 'FDD') &
                                                    (~self.df_enb_cell.postcell.str.endswith('L')) & (self.df_enb_cell.fdn.isnull()))]
            if self.usid.client.mname in ['NE'] and len(df_enb_cell_tmp.index) > 0:
                enb_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'EUtranCellFDD': [], 'EUtranCellTDD': []}}
                for r in df_enb_cell_tmp.itertuples():
                    if r.freqband == '30' and r.nooftx != '4': continue
                    enb_dict['ENodeBFunction']['EUtranCellFDD'].append({'eUtranCellFDDId': r.postcell, 'crsGain': '300',
                                                                        'attributes': {'xc:operation': 'update'}})
                self.mo_dict[F'update-crsGain-300-for-NE-market'] = copy.deepcopy(enb_dict)

        # NR Node and Cell Parammetes when it is added
        if len(self.df_gnb_cell.loc[(self.df_gnb_cell.addcell)].index) > 0:
            # NodeCredential
            self.mo_dict['gnbcucp_NodeCredential_expiryAlarmThreshold_update'] = {'managedElementId': self.node, 'SystemFunctions': {
                'systemFunctionsId': '1', 'SecM': {'secMId': '1', 'CertM': {'certMId': '1', 'NodeCredential': {'attributes': {
                    'xc:operation': 'update'}, 'nodeCredentialId': 'oamNodeCredential', 'expiryAlarmThreshold': '30'}}}}}
            # GNBDUFunction
            self.mo_dict['gnbdu_update'] = {'managedElementId': self.node, 'GNBDUFunction': {'gNBDUFunctionId': '1', 'RadioBearerTable': {
                'radioBearerTableId': '1', 'DataRadioBearer': {
                    'attributes': {'xc:operation': 'update'}, 'dataRadioBearerId': '1', 'dlMaxRetxThreshold': '32'}}}}
            # GNBCUCPFunction
            if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.isin(["N260", "N261", "N258"])].index) > 0:
                self.mo_dict['nr_hb_cucp_update'] = {'managedElementId': self.node, 'GNBCUCPFunction': {
                    'gNBCUCPFunctionId': '1', 'QciProfileEndcConfigExt': {'attributes': {'xc:operation': 'update'},
                                                                          'qciProfileEndcConfigExtId': '1', 'initialUplinkConf': '0 (MCG)'}}}
            if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.isin(["N260", "N261", "N258"])].index) > 0:
                self.mo_dict[F'nr_hb_cucp5qi_update'] = {'managedElementId': self.node, 'GNBCUCPFunction': {
                    'gNBCUCPFunctionId': '1', 'CUCP5qiTable': {'cUCP5qiTableId': '1', 'CUCP5qi': []}}}
                for i in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '199']:
                    self.mo_dict[F'nr_hb_cucp5qi_update']['GNBCUCPFunction']['CUCP5qiTable']['CUCP5qi'] += [{
                        'attributes': {'xc:operation': 'update'}, 'cUCP5qiId': str(i), 'tReorderingUl': '200'}]
        # # Write mos Script for cli Script for BL
        # script = []
        # self.get_lte_nr_node_parameters_when_bb_change()
        # self.get_mmbb_ip_parameters_when_node_is_coverted_to_mmbb()
        # self.get_lte_parameter()
        # self.get_nr_parameter()
        # self.write_script_file_from_lines_or_mo_dict(
        #     script, os.path.join(self.usid.base_dir, 'REMOTE_SCRIPT',
        #                          *[self.node, F'zz_1_{"_".join(self.__class__.__name__.split("_")[2:])}_{self.node}_cli.txt']))

    def special_formate_scripts(self):
        if len(self.df_enb_cell.loc[self.df_enb_cell.addcell].index) == 0 and len(self.df_gnb_cell.loc[self.df_gnb_cell.addcell].index) == 0:
            return
        # Write mos Script for Baseline
        for sc in ['ap', 'cli', 'cmedit']:
            sc_name = self.relative_path[sc][-1].split('_')
            sc_name[0] = sc_name[0] + 'b'
            self.relative_path[sc][-1] = '_'.join(sc_name)
            sc_name = self.relative_path[sc][-1].split('.')
            sc_name[-1] = 'mosscript.mos'
            self.relative_path[sc][-1] = '_'.join(sc_name)
            self.s_dict[sc] = []
        self.s_dict['cli'] = []
        self.s_dict['cli'] += self.get_let_nr_systemconstant()
        self.s_dict['cli'] += self.lte_node_cell_internal_parameter()
        if len(self.s_dict['cli']) > 0:
            self.s_dict['cli'] = ['unset all', '$DATE = `date +%Y%m%d_%H%M%S`', 'lt all', 'pv $nodename', F'if $nodename != {self.node}',
                                  'print ERROR: Node Name Mismatch. Wrong Node. ABORT !!!', 'return', 'fi',
                                  F'l+ logfile_{"_".join(self.relative_path["cli"][-1].split("_")[:-1])}_$DATE.log',
                                  'confbd+', 'gs+', '', ''] + self.s_dict['cli'] + ['', 'confbd-', 'gs', 'l-', 'unset all', '']
        self.s_dict['cmedit'] = copy.deepcopy(self.s_dict['cli'])
        self.write_script_file()
        self.s_dict['cli'] = []

    def get_let_nr_systemconstant(self):
        # Variable
        sc_type = ' for LTE' if self.enbdata.get('mmbb') else ''
        nr_hb_flag = len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.isin(["N260", "N261", "N258"])].index) > 0
        morethen3cells_n_non_mmbb = len(self.df_enb_cell.index) > 0 and (not self.enbdata.get('mmbb'))
        ess_flag = True if len(self.df_enb_cell.loc[(self.df_enb_cell.esssclocalid.fillna(0).astype(int) > 0) |
                                                    (self.df_enb_cell.essscpairid.fillna(0).astype(int) > 0)].index) > 0 or len(
            self.df_gnb_cell.loc[(self.df_gnb_cell.esssclocalid.fillna(0).astype(int) > 0) |
                                 (self.df_gnb_cell.essscpairid.fillna(0).astype(int) > 0)].index) > 0 else False
        sa_flag = False
        mrbs_flag = False
        b46_flag = len(self.df_enb_cell.loc[self.df_enb_cell.freqband == '46'].index) > 0
        n77_flag = len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.isin(['N77'])].index) > 0
        sc_dict = {
            'ATT_23_Q3': {
                'lte': [
                    F'####---------------- LTE System Constants ----------------####',
                    F'/cm/sysconwrite 1627 {"2" if ess_flag else "3"}',  # 2 for ESS else 3 (fixedCfiSib1)
                    F'/cm/sysconwrite 1728 20',
                    F'/cm/sysconwrite 2101 0',
                    F'/cm/sysconwrite 3202 60',
                    F'## /cm/sysconwrite 3562 0 ----- mRBS ---> 0 and non_mRBS ---> default',
                    F'/cm/sysconwrite 3763 0',
                    F'/cm/sysconwrite 3764 0',
                    F'/cm/sysconwrite L5324 0',
                    F'{"" if ess_flag else "## "}/cm/sysconwrite L5362 0 {"" if ess_flag else "----- ESS ---> 0 and non_ESS ---> default"}',
                    F'',
                ],
                'nr': [
                    F'####:---------------------------> NR SystemConstants <---------------------------:####',
                    F'## /cm/sysconwrite RP1869 0 for SA and NR_MB+_n77',  # ----- 0 for SA and NR_MB+_n77 else default
                    F'{"/cm/sysconwrite RP743 8" if nr_hb_flag else ""}',  # ----- default for non_NR_HB
                    F'',
                ]
            },
            'ATT_23_Q2': {
                'lte': [
                    F'####---------------- LTE System Constants ----------------####',
                    F'/cm/sysconwrite 1627 {"2" if ess_flag else "3"}',  # 2 for ESS else 3 (fixedCfiSib1)
                    F'/cm/sysconwrite 1728 20',
                    F'/cm/sysconwrite 2101 0',
                    F'/cm/sysconwrite 3202 60',
                    F'/cm/sysconwrite 3763 0',
                    F'/cm/sysconwrite 3764 0',
                    F'## /cm/sysconwrite 3562 0 ----- mRBS ---> 0 and non_mRBS ---> default',
                    F'{"" if ess_flag else "## "}/cm/sysconwrite L5362 0 {"" if ess_flag else "----- ESS ---> 0 and non_ESS ---> default"}',
                    F'',
                ],
                'nr': [
                    F'####:---------------------------> NR SystemConstants <---------------------------:####',
                    # F'{"" if "N077" in nr_band else "## --- for NR_MB+ N077 ---"}/cm/sysconwrite RC664 0',  # --- for NR_MB+ N077
                    F'/cm/sysconwrite RP137 20',  # ----- for all NR Site
                    F'/cm/sysconwrite RP138 20',  # ----- for all NR Site
                    F'/cm/sysconwrite RP139 20',  # ----- for all NR Site
                    F'{"/cm/sysconwrite RP743 8" if nr_hb_flag else ""}',  # ----- default for non_NR_HB
                    F'',
                ]
            },
            'ATT_23_Q1': {
                'lte': [
                    F'####---------------- LTE System Constants ----------------####',
                    F'/cm/sysconwrite 1627 {"2" if ess_flag else "3"}{sc_type}',  # 2 for ESS else 3 (fixedCfiSib1)
                    F'/cm/sysconwrite 1728 20{sc_type}',
                    F'/cm/sysconwrite 2101 0{sc_type}',
                    # F'/cm/sysconwrite 2400 0{sc_type}',
                    F'/cm/sysconwrite 3050 0{sc_type}',  # 0 as Initial Value (advMimoSleepMode4TxEnabled)
                    F'/cm/sysconwrite 3202 60{sc_type}',
                    # F'/cm/sysconwrite 3562 0{sc_type}',   mRBS ---> 0 and non_mRBS ---> default
                    F'/cm/sysconwrite 3763 0{sc_type}',
                    F'/cm/sysconwrite 3764 0{sc_type}',
                    F'/cm/sysconwrite L5281 0{sc_type}',
                    F'',
                ],
                'nr': [
                    F'####:---------------------------> NR SystemConstants <---------------------------:####',
                    # F'{"" if "N077" in nr_band else "## --- for NR_MB+ N077 ---"}/cm/sysconwrite RC664 0',  # --- for NR_MB+ N077
                    F'/cm/sysconwrite RP137 20',  # ----- for all NR Site
                    F'/cm/sysconwrite RP138 20',  # ----- for all NR Site
                    F'/cm/sysconwrite RP139 20',  # ----- for all NR Site
                    # F'{"" if nr_hb_flag else "/cm/sysconwrite RP1617 0"}',  # ----- default for NR_HB
                    # F'{"" if sa_flag else "/cm/sysconwrite RP1718 1"}',  # ----- default for non_SA
                    # F'{"" if nr_hb_flag else "/cm/sysconwrite RP66 16"}',  # ----- default for NR_HB
                    F'{"/cm/sysconwrite RP743 8" if nr_hb_flag else ""}',  # ----- default for non_NR_HB
                    F'',
                ]
            },
            'ATT_22_Q4': {
                'lte': [
                    F'####---------------- LTE System Constants ----------------####',
                    # F'/cm/sysconwrite 871 0{sc_type}',   Removed From GS Verson 22.70
                    # F'/cm/sysconwrite 908 {"5000" if morethen3cells_n_non_mmbb else "3900"}{sc_type}',
                    # F'{"/cm/sysconwrite 971 200" + sc_type if b46_flag else ""}',  # 200 for B46 (rlcBufferSplitLimit)
                    F'/cm/sysconwrite 1627 {"2" if ess_flag else "3"}{sc_type}',  # 2 for ESS else 3 (fixedCfiSib1)
                    # F'/cm/sysconwrite 1699 0{sc_type}', # It has been made Default on GS_Verson 22.63
                    F'/cm/sysconwrite 1728 20{sc_type}',
                    F'/cm/sysconwrite 2101 0{sc_type}',
                    # F'/cm/sysconwrite 2400 0{sc_type}',
                    F'/cm/sysconwrite 3050 0{sc_type}',  # 0 as Initial Value (advMimoSleepMode4TxEnabled)
                    F'/cm/sysconwrite 3202 60{sc_type}',
                    # F'/cm/sysconwrite 3562 0{sc_type}',   mRBS ---> 0 and non_mRBS ---> default
                    F'/cm/sysconwrite 3763 0{sc_type}',
                    F'/cm/sysconwrite 3764 0{sc_type}',
                    # F'/cm/sysconwrite 4445 0{sc_type}',   Removed From GS Verson 22.70
                    F'',
                ],
                'nr': [
                    F'####:---------------------------> NR SystemConstants <---------------------------:####',
                    # F'{"" if "N077" in nr_band else "## --- for NR_MB+ N077 ---"}/cm/sysconwrite RC664 0',  # --- for NR_MB+ N077
                    F'/cm/sysconwrite RP137 20',  # ----- for all NR Site
                    F'/cm/sysconwrite RP138 20',  # ----- for all NR Site
                    F'/cm/sysconwrite RP139 20',  # ----- for all NR Site
                    # F'{"" if nr_hb_flag else "/cm/sysconwrite RP1617 0"}',  # ----- default for NR_HB
                    # F'{"" if sa_flag else "/cm/sysconwrite RP1718 1"}',  # ----- default for non_SA
                    # F'{"" if nr_hb_flag else "/cm/sysconwrite RP66 16"}',  # ----- default for NR_HB
                    F'{"/cm/sysconwrite RP743 8" if nr_hb_flag else ""}',  # ----- default for non_NR_HB
                    F'',
                ]
            },
            'ATT_22_Q3': {
                'lte': [
                    F'####---------------- LTE System Constants ----------------####',
                    # F'/cm/sysconwrite 871 0{sc_type}',    Removed From GS Verson 22.70
                    F'/cm/sysconwrite 908 {"5000" if morethen3cells_n_non_mmbb else "3900"}{sc_type}',
                    # F'{"/cm/sysconwrite 971 200" + sc_type if b46_flag else ""}',  # 200 for B46 (rlcBufferSplitLimit)
                    F'/cm/sysconwrite 1627 {"2" if ess_flag else "3"}{sc_type}',  # 2 for ESS else 3 (fixedCfiSib1)
                    # F'/cm/sysconwrite 1699 0{sc_type}', # It has been made Default on GS_Verson 22.63
                    F'/cm/sysconwrite 1728 20{sc_type}',
                    F'/cm/sysconwrite 2101 0{sc_type}',
                    F'/cm/sysconwrite 2400 0{sc_type}',
                    F'/cm/sysconwrite 3050 0{sc_type}',  # 0 as Initial Value (advMimoSleepMode4TxEnabled)
                    F'/cm/sysconwrite 3202 60{sc_type}',
                    F'/cm/sysconwrite 3763 0{sc_type}',
                    F'/cm/sysconwrite 3764 0{sc_type}',
                    # F'/cm/sysconwrite 4445 0{sc_type}',   Removed From GS Verson 22.70
                    F'',
                ],
                'nr': [
                    F'####:---------------------------> NR SystemConstants <---------------------------:####',
                    # F'{"" if "N077" in nr_band else "## --- for NR_MB+ N077 ---"}/cm/sysconwrite RC664 0',  # --- for NR_MB+ N077
                    F'/cm/sysconwrite RP137 20',  # ----- for all NR Site
                    F'/cm/sysconwrite RP138 20',  # ----- for all NR Site
                    F'/cm/sysconwrite RP139 20',  # ----- for all NR Site
                    F'{"" if nr_hb_flag else "/cm/sysconwrite RP1617 0"}',  # ----- default for NR_HB
                    F'{"" if sa_flag else "/cm/sysconwrite RP1718 1"}',  # ----- default for non_SA
                    F'{"" if nr_hb_flag else "/cm/sysconwrite RP66 16"}',  # ----- default for NR_HB
                    F'{"/cm/sysconwrite RP743 8" if nr_hb_flag else ""}',  # ----- default for non_NR_HB
                    F'',
                ]
            }
        }

        sw = str(self.usid.client.software.swname)[:9]
        lines = [F'####:---------------------------> System Constants for {sw} <---------------------------:####',
                 F'/cm/sysconread all', '']
        if self.enbdata.get('mmbb') or self.gnbdata.get('mmbb'):
            if self.no_eq_change_with_dcgk_flag:
                current_sc = self.site.get_mos_w_end_str('SystemConstants=1')
                if self.enbdata.get('Lrat') is None:
                    lines += sc_dict.get(sw).get('lte')
                    lines += ['## ' + _ for _ in sc_dict.get(sw).get('nr')]
                elif self.gnbdata.get('GNBDU') is None:
                    lines += ['/cm/sysconreset all', 'scd all', '']
                    lines += sc_dict.get(sw).get('lte')
                    lines += sc_dict.get(sw).get('nr')
                else:
                    lines += ['## ' + _ for _ in ['/cm/sysconreset all', 'scd all', ''] + sc_dict.get(sw).get('lte') + sc_dict.get(sw).get('nr')]
            else:
                lines += ['/cm/sysconreset all', 'scd all', ''] + sc_dict.get(sw).get('lte') + sc_dict.get(sw).get('nr')
        elif len(self.df_enb_cell.loc[self.df_enb_cell.addcell].index) > 0:
            lines += sc_dict.get(sw).get('lte') + ['## ' + _ for _ in sc_dict.get(sw).get('nr')]
        elif len(self.df_gnb_cell.loc[self.df_gnb_cell.addcell].index) > 0:
            lines += ['## ' + _ for _ in sc_dict.get(sw).get('lte')] + sc_dict.get(sw).get('nr')
        else:
            lines += ['## ' + _ for _ in sc_dict.get(sw).get('lte') + sc_dict.get(sw).get('nr')]

        if self.enbdata.get('mmbb', self.gnbdata.get('mmbb')) and sw < 'ATT_23_Q1':
            lines.extend(['', '/cm/sysconreset 908', '/cm/sysconreset 908 for LTE', F'/cm/sysconwrite 908 3900{sc_type}', ''])
        lines += ['', '/cm/sysconread all', '']
        return lines

    def lte_node_cell_internal_parameter(self):
        lines = ['####:---------------------------> EricssonOnly Parameter <---------------------------:####',
                 '####--- Existing Node/Cell ---####']
        df_fdd = self.df_enb_cell.loc[(self.df_enb_cell.celltype == 'FDD')]
        if len(self.enbdata) == 0: return lines
        if len(df_fdd.loc[df_fdd.addcell].index) == 0: return lines
        for mo_name in self.MoName.objects.filter(software=self.usid.client.software, motype='internal'):
            qs = mo_name.modetail_set.filter(flag=True).values('parameter', 'value')
            tmp_dict = {_.get('parameter'): json.loads(_.get('value')) for _ in qs}
            if len(tmp_dict) == 0: continue
            for site_u in self.usid.sites:
                if site_u is None: continue
                mos = self.usid.sites[site_u].find_mo_ending_with_parent_str(mo_name.moc, '')
                for mo in mos:
                    if (site_u.split('_')[-1] != self.node or self.eq_flag is False) and (',EUtranCellFDD=' not in mo): continue
                    mo_ldn = ','.join(mo.split(',')[mo.split(',').index([_ for _ in mo.split(',') if 'ManagedElement' in _][0]) + 1:])
                    if ',EUtranCellFDD=' in mo_ldn:
                        precell = [_ for _ in mo_ldn.split(',') if 'EUtranCellFDD=' in _][0].split('=')[-1]
                        if len(df_fdd.loc[df_fdd.precell == precell].index) == 0 or not df_fdd.loc[df_fdd.precell == precell].addcell.iloc[0]:
                            continue
                        mo_ldn = mo_ldn.replace(precell, df_fdd.loc[df_fdd.precell == precell].postcell.iloc[0])
                    mo_data = self.usid.sites[site_u].site_extract_data(mo)
                    for key in tmp_dict:
                        if mo_data.get(key):
                            p_val = str(mo_data.get(key, '')).split()[0] if ('(') in str(mo_data.get(key, '')) else str(mo_data.get(key, ''))
                            if tmp_dict.get(key).lower() == p_val: continue
                            lines.append(F'seti {mo_ldn}$ {key} {p_val}')
        lines += ['', '####--- New Node/Cell ---####']
        if self.site is None or self.enbdata.get('Lrat') is None:
            lines += ['seti ENodeBFunction=1,Rrc=1$ tRrcConnectionSetup 6',
                      'seti ENodeBFunction=1,PreschedulingProfile= preschedulingSinrThreshold 20 ' '']
        if len(self.df_enb_cell.loc[((self.df_enb_cell.celltype == 'IOT') & (self.df_enb_cell.addcell))].index) > 0:
            lines += ['seti ENodeBFunction=1,Rrc=1$ t310NbIot 4000', '']
        for row in df_fdd.loc[df_fdd.movement == 'new'].itertuples():
            cell_name = F'ENodeBFunction=1,EUtranCellFDD={row.postcell}'
            lines += [F'seti {cell_name},UeMeasControl=1,ReportConfigEUtraBadCovPrim=1$ reportIntervalA2Prim 2',
                          F'seti {cell_name},UeMeasControl=1,ReportConfigSearch=1$ reportIntervalSearch 2',
                          F'seti {cell_name},UeMeasControl=1,ReportConfigA5DlComp=1$ a5Threshold1Rsrq -140',
                          F'seti {cell_name},UeMeasControl=1,ReportConfigA5DlComp=1$ a5Threshold2Rsrq -165',
                          F'seti {cell_name},UeMeasControl=1,ReportConfigB1GUtra=1$ reportAmountB1 8',
                          F'seti {cell_name},UeMeasControl=1,ReportConfigB1GUtra=1$ reportIntervalB1 2',
                          F'']
        return lines + ['', '']



    # def write_script_file_from_lines_or_mo_dict(self, lines=None, relative_path=None):
    #     if lines is not None and len(lines) > 0:
    #         if not os.path.exists(os.path.dirname(relative_path)): os.makedirs(os.path.dirname(relative_path))
    #         with open(relative_path, 'w') as f: f.write('\n'.join(lines))
    #     elif len(self.mo_dict) > 0:
    #         script_type = os.path.basename(relative_path).split('_')[-1].split('.')[0]
    #         if script_type in ['cmedit', 'cli']:
    #             lines = []
    #             for mo_fdn in self.mo_dict:
    #                 lines.extend(self.cmedit_list_form_dict(script_type, mo_fdn, self.mo_dict.get(mo_fdn, {})))
    #             if lines is not None and len(lines) > 0:
    #                 if not os.path.exists(os.path.dirname(relative_path)): os.makedirs(os.path.dirname(relative_path))
    #                 with open(relative_path, 'w') as f: f.write('\n'.join(lines))
    #         elif script_type in ['netconf']:
    #             lines = []
    #             for mo_fdn in self.mo_dict:
    #                 lines.extend(self.netconf_doc_form_dict(self.mo_dict.get(mo_fdn, {}), mo_fdn))
    #             if lines is not None and len(lines) > 0:
    #                 if not os.path.exists(os.path.dirname(relative_path)): os.makedirs(os.path.dirname(relative_path))
    #                 with open(relative_path, 'w') as f:
    #                     f.write('\n'.join(self.netconf_hello_msg()))
    #                     for doc in lines:
    #                         f.write(doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').replace(
    #                             '<?xml version="1.0" encoding="UTF-8"?>', '').strip())
    #                         f.write('\n]]>]]>\n')
    #                     f.write('\n'.join(self.netconf_close_msg()))
    #     self.mo_dict = {}
