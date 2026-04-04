import copy
import re
from .att_xml_base import att_xml_base


class lte_54_enb_lte_nr_relation(att_xml_base):
    def create_rpc_msg(self):
        df_lte = self.df_enb_cell.copy()
        df_lte = df_lte.loc[((df_lte.celltype.isin(['FDD'])) & (~(df_lte.postcell.str.endswith('_L'))) & (df_lte.isdlonly == 'false'))]
        df_lte = df_lte.loc[(df_lte.dlchannelbandwidth.astype(int) >= 5000)]
        df_nr = self.usid.df_gnb_cell.copy()
        df_nr = df_nr.loc[(~((df_nr.freqband.str.contains('N260|N261|N258')) & (df_nr.carrier.str.contains('MC'))))]
        if len(df_lte.index) == 0 or len(df_nr.index) == 0: return

        df_lte = df_lte[['celltype', 'postsite', 'postcell', 'dlchannelbandwidth', 'freqband']]
        df_nr = df_nr[['postsite', 'postcell', 'gnbid', 'gnbidlength', 'cellid', 'nrtac', 'nrpci', 'ssbfrequency', 'ssbsubcarrierspacing',
                       'ssbperiodicity', 'ssboffset', 'ssbduration', 'freqband']]
        df_nr['freq'] = df_nr.apply(lambda x: F'{x.ssbfrequency}-{x.ssbsubcarrierspacing}-{x.ssbperiodicity}-{x.ssboffset}-{x.ssbduration}' if
                                        self.usid.client.software.swname < 'ATT_22_Q3' else F'{x.ssbfrequency}-{x.ssbsubcarrierspacing}', axis=1)
        df_nr['relid'] = df_nr.apply(lambda x: F'{x.ssbfrequency}-{x.ssbsubcarrierspacing}-{x.ssbperiodicity}-{x.ssboffset}-{x.ssbduration}', axis=1)
        df_rel = df_lte.assign(flag='a').merge(df_nr.assign(flag='a'), on='flag', suffixes=('', '_nr')).reset_index(drop=True, inplace=False)
        df_rel = df_rel.loc[(~((df_rel.freqband.isin(['14'])) & (df_rel.freqband_nr.isin(['N005', 'N012', 'N017', 'N014', 'N029']))))]

        # df_lte_anchor = self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.celltype.isin(['FDD']))].copy()[['postsite', 'postcell',
        #                                                                                                   'dlchannelbandwidth', 'freqband']]
        # df_lte_anchor = pd.concat([df_lte_anchor, self.usid.df_lte_rel.copy()], join='inner', ignore_index=True)
        # df_lte_anchor = df_lte_anchor.loc[((~df_lte_anchor.postcell.str.contains('_L$')) & (df_lte_anchor.isdlonly == 'false') &
        #                                    (df_lte_anchor.dlchannelbandwidth.astype(int) >= 5000))].copy()
        # nr_lb = ['N005', 'N012', 'N017', 'N014', 'N029']
        # nr_mb = ['N002', 'N066', 'N030']
        # nr_mb_plus = ['N046', 'N048', 'N077']
        # nr_hb = ['N260', 'N261', 'N258']
        #
        # df_rel = df_rel.loc[
        #     ((df_rel.dlchannelbandwidth.astype(int) >= 5000) & (df_rel.freqband.isin(['2', '4', '30', '66']))) |
        #     ((df_rel.freqband.isin(['14'])) & (df_rel.freqband_nr.isin(nr_mb + nr_mb_plus + nr_hb)))
        # ]
        # #             ((df_rel.freqband.isin(['5', '12', '17'])) & (df_rel.freqband_nr.isin(nr_mb + nr_mb_plus + nr_hb))) |
        # #             ((df_rel.dlchannelbandwidth.astype(int) == 5000) & (df_rel.freqband.isin(['2', '4', '30', '66'])) &
        # #              (df_rel.freqband_nr.isin(nr_mb_plus + nr_hb))) |
        df_rel.reset_index(drop=True, inplace=True)
        del df_nr, df_lte
        if len(df_rel.index) == 0: return
        self.motype = 'Lrat'
        # GUtraNetwork
        mos_ldn_dict, freq_list = {}, []
        # GUtraNetwork
        mos_ldn_dict['GUtraNetwork'] = F'ENodeBFunction=1,GUtraNetwork={self.enbdata["GUtraNetwork"]}'
        freq_list += [mos_ldn_dict['GUtraNetwork']]
        gnb_nw = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'GUtraNetwork': {
            'gUtraNetworkId': self.enbdata['GUtraNetwork']}}}
        mo_dict = copy.deepcopy(gnb_nw)
        mo_dict['ENodeBFunction']['GUtraNetwork'] |= {'attributes': {'xc:operation': 'create'}}
        self.mo_dict[mos_ldn_dict['GUtraNetwork']] = copy.deepcopy(mo_dict)
        for gnb in df_rel.postsite_nr.unique():
            # ExternalGNodeBFunction, TermPointToGNB
            ext_nw = copy.deepcopy(gnb_nw)
            ext_id = F'{self.usid.gnodeb[gnb]["plmnlist"]["mcc"]}{self.usid.gnodeb[gnb]["plmnlist"]["mnc"]}-000000{self.usid.gnodeb[gnb]["nodeid"]}'
            # ext_id = gnb
            mos_ldn_dict['ExternalGNodeBFunction'] = F'{mos_ldn_dict["GUtraNetwork"]},ExternalGNodeBFunction={gnb}'
            freq_list += [mos_ldn_dict['ExternalGNodeBFunction']]
            ext_nw['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction'] = {'externalGNodeBFunctionId': gnb}
            mo_dict = copy.deepcopy(ext_nw)
            mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction'] = \
                self.get_mo_dict_from_moc_node_fdn_moid('ExternalGNodeBFunction', self.node, None, gnb)
            mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction'] |= {
                'gNodeBPlmnId': self.usid.gnodeb[gnb]['plmnlist'], 'gNodeBId': self.usid.gnodeb[gnb]['nodeid'],
                'gNodeBIdLength': self.usid.gnodeb[gnb]['gnbidlength']}
            self.mo_dict[mos_ldn_dict['ExternalGNodeBFunction']] = copy.deepcopy(mo_dict)
            mo_dict = copy.deepcopy(ext_nw)
            mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction']['TermPointToGNB'] = {
                'attributes': {'xc:operation': 'create'}, 'termPointToGNBId': gnb, 'administrativeState': '1 (UNLOCKED)',
                'ipAddress': '0.0.0.0', 'ipv6Address': self.usid.gnodeb[gnb]['lte_ip']
            }
            self.mo_dict[F'{mos_ldn_dict["ExternalGNodeBFunction"]},TermPointToGNB={gnb}'] = copy.deepcopy(mo_dict)
            # GUtranSyncSignalFrequency, ExternalGUtranCell
            for row in df_rel.loc[df_rel.postsite_nr == gnb].itertuples():
                band = '' if re.search(r'\d+', row.freqband_nr) is None else str(int(re.search(r'\d+', row.freqband_nr).group(0)))
                # freq_id = F'{row.ssbfrequency}-{row.ssbsubcarrierspacing}'
                mos_ldn_dict['GUtranSyncSignalFrequency'] = F'{mos_ldn_dict["GUtraNetwork"]},GUtranSyncSignalFrequency={row.freq}'
                if mos_ldn_dict['GUtranSyncSignalFrequency'] not in freq_list:
                    freq_list += [mos_ldn_dict['GUtranSyncSignalFrequency']]
                    mo_dict = copy.deepcopy(gnb_nw)
                    mo_dict['ENodeBFunction']['GUtraNetwork']['GUtranSyncSignalFrequency'] = \
                        self.get_mo_dict_from_moc_node_fdn_moid('GUtranSyncSignalFrequency', self.node, None, row.freq)
                    mo_dict['ENodeBFunction']['GUtraNetwork']['GUtranSyncSignalFrequency'] |= {
                        'arfcn': row.ssbfrequency, 'band': band, 'smtcDuration': row.ssbduration, 'smtcOffset': row.ssboffset,
                        'smtcPeriodicity': row.ssbperiodicity, 'smtcScs': row.ssbsubcarrierspacing}
                    self.mo_dict[mos_ldn_dict['GUtranSyncSignalFrequency']] = copy.deepcopy(mo_dict)
                # ExternalGUtranCell
                ext_cell_id = F'{ext_id}-{row.cellid}'
                mos_ldn_dict['ExternalGUtranCell'] = F'{mos_ldn_dict["ExternalGNodeBFunction"]},ExternalGUtranCell={ext_cell_id}'
                if mos_ldn_dict['ExternalGUtranCell'] not in freq_list:
                    freq_list += [mos_ldn_dict['ExternalGUtranCell']]
                    mo_dict = copy.deepcopy(ext_nw)
                    mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction']['ExternalGUtranCell'] = \
                        self.get_mo_dict_from_moc_node_fdn_moid('ExternalGUtranCell', self.node, None, F'{ext_id}-{row.cellid}')
                    mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction']['ExternalGUtranCell'] |= {
                        'physicalLayerCellIdGroup': F'{int(row.nrpci) // 3}',
                        'physicalLayerSubCellId': F'{int(row.nrpci) % 3}',
                        'localCellId': row.cellid,
                        'isRemoveAllowed': 'false',
                        'gUtranSyncSignalFrequencyRef': mos_ldn_dict['GUtranSyncSignalFrequency'],
                    }
                    self.mo_dict[mos_ldn_dict['ExternalGUtranCell']] = copy.deepcopy(mo_dict)
                # GUtranFreqRelation
                mos_ldn_dict['GUtranFreqRelation'] = F'ENodeBFunction=1,EUtranCellFDD={row.postcell},GUtranFreqRelation={row.relid}'
                if mos_ldn_dict['GUtranFreqRelation'] not in freq_list:
                    freq_list += [mos_ldn_dict['GUtranFreqRelation']]
                    mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('GUtranFreqRelation', self.node, None, row.relid)
                    mo_dict |= {'cellReselectionPriority': '-1', 'gUtranSyncSignalFrequencyRef': mos_ldn_dict['GUtranSyncSignalFrequency']}
                    self.mo_dict[mos_ldn_dict['GUtranFreqRelation']] = {'managedElementId': self.node, 'ENodeBFunction': {
                        'eNodeBFunctionId': '1', 'EUtranCellFDD': {'eUtranCellFDDId': row.postcell, 'GUtranFreqRelation': copy.deepcopy(mo_dict)}}}
                # GUtranCellRelation
                mos_ldn_dict['GUtranCellRelation'] = F'{mos_ldn_dict["GUtranFreqRelation"]},GUtranCellRelation={row.postcell_nr}'
                if mos_ldn_dict['GUtranCellRelation'] not in freq_list:
                    freq_list += [mos_ldn_dict['GUtranCellRelation']]
                    mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('GUtranCellRelation', self.node, None, row.postcell_nr)
                    mo_dict |= {'isRemoveAllowed': 'false', 'neighborCellRef': mos_ldn_dict['ExternalGUtranCell']}
                    self.mo_dict[mos_ldn_dict['GUtranCellRelation']] = {'managedElementId': self.node, 'ENodeBFunction': {
                        'eNodeBFunctionId': '1', 'EUtranCellFDD': {'eUtranCellFDDId': row.postcell, 'GUtranFreqRelation': {
                            'gUtranFreqRelationId': row.relid, 'GUtranCellRelation': copy.deepcopy(mo_dict)}}}}

        # Parameter Setting for LTE - NR
        lte_ip = F'Transport=1,Router={self.enbdata["lte"]},InterfaceIPv6={self.enbdata["lte_interface"]},AddressIPv6={self.enbdata["lte_add"]}'
        if self.enbdata['mmbb']:
            ran_ip = F'Transport=1,Router={self.gnbdata["lte"]},InterfaceIPv6={self.gnbdata["lte_interface"]},AddressIPv6={self.gnbdata["lte_add"]}'
        else: ran_ip = F'Transport=1,Router={self.enbdata["lte"]},InterfaceIPv6={self.enbdata["lte_interface"]},AddressIPv6={self.enbdata["lte_add"]}'

        if self.usid.client.software.swname <= 'ATT_22_Q3':
            crnode = ['SystemFunctions=1,SecM=1,CertM=1,NodeCredential=oamNodeCredential',
                      'SystemFunctions=1,SecM=1,CertM=1,TrustCategory=oamTrustCategory']
            self.mo_dict[F'update_ENodeBFunction=1,EndcProfile=1'] = {'managedElementId': self.node, 'NodeSupport': {
                'nodeSupportId': '1',
                'ServiceDiscovery': {'attributes': {'xc:operation': 'create'}, 'serviceDiscoveryId': '1', 'localAddress': ran_ip,
                                     'primaryGsds': {'host': 'localhost', 'port': '8301', 'serviceArea': 'NR'},
                                     'nodeCredential': crnode[0], 'trustCategory': crnode[1]},
                'ServiceDiscoveryServer': {'attributes': {'xc:operation': 'create'}, 'serviceDiscoveryServerId': '1', 'localAddress': ran_ip,
                                           'cluster': {'host': 'localhost', 'port': '8301', 'serviceArea': 'NR'},
                                           'nodeCredential': crnode[0], 'trustCategory': crnode[1]},
            }}

        self.mo_dict[F'node_lte_nr_parameter__ENodeBFunction=1'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'attributes': {'xc:operation': 'update'}, 'eNodeBFunctionId': '1', 'endcDataUsageReportEnabled': 'true', 'zzzTemporary81': '1',
            'extendedBandN77Supported': 'true', 'ueCapabilityEnquirySteps': '1 (TWO_STEP)', 'intraRanIpAddressRef': lte_ip}}

        # Parameter for LTE-NR Relations
        self.mo_dict[F'ENodeBFunction=1'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'attributes': {'xc:operation': 'update'}, 'eNodeBFunctionId': '1', 'endcDataUsageReportEnabled': 'true', 'zzzTemporary81': '1',
            'extendedBandN77Supported': 'true', 'ueCapabilityEnquirySteps': '1 (TWO_STEP)', 'intraRanIpAddressRef': lte_ip}}
        self.mo_dict[F'update-ENodeBFunction=1,PmFlexCounterFilter=2[34]'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'PmFlexCounterFilter': [
                {'attributes': {'xc:operation': 'update'}, 'pmFlexCounterFilterId': '23', 'endcFilterMin': '1 (ENDC_NR_MATCHED)',
                 'endcFilterEnabled': 'true'},
                {'attributes': {'xc:operation': 'update'}, 'pmFlexCounterFilterId': '24', 'endcFilterMin': '2 (ENDC_NR_ACTIVE)',
                 'endcFilterEnabled': 'true'}
            ]}}
        self.mo_dict[F'update-ENodeBFunction=1,QciTable=default,QciProfilePredefined=qci[12]'] = {
            'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1',
                'EndcProfile': {'attributes': {'xc:operation': 'create'}, 'endcProfileId': '1', 'meNbS1TermReqArpLev': '15',
                                'splitNotAllowedUeArpLev': '15'},
                'QciTable': {'qciTableId': 'default', 'QciProfilePredefined': [
                    {'attributes': {'xc:operation': 'update'}, 'qciProfilePredefinedId': _,
                     'endcProfileRef': 'ENodeBFunction=1,EndcProfile=1'} for _ in ['qci1', 'qci2']
                ]},
            }}

        nr_lb = ['N005', 'N012', 'N017', 'N014', 'N029']
        nr_mb = ['N002', 'N066', 'N030']
        nr_mb_plus = ['N046', 'N048', 'N077']
        nr_hb = ['N260', 'N261', 'N258']
        CXC4012218 = False
        freqband_nr = set(df_rel.freqband_nr.unique())
        CXC4012371 = True if len(freqband_nr) == 1 and len([_ for _ in nr_mb + nr_lb if _ in freqband_nr]) == 1 else False
        for row in df_rel.groupby(['postcell']).head(1).itertuples():
            anchor_flag = False
            freqband_nr = set(df_rel.loc[(df_rel.postcell == row.postcell)].freqband_nr.unique())
            cell_data = {
                'attributes': {'xc:operation': 'update'}, 'eUtranCellFDDId': row.postcell, 'primaryUpperLayerInd': '1 (ON)',
                'additionalUpperLayerIndList': ['OFF', 'OFF', 'OFF', 'OFF', 'OFF'], 'endcAllowedPlmnList': '',
                'UeMeasControl': {'ueMeasControlId': '1', 'ReportConfigB1GUtra': {
                    'attributes': {'xc:operation': 'update'}, 'reportConfigB1GUtraId': '1', 'b1ThresholdRsrp': '-113'}}}
            if self.usid.client.mname in ['LA', 'SFO']:
                cell_data['UeMeasControl']['attributes'] = {'xc:operation': 'update'}
                cell_data['UeMeasControl']['endcMeasRestartTime'] = '-1'
                cell_data['UeMeasControl']['endcMeasTime'] = '-1'
            elif len(freqband_nr) > 1:
                cell_data['UeMeasControl']['attributes'] = {'xc:operation': 'update'}
                cell_data['UeMeasControl']['endcMeasRestartTime'] = '7000'
                cell_data['UeMeasControl']['endcMeasTime'] = '2000'

            if row.freqband in ['14'] and len([_ for _ in nr_mb + nr_mb_plus + nr_hb if _ in freqband_nr]) > 0:
                anchor_flag = True
                cell_data['additionalUpperLayerIndList'] = ['ON', 'OFF', 'OFF', 'OFF', 'OFF']
                cell_data['endcAllowedPlmnList'] = [{'mcc': '313', 'mnc': '100', 'mncLength': '3'}]
            elif row.freqband in ['17', '12', '5'] and len([_ for _ in nr_mb + nr_mb_plus + nr_hb if _ in freqband_nr]) > 0:
                anchor_flag = True
                cell_data['additionalUpperLayerIndList'] = ['ON', 'OFF', 'OFF', 'OFF', 'OFF']
                cell_data['endcAllowedPlmnList'] = [{"mcc": "310", "mnc": "410", "mncLength": "3"}, {'mcc': '313', 'mnc': '100', 'mncLength': '3'}]
            elif row.freqband in ['2', '4', '66', '30'] and len([_ for _ in nr_mb_plus + nr_hb if _ in freqband_nr]) > 0:
                anchor_flag = True
                cell_data['additionalUpperLayerIndList'] = ['ON', 'OFF', 'OFF', 'OFF', 'OFF']
                cell_data['endcAllowedPlmnList'] = [{"mcc": "310", "mnc": "410", "mncLength": "3"}, {'mcc': '313', 'mnc': '100', 'mncLength': '3'}]
            elif row.freqband in ['2', '4', '66', '30'] and row.dlchannelbandwidth == '5000' and \
                len([_ for _ in nr_mb + nr_lb if _ in freqband_nr]) > 0: anchor_flag = False

            if anchor_flag:
                self.mo_dict[F'ENodeBFunction=1,EUtranCellFDD={row.postcell}'] = {
                    'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'EUtranCellFDD': copy.deepcopy(cell_data)}}
                CXC4012218 = True

        # CXC4012218 - Basic Intelligent Connectivity (LTEFDD/TDD)
        if CXC4012218:
            self.mo_dict[F'FeatureState=CXC4012218'] = {'managedElementId': self.node, 'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {
                'lmId': '1', 'FeatureState': {'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4012218',
                                              'featureState': '1 (ACTIVATED)'}}}}
        # CXC4012371- Capability-Aware Idle Mode Control (LTEFDD/TDD)
        if self.usid.client.mname == 'LA': CXC4012371 = False
        self.mo_dict[F'FeatureState=CXC4012371'] = {'managedElementId': self.node, 'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {
            'lmId': '1', 'FeatureState': {'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4012371',
                                          'featureState': '1 (ACTIVATED)' if CXC4012371 else '0 (DEACTIVATED)'}}}}
