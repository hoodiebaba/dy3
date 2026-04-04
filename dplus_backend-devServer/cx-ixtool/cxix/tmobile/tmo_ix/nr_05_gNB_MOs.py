import copy

from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base
import numpy as np


class nr_05_gNB_MOs(tmo_xml_base):
    def initialize_var(self):
        if self.gnbdata.get('nodefunc', '') is None or self.gnbdata.get('equ_change', False):
            self.script_elements.extend([self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()])

    def create_rpc_msg(self):
        doc, config = self.main_rcp_msg_start('gnb_mos')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node}, 'ManagedElement')
        config.appendChild(me_mo)

        # GNBCUCPFunction
        self.custom_moc = ['CUCP5qiTable', 'UeGroupSelection', 'ResourcePartitions']
        cucp_mo = self.mo_add_form_dict_xml({'gNBCUCPFunctionId': '1'}, 'GNBCUCPFunction')
        me_mo.appendChild(cucp_mo)
        self.motype = 'GNBCUCP'
        self.default_mocs = ['IntraFreqMC', ]
        childs = self.MoRelation.objects.filter(parent='GNBCUCPFunction', tag=self.motype, software=self.client.software)
        for child in childs:
            mos = self.db_append_child_tags(child.child, rel_tag=self.motype)
            for mo in mos: cucp_mo.appendChild(mo)
        moc_dict = {
            'CUCP5qiTable': {'id': ['1', 'SD_2000', 'SD_3000', 'SD_4000', 'SD_6000', 'SD_7000', 'SD_8000', 'SD_9000'],
                             'CUCP5qi': {'id': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '128']}},
            'UeGroupSelection': {'id': ['1'], 'UeGroupSelectionProfile': {'id': ['14', '2', 'GalaxyA53', 'HSI', 'VoNR']}},
            'ResourcePartitions': {'id': ['1'], 'ResourcePartition': {'id': ['FWA', 'SA', 'SD_2000', 'SD_3000', 'SD_4000', 'SD_6000', 'SD_8000'],
                                                                      'ResourcePartitionMember': {'id': ['1']}}},
        }
        if self.df_gnb_cell.loc[(self.df_gnb_cell.postcell.str.contains('^A'))].shape[0] > 0:
            moc_dict['CUCP5qiTable']['id'].append('2')
            moc_dict['UeGroupSelection']['UeServiceGroupDefinition'] = {'id': ['1', '2', '3']}
            moc_dict['ResourcePartitions']['ResourcePartition']['id'].append('NSA')
        for mo in self.db_appnd_child_special_finction(moc_dict=moc_dict): cucp_mo.appendChild(mo)

        # GNBCUUPFunction
        self.custom_moc = ['CUUP5qiTable', 'ResourcePartitions']
        cuup_mo = self.mo_add_form_dict_xml({'gNBCUUPFunctionId': '1'}, 'GNBCUUPFunction')
        me_mo.appendChild(cuup_mo)
        self.motype = 'GNBCUUP'
        childs = self.MoRelation.objects.filter(parent='GNBCUUPFunction', tag=self.motype, software=self.client.software)
        for child in childs:
            mos = self.db_append_child_tags(child.child, rel_tag=self.motype)
            for mo in mos: cuup_mo.appendChild(mo)

        moc_dict = {
            'CUUP5qiTable': {'id': ['1', 'SD_2000', 'SD_3000', 'SD_4000', 'SD_6000', 'SD_7000', 'SD_8000', 'SD_9000'],
                             'CUUP5qi': {'id': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '128']}},
            'ResourcePartitions': {'id': ['1'], 'ResourcePartition': {'id': ['FWA', 'SA', 'SD_2000', 'SD_3000', 'SD_4000', 'SD_6000', 'SD_8000'],
                                                                      'ResourcePartitionMember': {'id': ['1']}}},
        }
        if self.df_gnb_cell.loc[(self.df_gnb_cell.postcell.str.contains('^A'))].shape[0] > 0:
            moc_dict['CUUP5qiTable']['id'].append('2')
            moc_dict['ResourcePartitions']['ResourcePartition']['id'].append('NSA')
        for mo in self.db_appnd_child_special_finction(moc_dict=moc_dict):
            cuup_mo.appendChild(mo)

        # GNBDUFunction
        self.custom_moc = ['DU5qiTable', 'ResourcePartitions', 'CaSCellHandling', 'LinkAdaptation', 'RadioLinkControl', 'SchedulingProfile',
                           'SoftAcAssist', 'SrHandling', 'BWP', 'BWPSet']
        du_mo = self.mo_add_form_dict_xml({'gNBDUFunctionId': '1'}, 'GNBDUFunction')
        me_mo.appendChild(du_mo)
        self.motype = 'GNBDU'
        childs = self.MoRelation.objects.filter(parent='GNBDUFunction', tag=self.motype, software=self.client.software)
        for child in childs:
            mos = self.db_append_child_tags(child.child, rel_tag=self.motype)
            for mo in mos: du_mo.appendChild(mo)

        moc_dict = {
            'DU5qiTable': {'id': ['1', 'SD_2000', 'SD_3000', 'SD_4000', 'SD_6000', 'SD_7000', 'SD_8000', 'SD_9000'],
                           'DU5qi': {'id': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '128']}},
            'ResourcePartitions': {'id': ['1'], 'ResourcePartition': {'id': ['FWA', 'SA', 'SD_2000', 'SD_3000', 'SD_4000', 'SD_6000', 'SD_8000'],
                                                                      'ResourcePartitionMember': {'id': ['1']}}},
            'UeCA': {'id': ['1'],
                     'CaSCellHandling': {'id': ['1', 'Default'], 'CaSCellHandlingUeCfg': {'id': ['Base', 'SA', ]}}},
            'UeCC': {'id': ['1'],
                     'LinkAdaptation': {'id': ['1'], 'LinkAdaptationUeCfg': {
                         'id': ['Base', 'VoNR'], 'DlLinkAdaptation': {'id': ['1']}, 'PdcchLinkAdaptation': {'id': ['1']},
                         'UlLinkAdaptation': {'id': ['1']}}},
                     'RadioLinkControl': {'id': ['1'],
                                          'DrbRlc': {'id': ['Default', 'IMS-SIP', 'Video', 'VoNR', 'gaming'], 'DrbRlcUeCfg': {'id': ['Base']}},
                                          'UeAdaptiveRlc': {'id': ['1'], 'UeAdaptiveRlcUeCfg': {'id': ['Base']}}},
                     'SchedulingProfile': {'id': [
                         '5QI6', '5QI7', '5QI8', '5QI9', 'SD_2000_SST_1_5QI6', 'SD_2000_SST_1_5QI7', 'SD_2000_SST_1_5QI8',
                         'SD_2000_SST_1_5QI9', 'SD_3000_SST_1_5QI6', 'SD_4000_SST_1_5QI6', 'SD_4000_SST_1_5QI7', 'SD_4000_SST_1_5QI8',
                         'SD_4000_SST_1_5QI9', 'SD_6000_SST_1_5QI6', 'SD_6000_SST_1_5QI7', 'SD_6000_SST_1_5QI8', 'SD_6000_SST_1_5QI9',
                         'SD_8000_SST_1_5QI6', 'SD_8000_SST_1_5QI7', 'SD_8000_SST_1_5QI8', 'SD_8000_SST_1_5QI9']},
                     'SoftAcAssist': {'id': ['1'], 'SoftAcAssistUeCfg': {'id': ['Base']}},
                     'SrHandling': {'id': ['5QI_5', 'Default'], 'SrHandlingUeCfg': {'id': ['Base']}}
                     },
        }
        if self.df_gnb_cell.loc[(self.df_gnb_cell.postcell.str.contains('^A'))].shape[0] > 0:
            moc_dict['BWP'] = {'id': [
                'BW100_DenseSS_DL', 'BW100_DenseSS_UL', 'BW100_Init_DL', 'BW100_Init_UL', 'BW100_SparseSS_DL', 'BW100_SparseSS_UL',
                'BW40_DenseSS_DL', 'BW40_DenseSS_UL', 'BW40_Init_DL', 'BW40_Init_UL', 'BW40_SparseSS_DL', 'BW40_SparseSS_UL']}
            moc_dict['BWPSet'] = {'id': ['1', '6'],
                                  'BWPSetUeCfg': {'id': ['1', '2', '3', '4'], 'BWPSetCfg': {'id': ['0', '1']}},
                                  'DynPowerOpt': {'id': ['1', '2']}}
            moc_dict['DU5qiTable']['id'].append('2')
            moc_dict['ResourcePartitions']['ResourcePartition']['id'].append('NSA')
            moc_dict['UeCA']['CaSCellHandling']['CaSCellHandlingUeCfg']['id'].append('NSA')
            moc_dict['UeCC']['SchedulingProfile']['id'].extend(['NSA_5QI6', 'NSA_5QI7', 'NSA_5QI8', 'NSA_5QI9'])
        else:
            moc_dict['UeCC']['SoftAcAssist']['SoftAcAssistUeCfg']['id'].extend(['HSI'])
        for mo in self.db_appnd_child_special_finction(moc_dict=moc_dict):
            du_mo.appendChild(mo)

        return doc

    def db_append_child_tags(self, tag, rel_tag):
        ret_mos = []
        if tag in self.custom_moc: return ret_mos
        mo_tag_ins = self.MoName.objects.filter(moc=tag, software=self.client.software, motype=self.motype)
        if mo_tag_ins.exists():
            for mo_tag_in in mo_tag_ins:
                print(F'{tag}---{mo_tag_in.moid}---{type(mo_tag_in.moid)}----{"," in mo_tag_in.moid}')
                if mo_tag_in.moid in [None, 'None', '', 'XX', 'nan', np.nan, '""'] or ',' in mo_tag_in.moid:
                    print(mo_tag_in.moid)
                    continue
                ret_mos.append(self.append_child_tags(mo_tag_in, rel_tag=rel_tag))
        return ret_mos

    def append_child_tags(self, tag, rel_tag):
        parent_mo = self.mo_add_form_dict_xml(self.get_mo_related_attributes(tag), tag.moc)
        for child_mos in self.MoRelation.objects.filter(parent=tag.moc, tag=rel_tag, software=self.client.software):
            for child in self.MoName.objects.filter(moc=child_mos.child, software=self.client.software, motype=self.motype):
                print(F'{child}---{"," in child.moid}')
                if child.moid in [None, 'None', '', 'XX', 'nan', np.nan, '""'] or ',' in child.moid: continue
                if child.modetail_set.filter(flag=True).exists():
                    child_mo = self.append_child_tags(child, rel_tag)
                    parent_mo.appendChild(child_mo)
        return parent_mo

    def db_appnd_child_special_finction(self, moc_dict):
        ret_mos = []
        for moc in moc_dict.keys():
            if moc == 'id' or moc_dict[moc].get('id') is None: continue
            mo_tag_ins = self.MoName.objects.filter(moc=moc, software=self.client.software, motype=self.motype)
            for mo_tag_in in mo_tag_ins:
                if mo_tag_in.moid in moc_dict[moc].get('id'):
                    ret_mos.append(self.append_child_tags_special_finction(tag=mo_tag_in, moc_dict=moc_dict[moc], moid=mo_tag_in.moid))
        return ret_mos

    def append_child_tags_special_finction(self, tag, moc_dict, moid):
        mo_dict = self.get_mo_related_attributes(tag)
        mo_dict |= {self.get_moc_id(moc=tag.moc): mo_dict.get(self.get_moc_id(moc=tag.moc)).split(',')[-1]}
        parent_mo = self.mo_add_form_dict_xml(copy.deepcopy(mo_dict), tag.moc)
        for moc in moc_dict.keys():
            if moc == 'id' or moc_dict[moc].get('id') is None: continue
            moid_list = [F'{moid},{_}' for _ in moc_dict[moc].get('id')]
            for moc_c in self.MoName.objects.filter(moc=moc, software=self.client.software, motype=self.motype):
                if moc_c.moid not in moid_list: continue
                child_mo = self.append_child_tags_special_finction(moc_c, moc_dict=moc_dict[moc], moid=moc_c.moid)
                parent_mo.appendChild(child_mo)
        # print(parent_mo.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8'))
        return parent_mo



    def special_formate_scripts(self):
        import fileinput
        import sys
        import os

        def replace_mathod(file, searchExp, replaceExp, nodename):
            for line in fileinput.input(file, inplace=1):
                if 'selectionCriteria' in line:
                    line = line.replace(searchExp, replaceExp).replace('&amp;', '&').replace(F'ManagedElement={nodename},', '')
                sys.stdout.write(line)

        if os.path.exists(self.script_file) and os.path.isfile(self.script_file):
            replace_mathod(self.script_file, '&gt;', '>', self.node)
