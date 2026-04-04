import copy

from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_05b_gNB_Parameter(tmo_xml_base):
    def initialize_var(self):
        if self.gnbdata.get('nodefunc') is None or self.gnbdata.get('equ_change', False):
            self.script_elements.extend([self.rcp_msg_capabilities()] + self.create_rpc_msg() + [self.rcp_msg_close()])

    def create_rpc_msg(self):
        msgs = []
        self.motype = 'GNBCUCP'
       
        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['IntraFreqMC'] = self.get_mo_dict_for_id_tag('IntraFreqMC', '1')
        cucp_mo['IntraFreqMC']['IntraFreqMCCellProfile'] = self.get_mo_dict_for_id_tag('IntraFreqMCCellProfile', 'Default')
        cucp_mo['IntraFreqMC']['IntraFreqMCCellProfile']['IntraFreqMCCellProfileUeCfg'] = \
            self.get_mo_dict_for_id_tag('IntraFreqMCCellProfileUeCfg', 'Base')
        cucp_mo['IntraFreqMC']['IntraFreqMCFreqRelProfile'] = self.get_mo_dict_for_id_tag('IntraFreqMCFreqRelProfile', 'Default')
        cucp_mo['IntraFreqMC']['IntraFreqMCFreqRelProfile']['IntraFreqMCFreqRelProfileUeCfg'] = \
            self.get_mo_dict_for_id_tag('IntraFreqMCFreqRelProfileUeCfg', 'Base')
        doc, config = self.main_rcp_msg_start('gnbcucp_intrafreqmc')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['Mcfb'] = self.get_mo_dict_for_id_tag('Mcfb', '1')
        cucp_mo['Mcfb']['McfbCellProfile'] = self.get_mo_dict_for_id_tag('McfbCellProfile', 'Default')
        cucp_mo['Mcfb']['McfbCellProfile']['McfbCellProfileUeCfg'] = self.get_mo_dict_for_id_tag('McfbCellProfileUeCfg', 'Base')
        doc, config = self.main_rcp_msg_start('gnbcucp_mcfb')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['Mcpc'] = self.get_mo_dict_for_id_tag('Mcpc', '1')
        cucp_mo['Mcpc']['McpcPCellEUtranFreqRelProfile'] = self.get_mo_dict_for_id_tag('McpcPCellEUtranFreqRelProfile', 'Default')
        cucp_mo['Mcpc']['McpcPCellEUtranFreqRelProfile']['McpcPCellEUtranFreqRelProfileUeCfg'] = \
            self.get_mo_dict_for_id_tag('McpcPCellEUtranFreqRelProfileUeCfg', 'Base')
        cucp_mo['Mcpc']['McpcPCellNrFreqRelProfile'] = self.get_mo_dict_for_id_tag('McpcPCellNrFreqRelProfile', 'Default')
        cucp_mo['Mcpc']['McpcPCellNrFreqRelProfile']['McpcPCellNrFreqRelProfileUeCfg'] = \
            self.get_mo_dict_for_id_tag('McpcPCellNrFreqRelProfileUeCfg', 'Base')
        cucp_mo['Mcpc']['McpcPCellProfile'] = self.get_mo_dict_for_id_tag('McpcPCellProfile', 'Default')
        cucp_mo['Mcpc']['McpcPCellProfile']['McpcPCellProfileUeCfg'] = self.get_mo_dict_for_id_tag('McpcPCellProfileUeCfg', 'Base')
        cucp_mo['Mcpc']['McpcPSCellNrFreqRelProfile'] = self.get_mo_dict_for_id_tag('McpcPSCellNrFreqRelProfile', 'Default')
        cucp_mo['Mcpc']['McpcPSCellNrFreqRelProfile']['McpcPSCellNrFreqRelProfileUeCfg'] = \
            self.get_mo_dict_for_id_tag('McpcPSCellNrFreqRelProfileUeCfg', 'Base')
        tmp_mo_p_a1 = self.get_mo_dict_for_id_tag('McpcPSCellProfile', '1')
        tmp_mo_p_a2 = self.get_mo_dict_for_id_tag('McpcPSCellProfile', 'Default')
        tmp_mo_p_a1['McpcPSCellProfileUeCfg'] = self.get_mo_dict_for_id_tag('McpcPSCellProfileUeCfg', 'Base')
        tmp_mo_p_a2['McpcPSCellProfileUeCfg'] = self.get_mo_dict_for_id_tag('McpcPSCellProfileUeCfg', 'Base')
        tmp_mo_p_a2['McpcPSCellProfileUeCfg'].update({'rsrpCriticalEnabled': 'false'})
        cucp_mo['Mcpc']['McpcPSCellProfile'] = [tmp_mo_p_a1.copy(), tmp_mo_p_a2.copy()]
        doc, config = self.main_rcp_msg_start('gnbcucp_mcpc')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['Mdt'] = self.get_mo_dict_for_id_tag('Mdt', '1')
        cucp_mo['Mdt']['MdtCellProfile'] = self.get_mo_dict_for_id_tag('MdtCellProfile', 'Default')
        cucp_mo['Mdt']['MdtCellProfile']['MdtCellProfileUeCfg'] = self.get_mo_dict_for_id_tag('MdtCellProfileUeCfg', 'Base')
        doc, config = self.main_rcp_msg_start('gnbcucp_mdt')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['NrdcControl'] = self.get_mo_dict_for_id_tag('NrdcControl', '1')
        cucp_mo['NrdcControl']['NrdcMnCellProfile'] = self.get_mo_dict_for_id_tag('NrdcMnCellProfile', 'Default')
        cucp_mo['NrdcControl']['NrdcMnCellProfile']['NrdcMnCellProfileUeCfg'] = self.get_mo_dict_for_id_tag('NrdcMnCellProfileUeCfg', 'Base')
        doc, config = self.main_rcp_msg_start('gnbcucp_nrdccontrol')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['NrdcSnTermination'] = self.get_mo_dict_for_id_tag('NrdcSnTermination', 'SnTerminationProhibited')
        cucp_mo['NrdcSnTermination']['NrdcSnTerminationUeCfg'] = self.get_mo_dict_for_id_tag('NrdcSnTerminationUeCfg', 'Base')
        doc, config = self.main_rcp_msg_start('gnbcucp_nrdcsntermination')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['QciProfileEndcConfigExt'] = self.get_mo_dict_for_id_tag('QciProfileEndcConfigExt', '1')
        cucp_mo['SecurityHandling'] = self.get_mo_dict_for_id_tag('SecurityHandling', '1')
        doc, config = self.main_rcp_msg_start('qciprofileendcconfigext_securityhandling')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['TrafficSteering'] = self.get_mo_dict_for_id_tag('TrafficSteering', '1')
        cucp_mo['TrafficSteering']['TrStPSCellProfile'] = self.get_mo_dict_for_id_tag('TrStPSCellProfile', 'Default')
        cucp_mo['TrafficSteering']['TrStPSCellProfile']['TrStPSCellProfileUeCfg'] = self.get_mo_dict_for_id_tag('TrStPSCellProfileUeCfg', 'Base')
        cucp_mo['TrafficSteering']['TrStSaCellProfile'] = self.get_mo_dict_for_id_tag('TrStSaCellProfile', 'Default')
        cucp_mo['TrafficSteering']['TrStSaCellProfile']['TrStSaCellProfileUeCfg'] = self.get_mo_dict_for_id_tag('TrStSaCellProfileUeCfg', 'Base')
        cucp_mo['TrafficSteering']['TrStSaNrFreqRelProfile'] = self.get_mo_dict_for_id_tag('TrStSaNrFreqRelProfile', 'Default')
        cucp_mo['TrafficSteering']['TrStSaNrFreqRelProfile']['TrStSaNrFreqRelProfileUeCfg'] = self.get_mo_dict_for_id_tag('TrStSaNrFreqRelProfileUeCfg', 'Base')
        doc, config = self.main_rcp_msg_start('gnbcucp_trafficsteering')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['UeCC'] = self.get_mo_dict_for_id_tag('UeCC', '1')
        cucp_mo['UeCC']['CapabilityHandling'] = self.get_mo_dict_for_id_tag('CapabilityHandling', '1')
        cucp_mo['UeCC']['CapabilityHandling']['CapabilityHandlingUeCfg'] = self.get_mo_dict_for_id_tag('CapabilityHandlingUeCfg', 'Base')
        cucp_mo['UeCC']['InactivityProfile'] = self.get_mo_dict_for_id_tag('InactivityProfile', 'Default')
        cucp_mo['UeCC']['InactivityProfile']['InactivityProfileUeCfg'] = [self.get_mo_dict_for_id_tag('InactivityProfileUeCfg', 'Base'),
                                                                          self.get_mo_dict_for_id_tag('InactivityProfileUeCfg', '1')]
        cucp_mo['UeCC']['Rohc'] = self.get_mo_dict_for_id_tag('Rohc', '1')
        cucp_mo['UeCC']['Rohc']['RohcUeCfg'] = self.get_mo_dict_for_id_tag('RohcUeCfg', 'Base')

        cucp_mo['UeCC']['Rrc'] = self.get_mo_dict_for_id_tag('Rrc', '1')
        cucp_mo['UeCC']['Rrc']['RrcUeCfg'] = self.get_mo_dict_for_id_tag('RrcUeCfg', 'Base')
        cucp_mo['UeCC']['RrcInactiveProfile'] = self.get_mo_dict_for_id_tag('RrcInactiveProfile', 'Default')
        cucp_mo['UeCC']['RrcInactiveProfile']['RrcInactiveProfileUeCfg'] = self.get_mo_dict_for_id_tag('RrcInactiveProfileUeCfg', 'Base')
        cucp_mo['UeCC']['UaiProfile'] = self.get_mo_dict_for_id_tag('UaiProfile', 'Default')
        cucp_mo['UeCC']['UaiProfile']['UaiProfileUeCfg'] = self.get_mo_dict_for_id_tag('UaiProfileUeCfg', 'Base')
        doc, config = self.main_rcp_msg_start('gnbcucp_uecc')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['UeGroupSelection'] = self.get_mo_dict_for_id_tag('UeGroupSelection', '1')
        cucp_mo['UeGroupSelection']['UeGroupSelectionProfile'] = [
            self.get_mo_dict_for_id_tag('UeGroupSelectionProfile', '14'), self.get_mo_dict_for_id_tag('UeGroupSelectionProfile', '2'),
            self.get_mo_dict_for_id_tag('UeGroupSelectionProfile', 'GalaxyA53'), self.get_mo_dict_for_id_tag('UeGroupSelectionProfile', 'HSI'),
            self.get_mo_dict_for_id_tag('UeGroupSelectionProfile', 'VoNR'),
        ]
        doc, config = self.main_rcp_msg_start('gnbcucp_uegroupselection')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        for aa in doc.getElementsByTagName("selectionCriteria"):
            aa.firstChild.nodeValue = str(aa.firstChild.nodeValue).replace(F'ManagedElement={self.node},', '')
        msgs.append(doc)

        cucp_mo = {'gNBCUCPFunctionId': '1'}
        cucp_mo['UeMC'] = self.get_mo_dict_for_id_tag('UeMC', '1')
        cucp_mo['UeMC']['UeMCCellProfile'] = self.get_mo_dict_for_id_tag('UeMCCellProfile', 'Default')
        cucp_mo['UeMC']['UeMCEUtranFreqRelProfile'] = self.get_mo_dict_for_id_tag('UeMCEUtranFreqRelProfile', 'Default')
        cucp_mo['UeMC']['UeMCEUtranFreqRelProfile']['UeMCEUtranFreqRelProfileUeCfg'] = self.get_mo_dict_for_id_tag('UeMCEUtranFreqRelProfileUeCfg', 'Base')
        cucp_mo['UeMC']['UeMCNrFreqRelProfile'] = self.get_mo_dict_for_id_tag('UeMCNrFreqRelProfile', 'Default')
        cucp_mo['UeMC']['UeMCNrFreqRelProfile']['UeMCNrFreqRelProfileUeCfg'] = self.get_mo_dict_for_id_tag('UeMCNrFreqRelProfileUeCfg', 'Base')
        doc, config = self.main_rcp_msg_start('gnbcucp_uemc')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node, 'GNBCUCPFunction': cucp_mo}, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(doc)

        # DU5qiTable, DU5qi, CUCP5qiTable, CUCP5qi, CUUP5qiTable, CUUP5qi --- 2 --- for SA, NSA
        if len(self.df_gnb_cell.loc[((self.df_gnb_cell.postcell.str.startswith('A', na=False)) |
                                     (self.df_gnb_cell.postcell.str.startswith('J', na=False)))].index) > 0:
            msgs.extend(self.get_mo_dict_for_5qiTable_anchor_site())
        return msgs

    def get_mo_dict_for_id_tag(self, moc, moid, prev_site=None, parent=''):
        if (prev_site is not None) & (self.usid.sites.get(F'site_{self.usid.site_name_dict.get(prev_site, prev_site)}') is not None):
            site = self.usid.sites.get(F'site_{self.usid.site_name_dict.get(prev_site, prev_site)}')
            mo = site.find_mo_ending_with_parent_str_with_id(moc, moid, parent)
            if len(mo) > 0:
                mo = mo[0]
                tmp_dict = self.update_db_attr_with_mo_data(moc, site, mo)
            else: tmp_dict = self.get_mo_attributes(moc, moid)
        else: tmp_dict = self.get_mo_attributes(moc, moid)
        tmp_dict.update({self.lower_first_char(moc) + 'Id': moid})
        return tmp_dict

    def get_mo_dict_for_5qiTable_anchor_site(self):
        # CUUP5qiTable, CUUP5qi, DU5qiTable, DU5qi, CUCP5qiTable, CUCP5qi  --- 2 --- for SA, NSA
        msgs = []

        self.motype = 'GNBCUUP'
        mo_dict = {'managedElementId': self.node, 'GNBCUUPFunction': {'gNBCUUPFunctionId': '1'}}
        mo_dict['GNBCUUPFunction']['CUUP5qiTable'] = self.get_mo_dict_for_id_tag('CUUP5qiTable', '1')
        mo_dict['GNBCUUPFunction']['CUUP5qiTable'].update({'cUUP5qiTableId': '2', 'default5qiTable': 'false'})
        mo_dict['GNBCUUPFunction']['CUUP5qiTable']['CUUP5qi'] = []
        for i in range(1, 10):
            mo_dict['GNBCUUPFunction']['CUUP5qiTable']['CUUP5qi'].append(self.get_mo_dict_for_id_tag('CUUP5qi', str(i)))
        mo_dict['GNBCUUPFunction']['ResourcePartitions'] = self.get_mo_dict_for_id_tag('ResourcePartitions', '1')
        mo_dict['GNBCUUPFunction']['ResourcePartitions']['ResourcePartition'] = []
        mo_1 = self.get_mo_dict_for_id_tag('ResourcePartition', 'NSA')
        mo_1['ResourcePartitionMember'] = self.get_mo_dict_for_id_tag('ResourcePartitionMember', '_NSA_1')
        mo_1['ResourcePartitionMember']['resourcePartitionMemberId'] = '1'
        mo_dict['GNBCUUPFunction']['ResourcePartitions']['ResourcePartition'].append(copy.deepcopy(mo_1))
        mo_1 = self.get_mo_dict_for_id_tag('ResourcePartition', 'SA')
        mo_1['ResourcePartitionMember'] = self.get_mo_dict_for_id_tag('ResourcePartitionMember', '_SA_1')
        mo_1['ResourcePartitionMember']['resourcePartitionMemberId'] = '1'
        mo_dict['GNBCUUPFunction']['ResourcePartitions']['ResourcePartition'].append(copy.deepcopy(mo_1))
        doc, config = self.main_rcp_msg_start('gnbcuup_5qitable_2_for_anchor')
        me_mo = self.mo_add_form_dict_xml(mo_dict, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(copy.deepcopy(doc))

        self.motype = 'GNBDU'
        mo_dict = {'managedElementId': self.node, 'GNBDUFunction': {'gNBDUFunctionId': '1'}}
        mo_dict['GNBDUFunction']['DU5qiTable'] = self.get_mo_dict_for_id_tag('DU5qiTable', '1')
        mo_dict['GNBDUFunction']['DU5qiTable'].update({'dU5qiTableId': '2', 'default5qiTable': 'false'})
        mo_dict['GNBDUFunction']['DU5qiTable']['DU5qi'] = []
        for i in range(1, 10):
            mo_dict['GNBDUFunction']['DU5qiTable']['DU5qi'].append(self.get_mo_dict_for_id_tag('DU5qi', str(i)))
        mo_dict['GNBDUFunction']['ResourcePartitions'] = self.get_mo_dict_for_id_tag('ResourcePartitions', '1')
        mo_dict['GNBDUFunction']['ResourcePartitions']['ResourcePartition'] = []
        mo_1 = self.get_mo_dict_for_id_tag('ResourcePartition', 'NSA')
        mo_1['ResourcePartitionMember'] = self.get_mo_dict_for_id_tag('ResourcePartitionMember', '_NSA_1')
        mo_1['ResourcePartitionMember']['resourcePartitionMemberId'] = '1'
        mo_dict['GNBDUFunction']['ResourcePartitions']['ResourcePartition'].append(copy.deepcopy(mo_1))
        mo_1 = self.get_mo_dict_for_id_tag('ResourcePartition', 'SA')
        mo_1['ResourcePartitionMember'] = self.get_mo_dict_for_id_tag('ResourcePartitionMember', '_SA_1')
        mo_1['ResourcePartitionMember']['resourcePartitionMemberId'] = '1'
        mo_dict['GNBDUFunction']['ResourcePartitions']['ResourcePartition'].append(copy.deepcopy(mo_1))
        doc, config = self.main_rcp_msg_start('gnbdu_5qitable_2_for_anchor')
        me_mo = self.mo_add_form_dict_xml(mo_dict, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(copy.deepcopy(doc))

        self.motype = 'GNBCUCP'
        mo_dict = {'managedElementId': self.node, 'GNBCUCPFunction': {'gNBCUCPFunctionId': '1'}}
        mo_dict['GNBCUCPFunction']['CUCP5qiTable'] = self.get_mo_dict_for_id_tag('CUCP5qiTable', '1')
        mo_dict['GNBCUCPFunction']['CUCP5qiTable'].update({'cUCP5qiTableId': '2', 'default5qiTable': 'false'})
        mo_dict['GNBCUCPFunction']['CUCP5qiTable']['CUCP5qi'] = []
        for i in range(1, 10):
            mo_dict['GNBCUCPFunction']['CUCP5qiTable']['CUCP5qi'].append(self.get_mo_dict_for_id_tag('CUCP5qi', str(i)))
        mo_dict['GNBCUCPFunction']['ResourcePartitions'] = self.get_mo_dict_for_id_tag('ResourcePartitions', '1')
        mo_dict['GNBCUCPFunction']['ResourcePartitions']['ResourcePartition'] = []
        mo_1 = self.get_mo_dict_for_id_tag('ResourcePartition', 'NSA')
        mo_1['ResourcePartitionMember'] = self.get_mo_dict_for_id_tag('ResourcePartitionMember', '_NSA_1')
        mo_1['ResourcePartitionMember']['resourcePartitionMemberId'] = '1'
        mo_dict['GNBCUCPFunction']['ResourcePartitions']['ResourcePartition'].append(copy.deepcopy(mo_1))
        mo_1 = self.get_mo_dict_for_id_tag('ResourcePartition', 'SA')
        mo_1['ResourcePartitionMember'] = self.get_mo_dict_for_id_tag('ResourcePartitionMember', '_SA_1')
        mo_1['ResourcePartitionMember']['resourcePartitionMemberId'] = '1'
        mo_dict['GNBCUCPFunction']['ResourcePartitions']['ResourcePartition'].append(copy.deepcopy(mo_1))
        doc, config = self.main_rcp_msg_start('gnbcucp_5qitable_2_for_anchor')
        me_mo = self.mo_add_form_dict_xml(mo_dict, 'ManagedElement')
        config.appendChild(me_mo)
        msgs.append(copy.deepcopy(doc))

        return msgs

    def special_formate_scripts(self):
        import fileinput
        import sys
        import os
        def replace_mathod(file, searchExp, replaceExp):
            for line in fileinput.input(file, inplace=1):
                if 'selectionCriteria' in line: line = line.replace(searchExp, replaceExp)
                sys.stdout.write(line)
        if os.path.exists(self.script_file) and os.path.isfile(self.script_file):
            replace_mathod(self.script_file, '&gt;', '>')
