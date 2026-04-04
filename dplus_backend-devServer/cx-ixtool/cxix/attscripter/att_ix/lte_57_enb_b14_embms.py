import copy
from .att_xml_base import att_xml_base


class lte_57_enb_b14_embms(att_xml_base):
    def create_rpc_msg(self):
        self.motype = 'Lrat'
        b14_usid = len(self.usid.df_enb_cell.loc[self.usid.df_enb_cell.freqband == '14'].index) > 0
        if (not b14_usid): return
        b14_site = len(self.df_enb_cell.loc[((self.df_enb_cell.freqband == '14') & (self.df_enb_cell.addcell) &
                                             (~(self.df_enb_cell.fdn.isna())))].index) > 0
        if (not b14_site): return
        embms_flag, mce = False, []
        for row in self.df_enb_cell.loc[((self.df_enb_cell.freqband == '14') & (self.df_enb_cell.addcell) &
                                         (~(self.df_enb_cell.fdn.isna())))].itertuples():
            self.pre_site = self.usid.sites.get(F'site_{row.presite}')
            if len(self.pre_site.find_mo_ending_with_parent_str('MceFunction', '')) == 0: continue
            else:
                mce = self.pre_site.find_mo_ending_with_parent_str('MceFunction', '')[0]
                m3 = self.pre_site.find_mo_ending_with_parent_str('TermPointToMmeM3', mce)
                if len(m3) > 0: embms_flag = True; break
        if not embms_flag: return
        # MceFunction
        self.enb_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'MceFunction': {}, 'Mbms': []}}
        tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('MceFunction', self.pre_site.node, mce, mce.split('=')[-1])
        tmp_dict['TermPointToMmeM3'] = []
        for mo in m3:
            tmp_dict['TermPointToMmeM3'].append(
                self.get_mo_dict_from_moc_node_fdn_moid('TermPointToMmeM3', self.pre_site.node, mo, mo.split('=')[-1]))
        self.enb_dict['MceFunction'] = copy.deepcopy(tmp_dict)
        # Mbms
        for mo in self.pre_site.find_mo_ending_with_parent_str('Mbms', self.usid.enodeb.get(self.pre_site.node, {}).get('Lrat', '')):
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('Mbms', self.pre_site.node, mo, mo.split('=')[-1])
            # lte_access = F'ManagedElement=1,Transport=1,Router={node["lte"]},InterfaceIPv6={node["lte_interface"]},AddressIPv6={node["lte_add"]}'
            tmp_dict['m1IpInterfaceRef'] = F'Transport=1,Router={self.enbdata["lte"]},InterfaceIPv6={self.enbdata["lte_interface"]}'
            tmp_dict['MbsfnArea'] = []
            for mo1 in self.pre_site.find_mo_ending_with_parent_str('MbsfnArea', mo):
                tmp_dict_1 = self.get_mo_dict_from_moc_node_fdn_moid('MbsfnArea', self.pre_site.node, mo1, mo1.split('=')[-1])
                if 'commonSFAllocList' in tmp_dict_1.keys():
                    if type(tmp_dict_1['commonSFAllocList']) is list:
                        for mo3 in range(len(tmp_dict_1['commonSFAllocList'])):
                            for mo2 in ['subframeAllocationFourFrame', 'subframeAllocationOneFrame']:
                                if mo2 in tmp_dict_1['commonSFAllocList'][mo3].keys(): del tmp_dict_1['commonSFAllocList'][mo3][mo2]
                    elif type(tmp_dict_1['commonSFAllocList']) is dict:
                        for mo2 in ['subframeAllocationFourFrame', 'subframeAllocationOneFrame']:
                            if mo2 in tmp_dict_1['commonSFAllocList'].keys(): del tmp_dict_1['commonSFAllocList'][mo2]
                tmp_dict_1['PmchMch'] = []
                for mo2 in self.pre_site.find_mo_ending_with_parent_str('PmchMch', mo1):
                    tmp_dict_2 = self.get_mo_dict_from_moc_node_fdn_moid('PmchMch', self.pre_site.node, mo2, mo2.split('=')[-1])
                    tmp_dict_2['MbmsService'] = []
                    for mo3 in self.pre_site.find_mo_ending_with_parent_str('MbmsService', mo2):
                        tmp_dict_2['MbmsService'].append(self.get_mo_dict_from_moc_node_fdn_moid(
                            'MbmsService', self.pre_site.node, mo3, mo3.split('=')[-1]))
                    tmp_dict_1['PmchMch'].append(tmp_dict_2.copy())
                tmp_dict_1['MbsfnAreaCellRelation'] = []
                for mo2 in self.pre_site.find_mo_ending_with_parent_str('MbsfnAreaCellRelation', mo1):
                    if mo2.split('=')[-1] in self.df_enb_cell.precell.unique():
                        post_cell = self.df_enb_cell.loc[self.df_enb_cell.precell == mo2.split('=')[-1]].postcell.iloc[0]
                        tmp_dict_1['MbsfnAreaCellRelation'].append(self.get_mo_dict_from_moc_node_fdn_moid(
                            'MbsfnAreaCellRelation', self.pre_site.node, mo2, post_cell))
                tmp_dict['MbsfnArea'].append(tmp_dict_1.copy())
            self.enb_dict['ENodeBFunction']['Mbms'].append(tmp_dict.copy())
        self.mo_dict['embms'] = copy.deepcopy(self.enb_dict)
        # FeatureState --- 'CXC4011365', 'CXC4011555', 'CXC4011558', 'CXC4011618', 'CXC4012012'
        tmp_dict = []
        for feature in ['CXC4011365', 'CXC4011555', 'CXC4011558', 'CXC4011618', 'CXC4012012']:
            if len(self.pre_site.get_mos_w_end_str(F'SystemFunctions=1,Lm=1,FeatureState={feature}')) > 0:
                if self.pre_site.dcg.get(self.pre_site.get_mos_w_end_str(F'SystemFunctions=1,Lm=1,FeatureState={feature}')
                                         [0]).get('featureState', '') == '1 (ACTIVATED)':
                    tmp_dict.append({'attributes': {'xc:operation': 'update'}, 'featureStateId': feature, 'featureState': '1 (ACTIVATED)'})
        if len(tmp_dict) > 0:
            self.mo_dict['feature'] = {'managedElementId': self.node, 'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {
                'lmId': '1', 'FeatureState': copy.deepcopy(tmp_dict)}}}
        # NodeSupport=1,TimeSettings=1 --- gpsToUtcLeapSeconds
        if len(self.pre_site.get_mos_w_end_str(F'NodeSupport=1,TimeSettings=1')) > 0:
            self.mo_dict['gpsToUtcLeapSeconds'] = {'managedElementId': self.node, 'NodeSupport': {'nodeSupportId': '1', 'TimeSettings': {
                'attributes': {'xc:operation': 'update'}, 'timeSettingsId': '1', 'gpsToUtcLeapSeconds':
                    self.pre_site.dcg.get(self.pre_site.get_mos_w_end_str(F'NodeSupport=1,TimeSettings=1')[0]).get('gpsToUtcLeapSeconds', '')}}}
