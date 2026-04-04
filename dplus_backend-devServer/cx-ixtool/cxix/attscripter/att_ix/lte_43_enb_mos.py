import copy
import re
from .att_xml_base import att_xml_base


class lte_43_enb_mos(att_xml_base):
    def create_rpc_msg(self):
        self.motype = 'Lrat'
        # get ENodeBFunction=1 allowMocnCellLevelCommonTac true
        if len(self.df_enb_cell.loc[self.df_enb_cell.addcell].index) > 0:
            self.mo_dict['ENodeBFunction=1-allowMocnCellLevelCommonTac-true'] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'attributes': {'xc:operation': 'update'}, 'allowMocnCellLevelCommonTac': 'true'}}

        if not (self.no_eq_change_with_dcgk_flag and self.enbdata.get('Lrat')):
            tmp_mo_list = ['EndcProfile', 'ImeisvTable', 'PlmnInfo', 'PmFlexCounterFilter', 'TimerProfile', 'UnlicensedAccessFunction',
                           'SubscriberGroupProfile']
            self.systemCreated_list = ['ImeisvTable']
            for moc in tmp_mo_list:
                mos_dict = {'eNodeBFunctionId': '1'}
                cs = self.MoRelation.objects.filter(parent='ENodeBFunction', child=moc, tag='eNBMO__lte_43_enb_mo',
                                                    software=self.usid.client.software)
                for child in cs:
                    mos = self.log_append_child_tags(child.child, rel_tag='eNBMO__lte_43_enb_mo', parent_mo=self.enbdata.get("Lrat"), node=self.node)
                    for key in mos: mos_dict[key] = copy.deepcopy(mos[key])
                self.mo_dict[F'para_eNBMO--lte_43_enb_mo_{moc}'] = {'managedElementId': self.node, 'ENodeBFunction': copy.deepcopy(mos_dict)}

        # QciProfileOperatorDefined
        tmp_mo_list = []
        mos_ids = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('QciProfileOperatorDefined')] if self.no_eq_change_with_dcgk_flag else []
        if self.site and self.eq_flag:
            for mo_fdn in self.site.find_mos_with_moc('QciProfileOperatorDefined'):
                mos_ids.append(mo_fdn.split('=')[-1])
                cs = self.get_mo_dict_from_moc_node_fdn_moid('QciProfileOperatorDefined', self.node, mo_fdn)
                cs |= {'qci': re.search(r'\d+', cs.get('qciProfileOperatorDefinedId', 'qci199')).group(0),
                       'resourceType': self.site.dcg.get(mo_fdn).get('resourceType'), 'dlMaxHARQTxQci': '5', 'ulMaxHARQTxQci': '5'}
                tmp_mo_list.append(cs.copy())
        if 'qci162' not in mos_ids:
            cs = self.get_mo_dict_from_moc_node_fdn_moid('QciProfileOperatorDefined', self.node, None, 'qci162')
            cs |= {'qci': '162', 'resourceType': '0 (NON_GBR)', 'dlMaxHARQTxQci': '5', 'ulMaxHARQTxQci': '5'}
            tmp_mo_list.append(cs.copy())
        if 'qci199' not in mos_ids:
            cs = self.get_mo_dict_from_moc_node_fdn_moid('QciProfileOperatorDefined', self.node, None, 'qci199')
            cs |= {'qci': '199', 'resourceType': '0 (NON_GBR)', 'dlMaxHARQTxQci': '5', 'ulMaxHARQTxQci': '5'}
            tmp_mo_list.append(cs.copy())
        if len(tmp_mo_list) > 0:
            self.mo_dict['ENodeBFunction=1,QciProfileOperatorDefined='] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'QciTable': {'qciTableId': 'default', 'QciProfileOperatorDefined': copy.deepcopy(tmp_mo_list)}}}

        # AirIfLoadProfile
        tmp_mo_list = []
        mos_ids = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('AirIfLoadProfile')] if self.no_eq_change_with_dcgk_flag else []
        if self.site and self.eq_flag:
            for mo_fdn in self.site.find_mos_with_moc('AirIfLoadProfile'):
                mos_ids.append(mo_fdn.split('=')[-1])
                tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('AirIfLoadProfile', self.node, mo_fdn))
        for row in self.df_enb_cell.loc[(self.df_enb_cell.addcell & (~self.df_enb_cell.fdn.isna()))].itertuples():
            mo_fdn = self.get_ref_fdn_if_mo_para_has_ref_value(row.presite, row.fdn, 'ailgRef')
            if mo_fdn and mo_fdn.split('=')[-1] not in mos_ids:
                mos_ids.append(mo_fdn.split('=')[-1])
                tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('AirIfLoadProfile', row.presite, mo_fdn))
        if len(self.df_enb_cell.loc[(self.df_enb_cell.freqband == '30')].index) > 0 and ('4' not in mos_ids):
            tmp_dict = self.get_mo_dict_for_id_tag('AirIfLoadProfile', '4')
            tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'airIfLoadProfileId': '4'}
            tmp_mo_list.append(tmp_dict.copy())
        if len(tmp_mo_list) > 0:
            self.mo_dict['ENodeBFunction=1,AirIfLoadProfile='] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'AirIfLoadProfile': copy.deepcopy(tmp_mo_list)}}

        # PlmnAbConfProfile
        tmp_mo_list = []
        mos_ids = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('PlmnAbConfProfile')] if self.no_eq_change_with_dcgk_flag else []
        if self.site and self.eq_flag:
            for mo_fdn in self.site.find_mos_with_moc('PlmnAbConfProfile'):
                mos_ids.append(mo_fdn.split('=')[-1])
                tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('PlmnAbConfProfile', self.node, mo_fdn))
        for row in self.df_enb_cell.loc[(self.df_enb_cell.addcell & (~self.df_enb_cell.fdn.isna()))].itertuples():
            for ref in ['plmn1AbConfProfileRef', 'plmn2AbConfProfileRef', 'plmn3AbConfProfileRef']:
                mo_fdn = self.get_ref_fdn_if_mo_para_has_ref_value(row.presite, row.fdn, ref)
                if mo_fdn and mo_fdn.split('=')[-1] not in mos_ids:
                    mos_ids.append(mo_fdn.split('=')[-1])
                    tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('PlmnAbConfProfile', row.presite, mo_fdn))
        if len(self.df_enb_cell.loc[self.df_enb_cell.addcell].index) > 0 and self.node[-1].upper() != 'L':
            for mo_id in ['1', '2']:
                if mo_id in mos_ids: continue
                tmp_dict = self.get_mo_dict_for_id_tag('PlmnAbConfProfile', mo_id)
                tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'plmnAbConfProfileId': mo_id}
                tmp_mo_list.append(tmp_dict.copy())
        if len(tmp_mo_list) > 0:
            self.mo_dict['ENodeBFunction=1,PlmnAbConfProfile='] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'PlmnAbConfProfile': copy.deepcopy(tmp_mo_list)}}

        # DiffAdmCtrlFilteringProfile
        tmp_mo_list = []
        mos_ids = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('DiffAdmCtrlFilteringProfile')] if self.no_eq_change_with_dcgk_flag else []
        if self.site and self.eq_flag:
            for mo_fdn in self.site.find_mos_with_moc('DiffAdmCtrlFilteringProfile'):
                mos_ids.append(mo_fdn.split('=')[-1])
                tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('DiffAdmCtrlFilteringProfile', self.node, mo_fdn))
        for row in self.df_enb_cell.loc[(self.df_enb_cell.addcell & (~self.df_enb_cell.fdn.isna()))].itertuples():
            mo_fdn = self.get_ref_fdn_if_mo_para_has_ref_value(row.presite, row.fdn, 'diffAdmCtrlFilteringProfRef')
            if mo_fdn and mo_fdn.split('=')[-1] not in mos_ids:
                mos_ids.append(mo_fdn.split('=')[-1])
                tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('DiffAdmCtrlFilteringProfile', row.presite, mo_fdn))
        if len(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.freqband == '14')].index) > 0 and '1' not in mos_ids:
            tmp_dict = self.get_mo_dict_for_id_tag('DiffAdmCtrlFilteringProfile', '1')
            tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'diffAdmCtrlFilteringProfileId': '1'}
            tmp_mo_list.append(tmp_dict.copy())
        if len(tmp_mo_list) > 0:
            self.mo_dict['ENodeBFunction=1,AdmissionControl=1,DiffAdmCtrlFilteringProfile='] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'AdmissionControl': {'admissionControlId': '1',
                                                              'DiffAdmCtrlFilteringProfile': copy.deepcopy(tmp_mo_list)}}}
        if len(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.freqband == '14')].index) > 0:
            self.mo_dict['AdmissionControl=1_b14_para'] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'AdmissionControl': {
                    'attributes': {'xc:operation': 'update'}, 'admissionControlId': '1', 'dlAdmDifferentiationThr': '949',
                    'lbAtoThresholdLevel1': '55', 'lbAtoThresholdLevel2': '55', 'ulAdmDifferentiationThr': '949',
                    'diffAdmCtrlFilteringEnabled': 'true'}}}

        # MeasCellGroup
        tmp_mo_list = []
        mos_ids = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('MeasCellGroup')] if self.no_eq_change_with_dcgk_flag else []
        if self.site and self.eq_flag:
            for mo_fdn in self.site.find_mos_with_moc('MeasCellGroup'):
                mos_ids.append(mo_fdn.split('=')[-1])
                tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('MeasCellGroup', self.node, mo_fdn))
        for row in self.df_enb_cell.loc[(self.df_enb_cell.addcell & (~self.df_enb_cell.fdn.isna()))].itertuples():
            for ref in ['measCellGroupUeRef', 'measCellGroupCellRef']:
                if self.validate_empty_none_value(row.fdn) or self.validate_empty_none_value(
                        self.usid.sites.get(F'site_{row.presite}', None)): continue
                mo_fdns = self.usid.sites.get(F'site_{row.presite}').site_extract_data(row.fdn).get(ref, '')
                if self.validate_empty_none_value(mo_fdns) or len(mo_fdns) == 0: continue
                if type(mo_fdns) == str:
                    mo_fdn = self.usid.sites.get(F'site_{row.presite}').get_mo_w_end_str(mo_fdns)
                    if mo_fdn and mo_fdn.split('=')[-1] not in mos_ids:
                        mos_ids.append(mo_fdn.split('=')[-1])
                        tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('MeasCellGroup', row.presite, mo_fdn))
                elif type(mo_fdns) == list:
                    for mo_fdn in mo_fdns:
                        mo_fdn = self.usid.sites.get(F'site_{row.presite}').get_mo_w_end_str(mo_fdn)
                        if mo_fdn and mo_fdn.split('=')[-1] not in mos_ids:
                            mos_ids.append(mo_fdn.split('=')[-1])
                            tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('MeasCellGroup', row.presite, mo_fdn))
        if len(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.freqband == '14')].index) > 0 and '1' not in mos_ids:
            tmp_dict = self.get_mo_dict_for_id_tag('MeasCellGroup', '1')
            tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'measCellGroupId': '1'}
            # , 'groupPrbUnit': '5', 'plmnList': {'mcc': '313', 'mnc': '100', 'mncLength': '3'}
            tmp_mo_list.append(tmp_dict.copy())
        if len(tmp_mo_list) > 0:
            self.mo_dict['ENodeBFunction=1,MeasCellGroup='] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'MeasCellGroup': copy.deepcopy(tmp_mo_list)}}
        # PtmSubscriberGroup, PtmCellProfile
        mos_dict = {'ptmFunctionId': '1'}
        sub_group_dict = {
            '1': {'attributes': {'xc:operation': 'create'}, 'ptmSubscriberGroupId': '1',
                  'plmn': [{'mcc': '310', 'mnc': '410', 'mncLength': '3'}], 'spidList': ['-1', '3', '4']},
            '2': {'attributes': {'xc:operation': 'create'}, 'ptmSubscriberGroupId': '2',
                  'plmn': [{'mcc': '313', 'mnc': '100', 'mncLength': '3'}], 'spidList': ['2']},
            '3': {'attributes': {'xc:operation': 'create'}, 'ptmSubscriberGroupId': '3',
                  'plmn': [{'mcc': '313', 'mnc': '100', 'mncLength': '3'}], 'spidList': ['1']}
        }
        tmp_mo_list = []
        mos_ids = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('PtmSubscriberGroup')] if self.no_eq_change_with_dcgk_flag else []
        if self.site and self.eq_flag:
            for mo_fdn in self.site.find_mos_with_moc('PtmSubscriberGroup'):
                mos_ids.append(mo_fdn.split('=')[-1])
                tmp_mo_list.append(self.get_mo_dict_from_moc_node_fdn_moid('PtmSubscriberGroup', self.node, mo_fdn))
        if len(self.usid.df_enb_cell.loc[self.usid.df_enb_cell.freqband == '14'].index) > 0:
            for idss in ['1', '2', '3']:
                if idss not in mos_ids:  tmp_mo_list.append(sub_group_dict.get(idss).copy())
        mos_dict['PtmSubscriberGroup'] = copy.deepcopy(tmp_mo_list)

        # PtmCellProfile
        tmp_mo_list = []
        mos_ids = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('PtmCellProfile')] if self.no_eq_change_with_dcgk_flag else []
        if self.site and self.eq_flag:
            for mo_fdn in self.site.find_mos_with_moc('PtmCellProfile'):
                mos_ids.append(mo_fdn.split('=')[-1])
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('PtmCellProfile', self.node, mo_fdn)
                for moc in ['PtmAtoConfig', 'PtmIflbConfig', 'PtmIfoConfig', 'PtmResOpUseConfig', 'PtmStmConfig']:
                    tmp_dict_c = self.get_mo_dict_from_moc_node_fdn_moid(moc, self.node, F'{mo_fdn},{moc}=1', '1')
                    tmp_dict_c |= {'attributes': {'xc:operation': 'update'}}
                    if moc not in tmp_dict.keys(): tmp_dict[moc] = [copy.deepcopy(tmp_dict_c)]
                    else: tmp_dict[moc].append(tmp_dict_c.copy())
                tmp_mo_list.append(tmp_dict.copy())
        if len(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.freqband == '14')].index) > 0:
            if '1' not in mos_ids:
                tmp_mo_list.append({'attributes': {'xc:operation': 'create'}, 'ptmCellProfileId': '1', 'cellType': '0 (PRIORITY)'})
            if '2' not in mos_ids:
                tmp_mo_list.append({'attributes': {'xc:operation': 'create'}, 'ptmCellProfileId': '2', 'cellType': '1 (NON_PRIORITY)'})
        mos_dict['PtmCellProfile'] = copy.deepcopy(tmp_mo_list)
        self.mo_dict['ENodeBFunction=1,PtmFunction=aaaa'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'PtmFunction': copy.deepcopy(mos_dict)}}

        # RATFreqPrio
        tmp_dict = {'subscriberProfileIDId': '1', 'HoWhiteList': [], 'RATFreqPrio': []}
        child_dict = {'HoWhiteList': [], 'RATFreqPrio': []}
        mos_ids = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('SubscriberProfileID')] if self.no_eq_change_with_dcgk_flag else []
        child_dict['HoWhiteList'] = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('HoWhiteList')] if self.no_eq_change_with_dcgk_flag else []
        child_dict['RATFreqPrio'] = [_.split("=")[-1] for _ in self.site.find_mos_with_moc('RATFreqPrio')] if self.no_eq_change_with_dcgk_flag else []
        if self.site and self.eq_flag:
            for mo_fdn in self.site.find_mos_with_moc('SubscriberProfileID'):
                if '1' not in mo_fdn.split('=')[-1]: continue
                mos_ids.append(mo_fdn.split('=')[-1])
                tmp_dict |= self.get_mo_dict_from_moc_node_fdn_moid('SubscriberProfileID', self.node, mo_fdn)
                for moc in ['HoWhiteList', 'RATFreqPrio']:
                    for mo_fdn_c in self.site.find_mo_ending_with_parent_str(moc, mo_fdn):
                        child_dict[moc].append(mo_fdn_c.split('=')[-1])
                        tmp_dict[moc].append(self.get_mo_dict_from_moc_node_fdn_moid(moc, self.node, mo_fdn_c))
        if self.node[-1].upper() != 'L':
            if '1' not in mos_ids: tmp_dict |= self.get_mo_dict_from_moc_node_fdn_moid('SubscriberProfileID', self.node, '', '1')
            if '1' not in child_dict['HoWhiteList']:
                tmp_dict['HoWhiteList'] = self.get_mo_dict_from_moc_node_fdn_moid('HoWhiteList', self.node, '', '1')
            ratfreqprio_1 = {
                'attributes': {'xc:operation': 'create'}, 'rATFreqPrioId': '1', 't320': '30', 'ueCapPrioAllowed': 'false', 'spidList': ['1'],
                'bandClassPrioListCDMA1xRtt': [], 'bandClassPrioListCDMA2000': [],
                'freqPrioListEUTRA': [],
                'freqGroupPrioListGERAN': [{
                    'altCsfbTargetPrio': '-1000', 'altCsfbTargetPrioEc': '-1000', 'bandIndicatorGERAN': '0 (DCS_1800)',
                    'cellReselectionPriority': '-1000', 'connectedModeMobilityPrio': '-1000', 'csFallbackPrio': '-1000', 'csFallbackPrioEC': '-1000',
                    'frequencyGroupId': '-1000', 'voicePrio': '-1000'
                }],
                'freqPrioListUTRA': [{
                    'altCsfbTargetPrio': '-1000', 'altCsfbTargetPrioEc': '-1000', 'arfcnValueUtranDl': '-1000', 'atoAllowed': 'false',
                    'cellReselectionPriority': '-1000', 'connectedModeMobilityPrio': '-1000', 'csFallbackPrio': '-1000', 'csFallbackPrioEC': '-1000',
                    'loadBalancingAllowed': 'false', 'voicePrio': '-1000'
                }]
            }
            ratfreqprio_2 = copy.deepcopy(ratfreqprio_1)
            ratfreqprio_2 |= {'rATFreqPrioId': '2', 't320': '30', 'ueCapPrioAllowed': 'false', 'spidList': ['2']}
            ratfreqprio_33 = copy.deepcopy(ratfreqprio_2)
            ratfreqprio_33 |= {'rATFreqPrioId': '33', 't320': '30', 'ueCapPrioAllowed': 'false', 'spidList': ['33']}
            ratfreqprio_3 = copy.deepcopy(ratfreqprio_33)
            ratfreqprio_3 |= {'rATFreqPrioId': '3', 't320': '30', 'ueCapPrioAllowed': 'true', 'spidList': ['3']}
            ratfreqprio_4 = copy.deepcopy(ratfreqprio_3)
            ratfreqprio_4 |= {'rATFreqPrioId': '4', 't320': '30', 'ueCapPrioAllowed': 'true', 'spidList': ['4']}
            ratfreqprio_dict = {'1': ratfreqprio_1, '2': ratfreqprio_2, '33': ratfreqprio_33, '3': ratfreqprio_3, '4': ratfreqprio_4}
            for i in ['1', '2']:
                if i not in child_dict['RATFreqPrio']: tmp_dict['RATFreqPrio'].append(ratfreqprio_dict.get(i, {}).copy())
            if len(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.freqband.isin(['14', '30']))].index) > 0:
                for i in ['33', '3', '4']:
                    if i not in child_dict['RATFreqPrio']: tmp_dict['RATFreqPrio'].append(ratfreqprio_dict.get(i, {}).copy())
        self.mo_dict['ENodeBFunction=1,SubscriberProfileID=111111'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'SubscriberProfileID': copy.deepcopy(tmp_dict)}}

    def get_ref_fdn_if_mo_para_has_ref_value(self, node, mo, para):
        if self.validate_empty_none_value(mo) or self.validate_empty_none_value(self.usid.sites.get(F'site_{node}', None)): return None
        mo_ldn = self.usid.sites.get(F'site_{node}').site_extract_data(mo).get(para, '')
        if self.validate_empty_none_value(mo_ldn) or len(mo_ldn) == 0: return None
        else: return self.usid.sites.get(F'site_{node}').get_mo_w_end_str(mo_ldn)
